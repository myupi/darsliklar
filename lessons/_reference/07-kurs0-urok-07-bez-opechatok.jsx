// ===========================================================================
// Урок 7. Пишем без опечаток
// Один самодостаточный файл. Единственная зависимость — React.
// ===========================================================================
// =============================================================================
// КУРС 0 — КОМПЬЮТЕРНАЯ ГРАМОТНОСТЬ · общий канон уроков
// Дети 8–10 лет · UZ / RU / EN · один урок — один самодостаточный файл
//
// Пропсы: { studentName, lang, ttsApiBase, onFinished }
//   lang        'uz' | 'ru' | 'en'   (по умолчанию 'ru')
//   ttsApiBase  база сервиса озвучки. Пусто — урок озвучивает голосом браузера
//               (speechSynthesis) и остаётся полностью автономным; текст реплик
//               показывается только если недоступно и то и другое
//   onFinished  вызывается РОВНО один раз, payload без скоринга
// Дев-пропсы (в проде не передавать): startAt
//
// ВНИМАНИЕ при правках: верхняя часть файла (до пометки «УРОК») — общий канон
// Курса 0. Он совпадает с INFRA v1 модуля «Кибербез» с тремя отличиями, каждое
// продиктовано мастер-ТЗ Курса 0, а не вкусом:
//   1) ТРИ ЯЗЫКА вместо двух. pick() знает { uz, ru, en }; на UZ обращение к
//      ученику на «Siz», на RU и EN — на «ты» / «you» (критерий приёмки №4).
//   2) ПРОГРЕСС ПЕРЕЖИВАЕТ ВЫХОД. Критерий приёмки №11 требует вернуться на тот
//      же экран. В Кибербезе localStorage запрещён и прогресс жил до конца урока;
//      здесь он сохраняется — см. useProgress.
//   3) ЛЕСЕНКА ПОДСКАЗОК ИЗ ТРЁХ УРОВНЕЙ (раздел 10 мастер-ТЗ). Модель Кибербеза
//      «веди-до-верного» её не заменяет: там неверный вариант гаснет насовсем,
//      а здесь после каждой ошибки подсказка сужает поиск, и все варианты
//      остаются живыми. Компонент HintLadder — новый, см. блок 12.
//
// Что НЕ копировалось из Кибербеза намеренно:
//   · блок CSS «КАДР — ЭЛАСТИЧНЫЙ ЭЛЕМЕНТ ЭКРАНА» — в исходнике он продублирован
//     семь раз подряд (строки 1697–1807). Здесь он один.
//   · салют на финале — заказчик заменил его сиянием ещё в Кибербезе.
//   · чат-пузыри разбора переписки — тема Кибербеза, Курсу 0 не нужны.
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
  ui: '#1E88E5',
  uiSoft: '#E3F2FD',
  uiDk: '#1565C0',
  blue: '#2B7FD4',          // спокойный вспомогательный
  blueSoft: '#E4F0FB',
  blueDk: '#1F63A8',
  success: '#1F7A4D',
  successSoft: '#E3F0E8',
  wrong: '#E0543F',
  wrongSoft: '#FFE3DF',
  hint: '#C08A12',          // подсказка — отдельный канал, НЕ «ошибка»
  hintSoft: '#FFF6E0',
  // Условный редактор (песочница M9). Серые тона намеренно тусклее палитры
  // урока: панель инструментов — фон, а не герой экрана.
  uiBar: '#ECEAE5',
  uiEdge: '#D8D4CC',
  shadowBase: '58, 53, 48'  // тени задаются через rgba(${T.shadowBase}, a)
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. ПЕРСОНАЖ — БИП, робот-исследователь
//
// Один герой на весь урок (решение заказчика 2026-08-20, взамен пары Симка +
// Нолик из Кибербеза). Образ — маленький рабочий робот с биноклевыми глазами
// и антенной, парит над полом: любопытный, а не милый. Это прямо закрывает запрет мастер-ТЗ
// на «малышовый визуал» — программу не стыдно показать однокласснику.
//
// РИСУЕТСЯ КОДОМ, а не грузится картинками. Три причины, и все практические:
//   1) урок остаётся автономным — ни одного обращения к CDN (мастер-ТЗ, раздел 12);
//   2) поза меняется параметром, а не двадцатью файлами: добавить новую эмоцию
//      стоит десяти строк, а не работы дизайнера и выкладки на сервер;
//   3) робот принимает цвет из токенов T и не разъезжается с палитрой курса.
//
// ЧТО ДЕЛАЕТ ПОЗА. Выразительность держится на глазах и наклоне головы — как у
// киноробота, у которого нет лица. Рот не нужен, брови не нужны: наклон + форма
// линзы читаются восьмилеткой мгновенно.
//
// ВАЖНО ПРО ОШИБКУ. В Кибербезе ошибался Нолик, и ребёнок его выручал. С одним
// героем этой механики нет, поэтому Бип НИКОГДА не реагирует на неверный ответ
// сменой позы на грустную: разбор ведёт лесенка подсказок, а Бип на ошибке
// показывает 'think' — «давай посмотрим вместе», а не «ты не смог».
// ─────────────────────────────────────────────────────────────────────────────
const BOT = {
  shell:   '#FFFFFF',   // корпус
  shellMid:'#FBFCFE',
  shellDk: '#DCE2EB',   // теневая грань
  edge:    '#C9D2DE',   // тонкий контур
  visor:   '#0B0E15',   // тёмное стекло лица
  blush:   '#FF8FB0'
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
// Имя нигде на экране не показывается — герой безымянный. Держим его на случай,
// если понадобится в текстах, и НАМЕРЕННО нейтральным: имена из мультфильмов
// принадлежат правообладателю, и урок пойдёт в продакшн без них.
const BOT_NAME = { uz: 'Robot', ru: 'Робот', en: 'Robot' };

// Градиенты и обтравка объявляются внутри каждого экземпляра, поэтому им нужны
// разные имена: на экране бывает два робота сразу (маленький в шапке и крупный
// на прощании), и одинаковые id склеили бы их обводки.
let _botUid = 0;

// ─────────────────────────────────────────────────────────────────────────────
// РОБОТ. Каплевидный белый корпус, отдельная голова с тёмным визором, две руки,
// которые ни к чему не крепятся, светящийся шов на корпусе и антенна.
//
// СТРОЕНИЕ ВАЖНО ДЛЯ ДВИЖЕНИЯ, а не для рисунка: каждый подвижный узел это ДВА
// вложенных элемента — pose (поза, transition) и beat (такт, animation). Слить
// их в один нельзя: бесконечная анимация затрёт transition, и переход между
// состояниями станет мгновенным.
//
// РАМКА ЗАМЕТНО БОЛЬШЕ САМОГО РОБОТА, и это не запас «на всякий случай».
// Сам он занимает по ширине 91–329, но в движении выходит далеко за эти
// границы: на ликовании корпус подпрыгивает на 26 единиц, парение добавляет
// ещё 9, поза — 16, итого полсотни вверх; поднятая рука при повороте на 152°
// уносится вправо примерно до 380; смущение сдвигает левую руку до 54.
// При тесной рамке всё это обрезалось краем кадра, и прыжок выглядел так,
// будто робот ныряет под невидимую полку.
//
// Поля посчитаны по этим крайним точкам, и с запасом: сверху 90 единиц, снизу
// 50, слева 71, справа 20 сверх самой широкой позы. Заказчик всё ещё видел
// обрезанного робота на ликовании — там прыжок совпадает с парением и позой, и
// прежних 60 единиц сверху не хватало.
//
// Размер РОБОТА при этом задаётся не рамкой: рамка выросла, а --av пересчитана
// так, что сам робот на экране стал даже чуть крупнее — это тоже просьба
// заказчика («выглядит немного маленьким»).
// ─────────────────────────────────────────────────────────────────────────────
function RobotSVG({ pose = 'explain', className, talking }) {
  const key = POSE_SET[pose] ? pose : 'explain';
  const S = POSE_SET[key];
  const uid = useMemo(() => { _botUid += 1; return 'bot' + _botUid; }, []);

  // Поза, тайминг и акцент отдаются в CSS переменными: так одно и то же
  // правило обслуживает все тринадцать состояний.
  const vars = { '--dur': S.dur + 'ms', '--ease': S.ease, '--loop': S.loopMs + 'ms',
    '--accent': S.accent };
  Object.keys(S.pose).forEach((k) => { vars['--' + k] = S.pose[k] + (POSE_UNIT[k] || ''); });

  const cls = ['bot', 'eyes-' + S.eyes, S.loop];
  if (S.noBlink) cls.push('no-blink');
  if (talking) cls.push('is-talking');
  if (className) cls.push(className);

  const Spark = ({ x, y, s, d }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="spark" style={d ? { animationDelay: d + 'ms' } : undefined}
        fill="var(--accent)"
        d="M0 -25 C3 -8 8 -3 25 0 C8 3 3 8 0 25 C-3 8 -8 3 -25 0 C-8 -3 -3 -8 0 -25 Z" />
    </g>
  );

  return (
    <svg className={cls.join(' ')} style={vars} viewBox="20 -70 380 520"
      aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={uid + 's'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BOT.shell} />
          <stop offset="62%" stopColor={BOT.shellMid} />
          <stop offset="100%" stopColor={BOT.shellDk} />
        </linearGradient>
        <linearGradient id={uid + 'h'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BOT.shell} />
          <stop offset="70%" stopColor="#F6F8FB" />
          <stop offset="100%" stopColor="#DFE5EE" />
        </linearGradient>
        <linearGradient id={uid + 'a'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BOT.shell} />
          <stop offset="100%" stopColor="#E0E6EF" />
        </linearGradient>
        <clipPath id={uid + 'v'}><rect x="132" y="88" width="156" height="76" rx="38" /></clipPath>
      </defs>

      {/* Контактная тень. Дышит навстречу парению: робот поднялся — тень меньше
          и бледнее. Без неё он висит без веса. */}
      <ellipse className="bot-shadow" cx="210" cy="424" rx="90" ry="15" fill="#4A5568" />

      <g className="bot-float">
        <g className="bot-pose-body">
          <g className="bot-beat-body">

            {/* корпус */}
            <path d="M210 172 C252 172 278 202 278 246 C278 301 256 372 210 372
                     C164 372 142 301 142 246 C142 202 168 172 210 172 Z"
              fill={`url(#${uid}s)`} />
            <path d="M210 172 C252 172 278 202 278 246 C278 301 256 372 210 372"
              fill="none" stroke={BOT.edge} strokeWidth="1.4" opacity=".55" />
            <ellipse cx="184" cy="224" rx="16" ry="29" fill="#fff" opacity=".85" />

            {/* СВЕТЯЩИЙСЯ ШОВ — собственная примета героя. Пока идёт речь, он
                пульсирует чаще: у робота нет рта, и шов работает индикатором
                «я сейчас говорю». */}
            <rect className="bot-seam" x="206" y="258" width="8" height="68" rx="4"
              fill="var(--accent)" opacity=".9" />
            <rect className="bot-seam bot-glow" x="206" y="258" width="8" height="68" rx="4"
              fill="var(--accent)" />

            {/* голова */}
            <g className="bot-pose-head">
              <g className="bot-beat-head">
                <rect x="203" y="26" width="14" height="20" rx="7" fill="#E4EAF2" />
                <circle cx="210" cy="26" r="6" fill="var(--accent)" />
                <circle className="bot-glow" cx="210" cy="26" r="6" fill="var(--accent)" />

                <path d="M210 48 C262 48 306 76 306 122 C306 168 262 194 210 194
                         C158 194 114 168 114 122 C114 76 158 48 210 48 Z"
                  fill={`url(#${uid}h)`} />
                <ellipse cx="166" cy="74" rx="26" ry="12" fill="#fff" opacity=".9" />

                <ellipse className="bot-blush" cx="146" cy="172" rx="19" ry="8" fill={BOT.blush} />
                <ellipse className="bot-blush" cx="274" cy="172" rx="19" ry="8" fill={BOT.blush} />

                {/* визор */}
                <rect x="132" y="88" width="156" height="76" rx="38" fill={BOT.visor} />
                <g clipPath={`url(#${uid}v)`}>
                  <g className="bot-pose-eyes">
                    <ellipse className="bot-glow" cx="182" cy="126" rx="22" ry="22" fill="var(--accent)" />
                    <ellipse className="bot-glow" cx="238" cy="126" rx="22" ry="22" fill="var(--accent)" />
                    <ellipse className="pupil" cx="182" cy="126" rx="21" ry="21" fill="var(--accent)" />
                    <ellipse className="pupil" cx="238" cy="126" rx="21" ry="21" fill="var(--accent)" />
                    {/* кольца — удивление */}
                    <circle className="ring" cx="182" cy="126" r="17" fill="none"
                      stroke="var(--accent)" strokeWidth="7" />
                    <circle className="ring" cx="238" cy="126" r="17" fill="none"
                      stroke="var(--accent)" strokeWidth="7" />
                    {/* звёзды — восторг */}
                    <path className="star" transform="translate(182 126)" fill="var(--accent)"
                      d="M0 -25 C3 -8 8 -3 25 0 C8 3 3 8 0 25 C-3 8 -8 3 -25 0 C-8 -3 -3 -8 0 -25 Z" />
                    <path className="star" transform="translate(238 126)" fill="var(--accent)"
                      d="M0 -25 C3 -8 8 -3 25 0 C8 3 3 8 0 25 C-3 8 -8 3 -25 0 C-8 -3 -3 -8 0 -25 Z" />
                    {/* дуги — улыбка */}
                    <path className="arc" d="M163 134 Q182 110 201 134" fill="none"
                      stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" />
                    <path className="arc" d="M219 134 Q238 110 257 134" fill="none"
                      stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" />
                  </g>
                  {/* веки: наклон внешних углов и есть выражение */}
                  <rect className="bot-lid bot-lid-l" x="136" y="18" width="92" height="84" fill={BOT.visor} />
                  <rect className="bot-lid bot-lid-r" x="192" y="18" width="92" height="84" fill={BOT.visor} />
                  {/* моргание раз в 5.4 с — 0.18 Гц, втрое ниже порога WCAG */}
                  <rect className="bot-blink" x="132" y="88" width="156" height="76" fill={BOT.visor} />
                </g>
              </g>
            </g>

            {/* Искры восторга. Стаггер 140 мс — суммарно укладывается в бюджет
                полсекунды, дальше глаз перестаёт связывать их в одно событие. */}
            <g>
              <Spark x={96} y={118} s={0.5} />
              <Spark x={330} y={96} s={0.42} d={140} />
              <Spark x={122} y={44} s={0.34} d={280} />
              <Spark x={306} y={178} s={0.3} d={420} />
              <Spark x={72} y={200} s={0.38} d={560} />
            </g>

            {/* Руки. Не крепятся к телу и отстают от него на 90 мс — именно это
                запаздывание читается как живое, а не амплитуда. */}
            <g className="bot-pose-arm-l"><g className="bot-beat-arm-l">
              <path d="M118 228 C136 228 147 246 145 274 C143 310 132 344 118 344
                       C104 344 93 310 91 274 C89 246 100 228 118 228 Z" fill={`url(#${uid}a)`} />
            </g></g>
            <g className="bot-pose-arm-r"><g className="bot-beat-arm-r">
              <path d="M302 228 C320 228 331 246 329 274 C327 310 316 344 302 344
                       C288 344 277 310 275 274 C273 246 284 228 302 228 Z" fill={`url(#${uid}a)`} />
            </g></g>

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
  uz: "[O'zbekcha talaffuz] ",
  ru: '[Русское произношение] ',
  en: '[English pronunciation] '
};
const markLang = (text, lang) => {
  const s = String(text || '');
  if (!s) return s;
  return (LANG_MARK[lang] || LANG_MARK.ru) + s;
};

const buildTtsUrl = (base, text, gender) => {
  if (!base) return '';
  const p = new URLSearchParams({ text: String(text).slice(0, 1000), g: gender === 'm' ? 'm' : 'f' });
  return base.replace(/\/+$/, '') + '/api/tts?' + p.toString();
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
  const [failed, setFailed] = useState(true);   // до первого касания голоса нет
  // Было ли касание страницы. Браузер не отдаёт речь до первого жеста, поэтому
  // до него реплика показывается ТЕКСТОМ, а после — произносится.
  const [gestured, setGestured] = useState(false);
  const elRef = useRef(null);
  const onRef = useRef(true);
  const resolvers = useRef([]);   // «досрочно закрыть» все ждущие speak()
  const timers = useRef([]);
  const warmed = useRef(new Set());   // адреса фраз, уже заказанных сервису (см. warm)

  useEffect(() => { if (!gestured) setFailed(true); }, [ttsApiBase, gestured]);
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
    if (!elRef.current) { const a = new Audio(); a.preload = 'auto'; elRef.current = a; }
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
            const url = buildTtsUrl(ttsApiBase, markLang(clean, lang), gender || 'f');
            warmed.current.add(url);   // прогреву эту фразу заказывать уже не нужно
            a.src = url + (attempt > 1 ? '&r=' + attempt : '');
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
                  const silent = !a.duration || Number.isNaN(a.duration) || a.currentTime < 0.05;
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
      if (!gesturedRef.current) {
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
      const u = buildTtsUrl(ttsApiBase, markLang(clean, lang), 'f');
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
const safeStorage = (() => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const probe = '__k0_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch (e) { return null; }
})();

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
const PROGRESS_VERSION = 6; // 6: карта стала кино до первого экрана — номера экранов сдвинулись

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
const Stage = ({ children, eyebrow, screen, total, nav, speaker, overlay, heroFixed, done, hideSpeaker, hint }) => {
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
  return (
    <div className={'stage' + (heroFixed ? ' stage-hero-fixed' : '') + (hideSpeaker ? ' stage-bare' : '')
      + (speaking ? ' is-speaking' : '')}>
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
  box-shadow: 0 2px 0 ${T.uiDk}, 0 8px 18px -8px rgba(30,136,229,0.55); }

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
.progress-bar { height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.ui}, #64B5F6);
  box-shadow: 0 0 14px rgba(30,136,229,0.5); transition: width .3s cubic-bezier(.4,0,.2,1); }
.chrome { display: flex; align-items: center; justify-content: space-between; margin-top: 9px; gap: 8px; }
/* Подпись фазы НИКОГДА не переносится на вторую строку: перенос растит шапку и
   сдвигает всё содержимое вниз. На узком экране она просто укорачивается
   многоточием — панель управления важнее, её кнопки нажимают, а подпись
   только сообщает, где ты. */
.eyebrow { display: flex; align-items: center; gap: 7px; min-width: 0; flex: 0 1 auto;
  font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
  color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.eyebrow .dot { flex: 0 0 auto; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.ui}; box-shadow: 0 0 0 4px rgba(30,136,229,0.16); }
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
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.08), 0 10px 22px -12px rgba(30,136,229,0.55), inset 0 0 0 2px ${T.uiSoft}; }
.btn-accent::after { content: ''; position: absolute; inset: 0; border-radius: inherit; z-index: -1;
  background: ${T.ui}; opacity: 0; }
.btn-accent[data-ring]::after { animation: ringOut .46s cubic-bezier(.2,.7,.3,1) both; }
@keyframes ringOut { from { transform: scale(1); opacity: .38; } to { transform: scaleX(1.34) scaleY(1.5); opacity: 0; } }
.btn-accent:hover:not(:disabled) { transform: translateY(-2px);
  box-shadow: 0 4px 0 rgba(${T.shadowBase},0.08), 0 16px 30px -14px rgba(30,136,229,0.7), inset 0 0 0 2px ${T.ui}; }
.btn-accent:active:not(:disabled) { transform: translateY(0); }
.btn-accent:disabled { opacity: .38; cursor: not-allowed; transform: none;
  box-shadow: inset 0 0 0 2px rgba(${T.shadowBase},0.12); color: ${T.ink3}; }
/* ОТКРЫВШАЯСЯ КНОПКА ЗОВЁТ САМА. Ребёнок 8 лет не сканирует экран в поисках
   того, что изменилось: разблокировка обязана быть событием, а не отсутствием
   серого. Поэтому кнопка наливается цветом и дышит. */
.btn-accent.btn-ready { background: ${T.ui}; color: #fff;
  box-shadow: 0 3px 0 ${T.uiDk}, 0 14px 26px -12px rgba(30,136,229,0.7);
  animation: readyPulse 1.8s ease-in-out infinite; }
.btn-accent.btn-ready:hover { background: ${T.uiDk}; }
@keyframes readyPulse { 0%,100% { box-shadow: 0 3px 0 ${T.uiDk}, 0 14px 26px -12px rgba(30,136,229,0.7); }
  50% { box-shadow: 0 3px 0 ${T.uiDk}, 0 14px 26px -12px rgba(30,136,229,0.7), 0 0 0 8px rgba(30,136,229,0.13); } }
.btn-ghost { background: transparent; color: ${T.ink2}; box-shadow: inset 0 0 0 2px rgba(${T.shadowBase},0.14); }
.btn-accent:focus-visible, .btn-ghost:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }

.bigbtn { align-self: center; width: 100%; max-width: 360px; padding: 15px 18px; border: none; border-radius: 18px;
  background: ${T.ui}; color: #fff; font: inherit; font-size: clamp(16px, 3vw, 18px); font-weight: 800;
  cursor: pointer; min-height: 52px;
  box-shadow: 0 5px 0 ${T.uiDk}, 0 16px 28px -14px rgba(30,136,229,0.7); }
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
  background: linear-gradient(100deg, transparent, rgba(30,136,229,.11), transparent);
  transform: translateX(-160px); animation: optSweep 3s ease-in-out infinite; }
.opt:nth-child(2)::after { animation-delay: .35s; }
.opt:nth-child(3)::after { animation-delay: .7s; }
.opt:nth-child(4)::after { animation-delay: 1.05s; }
@keyframes optSweep { 0%, 60% { transform: translateX(-160px); } 100% { transform: translateX(830px); } }
.opt:hover:not(:disabled) { border-color: ${T.ui}; box-shadow: 0 8px 20px rgba(30,136,229,.16); transform: translateY(-2px); }
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
  box-shadow: 0 0 0 3px ${T.ui}, 0 0 0 9px rgba(30,136,229,0.28); animation: ringPulse 1.6s ease-in-out infinite; }
.coach-ring.is-tappable { pointer-events: auto; cursor: pointer; }
@keyframes ringPulse { 0%,100% { box-shadow: 0 0 0 3px ${T.ui}, 0 0 0 9px rgba(30,136,229,0.28);}
  50% { box-shadow: 0 0 0 3px ${T.ui}, 0 0 0 14px rgba(30,136,229,0.10);} }
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
  0%, 100% { box-shadow: inset 0 0 0 2px rgba(30,136,229,.25); }
  50% { box-shadow: inset 0 0 0 3px ${T.ui}, 0 0 18px -4px rgba(30,136,229,.7); }
}
.led > i { position: absolute; top: 8px; right: 8px; width: 9px; height: 9px; border-radius: 50%;
  background: ${T.ui}; animation: ledDot 1.15s ease-in-out infinite; }
@keyframes ledDot {
  0%, 100% { opacity: .3; box-shadow: 0 0 0 0 rgba(30,136,229,0); }
  50% { opacity: 1; box-shadow: 0 0 10px 2px rgba(30,136,229,.85); }
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

// ═════════════════════════════════════════════════════════════════════════════
//                        П Е С О Ч Н И Ц А - Р Е Д А К Т О Р
//                          механика M9 — ядро всего блока «Текст»
//
// Это ГЛАВНЫЙ переиспользуемый компонент курса. Мастер-ТЗ, раздел 9, называет
// три такие песочницы «ключевой экономией»: один раз спроектированный редактор
// обслуживает уроки 13, 14, 15, 16 и 17, а уроки только настраивают его через
// пропсы. Поэтому здесь НЕТ ничего про поздравление бабушке — только редактор.
//
// Устройство модели текста. Свободный contentEditable не годится: в нём нельзя
// надёжно узнать позицию курсора между перерисовками, а весь урок 13 именно про
// позицию курсора. Поэтому модель своя и предельно простая:
//     text  — строка, переносы строк обычным '\n'
//     caret — индекс от 0 до text.length; курсор стоит ПЕРЕД символом с этим
//             индексом, то есть caret === text.length означает «в самом конце»
// Ввод идёт двумя путями сразу и они не конфликтуют:
//     · физическая клавиатура (основное устройство курса — десктоп от 1024px)
//     · экранная клавиатура (планшет; плюс это честно для курса, где ребёнок
//       уже познакомился с раскладкой в уроках 5 и 7)
//
// Почему экранная клавиатура нарисована, а не вызывается системная: системная
// на планшете перекрывает нижнюю треть экрана, а контракт урока — 100dvh без
// прокрутки. Плюс раскладка обязана совпадать с языком урока, а системную мы
// не контролируем.
// ═════════════════════════════════════════════════════════════════════════════

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

// pop — слово не в окошке на странице, а отдельной карточкой поверх поля, как
// улика в детективе: появляется только по кнопке и сама прячется. Окошко на
// тесном экране (поле + клавиатура) сжималось до нуля, и по кнопке не
// показывалось ничего (заказчик, 09.10.2026).
function Glance({ children, label, onShown, disabled, pop }) {
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

  if (pop) return (
    <div className="glance is-pop">
      <button type="button" className="btn-soft glance-btn" onClick={flash} disabled={lit || disabled}>
        <Icon name="eye" size={17} />{pick(label)}
      </button>
      {lit && <div className="glance-card" role="status">{children}</div>}
    </div>
  );

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
// ===============  Д В И Ж О К  ·  Э К Р А Н Н А Я  К Л А В И А Т У Р А  ======
// =============================================================================
// Клавиатура, поле ввода и модель набора. Нужна уроку 5 (клавиатура — предмет
// урока), уроку 7 (правка опечаток с гаснущими клавишами) и всем урокам, где
// надо что-то напечатать.
//
// ПОЧЕМУ КЛАВИАТУРА СВОЯ, А НЕ СИСТЕМНАЯ.
// В движке редактора (engines/text-editor.jsx) поверх листа лежит настоящая
// <textarea>: там это правильно — ребёнок печатает СВОЙ текст, и системная
// клавиатура с её выделением, автоповтором и подсказками слов ему помогает.
// Здесь задача другая. Клавиатура — это то, ЧЕМУ учат: где живут буквы, что
// делает Enter, как стереть лишнее. Системную клавиатуру нельзя ни подсветить,
// ни погасить на ней клавишу, ни спросить «найди букву Ш». И главное: на
// телефоне она занимает половину экрана и закрывает собой и задание, и героя —
// то есть ровно то, ради чего урок написан.
//
// Поэтому здесь настоящего <input> нет НИГДЕ. Поле ввода (Field) рисуется
// span-ами, курсор — свой элемент. Ни один элемент движка не принимает фокус
// текстового поля, значит системная клавиатура не поднимется никогда, и класс
// .is-kbd (canon/04-root.jsx) на экранах этого движка не сработает.
//
// ЧТО ОТДАЁТ ДВИЖОК:
//   Keys       сама клавиатура: раскладка, подсветка, гашение, группы
//   Field      поле ввода без input: текст span-ами, свой мигающий курсор
//   useTyping  модель набора: буквы, служебные клавиши, курсор
//   KeyMap     карта клавиатуры с подписанными областями (урок 5)
//   Hunt       «найди клавишу»: урок называет, ребёнок ищет
//
// ДВИЖОК МОЛЧИТ. Он не произносит ни одной реплики: всё уходит наружу через
// onKey / onZone / onAsk / onSay, а озвучивает экран урока. Двух голосов
// одновременно быть не может.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// РАСКЛАДКИ
//
// Три ряда букв — ровно как на телефоне, а не как на клавиатуре компьютера с
// её пятью рядами и функциональными клавишами. Ребёнок 8–10 лет в 90% случаев
// сидит с телефоном (решение заказчицы 23.09.2026), и клавиатура, которую он
// видит здесь, обязана совпадать с той, что у него в руках. Уроку, который
// говорит про компьютерную клавиатуру, карта (KeyMap) объясняет области —
// они у обеих одинаковые.
//
// УЗБЕКСКАЯ РАСКЛАДКА — это латиница плюс тутуқ белгиси (‘). Отдельного ряда
// для sh/ch/ng не бывает: это диграфы, они набираются теми же буквами. Значок ‘
// добавлен в конец второго ряда, потому что без него нельзя напечатать
// «o‘qish» — самое частое слово в узбекских заданиях курса.
// ─────────────────────────────────────────────────────────────────────────────
const KB_ALPHA = {
  ru: ['йцукенгшщзхъ', 'фывапролджэ', 'ячсмитьбю'],
  en: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
  uz: ['qwertyuiop', 'asdfghjkl‘', 'zxcvbnm']
};

// ЦИФРЫ И ЗНАКИ. Набор намеренно детский: здесь нет ни решётки для тегов, ни
// долларов, ни скобок программиста. Оставлено то, что восьмилетка встретит в
// своём же тексте — точка, запятая, вопрос, восклицание, тире, двоеточие,
// скобки, кавычки и собака для почты (урок про почту в модуле «Интернет»).
const KB_NUM = ['1234567890', '.,!?-:()"@', "/+=%'#*;"];

// ШИРИНА РЯДА В «КЛАВИШАХ». Русский ряд длиннее латинского на две клавиши, и
// это не мелочь: именно из-за двенадцати клавиш в ЙЦУКЕН русская клавиша на
// телефоне заметно уже латинской. Размер считается от этого числа, поэтому
// ряды одной раскладки всегда ровные друг относительно друга.
const KB_UNITS = { ru: 12, en: 10, uz: 10, num: 10 };

// Служебные клавиши: подпись для голосового доступа и для карты.
const KB_LABEL = {
  shift: { uz: 'Katta harf', ru: 'Большая буква', en: 'Capital letter' },
  back:  { uz: 'O‘chirish', ru: 'Стереть', en: 'Erase' },
  enter: { uz: 'Yangi qator', ru: 'Новая строка', en: 'New line' },
  space: { uz: 'Bo‘sh joy', ru: 'Пробел', en: 'Space' },
  lang:  { uz: 'Boshqa harflar', ru: 'Другие буквы', en: 'Other letters' },
  num:   { uz: 'Raqamlar', ru: 'Цифры', en: 'Numbers' },
  abc:   { uz: 'Harflar', ru: 'Буквы', en: 'Letters' },
  left:  { uz: 'Chapga', ru: 'Влево', en: 'Left' },
  right: { uz: 'O‘ngga', ru: 'Вправо', en: 'Right' },
  keys:  { uz: 'Klaviatura', ru: 'Клавиатура', en: 'Keyboard' },
  field: { uz: 'Yozuv joyi', ru: 'Поле для текста', en: 'Text box' },
  empty: { uz: 'Bu yerga yozing', ru: 'Здесь появятся буквы', en: 'Letters appear here' }
};

// Сколько держать клавишу, чтобы пошёл автоповтор, и с каким шагом он идёт.
// 420 мс — это заметно дольше обычного нажатия (у ребёнка оно 90–180 мс), но
// короче, чем терпение восьмилетки. Повтор нужен только стиранию и стрелкам:
// набравший двадцать лишних букв ребёнок не должен тыкать «стереть» двадцать
// раз — на настоящей клавиатуре он этого и не делает.
const KB_HOLD_MS = 420;
const KB_REPEAT_MS = 90;
// Долгое удержание «большой буквы» ставит замок — второй путь к CapsLock для
// тех, кому двойное нажатие не даётся.
const KB_LOCK_MS = 520;

// Раскладка по языку урока. Узбекский — латиница со своим значком.
const kbLangLayout = (lang) => (lang === 'ru' ? 'ru' : (lang === 'uz' ? 'uz' : 'en'));
// Что показывает клавиша «другие буквы»: с кириллицы уводит на латиницу языка
// урока и обратно. Третьего алфавита в курсе нет.
const kbOtherLayout = (base, lang) => (base === 'ru' ? kbLangLayout(lang) : 'ru');

// ГРУППА КЛАВИШИ. Нужна и для подкраски (проп zones у Keys), и уроку 5,
// который спрашивает «а это что за клавиши».
//
// Буква отличается от знака одним свойством: у буквы есть верхний регистр.
// Это честнее списка символов — работает и для кириллицы, и для латиницы, и
// не придётся дописывать сюда каждый новый знак.
const kbZoneOf = (k) => {
  if (k.s) {
    if (k.s === 'space') return 'space';
    if (k.s === 'enter') return 'enter';
    if (k.s === 'back') return 'back';
    if (k.s === 'left' || k.s === 'right') return 'arrows';
    return 'service';
  }
  if (k.c >= '0' && k.c <= '9') return 'digits';
  return k.c.toUpperCase() !== k.c ? 'letters' : 'marks';
};

// ─────────────────────────────────────────────────────────────────────────────
// СБОРКА РЯДОВ
//
// Клавиша описывается коротко: { c } — обычная с этим символом, { s } —
// служебная, { sp } — невидимая распорка. Ширина w считается в «клавишах»:
// w: 2 значит «шириной в две буквы». Внутри ряда ширины раздаются через
// flex-grow, поэтому ряд всегда занимает всю ширину, какой бы она ни была.
//
// ПОЧЕМУ ШИРИНЫ СЧИТАЮТСЯ, А НЕ ПРОПИСАНЫ. Ряды разных раскладок разной длины
// (12 у ЙЦУКЕН, 10 у латиницы), и прописанные вручную ширины разъезжались бы
// при каждой правке алфавита. Считаем от длины ряда — и раскладка остаётся
// ровной сама собой.
// ─────────────────────────────────────────────────────────────────────────────

// Нижний служебный ряд. Собирается из флагов, а не выбирается из четырёх
// готовых вариантов: вариантов на самом деле шестнадцать (цифры × язык ×
// стрелки × точка), и руками их не удержать.
function kbServiceRow(units, o, mode) {
  const row = [];
  let rest = units;
  if (o.digits !== false) { row.push({ s: 'num', w: 1.5 }); rest -= 1.5; }
  if (o.langKey) { row.push({ s: 'lang', w: 1 }); rest -= 1; }
  if (o.arrows) { row.push({ s: 'left', w: 1 }); row.push({ s: 'right', w: 1 }); rest -= 2; }
  // Точка в ряду цифр уже есть — второй такой же клавиши быть не должно:
  // и lit, и dim, и покачивание ошибки адресуются по коду, а двойной код
  // подсветил бы сразу две клавиши.
  const dot = mode !== 'num';
  if (dot) rest -= 1;
  rest -= 2;                                   // ввод
  row.push({ s: 'space', w: Math.max(1.5, rest) });
  if (dot) row.push({ c: '.' });
  row.push({ s: 'enter', w: 2 });
  return row;
}

function kbRows(mode, o) {
  const opt = o || {};
  const units = KB_UNITS[mode] || 10;
  const src = mode === 'num' ? KB_NUM : (KB_ALPHA[mode] || KB_ALPHA.en);
  const L = src.map((s) => s.split('').map((c) => ({ c })));
  const w1 = L[0].length, w2 = L[1].length, w3 = L[2].length;

  if (opt.compact) {
    // УЗКИЙ ВАРИАНТ — три ряда вместо четырёх, для уроков, где клавиатура не
    // предмет разговора, а инструмент: напечатать слово и идти дальше.
    // Служебные клавиши уходят в концы буквенных рядов, как на старых
    // телефонных клавиатурах. Переключателя цифр здесь нет намеренно: урок,
    // которому нужны цифры, либо не компактный, либо сразу просит layout="num".
    const total = Math.max(w1 + 1.5, w2 + 2, w3 + 3);
    const r1 = L[0].concat([{ s: 'back', w: total - w1 }]);
    const pad = total - w2 - 2;
    // Распорка стоит СЛЕВА, чтобы ввод прижимался к правому краю, — иначе
    // он висит посреди ряда и не читается как «край строки».
    const r2 = (pad > 0 ? [{ sp: pad }] : []).concat(L[1], [{ s: 'enter', w: 2 }]);
    const r3 = L[2].slice();
    let sw = total - w3;
    if (opt.arrows) { r3.unshift({ s: 'left', w: 1 }); r3.push({ s: 'right', w: 1 }); sw -= 2; }
    r3.push({ s: 'space', w: Math.max(1.5, sw) });
    return [r1, r2, r3];
  }

  // Полная раскладка: три ряда символов плюс служебный.
  const gap = (units - w2) / 2;
  const r2 = [];
  // Второй ряд короче первого на одну клавишу — на настоящем телефоне он
  // поэтому сдвинут внутрь на полклавиши с каждой стороны. Мелочь, но именно
  // по таким мелочам ребёнок потом узнаёт свою клавиатуру.
  if (gap > 0) r2.push({ sp: gap });
  L[1].forEach((k) => r2.push(k));
  if (gap > 0) r2.push({ sp: gap });

  const r3 = [];
  if (mode !== 'num') r3.push({ s: 'shift', w: 1.5 });
  L[2].forEach((k) => r3.push(k));
  // Ширина «стереть» добирает ряд до полной: не подгоняли руками — считаем.
  r3.push({ s: 'back', w: units - (mode === 'num' ? 0 : 1.5) - w3 });

  return [L[0].slice(), r2, r3, kbServiceRow(units, opt, mode)];
}

// ─────────────────────────────────────────────────────────────────────────────
// ЗНАЧКИ КЛАВИШ
//
// Рисуются здесь, а не дописываются в ICONS: набор канона общий для всех
// уроков, и засорять его семью узкоспециальными значками клавиатуры нельзя
// (правило движков). Все — одной линией, как канонные, чтобы на одной кнопке
// с канонным значком не выглядели чужими.
// ─────────────────────────────────────────────────────────────────────────────
const KB_GLYPH = {
  back:  'M20.4 5.6H9.4L3.6 12l5.8 6.4h11zM16.8 9.6l-4.6 4.8M12.2 9.6l4.6 4.8',
  enter: 'M20.4 5.4v7.4H5.2M9.4 8.4L5 12.8l4.4 4.4',
  shift: 'M12 3.4l7.4 7.8h-4v6.2H8.6v-6.2h-4z',
  left:  'M19 12H5.4M11.2 5.8L5 12l6.2 6.2',
  right: 'M5 12h13.6M12.8 5.8L19 12l-6.2 6.2',
  space: 'M4.4 10v4h15.2v-4',
  lang:  'M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2zM3.6 12h16.8M12 3.4c2.2 2.4 3.4 5.4 3.4 8.6S14.2 18.2 12 20.6c-2.2-2.4-3.4-5.4-3.4-8.6S9.8 5.8 12 3.4z'
};
const KbGlyph = ({ name, size = 20 }) => {
  const d = KB_GLYPH[name];
  if (!d) return null;
  return (
    <svg className="ic" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
//                        К Л А В И А Т У Р А   (Keys)
// ═════════════════════════════════════════════════════════════════════════════
// Пропсы:
//   layout    'ru' | 'en' | 'uz' | 'num'. По умолчанию — язык урока (useLang()).
//   onKey(k)  k = { code, char, service, zone }. Для буквы code — сама буква в
//             нижнем регистре ('й', 'q', '7'), char — то, что надо вставить (с
//             учётом регистра). Для служебной code совпадает с service:
//             back, enter, space, shift, lang, num, left, right.
//   lit       массив кодов: подсветить (урок 5 показывает, где Enter).
//   dim       массив кодов: клавиша НАРИСОВАНА, но без буквы. Механика урока 7:
//             подписи гаснут одна за другой, ребёнок допечатывает по памяти.
//             Клавиша при этом работает — гаснет подпись, а не клавиша.
//   zones     true или массив групп ('letters','digits','marks','service',
//             'space','enter','back','arrows') — подкрасить группы.
//   compact   три ряда вместо четырёх.
//   arrows    показать стрелки влево/вправо (перемещение курсора).
//   langKey   показать клавишу смены алфавита (по умолчанию нет: урок идёт на
//             одном языке, и лишний переключатель ребёнка только путает).
//   digits    показать переключатель цифр (по умолчанию да).
//   shake     код клавиши, которая должна качнуться (ошибка в Hunt).
//   disabled  клавиатура заперта — пока герой говорит.
//   wide      снять ограничение ширины (по умолчанию 520 px): нужно на
//             планшете, где клавиатура — предмет урока и должна быть крупной.
//
// РАЗМЕР КЛАВИШИ — СОЗНАТЕЛЬНОЕ ИСКЛЮЧЕНИЕ ИЗ ПРАВИЛА 44 px.
// Двенадцать клавиш ЙЦУКЕН на экране 360 px дают колпачок около 27 px шириной.
// Для обычной кнопки курса это недопустимо, здесь — единственно верно: это
// точная копия клавиатуры, которая у ребёнка в руках, и ровно к такому размеру
// он привычен. Клавиша шире 44 px превратила бы раскладку в набор кубиков и
// разрушила бы перенос навыка на настоящий телефон.
// Компенсация — в CSS: отступы между клавишами сделаны ПОЛЯМИ ВНУТРИ самой
// кнопки (.kb-k { padding }), а не промежутками между соседями. Поэтому
// область нажатия соседних клавиш смыкается без зазоров: мимо клавиатуры
// попасть нельзя вообще, промахнуться можно только в соседнюю букву. Зазор
// виден только у колпачков, которые нарисованы внутри.
//
// РЕГИСТР И ЦИФРЫ ДВИЖОК ДЕРЖИТ САМ. Это свойство клавиатуры, а не урока:
// если бы каждый урок заводил под них своё состояние, пять уроков написали бы
// один и тот же код пять раз. Наружу нажатие всё равно уходит — уроку 5 надо
// сказать «эта клавиша делает большую букву».
// ═════════════════════════════════════════════════════════════════════════════
function Keys({
  layout, onKey, lit, dim, zones, compact, arrows, langKey, digits = true,
  shake, disabled, wide
}) {
  const lang = useLang();
  const pick = usePick();
  const audio = useAudio();

  const base = layout && layout !== 'num' ? layout : kbLangLayout(lang);
  const [alt, setAlt] = useState(false);          // включён второй алфавит
  const [numOn, setNumOn] = useState(layout === 'num');
  const [shift, setShift] = useState(0);          // 0 — нет, 1 — на одну букву, 2 — замок

  // Урок может переключить раскладку по ходу экрана — состояние цифр обязано
  // пойти за ним, иначе клавиатура останется на цифрах после layout="ru".
  useEffect(() => { setNumOn(layout === 'num'); setAlt(false); }, [layout]);

  const mode = numOn ? 'num' : (alt ? kbOtherLayout(base, lang) : base);
  const rows = useMemo(
    () => kbRows(mode, { compact, arrows, langKey, digits }),
    [mode, compact, arrows, langKey, digits]
  );

  // Колбэк держим в ref: автоповтор живёт в таймере и без ref утаскивал бы с
  // собой устаревший onKey того рендера, в котором клавишу нажали.
  const keyRef = useRef(onKey);
  useEffect(() => { keyRef.current = onKey; }, [onKey]);

  const hold = useRef(null);
  const repeated = useRef(false);
  // Какую клавишу нажали пальцем. Нужна, чтобы нажатие засчитывалось только
  // при отпускании НА ТОЙ ЖЕ клавише: съехал пальцем в сторону и отпустил —
  // значит передумал, и ни одной буквы не напечаталось. На мыши без этого
  // получалось совсем смешно — нажал на «а», отпустил над «б», напечаталась «б».
  const downKey = useRef(null);
  const stop = useCallback(() => {
    if (hold.current) { clearTimeout(hold.current); hold.current = null; }
  }, []);
  useEffect(() => stop, [stop]);
  // Палец могли увести с клавиши и отпустить где угодно — тогда pointerup до
  // кнопки не дойдёт, и повтор остался бы крутиться вечно. Ловим на окне.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const h = () => stop();
    window.addEventListener('pointerup', h);
    window.addEventListener('pointercancel', h);
    return () => {
      window.removeEventListener('pointerup', h);
      window.removeEventListener('pointercancel', h);
    };
  }, [stop]);

  const on = audio && audio.on;

  const send = useCallback((k, ch) => {
    if (!keyRef.current) return;
    keyRef.current(k.s
      ? { code: k.s, service: k.s, char: null, zone: kbZoneOf(k) }
      : { code: k.c, service: null, char: ch, zone: kbZoneOf(k) });
  }, []);

  const hit = (k) => {
    if (disabled) return;
    if (k.s === 'shift') {
      sfx('tap', on);
      setShift((s) => (s ? 0 : 1));
      send(k);
      return;
    }
    if (k.s === 'num') {
      sfx('tap', on);
      setNumOn((v) => !v);
      send(k);
      return;
    }
    if (k.s === 'lang') {
      sfx('tap', on);
      setAlt((v) => !v);
      setNumOn(false);
      send(k);
      return;
    }
    if (k.s) {
      // Ввод звучит иначе остальных: это не «буква», а «готово с этой строкой».
      sfx(k.s === 'enter' ? 'pop' : 'tap', on);
      send(k);
      return;
    }
    const ch = shift ? k.c.toUpperCase() : k.c;
    if (shift === 1) setShift(0);               // одноразовый регистр гаснет сам
    sfx('tap', on);
    send(k, ch);
  };

  // Автоповтор — только у стирания и стрелок. У букв он вреден: ребёнок,
  // задумавшийся с пальцем на «а», получил бы «ааааааа» и решил, что сломал.
  const holdable = (k) => k.s === 'back' || k.s === 'left' || k.s === 'right';
  const down = (k) => {
    if (disabled) return;
    repeated.current = false;
    downKey.current = k.s || k.c;
    if (k.s === 'shift') {
      hold.current = setTimeout(() => { repeated.current = true; setShift(2); sfx('pop', on); }, KB_LOCK_MS);
      return;
    }
    if (!holdable(k)) return;
    hold.current = setTimeout(function again() {
      repeated.current = true;
      hit(k);
      hold.current = setTimeout(again, KB_REPEAT_MS);
    }, KB_HOLD_MS);
  };
  const up = (k) => {
    stop();
    const was = downKey.current;
    downKey.current = null;
    // Нажатие засчитывается на отпускании, как у настоящей кнопки. Но если
    // повтор уже отработал, отпускание не должно добавить лишнюю букву сверху.
    if (repeated.current) { repeated.current = false; return; }
    if (was !== (k.s || k.c)) return;
    hit(k);
  };
  // Палец съехал с клавиши — нажатие отменено целиком, а не только автоповтор.
  const away = () => { stop(); downKey.current = null; };

  const inList = (arr, code) => Array.isArray(arr) && arr.indexOf(code) >= 0;
  const zoneOn = (z) => (zones === true) || (Array.isArray(zones) && zones.indexOf(z) >= 0);

  const capOf = (k) => {
    if (!k.s) return shift ? k.c.toUpperCase() : k.c;
    return null;
  };
  const labelOf = (k) => {
    if (!k.s) return shift ? k.c.toUpperCase() : k.c;
    if (k.s === 'num') return pick(numOn ? KB_LABEL.abc : KB_LABEL.num);
    return pick(KB_LABEL[k.s] || KB_LABEL.keys);
  };

  return (
    <div className={'kb' + (compact ? ' kb-compact' : '') + (wide ? ' kb-wide' : '')
      + (disabled ? ' is-off' : '')}
      role="group" aria-label={pick(KB_LABEL.keys)}>
      {rows.map((row, ri) => (
        <div className="kb-row" key={ri}>
          {row.map((k, ki) => {
            if (k.sp) return <span className="kb-sp" key={'s' + ki} style={{ flexGrow: k.sp }} aria-hidden="true" />;
            const code = k.s || k.c;
            const z = kbZoneOf(k);
            const isDim = inList(dim, code);
            const cls = 'kb-k'
              + (k.s ? ' kb-srv kb-' + k.s : '')
              + (zoneOn(z) ? ' kb-z kb-z-' + z : '')
              + (inList(lit, code) ? ' is-lit' : '')
              + (isDim ? ' is-dim' : '')
              + (shake === code ? ' fx-no' : '')
              + (k.s === 'shift' && shift ? (shift === 2 ? ' is-lock' : ' is-on') : '');
            return (
              <button type="button" key={code + ':' + ki} className={cls}
                style={{ flexGrow: k.w || 1 }}
                disabled={!!disabled}
                aria-label={labelOf(k)}
                onPointerDown={() => down(k)}
                onPointerUp={() => up(k)}
                onPointerLeave={away}
                onPointerCancel={away}
                // Клавиатура обязана работать и с настоящей клавиатуры, и с
                // экранного диктора — там pointer-событий не бывает вовсе.
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(k); } }}>
                <span className="kb-cap">
                  {k.s
                    ? (k.s === 'num'
                      ? <span className="kb-txt">{numOn ? 'ABC' : '123'}</span>
                      : <KbGlyph name={k.s} size={k.s === 'space' ? 22 : 19} />)
                    : (isDim ? null : <span className="kb-ch">{capOf(k)}</span>)}
                </span>
                <Led on={inList(lit, code)} />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//                          П О Л Е   В В О Д А   (Field)
// ═════════════════════════════════════════════════════════════════════════════
// Настоящего <input> здесь нет и быть не может: любое поле ввода на телефоне
// поднимает системную клавиатуру, а весь смысл движка в том, чтобы она не
// поднималась. Текст рисуется span-ами, курсор — свой элемент.
//
// Пропсы:
//   text        что напечатано
//   caret       позиция курсора (индекс в тексте)
//   label       подпись над полем
//   placeholder что написать в пустом поле
//   ghost       ОЖИДАЕМЫЙ текст. Если напечатанное — его начало, остаток
//               дорисовывается бледным. Это подсказка «сколько ещё осталось»,
//               и она работает лучше счётчика: ребёнок видит не число, а слово.
//   marks       { индекс: 'ok' | 'new' } — подкрасить отдельные буквы. Урок 7
//               помечает так исправленную опечатку.
//   multiline   переносить строки по \n
//   onCaret(i)  тап по букве ставит курсор перед ней
//   done        поле решено — зелёное кольцо
//   big         крупный кегль: когда в поле одно слово или одна буква
// ═════════════════════════════════════════════════════════════════════════════
function Field({
  text = '', caret, label, placeholder, ghost, marks, multiline,
  onCaret, done, big, caretOn = true
}) {
  const pick = usePick();
  const audio = useAudio();
  const t = String(text || '');
  const pos = Math.max(0, Math.min(t.length, caret == null ? t.length : caret));

  // Остаток образца. Показываем только пока напечатанное совпадает с началом
  // образца: как только ребёнок ушёл в сторону, бледный хвост врал бы.
  const tail = (typeof ghost === 'string' && ghost.indexOf(t) === 0) ? ghost.slice(t.length) : '';

  // Сквозной индекс по всему тексту, как в редакторе: курсор адресуется одним
  // числом, а не парой «строка + колонка».
  const lines = [];
  let acc = 0;
  (multiline ? t.split('\n') : [t]).forEach((ln, li) => {
    lines.push({ text: ln, start: acc, li });
    acc += ln.length + 1;
  });

  const jump = (i) => {
    if (!onCaret) return;
    sfx('tap', audio && audio.on);
    onCaret(i);
  };

  const dot = (i) => (caretOn && pos === i ? <span className="kb-cr" aria-hidden="true" /> : null);

  const drawChar = (ch, idx) => {
    const m = marks && marks[idx];
    const inner = <span className={'kb-f-ch' + (m ? ' is-' + m : '')}>{ch === ' ' ? ' ' : ch}</span>;
    if (!onCaret) return <span className="kb-f-cell" key={idx}>{dot(idx)}{inner}</span>;
    // Тап по букве — ВТОРОЙ путь к курсору, а не единственный: буква узкая и
    // до 44 px не дотягивает. Основной путь — стрелки на клавиатуре, они
    // полноразмерные. Поэтому мелкий тап здесь допустим: он ничего не
    // закрывает, а кому удобно — тому удобно.
    return (
      <span className="kb-f-cell" key={idx} role="button" tabIndex={-1}
        onClick={() => jump(idx)}>{dot(idx)}{inner}</span>
    );
  };

  return (
    <div className={'kb-f' + (done ? ' is-done fx-ok' : '') + (big ? ' is-big' : '') + (multiline ? ' is-multi' : '')}>
      {label ? <span className="kb-f-lab">{pick(label)}</span> : null}
      {/* Тап мимо букв — по бледному хвосту или пустому месту поля — ставит
          курсор в конец. Иначе на телефоне в конец слова не попасть: стрелок в
          компактной клавиатуре нет, а ячейка после последней буквы узкая. */}
      <div className="kb-f-box" aria-label={pick(label || KB_LABEL.field)} aria-live="polite"
        onClick={onCaret ? (e) => { if (e.target.closest && e.target.closest('.kb-f-cell')) return; jump(t.length); } : undefined}>
        {t.length === 0 && !tail ? (
          <span className="kb-f-ph">{dot(0)}{pick(placeholder || KB_LABEL.empty)}</span>
        ) : null}
        {t.length > 0 || tail ? lines.map((ln) => (
          <div className="kb-f-line" key={ln.li}>
            {ln.text.split('').map((ch, k) => drawChar(ch, ln.start + k))}
            <span className="kb-f-cell kb-f-end"
              role={onCaret ? 'button' : undefined} tabIndex={onCaret ? -1 : undefined}
              onClick={onCaret ? () => jump(ln.start + ln.text.length) : undefined}>
              {dot(ln.start + ln.text.length)}
            </span>
            {/* Бледный хвост образца дорисовывается только к последней строке. */}
            {ln.li === lines.length - 1 && tail
              ? <span className="kb-f-ghost" aria-hidden="true">{tail.replace(/ /g, ' ')}</span>
              : null}
          </div>
        )) : null}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//                        М О Д Е Л Ь   Н А Б О Р А   (useTyping)
// ═════════════════════════════════════════════════════════════════════════════
// Что делает с клавишами: буквы вставляет, «стереть» убирает символ ПЕРЕД
// курсором, стрелки двигают курсор, переключатели (регистр, алфавит, цифры)
// игнорирует — их клавиатура обработала сама.
//
// ВВОД В ОДНУ СТРОКУ. Enter в однострочном поле перевода строки НЕ вставляет:
// в задании «напечатай своё имя» перенос строки — не результат, а поломка
// вёрстки. Уроку он при этом нужен как событие «я закончил», поэтому уходит
// наружу через onEnter. Нужен настоящий перенос — multiline: true.
//
//   const kb = useTyping('', { max: 24, onEnter: check });
//   <Keys onKey={kb.press} />
//   <Field text={kb.text} caret={kb.caret} onCaret={kb.move} />
// ═════════════════════════════════════════════════════════════════════════════
function useTyping(initial, opts) {
  const o = opts || {};
  const store = useStore();
  const max = typeof o.max === 'number' ? o.max : 60;
  const multiline = !!o.multiline;
  const key = o.storeKey;
  const lang = useLang();

  const [st, setSt] = useState(() => {
    const t0 = typeof initial === 'string' ? initial : '';
    // Сохранённый набор переживает перезагрузку — но только если урок сам
    // попросил, передав storeKey. Экрану «найди клавишу» хранить нечего.
    if (key && store) {
      const v = store.get(key);
      // Набор хранится вместе с языком: узбекское «qnday» не должно
      // всплывать в русском уроке (заказчик, 09.10.2026).
      if (v && typeof v.text === 'string' && v.lang === lang) {
        return { text: v.text, caret: typeof v.caret === 'number' ? v.caret : v.text.length };
      }
    }
    return { text: t0, caret: t0.length };
  });

  useEffect(() => { if (key && store) store.set(key, { ...st, lang }); }, [st, key, store, lang]);

  const enterRef = useRef(o.onEnter);
  useEffect(() => { enterRef.current = o.onEnter; }, [o.onEnter]);
  const fullRef = useRef(o.onFull);
  useEffect(() => { fullRef.current = o.onFull; }, [o.onFull]);

  const press = useCallback((k) => {
    if (!k) return;
    // Ввод в однострочном поле — сигнал наружу, а не символ.
    if (k.service === 'enter' && !multiline) { if (enterRef.current) enterRef.current(); return; }
    if (k.service === 'shift' || k.service === 'lang' || k.service === 'num') return;
    setSt((s) => {
      const t = s.text;
      const i = Math.max(0, Math.min(t.length, s.caret));
      if (k.service === 'back') {
        if (i === 0) return s;
        return { text: t.slice(0, i - 1) + t.slice(i), caret: i - 1 };
      }
      if (k.service === 'left') return i === 0 ? s : { text: t, caret: i - 1 };
      if (k.service === 'right') return i >= t.length ? s : { text: t, caret: i + 1 };
      let ch = null;
      if (k.service === 'space') ch = ' ';
      else if (k.service === 'enter') ch = '\n';
      else if (k.char) ch = k.char;
      if (ch === null) return s;
      // Потолок длины — не наказание, а защита вёрстки: поле не умеет
      // прокручиваться, и сотня букв просто вылезла бы за экран.
      if (t.length >= max) { if (fullRef.current) fullRef.current(); return s; }
      return { text: t.slice(0, i) + ch + t.slice(i), caret: i + ch.length };
    });
  }, [max, multiline]);

  const set = useCallback((text, caret) => {
    const v = String(text == null ? '' : text).slice(0, max);
    setSt({ text: v, caret: typeof caret === 'number' ? Math.max(0, Math.min(v.length, caret)) : v.length });
  }, [max]);
  const move = useCallback((i) => setSt((s) => ({ text: s.text, caret: Math.max(0, Math.min(s.text.length, i)) })), []);
  const clear = useCallback(() => setSt({ text: '', caret: 0 }), []);

  return {
    text: st.text, caret: st.caret, full: st.text.length >= max,
    press, set, move, clear
  };
}

// ═════════════════════════════════════════════════════════════════════════════
//                      К А Р Т А   К Л А В И А Т У Р Ы   (KeyMap)
// ═════════════════════════════════════════════════════════════════════════════
// Экран урока 5: «вот клавиатура, у неё шесть областей, потрогай каждую».
//
// ПОЧЕМУ СХЕМА, А НЕ НАСТОЯЩАЯ КЛАВИАТУРА. На настоящей раскладке область
// «буквы» — это тридцать три отдельных кнопки, и тап по любой из них ребёнок
// понимает как «я выбрал букву Ы», а не «я потрогал буквы». Карта делает
// области ЦЕЛЫМИ кнопками: одна область — одно нажатие — одно объяснение. Так
// разговор идёт про устройство, а не про буквы.
//
// ОДНА РАСКЛАДКА НА ВЕСЬ УРОК (UX-12). Карта рисуется с той же клавиатуры,
// что стоит на всех экранах урока, — полной телефонной раскладки Keys без
// стрелок: буквы главным блоком (число колпачков в рядах берётся из kbRows
// языка урока), стирание справа в третьем ряду, прямо над Enter; внизу слева
// «123» — за ней цифры, посередине длинный пробел, справа Enter. Раньше карта
// рисовала компьютерную клавиатуру с рядом цифр и стрелками, а экраны —
// телефонную, и клавиши «переезжали» между экранами.
//
//   parts   список областей (по умолчанию пять) или массив своих
//           { id, label }; стрелки ('arrows') на карту не выводятся по
//           умолчанию: на клавиатуре урока их нет
//   onZone(id)     нажали область — урок говорит, что это
//   onAllSeen()    все области открыты
//   count          счётчик «n / 5» под картой (по умолчанию да; на итоге — нет)
// ═════════════════════════════════════════════════════════════════════════════
const KB_MAP_LABEL = {
  digits:  { uz: 'Raqamlar', ru: 'Цифры', en: 'Numbers' },
  letters: { uz: 'Harflar', ru: 'Буквы', en: 'Letters' },
  back:    { uz: 'O‘chirish', ru: 'Стереть', en: 'Erase' },
  enter:   { uz: 'Yangi qator', ru: 'Новая строка', en: 'New line' },
  space:   { uz: 'Bo‘sh joy', ru: 'Пробел', en: 'Space' },
  arrows:  { uz: 'Strelkalar', ru: 'Стрелки', en: 'Arrows' }
};
const KB_MAP_ORDER = ['letters', 'back', 'digits', 'space', 'enter'];

function KeyMap({ parts, labels, onZone, onAllSeen, stored, canAnswer = true, count = true }) {
  const pick = usePick();
  const audio = useAudio();
  const lang = useLang();
  const list = useMemo(() => {
    if (!Array.isArray(parts)) return KB_MAP_ORDER.map((id) => ({ id, label: KB_MAP_LABEL[id] }));
    return parts.map((p) => (typeof p === 'string'
      ? { id: p, label: KB_MAP_LABEL[p] }
      : { id: p.id, label: p.label || KB_MAP_LABEL[p.id] }));
  }, [parts]);
  // Сколько колпачков в каждом ряду букв — с настоящей раскладки урока.
  const letterRows = useMemo(() => kbRows(kbLangLayout(lang), {}).slice(0, 3)
    .map((row) => row.filter((k) => !k.s && !k.sp).length), [lang]);

  // Сохранённое старым форматом (там была шестая область «стрелки») не должно
  // ни ронять экран, ни засчитывать область, которой на карте больше нет.
  const ids = list.map((p) => p.id);
  const seen0 = () => seenOf(stored).filter((id) => ids.indexOf(id) >= 0);
  const [seen, setSeen] = useState(seen0);
  const fired = useRef(seen0().length >= list.length);
  const all = seen.length >= list.length;
  const led = useIdleLed(canAnswer && !all, seen.length);

  const tap = (p) => {
    if (!canAnswer) return;
    sfx('pop', audio && audio.on);
    if (onZone) onZone(p.id);
    if (seen.indexOf(p.id) >= 0) return;
    const n = seen.concat([p.id]);
    setSeen(n);
    if (n.length >= list.length && !fired.current && onAllSeen) {
      fired.current = true;
      onAllSeen({ seen: n });
    }
  };

  // Внутри области рисуем колпачки-заглушки: область должна ВЫГЛЯДЕТЬ куском
  // клавиатуры, иначе это просто шесть подписанных прямоугольников.
  const caps = (n) => {
    const out = [];
    for (let i = 0; i < n; i += 1) out.push(<i key={i} />);
    return <span className="km-caps" aria-hidden="true">{out}</span>;
  };
  const inside = (id) => {
    // Цифры на клавиатуре урока — за клавишей «123»: так её и рисуем.
    if (id === 'digits') return <span className="km-num mono" aria-hidden="true">123</span>;
    if (id === 'letters') return <span className="km-rows" aria-hidden="true">{letterRows.map((n, i) => <React.Fragment key={i}>{caps(n)}</React.Fragment>)}</span>;
    if (id === 'space') return <KbGlyph name="space" size={22} />;
    if (id === 'arrows') return <span className="km-arr" aria-hidden="true"><KbGlyph name="left" size={17} /><KbGlyph name="right" size={17} /></span>;
    return <KbGlyph name={id} size={20} />;
  };

  return (
    <div className="km">
      <div className="km-grid">
        {list.map((p) => {
          const was = seen.indexOf(p.id) >= 0;
          return (
            <button key={p.id} type="button"
              className={'km-p km-' + p.id + (was ? ' is-seen' : '') + (led && !was ? ' is-led' : '')}
              disabled={!canAnswer} onClick={() => tap(p)} aria-pressed={was}>
              {inside(p.id)}
              <span className="km-t">{pick(p.label)}</span>
              {was ? <span className="km-tick"><Icon name="check" size={12} /></span> : null}
              <Led on={led && !was} />
            </button>
          );
        })}
      </div>
      {/* UI-03: на итоге карта — памятка, счётчик «0 / 5» там только шумит. */}
      {count ? (
        <p className={'km-count mono' + (all ? ' is-all' : '')}>
          {all ? pick((labels && labels.all) || KB_MAP_ALL) : seen.length + ' / ' + list.length}
        </p>
      ) : null}
    </div>
  );
}
const KB_MAP_ALL = { uz: 'Hammasini ko‘rdingiz', ru: 'Все области открыты', en: 'Every part opened' };

// ═════════════════════════════════════════════════════════════════════════════
//                        Н А Й Д И   К Л А В И Ш У   (Hunt)
// ═════════════════════════════════════════════════════════════════════════════
// Урок называет клавишу, ребёнок ищет её на настоящей раскладке.
//
// ОШИБКА НИЧЕГО НЕ СТОИТ. Промахнувшаяся клавиша качается и остаётся рабочей:
// ни гашения, ни крестика, ни счёта попыток на экране. Ребёнок ищет столько,
// сколько нужно. После двух промахов подряд нужная клавиша загорается сама —
// это не поддавки, а правило курса: задача «найти» не должна превращаться в
// «перебрать тридцать три клавиши».
//
// ПЕРЕКЛЮЧАТЕЛИ НЕ СЧИТАЮТСЯ ПРОМАХОМ. Нажать «цифры», чтобы поискать там, —
// это и есть правильное поведение, а не ошибка.
//
//   targets = [{ code, ask, ok, hint? }]   ask произносит урок, а не движок;
//             hint — подсказка на промах: называет место и вид клавиши
//   labels  = { of, all }
//   idleLit   подсвечивать цель после семи секунд молчания (по умолчанию да)
//   litAfter  после скольких промахов подряд цель загорается сама (2)
//
// ЦИФРА ЗА «123». Если цель — цифра, а клавиатура показывает буквы, подсветка
// загорается на «123»: цифры на экране нет, и светить надо туда, где её взять.
// ═════════════════════════════════════════════════════════════════════════════
function Hunt({
  targets, labels, onAsk, onSay, onSolved, stored, canAnswer = true,
  layout, compact, arrows, langKey, digits, idleLit = true, litAfter = 2
}) {
  const pick = usePick();
  const audio = useAudio();
  const [done, setDone] = useState(() => doneOf(stored));
  const [shake, setShake] = useState(null);
  const [miss, setMiss] = useState(0);
  // Зеркало переключателя цифр в Keys: нужно только подсветке (см. выше).
  const [numOn, setNumOn] = useState(layout === 'num');
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const firstTry = useRef(stored ? stored.firstTry || 0 : 0);
  const asked = useRef(null);
  const alive = useRef(true);
  const fired = useRef(doneOf(stored).length >= targets.length);
  useEffect(() => () => { alive.current = false; }, []);

  const at = Math.min(done.length, targets.length - 1);
  const cur = targets[at];
  const all = done.length >= targets.length;
  const led = useIdleLed(canAnswer && !all, done.length + ':' + miss);

  // Вопрос произносит УРОК. Движок только сообщает, что пора спрашивать
  // следующее: два голоса одновременно в курсе запрещены, и очередь реплик
  // держит экран.
  useEffect(() => {
    if (!cur || all || asked.current === cur.code) return;
    asked.current = cur.code;
    if (onAsk) onAsk(cur, at);
  }, [cur && cur.code, all]); // eslint-disable-line react-hooks/exhaustive-deps

  const tap = (k) => {
    if (!canAnswer || all || shake) return;
    // Смена регистра, алфавита и цифр — это поиск, а не ответ.
    if (k.service === 'num') { setNumOn((v) => !v); return; }
    if (k.service === 'lang') { setNumOn(false); return; }
    if (k.service === 'shift') return;
    attempts.current += 1;
    if (k.code === cur.code) {
      if (miss === 0) firstTry.current += 1;
      const n = done.concat([cur.code]);
      setDone(n);
      setMiss(0);
      asked.current = null;
      sfx('ok', audio && audio.on);
      if (onSay) onSay(joinL(nextPraiseL(), cur.ok), 'rule');
      if (n.length >= targets.length && !fired.current && onSolved) {
        fired.current = true;
        onSolved({ done: n, attempts: attempts.current, firstTry: firstTry.current });
      }
      return;
    }
    setShake(k.code);
    setMiss((m) => m + 1);
    sfx('soft', audio && audio.on);
    (async () => {
      await sleep(420);
      if (!alive.current) return;
      setShake(null);
      // Подсказка сужает поиск: называет место и вид клавиши, а не общее
      // «посмотри внимательно».
      if (onSay) onSay(cur.hint ? joinL(nextEncourageL(), cur.hint) : nextEncourageL(), 'think');
    })();
  };

  // Подсветка цели: по общему правилу курса — через семь секунд молчания, а
  // также после двух промахов подряд. Экран проверки может отключить первое
  // и отодвинуть второе, но не убрать совсем: тупиков в курсе не бывает.
  const isDigit = !!cur && cur.code >= '0' && cur.code <= '9' && cur.code.length === 1;
  const litCode = cur ? (isDigit && !numOn ? 'num' : cur.code) : null;
  const lit = (!all && ((idleLit && led) || miss >= litAfter)) ? [litCode] : null;

  return (
    <div className="hu">
      {/* UI-33: при одной цели «1 из 1» с одной бусиной ничего не сообщает. */}
      {targets.length > 1 ? <div className="hu-top">
        <span className="hu-n mono">{Math.min(done.length + 1, targets.length)} {pick((labels && labels.of) || KB_HUNT_OF)} {targets.length}</span>
        <span className="hu-beads" aria-hidden="true">
          {targets.map((t, i) => (
            <i key={t.code} className={'hu-bead' + (i < done.length ? ' is-on' : '') + (i === done.length ? ' is-now' : '')} />
          ))}
        </span>
      </div> : null}
      {all ? (
        <span className="hu-all"><Icon name="check" size={20} />{pick((labels && labels.all) || KB_HUNT_ALL)}</span>
      ) : (
        <p className="hu-ask"><FitLine max={19} min={14}>{pick(cur.ask)}</FitLine></p>
      )}
      <Keys layout={layout} compact={compact} arrows={arrows} langKey={langKey} digits={digits}
        lit={lit} shake={shake} disabled={!canAnswer || all} onKey={tap} />
    </div>
  );
}
const KB_HUNT_OF = { uz: 'dan', ru: 'из', en: 'of' };
const KB_HUNT_ALL = { uz: 'Hammasi topildi', ru: 'Все клавиши найдены', en: 'Every key found' };
// =============================================================================
// УРОК 7 · «Пишем без опечаток» · модуль 2 «Файлы и текст»
//
// ДВИЖОК: keyboard
//
// Собирается: ./tools/sobrat.sh 07
//
// ПО КАРТЕ МЕХАНИК: крючок — ПОЛОМКА, изюминка — ГАСНУЩИЕ КЛАВИШИ.
//
// Робот написал другу «приает, как дила» и не понимает, почему тот ответил
// вопросительным знаком. Ребёнок чинит сообщение слово за словом.
//
// ПОЧЕМУ КЛАВИШИ ГАСНУТ. Печатать, глядя на буквы, ребёнок умеет и так —
// это не навык, а поиск. Навык начинается там, где буква уже не подписана, а
// палец всё равно знает, куда идти. Поэтому от уровня к уровню буквы
// нужного слова исчезают с клавиатуры: сама клавиша работает, просто молчит.
//
// ГАСНУТ ИМЕННО НУЖНЫЕ БУКВЫ, а не случайные. Так задание честное в любом из
// трёх языков: гасится ровно то, что ребёнок сейчас набирает, и ни одна
// лишняя клавиша не пропадает зря.
//
// ЭТО НЕ СКОРОСТЬ. Ни секундомера, ни «успей», ни счёта знаков в минуту:
// мастер-ТЗ запрещает давление временем, а слепая печать в восемь лет и не
// ставится — ставится привычка не искать глазами каждую букву.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU и EN — «ты» / «you».
// =============================================================================

// =============================================================================
// ===================  К А Н О Н  ·  К А Р Т А   М О Д У Л Я  =================
// =============================================================================
// Кино карты идёт в НАЧАЛЕ и в КОНЦЕ каждого урока (решение заказчика
// 2026-09-24, карта karta-kg-30-v2.html). Во весь экран, без героя, текста и
// кнопки — так же, как карта «Кибер-щита». В начале ребёнок видит, в какой урок
// пришёл: карточка урока подсвечена, курсор-маскот открывает на ней замок.
// В конце курсор уносит с карточки деталь и ставит её в компьютер: урок
// пройден, деталь получена, открывается следующая карточка.
//
// Блок одинаковый во всех уроках курса. Урок передаёт только свой номер:
//   корень урока — <MapFilm n={LESSON_N} mode="start" /> до первого экрана;
//   экран перед прощанием — <MapFilm n={LESSON_N} mode="end" onDone={p.next} />
// Правка здесь вносится во ВСЕ уроки сразу — источник: kurs0/_canon/module-map.jsx.
//
// ТРИ РАСКЛАДКИ, одна сцена. Карта 1600×940 из макета на телефоне сжимается
// до карточек в 27 px — ребёнок не найдёт на ней свой урок. Поэтому раскладка
// выбирается по месту, которое реально досталось карте:
//   full  — широкий и достаточно высокий экран: вся карта, 30 карточек, как в макете;
//   row   — широкий, но низкий (телефон лёжа): ряд текущего блока + компьютер сбоку;
//   focus — портрет (телефон): ряд текущего блока сверху, компьютер под ним.
// В row и focus все 30 уроков видны полоской прогресса под рядом.
//
// Карта нарочно тёмная: это «ночной стол», на котором собирается компьютер,
// особый момент урока, а не очередное задание. Цвета взяты из макета как есть.
// =============================================================================

const ML = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const MAP_N = 30;
const MAP_GOLD = '#FFC53D';
const MAP_BLOCKS = [
  { hex: '#4EA8FF', t: ML('Kompyuter', 'Компьютер', 'The Computer') },
  { hex: '#FFB020', t: ML('Fayllar va oynalar', 'Файлы и окна', 'Files and Windows') },
  { hex: '#35D6A4', t: ML('Matn', 'Текст', 'Text') },
  { hex: '#A98BFF', t: ML('Rasm chizish', 'Рисование', 'Drawing') },
  { hex: '#FF5F9E', t: ML('Internet', 'Интернет', 'The Internet') }
];
const MAP_ICON = {
  pc: 'M3 5h18v11H3zM8 20h8M12 16v4',
  shield: 'M12 3l7 3v5.5c0 4.3-3 7.4-7 8.5-4-1.1-7-4.2-7-8.5V6zM9 12l2.2 2.2L15.5 10',
  power: 'M12 4v7M7.8 6.6a7 7 0 108.4 0',
  mouse: 'M9 2.5h6A4.5 4.5 0 0119.5 7v10a4.5 4.5 0 01-4.5 4.5H9A4.5 4.5 0 014.5 17V7A4.5 4.5 0 019 2.5zM12 7v4',
  keyboard: 'M3 7h18v10H3zM6.5 10.5h.01M10 10.5h.01M13.5 10.5h.01M17 10.5h.01M8 14h8',
  cup: 'M7 4h10v5a5 5 0 11-10 0zM7 6H4.5a2.5 2.5 0 002.5 3M17 6h2.5a2.5 2.5 0 01-2.5 3M9.5 19h5M12 14v5M8 21h8',
  keycap: 'M4 5h16v14H4zM9.6 15l2.4-7 2.4 7M10.6 13h2.8',
  window: 'M4 5h16v14H4zM4 9.5h16M7 7.2h.01M9.6 7.2h.01M12.2 7.2h.01',
  file: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h6M10 16h6',
  folder: 'M3 7a2 2 0 012-2h4l2 2.5h8a2 2 0 012 2V17a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  save: 'M5 4h11l3 3v13H5zM8.5 4v5h6V4M8 13.5h8V20H8z',
  text: 'M5 5h14M12 5v14M8 19h8',
  format: 'M7 5h5.5a3.5 3.5 0 010 7H7zM7 12h6.5a3.5 3.5 0 010 7H7zM7 5v14',
  list: 'M4.5 6h.01M4.5 12h.01M4.5 18h.01M9 6h11M9 12h11M9 18h8',
  image: 'M3 5h18v14H3zM8 11a1.6 1.6 0 100-3.2A1.6 1.6 0 008 11M3 16l5-4.5 4 3.5 3-2.5 6 5',
  profile: 'M6 3h12v18H6zM12 10a2.2 2.2 0 100-4.4A2.2 2.2 0 0012 10M8.8 15c0-1.8 1.4-3.2 3.2-3.2s3.2 1.4 3.2 3.2M9 18h6',
  brush: 'M9.6 17.4c0 2-1.6 3.6-3.6 3.6-1.2 0-2.2-.4-2.2-.4 1.3-.7 1.2-2 1.2-2.8a2.6 2.6 0 014.6-.4zM11.2 15.4L20.6 6a2.2 2.2 0 00-3.1-3.1L8 12.3',
  palette: 'M12 3a9 9 0 000 18c1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.8 1.8-1.8H16a5 5 0 005-5c0-4.2-4-7.1-9-7.1zM7.6 10.6h.01M10.6 7.6h.01M14.4 7.6h.01M17 10.6h.01',
  undo: 'M9 14L4 9l5-5M4 9h9a6.5 6.5 0 010 13h-3',
  imgsave: 'M4 4h16v10H4zM8.5 9.2a1.5 1.5 0 100-3 1.5 1.5 0 000 3M4 13l4.5-4 3.5 3 2.5-2 5.5 4.5M12 18h8M16 15v6M13.4 18.6L16 21.2l2.6-2.6',
  envelope: 'M3 6h18v13H3zM3 6l9 7 9-7',
  wifi: 'M12 19h.01M4.5 11a11 11 0 0115 0M8 14.6a6 6 0 018 0',
  browser: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM16.2 16.2L21 21',
  download: 'M12 3v12M7.5 10.5l4.5 4.5 4.5-4.5M4 20h16',
  frame: 'M3 4h18v13H3zM8.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3M3 15l5-4 3.5 3 3-2.5 4.5 3.5M8 21h8M12 17v4',
  cert: 'M6 3h12v13H6zM9 7h6M9 10h6M12 16l-2.5 5 2.5-1.3L14.5 21 12 16z'
};
// [№, блок, иконка, деталь, тип ('' | 'q' квиз | 'p' проект), название]
const MAP_L = [
  [1, 0, 'pc', 'base', '', ML('Kompyuter bilan tanishamiz', 'Знакомимся с компьютером', 'Meet the Computer')],
  [2, 0, 'shield', 'lamp', '', ML('Kompyuterda xavfsiz ishlaymiz', 'Безопасно работаем за компьютером', 'Computer Safety')],
  [3, 0, 'power', 'power', '', ML('Kompyuterni yoqamiz va o‘chiramiz', 'Включаем и выключаем компьютер', 'Turn the Computer On and Off')],
  [4, 0, 'mouse', 'mouse', '', ML('Sichqonchani o‘rganamiz', 'Учимся пользоваться мышкой', 'Learn to Use the Mouse')],
  [5, 0, 'keyboard', 'keyboard', '', ML('Klaviatura bilan tanishamiz', 'Знакомимся с клавиатурой', 'Meet the Keyboard')],
  [6, 0, 'cup', 'screw1', 'q', ML('Kompyuter olamiga sayohat', 'Путешествие в мир компьютера', 'Journey into the Computer World')],
  [7, 1, 'keycap', 'keys', '', ML('Tez va to‘g‘ri yozamiz', 'Печатаем быстро и правильно', 'Type Fast and Correctly')],
  [8, 1, 'window', 'window', '', ML('Oynalar bilan ishlaymiz', 'Работаем с окнами', 'Working with Windows')],
  [9, 1, 'file', 'file', '', ML('Fayl nima?', 'Что такое файл?', 'What Is a File?')],
  [10, 1, 'folder', 'folder', '', ML('Papka yaratamiz', 'Создаём папку', 'Create a Folder')],
  [11, 1, 'save', 'drive', '', ML('Faylni saqlaymiz va topamiz', 'Сохраняем и находим файл', 'Save and Find a File')],
  [12, 1, 'cup', 'screw2', 'q', ML('Yo‘qolgan fayl siri', 'Тайна пропавшего файла', 'The Mystery of the Missing File')],
  [13, 2, 'text', 'textwin', '', ML('Matn yozamiz', 'Пишем текст', 'Write a Text')],
  [14, 2, 'format', 'format', '', ML('Matnni chiroyli qilamiz', 'Делаем текст красивым', 'Make the Text Look Great')],
  [15, 2, 'list', 'list', '', ML('Ro‘yxat tuzamiz', 'Создаём список', 'Make a List')],
  [16, 2, 'image', 'pic', '', ML('Rasm qo‘shamiz', 'Добавляем картинку', 'Add a Picture')],
  [17, 2, 'profile', 'sheet', 'p', ML('Mening anketam', 'Моя анкета', 'My Profile')],
  [18, 2, 'cup', 'screw3', 'q', ML('Sehrli matn ustaxonasi', 'Мастерская волшебного текста', 'Magic Text Workshop')],
  [19, 3, 'brush', 'paintwin', '', ML('Kompyuterda rasm chizamiz', 'Рисуем на компьютере', 'Draw on the Computer')],
  [20, 3, 'palette', 'palette', '', ML('Ranglar bilan ishlaymiz', 'Работаем с цветами', 'Work with Colors')],
  [21, 3, 'undo', 'undo', '', ML('Nusxa olamiz va bekor qilamiz', 'Копируем и отменяем', 'Copy and Undo')],
  [22, 3, 'imgsave', 'artfile', '', ML('Rasmni saqlaymiz', 'Сохраняем рисунок', 'Save the Drawing')],
  [23, 3, 'envelope', 'card', 'p', ML('Raqamli tabriknoma', 'Цифровая открытка', 'Digital Greeting Card')],
  [24, 3, 'cup', 'screw4', 'q', ML('Rassomlar bellashuvi', 'Битва цифровых художников', 'Digital Artists’ Challenge')],
  [25, 4, 'wifi', 'router', '', ML('Internet bilan tanishamiz', 'Знакомимся с интернетом', 'Meet the Internet')],
  [26, 4, 'browser', 'browser', '', ML('Brauzerda ishlaymiz', 'Работаем с браузером', 'Use a Browser')],
  [27, 4, 'search', 'search', '', ML('Internetda to‘g‘ri qidiramiz', 'Правильно ищем в интернете', 'Search the Internet')],
  [28, 4, 'download', 'download', '', ML('Fayl yuklab olamiz', 'Скачиваем файл', 'Download a File')],
  [29, 4, 'frame', 'framed', 'p', ML('Mening birinchi raqamli ishim', 'Моя первая цифровая работа', 'My First Digital Work')],
  [30, 4, 'cert', 'final', 'q', ML('Internet detektivi', 'Интернет-детектив', 'Internet Detective')]
];
// Как деталь называет голос: «Держи новую деталь — …».
const MAP_PART = {
  base: ML('kompyuterli stol', 'стол с компьютером', 'a desk with a computer'),
  lamp: ML('stol chirog‘i', 'настольная лампа', 'a desk lamp'),
  power: ML('yoqish tugmasi', 'кнопка включения', 'a power button'),
  mouse: ML('sichqoncha', 'мышка', 'a mouse'),
  keyboard: ML('klaviatura', 'клавиатура', 'a keyboard'),
  screw1: ML('vint', 'винтик', 'a screw'),
  screw2: ML('vint', 'винтик', 'a screw'),
  screw3: ML('vint', 'винтик', 'a screw'),
  screw4: ML('vint', 'винтик', 'a screw'),
  keys: ML('tugmalar', 'клавиши', 'keys'),
  window: ML('ekrandagi oyna', 'окно на экране', 'a window on the screen'),
  file: ML('fayl', 'файл', 'a file'),
  folder: ML('papka', 'папка', 'a folder'),
  drive: ML('fayllar uchun disk', 'диск для файлов', 'a drive for files'),
  textwin: ML('matn oynasi', 'окно для текста', 'a text window'),
  format: ML('bezash paneli', 'панель оформления', 'a formatting bar'),
  list: ML('ro‘yxat', 'список', 'a list'),
  pic: ML('rasm', 'картинка', 'a picture'),
  sheet: ML('anketa', 'анкета', 'a profile page'),
  paintwin: ML('rasm chizish oynasi', 'окно для рисования', 'a drawing window'),
  palette: ML('palitra', 'палитра', 'a palette'),
  undo: ML('bekor qilish tugmasi', 'кнопка отмены', 'an undo button'),
  artfile: ML('rasm fayli', 'файл с рисунком', 'a picture file'),
  card: ML('tabriknoma', 'открытка', 'a greeting card'),
  router: ML('router', 'роутер', 'a router'),
  browser: ML('brauzer', 'браузер', 'a browser'),
  search: ML('qidiruv qatori', 'строка поиска', 'a search bar'),
  download: ML('yuklab olish tugmasi', 'кнопка скачивания', 'a download button'),
  framed: ML('ramkadagi rasm', 'картина в рамке', 'a framed picture'),
  final: ML('sertifikat', 'сертификат', 'a certificate')
};

function mapRR(x, y, w, h, k) {
  return 'M' + (x + k) + ' ' + y + 'h' + (w - 2 * k) + 'a' + k + ' ' + k + ' 0 0 1 ' + k + ' ' + k + 'v' + (h - 2 * k)
    + 'a' + k + ' ' + k + ' 0 0 1 ' + (-k) + ' ' + k + 'h' + (-(w - 2 * k)) + 'a' + k + ' ' + k + ' 0 0 1 ' + (-k) + ' ' + (-k)
    + 'v' + (-(h - 2 * k)) + 'a' + k + ' ' + k + ' 0 0 1 ' + k + ' ' + (-k) + 'Z';
}

// Детали машины в её локальных координатах: [тег, атрибуты, стиль].
// Стили: f — корпус, o — контур, u — клавиша, s — заливка, d — блик,
// t — тонкая линия, g — обои на экране, k — чёрный экран.
const MAP_MACHINE = (function () {
  const bx = -239, bw = 212, kb = [['path', { d: mapRR(-246, 156, 226, 58, 12) }, 'f']], hot = [];
  [12, 11, 10].forEach((n, r) => {
    const w = (bw - (n - 1) * 3) / n, y = 162 + r * 13;
    for (let i = 0; i < n; i++) {
      const d = mapRR(bx + i * (w + 3), y, w, 10, 2.5);
      kb.push(['path', { d: d }, 'u']);
      if ((r === 1 && i > 1 && i < 5) || (r === 2 && i > 4 && i < 7)) hot.push(['path', { d: d }, 's']);
    }
  });
  [[0, 22], [25, 22], [50, 112], [165, 22], [190, 22]].forEach((k) => kb.push(['path', { d: mapRR(bx + k[0], 201, k[1], 10, 2.5) }, 'u']));
  const screw = (x, y) => [['circle', { cx: x, cy: y, r: 10 }, 'o'], ['path', { d: 'M' + x + ' ' + (y - 7) + 'v14M' + (x - 7) + ' ' + y + 'h14' }, 't']];
  return {
    base: { a: [0, 0], s: [
      ['path', { d: mapRR(-350, 150, 640, 84, 18) }, 'f'], ['path', { d: 'M-318 218h576' }, 't'],
      ['path', { d: mapRR(-270, -180, 350, 250, 20) }, 'f'], ['path', { d: mapRR(-254, -164, 318, 218, 10) }, 'k'],
      ['path', { d: mapRR(-112, 70, 44, 62, 6) }, 'f'], ['path', { d: mapRR(-160, 126, 140, 24, 10) }, 'f'],
      ['path', { d: mapRR(150, -120, 120, 270, 16) }, 'f'], ['path', { d: mapRR(166, -106, 88, 24, 6) }, 'o']] },
    lamp: { a: [-300, 60], s: [
      ['ellipse', { cx: -320, cy: 228, rx: 28, ry: 8 }, 'f'], ['path', { d: 'M-320 224V20' }, 'o'],
      ['path', { d: 'M-320 26l30-30' }, 'o'], ['path', { d: 'M-308 -14h30l10 26h-50z' }, 'f'],
      ['path', { d: 'M-290 12l-52 138h128z' }, 'd']] },
    power: { a: [210, -16], s: [
      ['path', { d: mapRR(-254, -164, 318, 218, 10) }, 'g'], ['circle', { cx: 210, cy: -16, r: 17 }, 'o'],
      ['path', { d: 'M210 -24v-9M204.6 -21.4a8 8 0 1010.8 0' }, 't']] },
    mouse: { a: [31, 185], s: [
      ['path', { d: 'M31 156c11 0 20 9 20 20v18c0 11-9 20-20 20s-20-9-20-20v-18c0-11 9-20 20-20z' }, 'f'],
      ['path', { d: 'M12.5 178h37' }, 't'], ['path', { d: 'M31 157v21' }, 't'],
      ['path', { d: mapRR(28, 162, 6, 11, 3) }, 'u']] },
    keyboard: { a: [-133, 185], s: kb },
    keys: { a: [46, 120], s: hot.concat([['path', { d: mapRR(0, 118, 26, 26, 6) }, 'o'],
      ['path', { d: mapRR(34, 96, 26, 26, 6) }, 'o'], ['path', { d: mapRR(68, 114, 26, 26, 6) }, 'o']]) },
    window: { a: [-146, -117], s: [['path', { d: mapRR(-196, -150, 100, 66, 8) }, 'f'], ['path', { d: 'M-196 -134h100' }, 't'],
      ['circle', { cx: -188, cy: -142, r: 3.2 }, 's'], ['circle', { cx: -178, cy: -142, r: 3.2 }, 's'],
      ['path', { d: 'M-186 -122h56M-186 -108h38' }, 't']] },
    file: { a: [-229, -141], s: [['path', { d: 'M-244 -156h18l12 12v18h-30z' }, 'f'],
      ['path', { d: 'M-238 -140h14M-238 -132h14' }, 't']] },
    folder: { a: [-229, -99], s: [['path', { d: 'M-244 -114h12l5 6h13a4 4 0 014 4v14a4 4 0 01-4 4h-30a4 4 0 01-4-4v-20a4 4 0 014-4z' }, 'f']] },
    drive: { a: [210, -56], s: [['path', { d: mapRR(166, -66, 88, 20, 5) }, 'o'], ['path', { d: 'M174 -56h40' }, 't']] },
    textwin: { a: [-22, -115], s: [['path', { d: mapRR(-90, -160, 136, 90, 8) }, 'f'], ['path', { d: 'M-90 -142h136' }, 't'],
      ['circle', { cx: -80, cy: -151, r: 3.2 }, 's'], ['path', { d: 'M-80 -78h60' }, 't']] },
    format: { a: [-22, -130], s: [['path', { d: mapRR(-84, -138, 124, 16, 4) }, 'o'], ['circle', { cx: -74, cy: -130, r: 3.4 }, 's'],
      ['circle', { cx: -62, cy: -130, r: 3.4 }, 's'], ['circle', { cx: -50, cy: -130, r: 3.4 }, 's']] },
    list: { a: [-50, -100], s: [['path', { d: 'M-80 -112h.01M-80 -100h.01M-80 -88h.01' }, 't'],
      ['path', { d: 'M-72 -112h38M-72 -100h44M-72 -88h30' }, 't']] },
    pic: { a: [18, -95], s: [['path', { d: mapRR(-4, -112, 44, 34, 5) }, 'f'], ['path', { d: 'M-4 -84l14-12 10 8 8-6 12 10' }, 't']] },
    paintwin: { a: [-138, -21], s: [['path', { d: mapRR(-196, -60, 116, 78, 8) }, 'f'], ['path', { d: 'M-196 -42h116' }, 't'],
      ['circle', { cx: -186, cy: -51, r: 3.2 }, 's'], ['path', { d: 'M-180 -16q20-22 40-6t32-8' }, 't']] },
    palette: { a: [-158, 6], s: [-186, -172, -158, -144, -130].map((x) => ['circle', { cx: x, cy: 6, r: 5 }, 's']) },
    undo: { a: [-106, -48], s: [['path', { d: 'M-112 -54l-7 6 7 6' }, 't'], ['path', { d: 'M-119 -48h12a7 7 0 010 14h-3' }, 't']] },
    artfile: { a: [-229, -57], s: [['path', { d: mapRR(-244, -72, 30, 30, 6) }, 'f'],
      ['path', { d: 'M-241 -50l8-7 6 5 5-4 7 6' }, 't']] },
    screw1: { a: [210, 120], s: screw(210, 120) },
    screw2: { a: [-258, 58], s: screw(-258, 58) },
    screw3: { a: [-258, -168], s: screw(-258, -168) },
    screw4: { a: [68, -168], s: screw(68, -168) },
    router: { a: [210, -141], s: [['path', { d: mapRR(160, -158, 100, 34, 8) }, 'f'], ['path', { d: 'M240 -158v-26' }, 'o'],
      ['path', { d: 'M228 -190q12-11 24 0' }, 't'], ['path', { d: 'M220 -200q20-17 40 0' }, 't'],
      ['circle', { cx: 176, cy: -141, r: 4 }, 's'], ['circle', { cx: 190, cy: -141, r: 4 }, 's']] },
    browser: { a: [-5, -13], s: [['path', { d: mapRR(-70, -56, 130, 86, 8) }, 'f'], ['path', { d: 'M-70 -30h130' }, 't'],
      ['circle', { cx: -5, cy: 2, r: 16 }, 'o'], ['path', { d: 'M-21 2h32M-5 -14c7 7 7 25 0 32' }, 't']] },
    search: { a: [-20, -42], s: [['path', { d: mapRR(-62, -50, 114, 16, 8) }, 'o'], ['circle', { cx: -50, cy: -42, r: 5 }, 't'],
      ['path', { d: 'M-46.5 -38.5l4 4' }, 't'], ['path', { d: 'M-36 -42h40' }, 't']] },
    download: { a: [44, -44], s: [['circle', { cx: 44, cy: -44, r: 12 }, 'o'],
      ['path', { d: 'M44 -51v12M38.5 -45.5L44 -40l5.5 -5.5' }, 't'],
      ['path', { d: mapRR(-244, -30, 30, 30, 6) }, 'f'], ['path', { d: 'M-229 -24v10M-234 -19l5 5 5-5' }, 't']] },
    sheet: { a: [-135, 317], s: [['path', { d: mapRR(-190, 272, 110, 90, 6) }, 'f'], ['path', { d: 'M-180 284h60' }, 't'],
      ['circle', { cx: -135, cy: 308, r: 9 }, 'o'], ['path', { d: 'M-148 330c0-7 6-12 13-12s13 5 13 12' }, 't']] },
    card: { a: [0, 317], s: [['path', { d: mapRR(-55, 272, 110, 90, 6) }, 'f'], ['path', { d: 'M-55 278l55 40 55-40' }, 't'],
      ['path', { d: 'M0 348c-10-9-18-13-18-21a7 7 0 0118-4 7 7 0 0118 4c0 8-8 12-18 21z' }, 'd']] },
    framed: { a: [135, 317], s: [['path', { d: mapRR(80, 272, 110, 90, 6) }, 'f'], ['path', { d: mapRR(90, 282, 90, 64, 4) }, 'o'],
      ['path', { d: 'M94 340l20-18 14 12 12-10 26 22' }, 't'], ['path', { d: 'M120 358h30' }, 't']] },
    final: { a: [-95, -84], s: [['circle', { cx: 68, cy: 58, r: 10 }, 'o'], ['path', { d: 'M68 51v14M61 58h14' }, 't'],
      ['path', { d: mapRR(-244, -154, 298, 140, 10) }, 'f'],
      ['path', { d: MAP_ICON.cert, transform: 'translate(-119,-114) scale(2)' }, 'o']] }
  };
})();
const MAP_ZORD = ['base', 'lamp', 'mouse', 'keyboard', 'keys', 'drive', 'router', 'power',
  'screw1', 'screw2', 'screw3', 'screw4', 'window', 'file', 'folder', 'textwin', 'format', 'list', 'pic',
  'paintwin', 'palette', 'undo', 'artfile', 'browser', 'search', 'download', 'sheet', 'card', 'framed', 'final'];

function mapStyled(style, color) {
  const a = { strokeLinejoin: 'round', strokeLinecap: 'round' };
  if (style === 'o') { a.fill = 'none'; a.stroke = color; a.strokeWidth = 3; }
  else if (style === 'f') { a.fill = '#141B36'; a.stroke = color; a.strokeWidth = 3; }
  else if (style === 'u') { a.fill = '#1C2549'; a.stroke = color; a.strokeWidth = 1.3; a.opacity = 0.92; }
  else if (style === 's') { a.fill = color; a.stroke = 'none'; }
  else if (style === 'd') { a.fill = color; a.opacity = 0.22; a.stroke = 'none'; }
  else if (style === 't') { a.fill = 'none'; a.stroke = color; a.strokeWidth = 2.2; }
  else if (style === 'g') { a.fill = 'url(#mm-wall)'; a.stroke = 'none'; }
  else if (style === 'k') { a.fill = '#07060F'; a.stroke = 'none'; }
  return a;
}
const MAP_GHOST = { fill: 'none', stroke: '#5D6AA6', strokeWidth: 2, strokeDasharray: '6 8', opacity: 0.5,
  strokeLinejoin: 'round', strokeLinecap: 'round' };

// Раскладки. CW — сторона карточки, всё остальное в единицах viewBox.
const MAP_CW = 116, MAP_GAP = 14, MAP_ROWW = 6 * MAP_CW + 5 * MAP_GAP;
const MAP_LAYOUT = {
  full: { w: 1600, h: 940, all: true, trayX: 56, trayY: 112, rowGap: 44, mach: { x: 1251, y: 340, s: 1.05 },
    numR: 15, numF: 16, lblF: 17, prog: { x: 890, y: 800, w: 660 } },
  row: { w: 1640, h: 620, all: false, trayX: 44, trayY: 170, mach: { x: 1262, y: 238, s: 0.98 },
    numR: 21, numF: 24, lblF: 30, lockS: 1.5, worksF: 30, strip: { x: 44, y: 330 } },
  focus: { w: 840, h: 930, all: false, trayX: 37, trayY: 76, mach: { x: 453, y: 500, s: 1.1 },
    numR: 21, numF: 24, lblF: 30, lockS: 1.5, worksF: 30, strip: { x: 37, y: 226 } }
};

const mapEaseInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function mapArc(a, b, t, lift) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - lift, u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * mx + t * t * b.x, y: u * u * a.y + 2 * u * t * my + t * t * b.y };
}
const mapReduced = () => typeof window !== 'undefined' && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// n — номер урока (1…30). mode: 'start' — открываем замок на карточке урока;
// 'end' — уносим деталь с карточки в компьютер и открываем следующую.
// onDone зовётся один раз, когда анимация закончилась (или сразу, если
// ребёнок просил меньше движения). still — сразу последний кадр, без анимации.
// onBeat(k) — такт анимации ('move' | 'unlock' | 'lift' | 'place'): под него
// кино играет звук.
function ModuleMap({ n, mode, onDone, still, onBeat }) {
  const pick = usePick();
  const box = useRef(null);
  const [kind, setKind] = useState('focus');
  const idx = Math.max(0, Math.min(MAP_N - 1, n - 1));
  // built — сколько деталей уже стоит; open — открыт ли замок на карточке built.
  const [built, setBuilt] = useState(idx);
  const [open, setOpen] = useState(mode === 'end');
  const cur = useRef(null), carry = useRef(null), marks = useRef({}), parts = useRef({}), icons = useRef({});
  const pos = useRef({ x: 0, y: 0 });
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const beat = (k) => { if (onBeat) onBeat(k); };

  // Раскладку выбирает место, а не устройство: на планшете лёжа карта может
  // получить и широкую полосу, и почти квадрат — в зависимости от реплики.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const pickKind = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const r = w / h;
      setKind(r >= 1.3 ? (h >= 380 && w >= 720 ? 'full' : 'row') : 'focus');
    };
    pickKind();
    const ro = new ResizeObserver(pickKind);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lay = MAP_LAYOUT[kind];
  const block = MAP_L[idx][1];
  const cardXY = (i) => {
    const r = MAP_L[i][1], k = i - r * 6;
    if (lay.all) return { x: lay.trayX + k * (MAP_CW + MAP_GAP), y: lay.trayY + r * (MAP_CW + lay.rowGap) };
    if (r !== block) return null;
    return { x: lay.trayX + k * (MAP_CW + MAP_GAP), y: lay.trayY };
  };
  const colorOf = (i) => (i === MAP_N - 1 ? MAP_GOLD : MAP_BLOCKS[MAP_L[i][1]].hex);
  const anchor = (id) => {
    const a = MAP_MACHINE[id].a;
    return { x: lay.mach.x + lay.mach.s * a[0], y: lay.mach.y + lay.mach.s * a[1] };
  };
  const onCard = (i) => {
    const c = cardXY(i);
    // Кончик стрелки — на замке в правом нижнем углу: курсор «открывает» его
    // и не закрывает собой номер и значок урока.
    return c ? { x: c.x + MAP_CW - 6, y: c.y + MAP_CW + 4 } : home();
  };
  const home = () => {
    if (kind === 'full') return { x: 930, y: 668 };
    const c = cardXY(idx) || { x: lay.trayX, y: lay.trayY };
    return { x: c.x + MAP_CW / 2 + 40, y: c.y + MAP_CW + 70 };
  };

  const place = (x, y) => {
    pos.current = { x: x, y: y };
    if (cur.current) cur.current.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
    if (carry.current) carry.current.setAttribute('transform', 'translate(' + (x + 12) + ' ' + (y + 14) + ')');
  };
  const move = (to, dur, lift) => new Promise((res) => {
    beat('move');
    const from = { x: pos.current.x, y: pos.current.y }, t0 = performance.now();
    const step = (now) => {
      if (!alive.current) return;
      const t = Math.min(1, (now - t0) / dur), q = mapArc(from, to, mapEaseInOut(t), lift);
      place(q.x, q.y);
      if (t < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const unlock = (i) => new Promise((res) => {
    beat('unlock');
    const m = marks.current[i];
    if (!m || !m.animate) { res(); return; }
    const a = m.animate([{ transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1.18) translateY(-2px)', offset: 0.3, opacity: 1 },
      { transform: 'scale(.3) translateY(-14px)', opacity: 0 }],
      { duration: 420, easing: 'cubic-bezier(.3,0,1,1)', fill: 'forwards' });
    a.onfinish = () => res();
  });

  // Раскладка может смениться посреди анимации (повернули телефон). Тогда
  // курсор просто встаёт на своё место в новой раскладке.
  useLayoutEffect(() => {
    const at = open ? onCard(Math.min(built, MAP_N - 1)) : home();
    place(at.x, at.y);
  }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancel = false;
    const fin = () => { if (!cancel && alive.current && onDone) onDone(); };
    if (still || mapReduced()) {
      if (mode === 'end') setBuilt(idx + 1);
      setOpen(true);
      fin();
      return () => { cancel = true; };
    }
    (async () => {
      await wait(650);
      if (cancel) return;
      if (mode === 'start') {
        await move(onCard(idx), 900, 90);
        if (cancel) return;
        await unlock(idx);
        if (cancel) return;
        setOpen(true);
        fin();
        return;
      }
      // КОНЕЦ УРОКА: взять деталь с карточки и отнести в компьютер.
      place(onCard(idx).x, onCard(idx).y);
      const ic = icons.current[idx];
      if (ic && ic.animate) ic.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-7px)', offset: 0.4 },
        { transform: 'translateY(0)' }], { duration: 340, easing: 'cubic-bezier(.34,1.4,.5,1)' });
      beat('lift');
      if (carry.current) {
        carry.current.setAttribute('opacity', 1);
        if (carry.current.animate) carry.current.firstChild.animate([{ transform: 'scale(.3)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 }], { duration: 240, easing: 'cubic-bezier(.34,1.4,.5,1)' });
      }
      await wait(380);
      if (cancel) return;
      const id = MAP_L[idx][3];
      const to = anchor(id);
      await move({ x: to.x - 12, y: to.y - 14 }, 1000, 160);
      if (cancel) return;
      if (carry.current) carry.current.setAttribute('opacity', 0);
      beat('place');
      setBuilt(idx + 1); setOpen(false);
      requestAnimationFrame(() => {
        const pr = parts.current[id];
        if (pr && pr.animate) pr.animate(MAP_L[idx][4] === 'q'
          ? [{ transform: 'scale(.6) rotate(-100deg)', opacity: 0 }, { transform: 'scale(1) rotate(0deg)', opacity: 1 }]
          : [{ transform: 'scale(.55)', opacity: 0 }, { transform: 'scale(1.13)', offset: 0.62, opacity: 1 },
            { transform: 'scale(1)', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.34,1.4,.5,1)' });
      });
      await wait(700);
      if (cancel) return;
      // Следующая карточка открывается, только если она видна в этой раскладке.
      if (idx + 1 < MAP_N && cardXY(idx + 1)) {
        await move(onCard(idx + 1), 800, 110);
        if (cancel) return;
        await unlock(idx + 1);
        if (cancel) return;
        setOpen(true);
      } else {
        await move(home(), 700, 90);
      }
      fin();
    })();
    return () => { cancel = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stateOf = (i) => (i < built ? 'done' : i === built ? (open ? 'now' : 'lock') : 'lock');
  const cards = [];
  for (let i = 0; i < MAP_N; i++) {
    const c = cardXY(i);
    if (!c) continue;
    const st = stateOf(i), lock = st === 'lock', color = colorOf(i), t = MAP_L[i][4];
    const ls = lay.lockS || 1, lx = c.x + MAP_CW - 22, ly = c.y + MAP_CW - 22, nr = lay.numR;
    cards.push(
      <g key={i} className={'mm-card' + (st === 'now' ? ' is-now' : '') + (i === idx ? ' is-this' : '')}>
        {st === 'now' ? <path className="mm-ring" d={mapRR(c.x - 11, c.y - 11, MAP_CW + 22, MAP_CW + 22, 26)}
          fill="none" stroke={color} strokeWidth="3" /> : null}
        {t ? <path d={mapRR(c.x - 6, c.y - 6, MAP_CW + 12, MAP_CW + 12, 21)} fill="none" strokeWidth="2"
          strokeDasharray={t === 'p' ? '7 7' : undefined} stroke={lock ? '#302B60' : color} opacity={lock ? 0.55 : 0.85} /> : null}
        <path d={mapRR(c.x, c.y, MAP_CW, MAP_CW, 16)} fill={lock ? '#12102C' : '#171340'}
          stroke={lock ? '#302B60' : color} strokeWidth={lock ? 2.5 : 3.5}
          filter={st === 'now' ? 'url(#mm-glow)' : undefined} />
        <circle cx={c.x + nr + 9} cy={c.y + nr + 9} r={nr} fill={lock ? '#302B60' : color} />
        <text x={c.x + nr + 9} y={c.y + nr + 9 + nr * 0.4} className="mm-num" fontSize={lay.numF}
          fill={lock ? '#8F9BCB' : '#0A0820'}>{i + 1}</text>
        <g ref={(el) => { icons.current[i] = el; }} className="mm-ic"
          transform={'translate(' + (c.x + 62) + ' ' + (c.y + 70) + ') scale(2.1) translate(-12 -12)'}
          fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
          stroke={lock ? '#6B79A8' : color} opacity={lock ? 0.7 : 1}>
          <path d={MAP_ICON[MAP_L[i][2]]} />
        </g>
        {lock ? (
          <g ref={(el) => { marks.current[i] = el; }} className="mm-mark">
            {/* Замок в компактных раскладках крупнее (ls): на телефоне карта
                сжимается в 2.5 раза, и замок в 14 единиц становился точкой. */}
            <circle cx={lx - ls * 3} cy={ly - ls * 3} r={14 * ls} fill="#16133A" stroke="#39336E" strokeWidth={2 * ls} />
            <path d={'M' + (lx - ls * 3 - 5 * ls) + ' ' + (ly - ls * 3 + 0.5 * ls) + 'h' + 10 * ls + 'v' + 7 * ls + 'h' + (-10 * ls) + 'z'}
              fill="none" stroke="#8F9BCB" strokeWidth={2 * ls} strokeLinejoin="round" />
            <path d={'M' + (lx - ls * 3 - 2.8 * ls) + ' ' + (ly - ls * 3 + 0.5 * ls) + 'v' + (-2.6 * ls) + 'a' + 2.8 * ls + ' ' + 2.8 * ls + ' 0 01' + 5.6 * ls + ' 0v' + 2.6 * ls}
              fill="none" stroke="#8F9BCB" strokeWidth={2 * ls} strokeLinecap="round" />
          </g>
        ) : null}
      </g>
    );
  }

  const trays = [];
  for (let r = 0; r < 5; r++) {
    if (!lay.all && r !== block) continue;
    const y = lay.all ? lay.trayY + r * (MAP_CW + lay.rowGap) : lay.trayY;
    trays.push(
      <g key={r}>
        <path d={mapRR(lay.trayX - 12, y - 10, MAP_ROWW + 24, MAP_CW + 20, 18)} fill="#0C0A22"
          stroke={MAP_BLOCKS[r].hex} strokeWidth="1.6" opacity="0.45" />
        <text x={lay.trayX} y={y - 22} className="mm-shelf" fontSize={lay.lblF} fill={MAP_BLOCKS[r].hex}>
          {lay.all ? pick(MAP_BLOCKS[r].t) : (r + 1) + ' · ' + pick(MAP_BLOCKS[r].t)}
        </text>
      </g>
    );
  }

  // Полоска всех 30 уроков — в компактных раскладках она заменяет пять лотков.
  let strip = null;
  if (lay.strip) {
    const sw = (MAP_ROWW - 29 * 4) / 30;
    strip = (
      <g>
        {MAP_L.map((les, i) => (
          <rect key={i} x={lay.strip.x + i * (sw + 4)} y={lay.strip.y} width={sw} height="16" rx="5"
            fill={i < built ? colorOf(i) : '#231F4D'}
            stroke={i === Math.min(built, MAP_N - 1) && open ? colorOf(i) : 'none'} strokeWidth="2.5" />
        ))}
      </g>
    );
  }

  let panel = null;
  if (lay.prog) {
    const pr = lay.prog;
    panel = (
      <g>
        <text x={pr.x} y={pr.y} className="mm-prog" fill="#EDF2FF">
          {pick({ uz: '30 tadan ' + built + ' yig‘ildi', ru: 'Собрано ' + built + ' из 30', en: built + ' of 30 built' })}
        </text>
        <path d={mapRR(pr.x, pr.y + 16, pr.w, 12, 6)} fill="#1A1740" />
        <path d={mapRR(pr.x, pr.y + 16, Math.max(12, pr.w * built / MAP_N), 12, 6)}
          fill={MAP_BLOCKS[Math.min(4, Math.floor(Math.max(0, built - 1) / 6))].hex} />
        {MAP_BLOCKS.map((b, i) => {
          const k = Math.max(0, Math.min(6, built - i * 6));
          return (
            <g key={i}>
              <circle cx={pr.x + i * 134 + 8} cy={pr.y + 74} r="7" fill={b.hex} />
              <text x={pr.x + i * 134 + 24} y={pr.y + 80} className="mm-lg" fill={k === 6 ? b.hex : '#A3B1DC'}>{k + '/6'}</text>
            </g>
          );
        })}
      </g>
    );
  }

  const PTR = 'M0 0v44l11-10 7 16 9-4-7-15 14-2z';
  const les = MAP_L[idx];
  const m = lay.mach;
  return (
    <div className="mmap" ref={box}>
      <svg viewBox={'0 0 ' + lay.w + ' ' + lay.h} preserveAspectRatio="xMidYMid meet" role="img"
        aria-label={pick({ uz: 'Modul xaritasi', ru: 'Карта модуля', en: 'Module map' }) + ': ' + les[0] + '. ' + pick(les[5])}>
        <defs>
          <linearGradient id="mm-desk" x1="0" y1="0" x2=".55" y2="1">
            <stop offset="0" stopColor="#171338" /><stop offset=".55" stopColor="#1A1442" /><stop offset="1" stopColor="#0C0A20" />
          </linearGradient>
          <linearGradient id="mm-wall" x1="0" y1="0" x2=".4" y2="1">
            <stop offset="0" stopColor="#2E6BD6" /><stop offset="1" stopColor="#5B3FA8" />
          </linearGradient>
          <radialGradient id="mm-lamp"><stop offset="0" stopColor="#FFE7A8" stopOpacity=".16" /><stop offset="1" stopColor="#FFE7A8" stopOpacity="0" /></radialGradient>
          <pattern id="mm-dots" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.7" fill="#AFC0FF" opacity=".09" /></pattern>
          <filter id="mm-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="mm-soft" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect x="0" y="0" width={lay.w} height={lay.h} rx="28" fill="url(#mm-desk)" />
        <rect x="0" y="0" width={lay.w} height={lay.h} rx="28" fill="url(#mm-dots)" />
        <ellipse cx={m.x - 70} cy={m.y + 20} rx={lay.w * 0.39} ry={lay.h * 0.45} fill="url(#mm-lamp)" />
        {trays}
        {strip}
        {cards}
        <g transform={'translate(' + m.x + ' ' + m.y + ') scale(' + m.s + ')'}>
          <path d="M-210 366h420" stroke="#332C63" strokeWidth="4" strokeLinecap="round" />
          <text x="0" y={lay.worksF ? 262 : 258} className="mm-works" fontSize={lay.worksF || 16} fill="#A3B1DC">{pick({ uz: 'Mening ishlarim', ru: 'Мои работы', en: 'My works' })}</text>
          {MAP_ZORD.map((id) => {
            const sp = MAP_MACHINE[id];
            const li = MAP_L.findIndex((l) => l[3] === id);
            const on = li < built;
            const color = colorOf(li);
            return (
              <g key={id}>
                <g opacity={on ? 0 : 1}>
                  {sp.s.filter((s) => s[2] === 'f' || s[2] === 'o').map((s, k) => React.createElement(s[0], Object.assign({ key: k }, s[1], MAP_GHOST)))}
                </g>
                <g ref={(el) => { parts.current[id] = el; }} opacity={on ? 1 : 0} className="mm-part">
                  {sp.s.map((s, k) => React.createElement(s[0], Object.assign({ key: k }, s[1], mapStyled(s[2], color))))}
                </g>
              </g>
            );
          })}
        </g>
        {panel}
        <g ref={carry} opacity="0">
          <g className="mm-carry" fill="none" stroke={colorOf(idx)} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" filter="url(#mm-glow)">
            <path d={MAP_ICON[les[2]]} transform="scale(1.9) translate(-12 -12)" />
          </g>
        </g>
        <g ref={cur}>
          <g className="mm-bob">
            <ellipse cx="2" cy="32" rx="20" ry="6" fill="#04030C" opacity=".45" />
            <g transform="translate(-16 -26)">
              <path d={PTR} fill="#DCEAFF" stroke="#DCEAFF" strokeWidth="9" strokeLinejoin="round" filter="url(#mm-soft)" />
              <path d={PTR} fill="none" stroke="#3E7FE8" strokeWidth="3" strokeLinejoin="round" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

// КИНО КАРТЫ (правка заказчика 2026-09-24: «интро как в уроках Кибер-щита»).
// Карта больше не экран урока с роботом, репликой и кнопкой — это кино во весь
// экран, как карта «Кибер-щита»: без героя, без текста и без кнопки, только
// звуки. Кино доигрывает и САМО открывает урок.
//   mode="start" — до первого экрана: курсор приходит на карточку урока и
//                  открывает замок — ребёнок видит, в какой урок зашёл;
//   mode="end"   — перед прощанием: курсор уносит деталь с карточки и ставит
//                  её в компьютер — ребёнок видит, какую деталь получил;
//   still        — «Назад» с первого экрана: кино не отыгрывается заново,
//                  а коротко мигает последним кадром и возвращает вперёд.
// Первое касание кино НЕ пропускает — оно будит звук (браузер без касания его
// не отдаёт). Пропуск со второго касания. ?karta=0 — приёмка вёрстки без кино.
const MAP_HOLD = { start: 1300, end: 2200, still: 700 };
const MAP_BEAT = { move: 'blip', unlock: 'hint', lift: 'pop', place: 'win' };
function mapFilmNeeded() {
  try { return new URLSearchParams(window.location.search).get('karta') !== '0'; } catch (e) { return true; }
}
function MapFilm({ n, mode, still, onDone }) {
  const audio = useAudio();
  const [out, setOut] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const gone = useRef(false), taps = useRef(0), timers = useRef([]);
  const soundOn = useRef(true);
  soundOn.current = !(audio && audio.on === false);

  const leave = useCallback(() => {
    if (gone.current) return;
    gone.current = true;
    timers.current.forEach(clearTimeout);
    setOut(true);
    timers.current = [setTimeout(() => { if (doneRef.current) doneRef.current(); }, 440)];
  }, []);

  useEffect(() => {
    if (!mapFilmNeeded()) { gone.current = true; if (doneRef.current) doneRef.current(); return undefined; }
    // Страховка: кино не держит ребёнка, даже если анимация где-то застряла.
    timers.current.push(setTimeout(leave, 12000));
    return () => timers.current.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const beat = useCallback((k) => sfx(MAP_BEAT[k] || 'blip', soundOn.current), []);
  const shown = useCallback(() => {
    timers.current.push(setTimeout(leave, still ? MAP_HOLD.still : MAP_HOLD[mode] || 1300));
  }, [leave, still, mode]);
  const tap = () => { taps.current += 1; if (taps.current >= 2) leave(); };

  return (
    <div className={'mfilm' + (still ? ' is-still' : '') + (out ? ' is-out' : '')} onPointerDown={tap}>
      <ModuleMap n={n} mode={mode} still={still} onDone={shown} onBeat={still ? undefined : beat} />
    </div>
  );
}

const MAP_CSS = `
/* ══════════════════════════════════════════════════════════════
   КАРТА МОДУЛЯ — экран в начале и в конце урока
   Карта эластичная: забирает всю высоту, что осталась под репликой,
   распорки сцены на этом экране схлопываются.
   ══════════════════════════════════════════════════════════════ */
.stage-content:has(.mmap)::before, .stage-content:has(.mmap)::after { flex: 0 0 0; }
.stack:has(> .mmap) { flex: 1 1 auto; }
/* Основа 0, а не высота: карта забирает ровно оставшееся место и не
   вылезает за край сцены на несколько точек. */
.stack > .mmap { flex: 1 1 0; min-height: 140px; }
.mmap { position: relative; width: 100%; height: clamp(220px, 52dvh, 620px); display: flex; align-items: center; justify-content: center; }
.mmap svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block;
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.mm-num { font-weight: 800; text-anchor: middle; }
.mm-shelf { font-weight: 800; }
.mm-prog { font-weight: 800; font-size: 19px; }
.mm-lg { font-weight: 700; font-size: 15px; }
.mm-works { font-weight: 800; text-anchor: middle; }
.mm-mark, .mm-part, .mm-ic, .mm-carry { transform-box: fill-box; transform-origin: center; }
.mm-ring { transform-box: fill-box; transform-origin: center; animation: mmBreathe 2.4s ease-in-out infinite; }
@keyframes mmBreathe { 0%, 100% { transform: scale(1); opacity: .5; } 50% { transform: scale(1.12); opacity: 0; } }
.mm-bob { animation: mmBob 3.4s cubic-bezier(.4,0,.2,1) infinite; }
@keyframes mmBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@media (prefers-reduced-motion: reduce) { .mm-ring { animation: none; opacity: .4; } .mm-bob { animation: none; } }

/* ── КИНО КАРТЫ — во весь экран, поверх урока (как карта «Кибер-щита») ── */
.mfilm { position: fixed; inset: 0; z-index: 90; display: flex; align-items: center; justify-content: center;
  padding: max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right))
    max(10px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));
  background: radial-gradient(120% 90% at 50% 40%, #1A1545 0%, #0C0A22 70%, #07061A 100%);
  animation: mfIn .36s ease-out both; cursor: pointer; user-select: none; -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent; }
.mfilm.is-still { animation: none; }
.mfilm.is-out { animation: mfOut .44s ease-in forwards; pointer-events: none; }
@keyframes mfIn { from { opacity: 0; } }
@keyframes mfOut { to { opacity: 0; } }
.mfilm > .mmap { width: 100%; height: 100%; max-width: 1500px; min-height: 0; }
@media (prefers-reduced-motion: reduce) { .mfilm, .mfilm.is-out { animation: none; } }
`;

// =============================================================================
// ===============  К А Н О Н  ·  П Р А В К И   В Ё Р С Т К И  =================
// =============================================================================
// Правки по UI-ревью (2026-09-24, komp-gramotnost/REVIEW-UI.md). Блок идёт
// ПОСЛЕДНИМ в стилях урока и поэтому перекрывает и каркас, и CSS урока.
// Одинаковый во всех уроках; источник — komp-gramotnost/_canon/ui-canon.jsx.
// =============================================================================
const CANON_UI_CSS = `
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

const META = {
  lessonId: 'k0-07-typing',
  module: 'kurs0-block2-files',
  lessonTitle: {
    uz: '7-dars. Xatosiz yozamiz',
    ru: 'Урок 7. Пишем без опечаток',
    en: 'Lesson 7. Typing without slips'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });

// Сообщение робота. Два испорченных слова и одно верное (правка 25.09.2026):
//   первое слово — одна буква НЕ ТА (uz «k» вместо «l», ru «а» вместо «в»,
//     en «k» вместо «l»): её стирают и пишут верную — это показ s5 и уровень s6;
//   второе — uz/en: буква ПРОПУЩЕНА (её добавляют, s8), ru: снова не та буква;
//   третье написано верно — экран s4 учит, что не всё непривычное испорчено.
// Раньше у автора в uz/en обе опечатки были пропусками, а реплики говорили про
// «лишнюю» и «не ту» букву — голос называл не ту поломку, что в поле.
const MSG = {
  bad: L3('sakom, ishlar qnday', 'приает, как дила', 'heklo, how ar you'),
  good: L3('salom, ishlar qanday', 'привет, как дела', 'hello, how are you')
};

// Буквы в репликах. Голос читает сам текст реплики (кавычки снимает
// sanitizeForTts), поэтому буква пишется так, как её надо произнести: uz —
// «k harfi», ru — названием буквы («вэ», «эль», «дэ»: одинокое «в» голос читает
// как предлог), en — заглавной (L, K, E читаются названием). Испорченное слово
// голос не произносит никогда: он называет верное слово и место ошибки.
const C = {
  s1: {
    eyebrow: L3('Nosozlik', 'Поломка', 'A breakdown'),
    // Нажатие «отправляет» сообщение — и тогда приходит ответ друга «?». Поэтому
    // до нажатия голос про вопросительный знак молчит (его ещё нет на экране) и
    // в конце называет, что нажать: сообщение справа (UX-03).
    say1: L3('Do‘stimga xabar yozdim. Uni yuborish uchun pastdagi ko‘k samolyotcha tugmasini bosing.',
      'Я написал другу сообщение. Чтобы отправить его, нажми на синюю кнопку с самолётиком внизу.',
      'I wrote my friend a message. To send it, tap the blue paper-plane button below.'),
    say2: L3('Do‘stim faqat savol belgisini yubordi: u xabarimni tushunmadi. Men shoshdim va so‘zlarda xato qildim: bir harfni noto‘g‘ri bosdim, yana birini tushirib qoldirdim.',
      'Друг прислал в ответ только вопросительный знак: он не понял моё сообщение. Я торопился и ошибся в словах: нажал не те буквы.',
      'My friend sent back only a question mark: he did not understand my message. I rushed and made slips: I pressed one wrong letter and left another one out.'),
    ask: L3('O‘ngdagi xabarni bosing', 'Нажми на сообщение справа', 'Tap the message on the right'),
    btn: L3('Tuzatamiz', 'Починим', 'Let us fix it')
  },
  s2: {
    eyebrow: L3('Missiya', 'Миссия', 'Mission'),
    title: L3('Xabarni tuzatamiz', 'Починим сообщение', 'Fix the message'),
    ask: L3('Uchala qadamni bosing', 'Нажми на все три шага', 'Tap all three steps'),
    // Образ «клавиатура молчит» заменён тем, что видно: букв на клавишах
    // становится меньше. Последняя фраза зовёт нажимать карточки (UX-04).
    say: L3('Xabardagi xato so‘zlarni tuzatamiz. Har safar klaviaturada kamroq harf ko‘rinadi. Birma-bir ko‘rsataman.',
      'Починим слова с ошибками в сообщении. С каждым разом на клавиатуре будет видно меньше букв. Покажу по очереди.',
      'We will fix the broken words in the message. Each time, fewer letters will show on the keyboard. I will show them one by one.'),
    // Шаги — ровно те два ремонта, что есть в уроке (стереть не ту букву и
    // добавить пропущенную), и память на места клавиш. «Лишней» буквы в
    // сообщении нет, поэтому и шага «убрать лишнее» больше нет.
    steps: [
      { icon: 'cross', text: L3('Xato harfni o‘chirish', 'Стереть неверную букву', 'Erase the wrong letter'),
        say: L3('Kursorni xato harfdan keyin qo‘yamiz va o‘chirish tugmasini bosamiz. U kursordan oldingi bitta harfni o‘chiradi.',
          'Ставим курсор сразу за неверной буквой и жмём стирание. Оно убирает одну букву перед курсором.',
          'We put the cursor right after the wrong letter and press erase. It removes the one letter before the cursor.') },
      { icon: 'keyboard', text: L3('Yetmagan harfni qo‘shish', 'Добавить пропущенную букву', 'Add the missing letter'),
        say: L3('Maydondagi harfni bossangiz, kursor uning oldiga turadi. Yangi harf aynan kursor turgan joyda paydo bo‘ladi.',
          'Нажмёшь на букву в поле — курсор встанет перед ней. Новая буква появится ровно там, где курсор.',
          'Tap a letter in the box, and the cursor moves in front of it. A new letter appears right where the cursor is.') },
      { icon: 'eye', text: L3('Tugmalar joyini eslash', 'Запомнить, где клавиши', 'Remember where the keys are'),
        say: L3('Harflar klaviaturadan birin-ketin yo‘qoladi, tugmalar esa o‘z joyida qoladi. Harf qayerda turganini eslab, yozishda davom etamiz.',
          'Буквы будут пропадать с клавиатуры одна за другой, а клавиши останутся на местах. Вспоминаем, где стояла буква, и печатаем дальше.',
          'The letters will vanish from the keyboard one by one, but the keys stay put. We remember where each letter was and keep typing.') }
    ],
    done: L3('Boshladik. Birinchi so‘zda klaviatura to‘liq: hamma harf ko‘rinadi.',
      'Начинаем. В первом слове клавиатура полная: видны все буквы.',
      'Off we go. For the first word the keyboard is full: every letter shows.')
  },
  s3: {
    eyebrow: L3('Nega kerak', 'Зачем это нужно', 'Why it matters'),
    ask: L3('Uchala kartochkani bosing', 'Нажми на все три карточки', 'Tap all three cards'),
    // Было обрывком: «Nega xato muhim. Kartochkani bosing.» (UX-04).
    say: L3('Xato nega muhim? Uchta sababni aytaman.',
      'Почему опечатка важна? Расскажу три причины.',
      'Why does a slip matter? I will tell you three reasons.'),
    items: [
      { id: 'read', text: L3('O‘qib bo‘lmaydi', 'Не прочитать', 'Cannot be read'),
        why: L3('Bitta harf xato bo‘lsa, so‘z boshqa so‘zga aylanadi yoki uni umuman o‘qib bo‘lmaydi.',
          'Если одна буква не та, слово становится другим словом или не читается вовсе.',
          'If one letter is wrong, the word turns into another word or cannot be read at all.') },
      { id: 'ask', text: L3('Qayta so‘raydilar', 'Переспросят', 'They will ask again'),
        why: L3('Do‘st tushunmasa, qayta so‘raydi. Keyin xabarni yana bir marta yozishga to‘g‘ri keladi, bu esa uzoqroq.',
          'Друг не понял — переспросит. Тогда сообщение придётся писать ещё раз, а это дольше.',
          'If your friend does not understand, they ask again. Then you have to write the message once more, and that takes longer.') },
      { id: 'fix', text: L3('Tuzatish oson', 'Легко починить', 'Easy to fix'),
        why: L3('Xatoni tuzatish uchun hammasini qayta yozish shart emas: bitta harfni tuzatish yetadi.',
          'Чтобы починить опечатку, не надо переписывать всё: хватит поправить одну букву.',
          'To fix a slip you need not retype it all: fixing one letter is enough.') }
    ],
    done: L3('Xatodan qo‘rqmang: uni tuzatish oson.',
      'Опечатки не нужно бояться: её легко починить.',
      'Do not be afraid of a slip: it is easy to fix.')
  },
  s4: {
    // «Три ошибки» было неправдой: испорчены два слова, третье верное.
    eyebrow: L3('Uchta so‘z', 'Три слова', 'Three words'),
    ask: L3('Har bir so‘zni bosing', 'Нажми на каждое слово', 'Tap each word'),
    // Заказчик, 27.09.2026: слова открывает Луми, ребёнку нажимать не нужно.
    say: L3('Mana xabardagi uchta so‘z. Qaysi birida xato borligini birma-bir aytib beraman.',
      'Вот три слова из сообщения. Расскажу по очереди, в каком ошибка.',
      'Here are three words from the message. I will tell you one by one which has a slip.'),
    // id — ключи сохранения (seen), поэтому прежние: 'miss' — первое слово,
    // 'extra' — второе, 'swap' — верное. Разбор называет верное слово и место
    // ошибки на языке урока; испорченное слово голос не читает.
    spots: [
      { id: 'miss', word: L3('sakom', 'приает', 'heklo'),
        why: L3('Bu so‘z «salom» bo‘lishi kerak. Unda «l» harfi o‘rniga «k» turibdi: bitta harf noto‘g‘ri.',
          'Здесь должно быть слово «привет». Вместо «вэ» стоит «а»: одна буква не та.',
          'This should be hello. There is a K where the L should be: one letter is wrong.') },
      { id: 'extra', word: L3('qnday', 'дила', 'ar'),
        why: L3('Bu so‘z «qanday» bo‘lishi kerak. Unda «q» harfidan keyin «a» harfi tushib qolgan.',
          'Здесь должно быть слово «дела». Вместо «е» стоит «и»: снова одна буква не та.',
          'This should be are. The letter E at the end is missing.') },
      { id: 'swap', word: L3('ishlar', 'как', 'how'),
        why: L3('Bu so‘z to‘g‘ri yozilgan, uni tuzatish shart emas.',
          'А это слово написано верно — его чинить не нужно.',
          'This word is spelled right; it needs no fixing.') }
    ],
    done: L3('Uchta so‘zdan ikkitasida xato bor. Ularni tuzatamiz.',
      'В двух словах из трёх есть ошибка. Их и починим.',
      'Two of the three words have a slip. Those are the ones we will fix.')
  },
  // Заказчик, 27.09.2026: «bolani o‘zi … o‘zi teradi». Раньше здесь был показ:
  // Луми сам чинил первое слово сообщения, а ребёнок смотрел. Тот же ремонт
  // ребёнок делает на экране 6 — перенести показ как есть значило бы сделать
  // два одинаковых экрана. Поэтому экран 5 — первый, облегчённый шаг: одно
  // короткое слово, неверная буква В КОНЦЕ (курсор уже стоит за ней), и два
  // действия — стереть и напечатать, каждое названо голосом и светится.
  // Постановку курсора ребёнок впервые делает сам на экране 6.
  // Буквы в репликах — по правилу MSG выше: uz — «t harfi», ru — названием
  // («чэ», «эс»), en — заглавной. Испорченное слово голос не читает.
  s5: {
    eyebrow: L3('Mashq', 'Тренировка', 'Practice'),
    say: L3('Xabarni tuzatishdan oldin bitta so‘zda mashq qilamiz. Bu «rahmat» so‘zi, lekin oxirida «t» o‘rniga «r» turibdi. Miltillab turgan ko‘k chiziqcha — kursor, u xato harfdan keyin turibdi. O‘ng yuqoridagi xochli o‘chirish tugmasini bosing.',
      'Прежде чем чинить сообщение, потренируемся на одном слове. Это слово «мяч», но в конце вместо «чэ» стоит «эс». Мигающая синяя палочка — курсор, он стоит сразу за неверной буквой. Нажми на стирание с крестиком справа вверху.',
      'Before we fix the message, let us practise on one word. This is thanks, but at the end there is a D where the S should be. The blinking blue line is the cursor, and it sits right after the wrong letter. Tap the erase key with the cross at the top right.'),
    start: L3('rahmar', 'мяс', 'thankd'),
    want: L3('rahmat', 'мяч', 'thanks'),
    field: L3('Mashq', 'Тренировка', 'Practice'),
    lines: {
      erased: L3('O‘chirish tugmasi kursordan oldingi harfni o‘chirdi: xato «r» yo‘q. Endi «t» harfini bosing: u yuqori qatorda, chapdan beshinchi.',
        'Стирание убрало букву перед курсором: неверной «эс» больше нет. Теперь нажми на букву «чэ»: она в нижнем ряду, вторая слева.',
        'Erase removed the letter before the cursor: the wrong D is gone. Now tap the S: it is in the middle row, second from the left.'),
      fixed: L3('«t» harfi kursor turgan joyda paydo bo‘ldi: rahmat. Xato harfni o‘chiramiz, to‘g‘ri harfni yozamiz.',
        'Буква «чэ» появилась там, где курсор: мяч. Неверную букву стираем, верную печатаем.',
        'The S appeared right where the cursor is: thanks. We erase the wrong letter and type the right one.'),
      // Нажата не та клавиша: называем место нужной ещё раз, без «не так».
      eraseAgain: L3('Bu boshqa tugma. O‘chirish tugmasi yuqori qatorning eng o‘ngida, unda xoch bor.',
        'Это другая клавиша. Стирание — в верхнем ряду, справа с краю, на нём крестик.',
        'That is another key. Erase is at the right end of the top row, with a cross on it.'),
      typeAgain: L3('Bu boshqa harf. «t» harfi yuqori qatorda, chapdan beshinchi.',
        'Это другая буква. «Чэ» — в нижнем ряду, вторая слева.',
        'That is another letter. The S is in the middle row, second from the left.')
    },
    done: L3('Keyingi ekranda xabardagi so‘zni tuzatasiz. U yerda xato so‘z o‘rtasida: kursorni o‘zingiz qo‘yasiz.',
      'На следующем экране починишь слово в сообщении. Там ошибка в середине слова: курсор поставишь сам.',
      'On the next screen you fix a word in the message. There the slip is in the middle, so you place the cursor yourself.')
  },
  s6: {
    eyebrow: L3('1-daraja', 'Уровень 1', 'Level 1'),
    ask: L3('Birinchi so‘zni tuzating', 'Почини первое слово', 'Fix the first word'),
    // Задание звучит целиком: какое слово, где ошибка и что нажать по порядку.
    say: L3('Endi siz tuzating. «salom» so‘zida «l» harfi o‘rniga «k» turibdi. Maydondagi «o» harfini bosing, keyin o‘ng yuqoridagi o‘chirish tugmasini, so‘ng klaviaturada «l» harfini bosing. Klaviaturada hamma harf ko‘rinadi.',
      'Теперь твоя очередь. В слове «привет» вместо «вэ» стоит «а». Нажми в поле на букву «е», потом на стирание справа вверху, а потом на букву «вэ» на клавиатуре. На клавиатуре видны все буквы.',
      'Now it is your turn. In hello there is a K where the L should be. Tap the L in the box, then the erase key at the top right, then the L key on the keyboard. Every letter shows on the keyboard.'),
    start: L3('sakom', 'приает', 'heklo'),
    // Слово автора до правки 25.09. Нетронутый набор с ним сбрасываем (K7Fix):
    // иначе голос говорил бы про «k», а в поле стояло бы старое слово.
    legacy: { uz: 'salm', en: 'helo' },
    want: L3('salom', 'привет', 'hello'),
    field: L3('Xabar', 'Сообщение', 'Message'),
    dim: 0,
    done: L3('Birinchi so‘z tayyor. Keyingi so‘zda klaviaturadan ikkita harf yo‘qoladi.',
      'Первое слово готово. В следующем с клавиатуры пропадут две буквы.',
      'The first word is done. In the next one, two letters will vanish from the keyboard.')
  },
  s7: {
    eyebrow: L3('Tekshiramiz', 'Проверим', 'Check'),
    ask: L3('So‘z bir soniyaga ko‘rinadi', 'Слово покажется на секунду', 'The word shows for a second'),
    // Голос называет кнопку показа по значку и месту: без неё клавиатура заперта.
    // В uz слово с «o‘»: как её набрать, сказано заранее — иначе «dost» так и
    // не сходится со словом, а подсказки на этом экране нет.
    say: L3('So‘zni bir soniyaga ko‘rsataman. Buning uchun maydon tepasidagi ko‘z belgili tugmani bosing. Keyin so‘zni yoddan yozing. Kerak bo‘lsa, tugmani yana bosing. «o‘» harfi uchun avval «o» harfini, keyin Enter yonidagi belgini bosing.',
      'Я покажу слово на секунду. Для этого нажми на кнопку с глазом над полем. Потом напечатай слово по памяти. Если нужно, нажми на кнопку ещё раз.',
      'I will show you a word for a second. To see it, tap the button with the eye above the box. Then type the word from memory. If you need to, tap the button again.'),
    show: L3('Ko‘rsating', 'Показать', 'Show'),
    word: L3('do‘st', 'друг', 'friend'),
    field: L3('Yoddan', 'По памяти', 'From memory'),
    done: L3('Yoddan ham yozib bo‘larkan.',
      'Оказывается, по памяти тоже можно.',
      'Turns out you can do it from memory too.')
  },
  s8: {
    eyebrow: L3('2-daraja', 'Уровень 2', 'Level 2'),
    // «Второе слово» в ru/en было неправдой: «дила» и «ar» там третьи по счёту.
    ask: L3('Ikkinchi xato so‘zni tuzating', 'Почини второе слово с ошибкой', 'Fix the second broken word'),
    say: L3('«qanday» so‘zida «q» harfidan keyin «a» harfi tushib qolgan. Maydondagi «n» harfini bosing, keyin klaviaturada «a» harfini bosing. «a» harfi klaviaturada ko‘rinmaydi: uning joyini eslang. Klaviaturadan ikkita harf yo‘qoldi, lekin tugmalari o‘z joyida.',
      'В слове «дела» вместо «е» стоит «и». Нажми в поле на букву «эль», потом на стирание справа вверху и на букву «е» на клавиатуре. Буквы «е» на клавише не видно: вспомни, где она стояла. С клавиатуры пропали две буквы, но их клавиши на месте.',
      'In are, the E at the end is missing. The cursor is already at the end, so just tap the E key. Two letters have vanished from the keyboard, but their keys are still in place.'),
    start: L3('qnday', 'дила', 'ar'),
    want: L3('qanday', 'дела', 'are'),
    field: L3('Xabar', 'Сообщение', 'Message'),
    dim: 2,
    done: L3('So‘z tuzaldi. Ikkita harf ko‘rinmasa ham, tugmalari o‘z joyida qoldi.',
      'Слово починено. Двух букв не видно, но клавиши остались на своих местах.',
      'The word is fixed. Two letters were hidden, but their keys stayed in place.')
  },
  s9: {
    eyebrow: L3('3-daraja', 'Уровень 3', 'Level 3'),
    // «Третье слово» было неправдой: в сообщении третье слово верное (s4), а в
    // ru/en это слово из сообщения вообще не взято. Теперь — «ещё одно слово».
    // Сколько букв погасло — числом, как на экране (k7Dim): uz и ru — четыре,
    // en — три (в «you» всего три буквы). «Половина» не совпадала ни в одном языке.
    ask: L3('Yana bitta so‘zni tuzating', 'Почини ещё одно слово', 'Fix one more word'),
    say: L3('Yana bitta so‘z: «ishlar». Unda «l» va «r» harflari orasida «a» harfi tushib qolgan. Maydondagi «r» harfini bosing, keyin klaviaturada «a» harfini bosing. Endi klaviaturadan to‘rtta harf yo‘qoldi.',
      'Ещё одно слово: «дела». В нём между «дэ» и «эль» пропала «е». Нажми в поле на букву «эль», потом на «е» на клавиатуре. Её на клавише не видно: вспомни, где она. Теперь с клавиатуры пропали четыре буквы.',
      'One more word: you. The O between Y and U is missing. Tap the U in the box, then tap O on the keyboard. The O is hidden on the keyboard, so remember where it was. Now three letters have vanished from the keyboard.'),
    start: L3('ishlr', 'дла', 'yu'),
    want: L3('ishlar', 'дела', 'you'),
    field: L3('Xabar', 'Сообщение', 'Message'),
    dim: 4,
    done: L3('To‘rtta harf ko‘rinmadi, so‘z esa baribir tuzaldi.',
      'Четырёх букв не было видно, а слово всё равно починено.',
      'Three letters were hidden, and the word is still fixed.')
  },
  s10: {
    eyebrow: L3('4-daraja', 'Уровень 4', 'Level 4'),
    ask: L3('Jumlani oxirigacha yozing', 'Допиши фразу до конца', 'Finish the sentence'),
    // Что допечатать — словом и тем, что видно в поле (бледный хвост образца).
    say: L3('Xabarning boshi tayyor: «salom, ishlar». Oxiriga «qanday» so‘zini yozing, u maydonda och kulrang harflar bilan ko‘rinib turibdi. Endi klaviaturadan oltita harf yo‘qoldi.',
      'Начало сообщения готово: «привет, как». В конце допиши слово «дела» — оно видно в поле бледно-серыми буквами. Теперь с клавиатуры пропали шесть букв.',
      'The start of the message is ready: hello, how. At the end, type are, then a space with the long key at the right of the bottom row, then you. The words show in the box in pale grey. Now six letters have vanished from the keyboard.'),
    start: L3('salom, ishlar ', 'привет, как ', 'hello, how '),
    want: MSG.good,
    field: L3('Xabar', 'Сообщение', 'Message'),
    dim: 6,
    done: L3('Jumla to‘liq. Do‘stingiz endi tushunadi.',
      'Фраза целая. Друг теперь поймёт.',
      'The sentence is whole. Your friend will understand now.')
  },
  s11: {
    eyebrow: L3('Sinov', 'Вызов', 'Challenge'),
    // «Javob» было непонятно чей: ответа друга «yaxshi» на экране нет. Задание —
    // одно слово по памяти; фраза заказчика для вызова (как в уроке 1).
    ask: L3('So‘zni yoddan yozing', 'Напечатай слово по памяти', 'Type the word from memory'),
    say: L3('Oxirgi sinov: «yaxshi» so‘zini yozing. Bu so‘zning harflari klaviaturada ko‘rinmaydi, ularning joyini eslang. Men faqat to‘g‘ri bajarganingizda gapiraman.',
      'Последнее испытание: напечатай слово «хорошо». Его букв на клавиатуре не видно — вспомни, где они. Я скажу, только когда ты сделаешь правильно.',
      'The last challenge: type the word good. Its letters are hidden on the keyboard, so remember where they are. I will only speak when you do it right.'),
    start: L3('', '', ''),
    want: L3('yaxshi', 'хорошо', 'good'),
    field: L3('So‘z', 'Слово', 'Word'),
    dim: 99,
    done: L3('Barakalla! Siz butun so‘zni harflari ko‘rinmaydigan klaviaturada yozdingiz.',
      'Молодец! Целое слово напечатано на клавиатуре, где букв не видно.',
      'Well done! You typed a whole word on a keyboard with its letters hidden.')
  },
  s12: {
    eyebrow: L3('Tekshiramiz', 'Проверим', 'Check'),
    ask: L3('Ha yoki yo‘q', 'Да или нет', 'Yes or no'),
    // Утверждения звучат (onAsk), кнопки названы цветом и местом (UX-06).
    say: L3('To‘rtta gap bor, men har birini o‘qib beraman. Rost bo‘lsa — chapdagi yashil tugmani bosing. Rost bo‘lmasa — o‘ngdagi kulrang tugmani bosing.',
      'Четыре утверждения, я прочитаю каждое. Если это правда — нажми зелёную кнопку слева. Если нет — серую кнопку справа.',
      'Four statements, and I will read each one. If it is true, tap the green button on the left. If not, tap the grey button on the right.'),
    yes: L3('Ha', 'Да', 'Yes'),
    no: L3('Yo‘q', 'Нет', 'No'),
    all: L3('Hammasiga javob berildi', 'На все ответы даны', 'All answered'),
    items: [
      // hint — звучит после неверного ответа и отсылает к тому, что ребёнок
      // делал в уроке, не называя ответ (UX-15).
      { id: 'a', text: L3('Xato bo‘lsa, hammasini qayta yozish kerak', 'Из-за опечатки надо переписать всё', 'A slip means retyping everything'),
        yes: false, why: L3('Bitta harfni tuzatish yetadi.', 'Достаточно починить одну букву.', 'Fixing one letter is enough.'),
        hint: L3('Birinchi so‘zni eslang: uni butunlay qayta yozdingizmi?', 'Вспомни первое слово: его пришлось переписать целиком?', 'Think of the first word: did you have to retype all of it?') },
      { id: 'b', text: L3('Harf kursor turgan joyda paydo bo‘ladi', 'Буква появляется там, где курсор', 'A letter appears where the cursor is'),
        yes: true, why: L3('Shuning uchun avval kursorni qo‘yamiz.', 'Поэтому сначала ставим курсор.', 'That is why we place the cursor first.'),
        hint: L3('Maydondagi harfni bosganda kursor qayerga turadi, yangi harf esa qayerda chiqadi?', 'Вспомни, куда встаёт курсор после нажатия на букву в поле и где потом появляется новая буква.', 'Think about where the cursor goes when you tap a letter in the box, and where the new letter then appears.') },
      { id: 'c', text: L3('O‘chirish tugmasi butun so‘zni o‘chiradi', 'Стирание убирает слово целиком', 'Erase removes the whole word'),
        yes: false, why: L3('U bittadan harf o‘chiradi.', 'Оно убирает по одной букве.', 'It removes one letter at a time.'),
        hint: L3('O‘chirish tugmasini bir marta bossangiz, nechta harf yo‘qoladi?', 'Сколько букв пропадает от одного нажатия на стирание?', 'How many letters go when you tap erase once?') },
      { id: 'd', text: L3('Tugmaning joyini yodda saqlash mumkin', 'Место клавиши можно запомнить', 'You can remember where a key is'),
        yes: true, why: L3('Shu darsda siz shuni qildingiz.', 'В этом уроке у тебя это получилось.', 'You just did that in this lesson.'),
        hint: L3('Harflar ko‘rinmaganda ham so‘zni yoza oldingizmi?', 'Получилось напечатать слово, когда букв на клавишах не было видно?', 'Could you type a word when the letters on the keys were hidden?') }
    ],
    // Итог по результату, целой фразой: пока ответ неверный, утверждение не
    // уходит, поэтому прежнее «На все четыре — верно» звучало и после ошибок.
    // Чистый проход — ответов ровно столько, сколько утверждений.
    done: L3('Barakalla! Hamma savolga to‘g‘ri javob berdingiz.',
      'Молодец! Все ответы верные с первого раза.',
      'Well done! You answered every question correctly.'),
    doneRetry: L3('Yaxshi natija! Keyingi safar hammasiga to‘g‘ri javob berishga harakat qilamiz.',
      'Хороший результат! В следующий раз постараемся ответить верно на все вопросы.',
      'Good result! Next time we will try to get every answer right.')
  },
  s13: {
    eyebrow: L3('Xabar', 'Сообщение', 'The message'),
    ask: L3('Do‘stga yana nima qo‘shamiz?', 'Что добавим другу ещё?', 'What else shall we add?'),
    say: L3('Xabar tuzaldi, endi uni o‘qish mumkin. Unga yana nima qo‘shamiz? Pastdagi to‘rtta kartochkadan birini bosing.',
      'Сообщение починено, теперь его можно прочитать. Что добавим к нему? Нажми на одну из четырёх карточек внизу.',
      'The message is fixed, and now it can be read. What shall we add to it? Tap one of the four cards below.'),
    // Четыре варианта сеткой 2×2 (UX-14). add — что дописывается в сообщение
    // на экране: раньше «Своё имя» не дописывало ничего, а голос говорил, что
    // друг узнает, от кого письмо. Сообщение пишет Луми, поэтому имя — его.
    picks: [
      { id: 'smile', icon: 'star', text: L3('Tabassum', 'Улыбку', 'A smile'),
        add: L3(' :)', ' :)', ' :)'),
        reply: L3('Yaxshi: xabar iliqroq bo‘ladi.', 'Хорошо: сообщение станет теплее.', 'Good: the message gets warmer.') },
      { id: 'ask', icon: 'bulb', text: L3('Savol belgisi', 'Вопросительный знак', 'A question mark'),
        add: L3('?', '?', '?'),
        reply: L3('Yaxshi: savol suhbatni davom ettiradi.', 'Хорошо: вопрос продолжит разговор.', 'Good: a question keeps the talk going.') },
      { id: 'name', icon: 'doc', text: L3('Lumi ismi', 'Имя Луми', 'The name Lumi'),
        add: L3(' — Lumi', ' — Луми', ' — Lumi'),
        reply: L3('Yaxshi: do‘st xabar kimdan kelganini biladi.', 'Хорошо: друг будет знать, от кого сообщение.', 'Good: your friend will know who wrote it.') },
      { id: 'bye', icon: 'arrowR', text: L3('Xayr!', 'Пока!', 'Bye!'),
        add: L3(' Xayr!', ' Пока!', ' Bye!'),
        reply: L3('Yaxshi: xayrlashib yozish — xushmuomalalik.', 'Хорошо: попрощаться в конце — вежливо.', 'Good: saying goodbye at the end is polite.') }
    ],
    done: L3('Mana, endi xabarni o‘qish mumkin.', 'Вот оно — сообщение, которое прочитают.', 'There it is — a message that will be read.'),
    btn: L3('Yuborish', 'Отправить', 'Send')
  },
  s14: {
    eyebrow: L3('Tayyor', 'Готово', 'Done'),
    title: L3('Xabar tuzatildi', 'Сообщение починено', 'The message is fixed'),
    say: L3('Endi siz xatoni tuzata olasiz va tugmalar joyini eslaysiz.',
      'Теперь ты умеешь чинить опечатки и помнишь, где какие клавиши.',
      'Now you can fix slips and you remember where the keys are.'),
    // Набор умений, а не порядок шагов — галочки остаются. Строки — те же
    // правила, что звучали в уроке (s2, s5, s12), а не обрывки «Курсор на месте».
    skills: [
      L3('Uchta xato so‘z tuzatildi', 'Три слова с ошибками починены', 'Three broken words fixed'),
      L3('Harf kursor turgan joyda paydo bo‘ladi', 'Буква появляется там, где курсор', 'A letter appears where the cursor is'),
      L3('O‘chirish kursordan oldingi harfni o‘chiradi', 'Стирание убирает букву перед курсором', 'Erase removes the letter before the cursor'),
      L3('Harflar ko‘rinmasa ham, yoddan yozish mumkin', 'Можно печатать по памяти, даже без букв на клавишах', 'You can type from memory, even with the letters hidden')
    ],
    btn: L3('Oxirigacha', 'В конец', 'To the end')
  },
  s15: {
    eyebrow: L3('Ko‘rishguncha', 'До встречи', 'See you'),
    say: L3('Keyingi darsda oynalar bilan tanishamiz.',
      'На следующем уроке познакомимся с окнами.',
      'Next lesson we will meet windows.'),
    btn: L3('Darsni yakunlash', 'Завершить урок', 'Finish the lesson')
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//                        Э К Р А Н Ы   У Р О К А   7
// ═════════════════════════════════════════════════════════════════════════════

// КАКИЕ БУКВЫ ГАСНУТ. Берём буквы самого слова, которое ребёнок сейчас
// набирает, и гасим первые n из них. Так задание работает в любом из трёх
// языков — списка русских клавиш в уроке нет вовсе, и ни одна лишняя клавиша
// не пропадает зря. Порядок фиксированный (по первому появлению в слове),
// поэтому при возврате на экран гаснут те же самые.
// Буквы перечислены строкой, а не регулярным выражением: в раскладках есть
// апостроф (o‘, g‘), и внутри литерала регулярки он путает проверялку —
// она принимает его за начало строки и объявляет файл незакрытым.
const K7_LETTERS = 'abcdefghijklmnopqrstuvwxyz' + 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

const k7Dim = (word, n) => {
  if (!n) return null;
  const out = [];
  String(word || '').toLowerCase().split('').forEach((ch) => {
    if (K7_LETTERS.indexOf(ch) >= 0 && out.indexOf(ch) < 0) out.push(ch);
  });
  return out.slice(0, n);
};

const K7Why = ({ id, live }) => {
  const cls = 'why-art' + (live ? ' is-live' : '');
  if (id === 'read') return (
    <svg className={cls} viewBox="0 0 90 70" aria-hidden="true">
      <rect className="wa-a" x="12" y="20" width="66" height="30" rx="6" fill={T.paper} stroke={T.uiEdge} strokeWidth="3" />
      <rect className="wa-b" x="20" y="29" width="22" height="5" rx="2.5" fill={T.ink3} />
      <rect className="wa-c" x="46" y="29" width="14" height="5" rx="2.5" fill={T.hint} />
      <rect x="20" y="39" width="34" height="4" rx="2" fill={T.ink3} />
    </svg>
  );
  if (id === 'ask') return (
    <svg className={cls} viewBox="0 0 90 70" aria-hidden="true">
      <path className="wa-a" d="M12 16h44v24H30l-10 9v-9H12z" fill={T.blueSoft} stroke={T.blue} strokeWidth="3" strokeLinejoin="round" />
      <text className="wa-b" x="60" y="42" fontSize="30" fontWeight="800" fill={T.accent}>?</text>
    </svg>
  );
  return (
    <svg className={cls} viewBox="0 0 90 70" aria-hidden="true">
      <rect className="wa-a" x="16" y="22" width="58" height="26" rx="6" fill={T.successSoft} stroke={T.success} strokeWidth="3" />
      <path className="wa-b" d="M30 35l7 7 14-14" fill="none" stroke={T.success} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ═════════════════════════════════════════════════════════════════════════════

// ПЕРЕПИСКА КАК В TELEGRAM (заказчик, 28.09.2026: «telegramda yozishmaga
// o‘xshatib qil»). Раньше на экране висели два голых пузыря, и ребёнок не
// узнавал в них мессенджер. Теперь это окно чата, какое он видит на телефоне
// у родителей: шапка с аватаркой-буквой, именем друга и «onlayn», зелёный
// фон, свои сообщения справа светло-зелёные с временем и двумя галочками,
// чужие — слева белые, внизу поле ввода и синяя кнопка-самолётик.
// Портрета у друга нет намеренно (как в «Кибер-щите»): лицо ему урок не
// придумывает, аватарка — первая буква имени.
const K7_PEER = L3('Sardor', 'Сардор', 'Sardor');
const K7_TG = {
  online: L3('onlayn', 'в сети', 'online'),
  typing: L3('yozmoqda…', 'печатает…', 'typing…'),
  field: L3('Xabar', 'Сообщение', 'Message'),
  send: L3('Yuborish', 'Отправить', 'Send')
};

// msgs = [{ who: 'me' | 'him', text, time, big }]; draft — текст в поле ввода.
// onSend — кнопка-самолётик живая; sendLive — она мягко зовёт. onBubble —
// пузыри нажимаются (повтор реплики). compact — без поля ввода (итог урока).
function K7Tg({ msgs, typing, draft, onSend, sendLive, onBubble, compact }) {
  const pick = usePick();
  return (
    <div className={'k7-tg' + (compact ? ' is-compact' : '')}>
      <div className="k7-tg-top">
        <svg className="k7-tg-back" width="12" height="20" viewBox="0 0 12 20" aria-hidden="true">
          <path d="M10 2L2 10l8 8" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="k7-tg-av" aria-hidden="true">{pick(K7_PEER).charAt(0)}</span>
        <span className="k7-tg-who">
          <b>{pick(K7_PEER)}</b>
          <i>{pick(typing ? K7_TG.typing : K7_TG.online)}</i>
        </span>
      </div>
      <div className="k7-tg-body">
        {msgs.map((m, i) => {
          const Tag = onBubble ? 'button' : 'span';
          return (
            <Tag key={i} type={onBubble ? 'button' : undefined}
              className={'k7-tg-msg ' + (m.who === 'me' ? 'is-me' : 'is-him') + (m.big ? ' is-big' : '')}
              onClick={onBubble ? () => onBubble(m, i) : undefined}>
              <span className="k7-tg-t">{m.text}</span>
              <span className="k7-tg-meta">
                {m.time}
                {m.who === 'me' ? (
                  <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true">
                    <path d="M1 6l3 3 6-7M6.5 9.2l.8.8 7-8" stroke="currentColor" strokeWidth="1.6" fill="none"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </span>
            </Tag>
          );
        })}
        {typing ? <span className="k7-tg-msg is-him k7-tg-dots" aria-hidden="true"><i /><i /><i /></span> : null}
      </div>
      {compact ? null : (
        <div className="k7-tg-bar">
          <span className={'k7-tg-field' + (draft ? '' : ' is-empty')}>{draft || pick(K7_TG.field)}</span>
          <button type="button" className={'k7-tg-send' + (sendLive ? ' is-live' : '')}
            disabled={!onSend} onClick={onSend} aria-label={pick(K7_TG.send)}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 11.4L21 4l-3.6 16.2-5.4-4.5-2.8 3v-4.9l8.3-7.4-9.9 6.1z" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function S1({ p }) {
  const pick = usePick();
  const store = useStore();
  const audio = useAudio();
  const [told, setTold] = useState(() => !!store.get('s1'));
  const [sent, setSent] = useState(told);
  const [typing, setTyping] = useState(false);
  // Вернулись на экран, а сообщение уже отправлено и «?» на месте: звать
  // «нажми, чтобы отправить» было бы неправдой — звучит, что случилось.
  const [speaker, say, spoken, sayNow] = useVoice([told
    ? { text: C.s1.say2, pose: 'sorry' }
    : { text: C.s1.say1, pose: 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(told, spoken);
  const said = useRef(told);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  // Отправка — как в мессенджере: сообщение уходит в чат, у друга «пишет…»,
  // и через секунду приходит «?». Только после этого Луми объясняет, что
  // случилось: раньше знака вопроса на экране нет, и говорить о нём рано.
  const send = () => {
    if (!canTap || sent) return;
    setSent(true);
    sfx('pop', audio && audio.on);
    (async () => {
      await sleep(600);
      if (!alive.current) return;
      setTyping(true);
      await sleep(1400);
      if (!alive.current) return;
      setTyping(false);
      setTold(true); store.set('s1', { done: true });
      sfx('soft', audio && audio.on);
      if (said.current) return;
      said.current = true;
      say(C.s1.say2, 'sorry');
    })();
  };

  // ПОВТОРНОЕ НАЖАТИЕ (правка 25.09, как урок 2): после ответа друга и после
  // возврата на экран пузыри нажимаются — робот ещё раз объясняет, что вышло.
  const replay = () => {
    if (!canTap || !told) return;
    sfx('tap', audio && audio.on);
    sayNow(C.s1.say2, 'sorry');
  };

  const msgs = [];
  if (sent) msgs.push({ who: 'me', text: pick(MSG.bad), time: '19:42' });
  if (told) msgs.push({ who: 'him', text: '?', time: '19:42', big: true });

  return (
    <Stage eyebrow={C.s1.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<NextBtn disabled={!canGo} onClick={p.next} label={C.s1.btn} />}>
      <K7Tg msgs={msgs} typing={typing} draft={sent ? '' : pick(MSG.bad)}
        onSend={sent ? undefined : send} sendLive={canTap && !sent}
        onBubble={told ? replay : undefined} />
    </Stage>
  );
}

const S2 = ({ p }) => <MissionScreen p={p} c={C.s2} id="s2" />;
const S3 = ({ p }) => <WhyScreen p={p} c={C.s3} id="s3" art={(id, live) => <K7Why id={id} live={live} />} />;

// Показ карточек (канон useCardTour), но сохранение — в прежнем формате
// экрана: seen хранит ключи слов ('miss', 'extra', 'swap'), а не номера.
function useTourKeys(id, keys, opts) {
  const store = useStore();
  const tour = useCardTour(Object.assign({ id: id }, opts));
  useEffect(() => {
    if (tour.ended) store.set(id, { done: true, seen: keys.slice() });
  }, [tour.ended]); // eslint-disable-line react-hooks/exhaustive-deps
  return tour;
}

// ТРИ МЕСТА В СООБЩЕНИИ. Третье — не ошибка, и это важно: ребёнок должен
// убедиться, что не всякое непривычное слово испорчено.
// Заказчик, 27.09.2026: ни точек, ни счётчика «0/3», ни галочек, ни строки
// задания — только Луми и три слова. Ребёнок их не нажимает: Луми сам
// открывает слова по одному, пока разбирает каждое, и то, о котором он
// говорит, подсвечено. После показа открытое слово можно нажать — разбор
// повторится. Подсказки (hint) у экрана нет: она звала бы «нажми на каждое».
function S4({ p }) {
  const pick = usePick();
  const spots = C.s4.spots;
  const tour = useTourKeys('s4', spots.map((s) => s.id), {
    intro: C.s4.say, lines: spots.map((s) => s.why), done: C.s4.done
  });
  return (
    <Stage eyebrow={C.s4.eyebrow} screen={p.screen} total={p.total}
      speaker={tour.speaker} done={tour.ended && tour.spoken}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!tour.passed} onClick={p.next} /></>}>
      <TourCards tour={tour} cards={spots} label={(s) => s.word}
        face={(s) => <span className="k7-spot-w">{pick(s.word)}</span>} />
    </Stage>
  );
}

// ТРЕНИРОВКА — ребёнок чинит слово сам (заказчик, 27.09.2026: «bolani o‘zi
// qismlarni tersin… qolgan darslarda ham shunday bo‘lsa o‘zgartir — bola
// qatnashishini ham»). Раньше здесь Луми сам чинил первое слово сообщения по
// кадрам (курсор, стирание, буква), клавиатура была заперта, а ребёнок жал «Ko‘rsating».
//
// Теперь клавиатура настоящая, но ведёт голос: шагов два, и на каждом
// светится ровно одна клавиша — сначала стирание, потом верная буква. Шаг
// выводится из самого текста в поле (слово целиком / без последней буквы /
// верное), поэтому возврат на экран и перезагрузка показывают честное
// состояние. Нажата не та клавиша — в поле ничего не меняется, Луми ещё раз
// называет место нужной. Курсор здесь не двигается (поле без onCaret): он уже
// стоит за неверной буквой, а ставить его ребёнок учится на экране 6.
function S5({ p }) {
  const pick = usePick();
  const store = useStore();
  const log = useLog();
  const audio = useAudio();
  const bad = pick(C.s5.start);
  const want = pick(C.s5.want);
  const cut = bad.slice(0, -1);
  // Сохранённый набор, который не похож ни на один шаг (другая сборка, другой
  // язык), сбрасываем ДО useTyping — иначе шаг не вывести, и экран встанет.
  useState(() => {
    const v = store.get('s5-t');
    if (v && [bad, cut, want].indexOf(v.text) < 0) store.set('s5-t', undefined);
    return null;
  });
  // Экран пройден в старой сборке (там был показ, набора в сохранении нет) —
  // в поле сразу верное слово, чтобы «Дальше» и поле говорили одно и то же.
  const type = useTyping(store.get('s5') ? want : bad, { storeKey: 's5-t', max: 20 });
  const ok = type.text === want;
  const step = ok ? 'done' : (type.text === cut ? 'type' : 'erase');
  const need = step === 'erase' ? 'back' : want.slice(-1);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: C.s5.say, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ok, spoken);
  const said = useRef(ok);
  const tries = useRef(0);

  const key = (k) => {
    if (!canTap || ok || !k) return;
    // Регистр, алфавит, цифры клавиатура переключает сама — это не ответ.
    if (k.service === 'shift' || k.service === 'lang' || k.service === 'num') return;
    tries.current += 1;
    if (k.code !== need) {
      sfx('soft', audio && audio.on);
      sayNow(step === 'erase' ? C.s5.lines.eraseAgain : C.s5.lines.typeAgain, 'think');
      return;
    }
    // Букву кладём строчной: Shift мог остаться включённым, а в слове её нет.
    type.press(k.service ? k : Object.assign({}, k, { char: k.code }));
    if (step === 'erase') { sayNow(C.s5.lines.erased, 'point'); return; }
    sfx('ok', audio && audio.on);
    store.set('s5', { done: true, attempts: tries.current });
    log({ screenId: 's5', type: 'level', attempts: tries.current });
    sayNow(C.s5.lines.fixed, 'smile');
    if (said.current) return;
    said.current = true;
    setTimeout(() => say(C.s5.done, 'cheer'), 380);
  };

  const marks = ok ? { [want.length - 1]: 'ok' } : null;
  return (
    <Stage eyebrow={C.s5.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}>
      <Field text={type.text} caret={type.caret} marks={marks} label={C.s5.field} done={ok} big />
      <Keys compact disabled={!canTap || ok} lit={canTap && !ok ? [need] : null} onKey={key} />
    </Stage>
  );
}

// Общий каркас уровней 6, 8, 9, 10 и вызова 11. Отличаются только словом и
// тем, сколько его букв погасло на клавиатуре.
function K7Fix({ p, c, id }) {
  const pick = usePick();
  const lang = useLang();
  const store = useStore();
  const log = useLog();
  // Слово уровня сменилось (правка 25.09.2026, см. MSG). Сохранённый набор,
  // в котором всё ещё нетронутое старое слово автора, сбрасываем ДО useTyping:
  // иначе голос говорил бы про «k», а в поле стояло бы «salm». Любой другой
  // сохранённый набор оставляем — его можно доправить до верного слова.
  useState(() => {
    const old = c.legacy && c.legacy[lang];
    const v = old ? store.get(id + '-t') : null;
    if (v && v.text === old) store.set(id + '-t', undefined);
    return null;
  });
  const want = pick(c.want);
  const type = useTyping(pick(c.start), { storeKey: id + '-t', max: 40 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const ok = type.text.trim() === want;
  const canGo = useAdvanceGate(ok, spoken);
  const said = useRef(ok);
  const dim = useMemo(() => k7Dim(want, c.dim), [want, c.dim]);

  useEffect(() => {
    if (!ok || said.current) return;
    said.current = true;
    log({ screenId: id, type: 'level' });
    setTimeout(() => say(c.done, 'cheer'), 380);
  }, [ok]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stage hint={c.ask} eyebrow={c.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}>
      <p className="ask hook-ask">{pick(c.ask)}</p>
      <Field text={type.text} caret={type.caret} label={c.field}
        ghost={want} onCaret={type.move} done={ok} big />
      <Keys compact dim={dim} disabled={!canTap || ok} onKey={type.press} />
    </Stage>
  );
}

const S6 = ({ p }) => <K7Fix p={p} c={C.s6} id="s6" />;

// ВСПЫШКА. Слово показывается на секунду и гаснет — дальше по памяти.
// Запустить показ можно сколько угодно раз: отсчёта и наказания здесь нет.
function S7({ p }) {
  const pick = usePick();
  const store = useStore();
  const log = useLog();
  const want = pick(C.s7.word);
  const type = useTyping('', { storeKey: 's7-t', max: 20 });
  const [shown, setShown] = useState(() => !!store.get('s7'));
  const [speaker, say, spoken, sayNow] = useVoice([{ text: C.s7.say, pose: 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const ok = type.text.trim() === want;
  const canGo = useAdvanceGate(ok, spoken);
  const said = useRef(ok);

  useEffect(() => {
    if (!ok || said.current) return;
    said.current = true;
    store.set('s7', { done: true });
    log({ screenId: 's7', type: 'check' });
    setTimeout(() => say(C.s7.done, 'cheer'), 380);
  }, [ok]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stage hint={C.s7.ask} eyebrow={C.s7.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}>
      <p className="ask hook-ask">{pick(C.s7.ask)}</p>
      <Glance pop label={C.s7.show} disabled={!canTap} onShown={() => setShown(true)}>
        <span className="k7-flash">{want}</span>
      </Glance>
      <Field text={type.text} caret={type.caret} label={C.s7.field} onCaret={type.move} done={ok} big />
      <Keys compact disabled={!canTap || !shown || ok} onKey={type.press} />
    </Stage>
  );
}

const S8 = ({ p }) => <K7Fix p={p} c={C.s8} id="s8" />;
const S9 = ({ p }) => <K7Fix p={p} c={C.s9} id="s9" />;
const S10 = ({ p }) => <K7Fix p={p} c={C.s10} id="s10" />;
const S11 = ({ p }) => <K7Fix p={p} c={C.s11} id="s11" />;

function S12({ p }) {
  const pick = usePick();
  const store = useStore();
  const log = useLog();
  const [rec, setRec] = useState(() => store.get('s12') || undefined);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: C.s12.say, pose: 'think' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(!!rec, spoken);
  const said = useRef(!!rec);

  return (
    <Stage hint={C.s12.ask} eyebrow={C.s12.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}>
      <p className="ask hook-ask">{pick(C.s12.ask)}</p>
      {/* Утверждение звучит (UX-06): встаёт в очередь после реплики экрана. */}
      <YesNo items={C.s12.items} labels={{ yes: C.s12.yes, no: C.s12.no, all: C.s12.all }}
        onAsk={(it) => say(it.text, 'think')}
        stored={rec} canAnswer={canTap}
        onSolved={(r) => {
          const v = { done: r.done, attempts: r.attempts };
          store.set('s12', v); setRec(v);
          log({ screenId: 's12', type: 'check', attempts: r.attempts });
          if (said.current) return;
          said.current = true;
          // Итог по результату (как урок 3): чистый проход — ответов ровно
          // столько, сколько утверждений.
          const clean = r.attempts <= C.s12.items.length;
          setTimeout(() => say(clean ? C.s12.done : C.s12.doneRetry, clean ? 'cheer' : 'smile'), 340);
        }}
        onSay={(t, pose) => sayNow(t, pose)} />
    </Stage>
  );
}

function S13({ p }) {
  const pick = usePick();
  const store = useStore();
  const [rec, setRec] = useState(() => store.get('s13') || undefined);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: C.s13.say, pose: 'celebrate' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(!!rec, spoken);
  const said = useRef(!!rec);
  const extra = rec ? C.s13.picks.filter((o) => o.id === rec.pick)[0] : null;

  return (
    <Stage hint={C.s13.ask} eyebrow={C.s13.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} label={C.s13.btn} /></>}>
      {/* Выбранное дописывается в сообщение (поле add) — что обещает ответ
          робота, то и видно: улыбка, знак вопроса, имя Луми или «Пока!». */}
      <K7Tg compact msgs={[{ who: 'me', time: '19:45',
        text: pick(MSG.good) + (extra && extra.add ? pick(extra.add) : '') }]} />
      <p className="ask hook-ask">{pick(C.s13.ask)}</p>
      {/* Четыре карточки — сетка 2×2 (UX-14), см. .k7-rf в LESSON_CSS. */}
      <div className="k7-rf">
      <Reflection options={C.s13.picks} stored={rec} canAnswer={canTap}
        onPicked={(r) => {
          const v = { pick: r.pick };
          store.set('s13', v); setRec(v);
          if (said.current) return;
          said.current = true;
          setTimeout(() => say(C.s13.done, 'cheer'), 900);
        }}
        onSay={(t, pose) => sayNow(t, pose)} />
      </div>
    </Stage>
  );
}

const S14 = ({ p }) => <AchievementScreen p={p} c={C.s14} />;
const S15 = ({ p }) => <ByeScreen p={p} c={C.s15} />;

// Кино карты модуля — до первого экрана (в корне) и перед прощанием (канон,
// см. «КАРТА МОДУЛЯ»). Экран с film: true «Назад» перешагивает: иначе кино
// отыгралось бы заново и само увело бы ребёнка вперёд.
const LESSON_N = 7;
const M1 = ({ p }) => <MapFilm n={LESSON_N} mode="end" onDone={p.next} />;

const SCREENS = [
  { id: 's1',  code: 'HOOK',        Comp: S1  },
  { id: 's2',  code: 'MISSION',     Comp: S2  },
  { id: 's3',  code: 'WHY',         Comp: S3  },
  { id: 's4',  code: 'EXPLORE',     Comp: S4  },
  { id: 's5',  code: 'SHOW',        Comp: S5  },
  { id: 's6',  code: 'DO-1',        Comp: S6  },
  { id: 's7',  code: 'CHECK-1',     Comp: S7  },
  { id: 's8',  code: 'LEVEL-2',     Comp: S8  },
  { id: 's9',  code: 'LEVEL-3',     Comp: S9  },
  { id: 's10', code: 'LEVEL-4',     Comp: S10 },
  { id: 's11', code: 'CHALLENGE',   Comp: S11 },
  { id: 's12', code: 'CHECK-2',     Comp: S12 },
  { id: 's13', code: 'RESULT',      Comp: S13 },
  { id: 's14', code: 'ACHIEVEMENT', Comp: S14 },
  { id: 'm1',  code: 'MAP-END',     Comp: M1, film: true },
  { id: 's15', code: 'PREVIEW',     Comp: S15 }
];

const SCREEN_RESET = {
  s1: ['s1'], s3: ['s3'], s4: ['s4'], s5: ['s5', 's5-t'], s6: ['s6-t'], s7: ['s7', 's7-t'],
  s8: ['s8-t'], s9: ['s9-t'], s10: ['s10-t'], s11: ['s11-t'], s12: ['s12'], s13: ['s13']
};

// ═════════════════════════════════════════════════════════════════════════════
// КОРНЕВОЙ КОМПОНЕНТ
// ═════════════════════════════════════════════════════════════════════════════
export default function TypingLesson({ studentName, lang, ttsApiBase, onFinished, startAt, onExit }) {
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({
      artifact: { type: 'message', value: (store.get('s13') || {}).pick || null },
      badge: 'k0-07-typing'
    })
  });
  // КИНО КАРТЫ ДО УРОКА. Пока оно идёт, экран урока не монтируется: иначе
  // робот заговорил бы под кино. startAt (приёмка) кино пропускает.
  const [gate, setGate] = useState(() => (Number(startAt) > 0 ? 'done' : 'run'));
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const back = R.i > 0 && SCREENS[R.i - 1].film ? () => R.go(-2) : R.prev;
  // Прогрев озвучки: реплики этого экрана и следующего заказываются сервису
  // заранее, чтобы голос на нажатие не запаздывал (см. warm в движке). Пауза —
  // чтобы первая реплика экрана успела уйти своим запросом и не дублировалась.
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (gate !== 'done' || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(spokenOf(C[cur.id], R.lang).concat(spokenOf(C[nextId], R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang, gate]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = {
    screen: R.i, total: SCREENS.length,
    next: R.next, prev: R.i > 0 ? back : null,
    finish: R.finish, name: R.displayName
  };
  return (
    <R.Shell css={LESSON_CSS + MAP_CSS + CANON_UI_CSS}>
      {/* R.done — урок закрыт: остаётся только фон. Своего экрана нет —
          поверх фона платформа показывает своё уведомление. */}
      {gate === 'done' && !R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      {gate !== 'done' ? <MapFilm n={LESSON_N} mode="start" onDone={() => setGate('done')} /> : null}
    </R.Shell>
  );
}

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
.tour-back { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 16px;
  background: repeating-linear-gradient(135deg, ${T.ui} 0 14px, #42A5F5 14px 28px); }
.tour-back i { display: grid; place-items: center; width: clamp(34px, 7dvh, 48px); aspect-ratio: 1;
  border-radius: 50%; background: rgba(255,255,255,.92); color: ${T.uiDk};
  font-size: clamp(20px, 4dvh, 28px); font-weight: 900; line-height: 1; font-style: normal; }
.tour-card.is-open .tour-face { animation: tourFlip .5s cubic-bezier(.34,1.3,.64,1) both; }
@keyframes tourFlip { 0% { opacity: 0; transform: perspective(500px) rotateY(80deg) scale(.9); }
  100% { opacity: 1; transform: none; } }
.tour-card.is-reading { border-color: ${T.ui}; background: ${T.uiSoft}; transform: translateY(-3px);
  box-shadow: 0 0 0 4px rgba(30,136,229,.18), 0 10px 22px rgba(${T.shadowBase},0.12); }
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
  box-shadow: 0 0 0 4px rgba(30,136,229,.14); }
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
  filter: drop-shadow(0 12px 22px rgba(30,136,229,.3));
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
/* Карточка-улика: поверх поля и клавиатуры, место в раскладке не занимает. */
.glance.is-pop { position: relative; z-index: 30; }
.glance-card { position: absolute; left: 50%; top: calc(100% + 10px); z-index: 30;
  min-width: min(260px, 86vw); max-width: min(420px, 92vw); padding: clamp(14px, 3dvh, 26px) clamp(18px, 4vw, 34px);
  background: ${T.paper}; border-radius: 20px; border: 3px solid ${T.ui};
  box-shadow: 0 18px 40px rgba(${T.shadowBase}, .28), 0 3px 8px rgba(${T.shadowBase}, .16);
  transform: translateX(-50%); animation: glanceCardIn .22s cubic-bezier(.2,1.4,.4,1) both; }
.glance-card .k7-flash { font-size: clamp(30px, 8vw, 52px) !important; padding: 0 !important; }
@keyframes glanceCardIn { from { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(.85) rotate(-3deg); }
  to { opacity: 1; transform: translateX(-50%) rotate(-1.5deg); } }

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
  box-shadow: 0 0 0 4px rgba(30,136,229,.14); transform: translateY(-3px); }
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

// Оформление движка экранной клавиатуры. Едет вместе с ним.
//
// Разбито на шесть кусков не из любви к порядку, а по опыту: одна шаблонная
// строка на четыреста строк CSS не читается и не правится — в ней невозможно
// найти незакрытую скобку. Голого CSS вне обратных кавычек здесь быть не
// может, это синтаксическая ошибка на уровне модуля.

const KEYBOARD_CSS_1 = `
/* ══════════════════════════════════════════════════════════════
   КЛАВИАТУРА
   Копия телефонной, а не «кнопочки на тему». Пропорции, порядок рядов и
   сдвиг второго ряда — как у настоящей: именно по ним ребёнок потом узнает
   свою клавиатуру.
   ══════════════════════════════════════════════════════════════ */

/* ВЫСОТА. Главное ограничение движка: клавиатура не имеет права съесть больше
   40% сцены, иначе заданию и герою не остаётся места. На телефоне 360x640 под
   сцену приходится около 390 px, значит потолок — 156 px.
   Считаем от ширины окна (клавиша у настоящей клавиатуры почти квадратная) и
   отдельно подстраховываемся высотой:
     360 px шириной → 9.2vw = 33 px → четыре ряда = 132 px + поля = 140 px (36%);
     компактный вариант на тех же 360 → три ряда = 107 px (27%).
   Верхний предел 48 px нужен планшету: без него клавиши разъезжаются в лапти.
   Страховка по высоте — 5dvh (было 5.6): на ноутбуке 1280×800 под сцену
   остаётся около 400 px, и с 5.6dvh кнопка «Показать» на экране показа
   уходила под нижнюю панель. */
.kb { --kb-h: clamp(32px, min(9.2vw, 5dvh), 48px);
  display: flex; flex-direction: column; flex: 0 0 auto;
  width: 100%; max-width: 520px; align-self: center; box-sizing: border-box;
  padding: 4px 3px; border-radius: 14px; background: ${T.uiBar};
  box-shadow: inset 0 0 0 1px ${T.uiEdge}, 0 8px 20px -16px rgba(${T.shadowBase},0.6);
  user-select: none; -webkit-user-select: none; touch-action: manipulation; }
.kb-wide { max-width: 760px; }
.kb.is-off { opacity: .55; }

.kb-row { display: flex; align-items: stretch; width: 100%; height: var(--kb-h); }
/* Распорка полклавиши: второй ряд настоящего ЙЦУКЕН сдвинут внутрь. */
.kb-sp { flex-basis: 0; flex-shrink: 1; min-width: 0; }

/* КЛАВИША. Отступы — ПОЛЯ ВНУТРИ кнопки, а не промежутки между соседями:
   области нажатия смыкаются, и мимо клавиатуры попасть невозможно. Видимый
   зазор рисует колпачок, который лежит внутри этих полей.
   flex-basis: 0 плюс flex-grow из разметки — так ряд всегда занимает всю
   ширину, а «широкая на две клавиши» остаётся ровно вдвое шире соседки. */
.kb-k { position: relative; flex-basis: 0; flex-shrink: 1; min-width: 0;
  margin: 0; padding: 2.5px 1.5px; border: none; background: transparent;
  font: inherit; color: ${T.ink}; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.kb-k:disabled { cursor: default; }
.kb-k:focus-visible { outline: none; }
.kb-k:focus-visible .kb-cap { box-shadow: 0 0 0 3px ${T.ui}; }

.kb-cap { display: flex; align-items: center; justify-content: center; gap: 2px;
  width: 100%; height: 100%; border-radius: 7px; overflow: hidden;
  background: ${T.paper}; color: ${T.ink};
  box-shadow: 0 1px 0 rgba(${T.shadowBase},0.18);
  transition: background .12s, transform .1s, box-shadow .15s, color .15s; }
/* Нажатие видно СРАЗУ и без анимации въезда: у настоящей клавиатуры отклик
   мгновенный, и задержка читается как «не сработало». */
.kb-k:active:not(:disabled) .kb-cap { transform: translateY(1px) scale(.96);
  background: ${T.uiSoft}; box-shadow: none; }

.kb-ch { display: block; line-height: 1;
  font-size: clamp(13px, min(4.4vw, 2.8dvh), 21px); font-weight: 600; }
.kb-txt { display: block; line-height: 1; letter-spacing: .02em;
  font-size: clamp(12px, min(3.4vw, 2dvh), 15px); font-weight: 800; color: ${T.ink2}; }

/* Служебные клавиши тусклее буквенных: буквы — главное, остальное помогает. */
.kb-srv .kb-cap { background: #E3E0DA; color: ${T.ink2}; }
.kb-enter .kb-cap { background: ${T.blueSoft}; color: ${T.blueDk}; }
.kb-space .kb-cap { background: ${T.paper}; }
.kb-shift.is-on .kb-cap { background: ${T.uiSoft}; color: ${T.uiDk};
  box-shadow: inset 0 0 0 2px ${T.ui}; }
/* Замок регистра — долгое нажатие. Отличается от одноразового подчёркиванием
   снизу: у настоящих клавиатур CapsLock тоже показан отдельной меткой. */
.kb-shift.is-lock .kb-cap { background: ${T.ui}; color: ${T.paper};
  box-shadow: inset 0 -3px 0 ${T.uiDk}; }
`;

const KEYBOARD_CSS_2 = `
/* ── ПОДСВЕЧЕННАЯ КЛАВИША (проп lit) ──────────────────────────────────────
   «Вот эта, нажми её». Кольцо плюс лёгкое дыхание: неподвижную подсветку на
   раскладке из тридцати трёх клавиш глаз не находит. Частота ниже 3 Гц —
   порог, за которым мерцание становится опасным. */
.kb-k.is-lit .kb-cap { background: ${T.uiSoft}; color: ${T.uiDk};
  box-shadow: inset 0 0 0 2.5px ${T.ui}; animation: kbBreathe 1.6s ease-in-out infinite; }
@keyframes kbBreathe {
  0%, 100% { box-shadow: inset 0 0 0 2.5px ${T.ui}, 0 0 0 0 rgba(30,136,229,0); }
  50% { box-shadow: inset 0 0 0 2.5px ${T.ui}, 0 0 0 6px rgba(30,136,229,.22); }
}
/* Светодиод канона внутри клавиши слишком крупен — гасим его точку и
   оставляем только рамку, подсветку рисует сама клавиша. */
.kb-k .led { border-radius: 7px; }
.kb-k .led > i { display: none; }

/* ── ПОГАШЕННАЯ КЛАВИША (проп dim) ────────────────────────────────────────
   Механика урока 7: подписи гаснут одна за другой, и ребёнок допечатывает по
   памяти. Гаснет ПОДПИСЬ, а не клавиша: колпачок на месте, размер тот же,
   нажатие работает. Пустой колпачок чуть утоплен — видно, что это не дырка в
   раскладке, а стёршаяся буква. */
.kb-k.is-dim .kb-cap { background: #EFEDE8;
  box-shadow: inset 0 1px 2px rgba(${T.shadowBase},0.16); }

/* ── ГРУППЫ КЛАВИШ (проп zones) ───────────────────────────────────────────
   Урок 5 объясняет карту клавиатуры и подкрашивает то, о чём говорит. Цвета
   взяты из вспомогательных каналов палитры: красного среди них нет — красный
   в курсе не значит ничего, и уж точно не «ошибка». */
.kb-z-letters .kb-cap { background: ${T.paper}; box-shadow: 0 1px 0 rgba(${T.shadowBase},0.18), inset 0 0 0 2px ${T.uiSoft}; }
.kb-z-digits .kb-cap { background: ${T.blueSoft}; color: ${T.blueDk}; }
.kb-z-marks .kb-cap { background: ${T.hintSoft}; color: ${T.ink2}; }
.kb-z-space .kb-cap { background: ${T.successSoft}; color: ${T.success}; }
.kb-z-enter .kb-cap { background: ${T.blueSoft}; color: ${T.blueDk}; box-shadow: inset 0 0 0 2px ${T.blue}; }
.kb-z-back .kb-cap { background: ${T.hintSoft}; color: ${T.hint}; box-shadow: inset 0 0 0 2px ${T.hint}; }
.kb-z-arrows .kb-cap { background: ${T.blueSoft}; color: ${T.blueDk}; }
.kb-z-service .kb-cap { background: #E3E0DA; }
`;

const KEYBOARD_CSS_3 = `
/* ══════════════════════════════════════════════════════════════
   ПОЛЕ ВВОДА
   Настоящего <input> внутри нет: он поднял бы системную клавиатуру, ради
   отсутствия которой весь движок и написан. Текст — span-ы, курсор — свой.
   ══════════════════════════════════════════════════════════════ */
.kb-f { display: flex; flex-direction: column; gap: 5px; width: 100%;
  max-width: 520px; align-self: center; }
.kb-f-lab { font-size: 13px; font-weight: 800;
  letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }
.kb-f-box { position: relative; box-sizing: border-box; width: 100%;
  min-height: clamp(44px, 7.4dvh, 64px);
  padding: clamp(8px, 1.4dvh, 13px) clamp(10px, 2.2vw, 16px);
  border-radius: 14px; background: ${T.paper};
  font-size: clamp(15px, min(4.4vw, 2.9dvh), 24px); font-weight: 600; line-height: 1.45;
  color: ${T.ink}; overflow-wrap: anywhere;
  box-shadow: inset 0 0 0 2px ${T.uiEdge}, 0 2px 0 rgba(${T.shadowBase},0.05);
  transition: box-shadow .25s, background .25s; }
.kb-f.is-big .kb-f-box { font-size: clamp(28px, min(8.6vw, 4.8dvh), 44px);
  text-align: center; font-weight: 800; }
/* UI-19: в крупном поле курсор ставят пальцем, поэтому каждая буква — своя
   зона нажатия: не уже 0.8 em (26–35 px) и во всю высоту строки. Конец строки
   тоже зона, а не полоска в 3 px. */
.kb-f.is-big .kb-f-cell { display: inline-block; min-width: .8em; text-align: center; }
.kb-f.is-big .kb-f-end { min-width: 1.2em; }
/* Две строки крупным кеглем на ноутбуке 1280×800 сталкивали клавиатуру под
   нижнюю панель: у поля в две строки кегль ниже и строки плотнее. */
.kb-f.is-big.is-multi .kb-f-box { font-size: clamp(28px, min(8.6vw, 4.6dvh), 34px); line-height: 1.25; }
.kb-f.is-multi .kb-f-line { min-height: 1.25em; }
.kb-f.is-done .kb-f-box { box-shadow: inset 0 0 0 2.5px ${T.success}; background: ${T.successSoft}; }

.kb-f-line { display: block; min-height: 1.4em; }
.kb-f-cell { position: relative; display: inline; }
.kb-f-ch { display: inline; white-space: pre; }
/* Отметки на отдельных буквах: урок 7 подсвечивает исправленную опечатку.
   Зелёная — «стало верно», охра — «вот это ты только что добавил». Ни одна
   отметка не означает ошибку: ошибки цветом в курсе не показываются. */
.kb-f-ch.is-ok { color: ${T.success}; font-weight: 800; }
.kb-f-ch.is-new { color: ${T.uiDk}; font-weight: 800; }
.kb-f-end { display: inline-block; min-width: 3px; }
.kb-f-ph { color: ${T.ink3}; font-style: italic; font-weight: 500;
  font-size: clamp(13px, min(3.6vw, 2.2dvh), 18px); }
/* Бледный хвост образца: видно, сколько ещё осталось напечатать. Числом
   («ещё 6 букв») восьмилетка не пользуется, а по контуру слова — сразу. */
.kb-f-ghost { color: ${T.ink3}; opacity: .5; font-weight: 500; }

/* КУРСОР. Такой же, как в движке редактора, и это намеренно: в тринадцатом
   уроке ребёнок уже познакомился с мигающей палочкой, и вторая, непохожая,
   читалась бы как другая вещь. Мигание раз в секунду — ниже порога 3 Гц. */
.kb-cr { display: inline-block; width: 2.5px; height: 1.05em; margin-right: -2.5px;
  vertical-align: text-bottom; background: ${T.ui}; border-radius: 1px;
  animation: kbBlink 1s step-end infinite; }
@keyframes kbBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
`;

const KEYBOARD_CSS_4 = `
/* ══════════════════════════════════════════════════════════════
   КАРТА КЛАВИАТУРЫ
   Области стоят там же, где на клавиатуре урока (полная раскладка Keys):
   буквы главным блоком, стирание справа над Enter, внизу «123» (цифры),
   пробел и Enter. Карта и клавиатура обязаны совпадать (UX-12).
   ══════════════════════════════════════════════════════════════ */
.km { display: flex; flex-direction: column; gap: 8px; width: 100%;
  max-width: 460px; align-self: center; }
.km-grid { display: grid; gap: clamp(4px, 1vw, 7px);
  /* UI-16: крайние столбцы («123», «Стереть», «Новая строка») не уже 64 px и
     по ширине подписи в одну строку; середина делится поровну. */
  grid-template-columns: minmax(64px, auto) repeat(4, minmax(0, 1fr)) minmax(64px, auto);
  /* Как полная раскладка Keys (UX-12): буквы блоком, стирание справа в
     третьем ряду над Enter, внизу «123» — пробел — Enter. */
  grid-template-areas: 'l l l l l .' 'l l l l l b' 'd s s s s e';
  padding: 6px; border-radius: 14px; background: ${T.uiBar};
  box-shadow: inset 0 0 0 1px ${T.uiEdge}; }
.km-digits { grid-area: d; } .km-letters { grid-area: l; }
.km-back { grid-area: b; } .km-enter { grid-area: e; }
.km-arrows { grid-area: a; } .km-space { grid-area: s; }

/* Каждая область — одна кнопка не ниже 44 px: это обычная кнопка курса, а не
   клавиша, и правило размера здесь работает в полную силу. */
.km-p { position: relative; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 3px;
  min-height: 44px; padding: clamp(5px, 1dvh, 9px) 4px; border: none;
  border-radius: 10px; background: ${T.paper}; color: ${T.ink2};
  font: inherit; cursor: pointer;
  box-shadow: 0 1px 0 rgba(${T.shadowBase},0.14);
  transition: background .2s, box-shadow .2s, transform .14s, color .2s; }
.km-letters { min-height: clamp(66px, 11dvh, 110px); }
.km-p:hover:not(:disabled) { background: ${T.uiSoft}; color: ${T.uiDk}; }
.km-p:active:not(:disabled) { transform: scale(.98); }
.km-p:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 2px; }
.km-p:disabled { cursor: default; }
.km-p.is-seen { background: ${T.successSoft}; color: ${T.success};
  box-shadow: inset 0 0 0 2px ${T.success}; }
.km-t { font-size: clamp(13px, min(3.6vw, 2.1dvh), 15px); font-weight: 800;
  line-height: 1.1; text-align: center; white-space: nowrap; }
.km-tick { position: absolute; top: 4px; right: 4px; display: grid; place-items: center;
  width: 17px; height: 17px; border-radius: 50%; background: ${T.success}; color: ${T.paper}; }

/* Заглушки-колпачки внутри области: она должна ВЫГЛЯДЕТЬ куском клавиатуры,
   иначе это просто шесть подписанных прямоугольников. */
.km-caps { display: flex; gap: 2px; justify-content: center; }
/* UI-16: колпачки-точки тёмные (ink2), а не бледно-серые: читаются как клавиши. */
.km-caps i { width: clamp(6px, 1.7vw, 10px); height: clamp(8px, 2.2vw, 12px);
  border-radius: 2px; background: ${T.ink2}; opacity: .62; }
.km-rows { display: flex; flex-direction: column; gap: 2px; }
.km-p.is-seen .km-caps i { background: ${T.success}; opacity: .45; }
.km-arr { display: flex; gap: 2px; }
.km-num { font-size: clamp(13px, min(3.6vw, 2.1dvh), 15px); font-weight: 800; line-height: 1; color: ${T.ink}; }
.km-count { font-size: clamp(13px, 1.9dvh, 14px); font-weight: 700;
  color: ${T.ink2}; text-align: center; }
.km-count.is-all { color: ${T.success}; }
`;

const KEYBOARD_CSS_5 = `
/* ══════════════════════════════════════════════════════════════
   НАЙДИ КЛАВИШУ
   Порядок сверху вниз: счётчик — вопрос — клавиатура. Вопрос стоит вплотную к
   раскладке, потому что смотреть надо туда: подними его выше, и ребёнок
   читает задание, а потом заново ищет глазами клавиатуру.
   ══════════════════════════════════════════════════════════════ */
.hu { display: flex; flex-direction: column; gap: clamp(6px, 1.4dvh, 12px);
  width: 100%; min-height: 0; }
.hu-top { display: flex; align-items: center; justify-content: center; gap: 10px; }
.hu-n { font-size: clamp(13px, 1.9dvh, 14px); font-weight: 800; color: ${T.ink2}; }
/* Бусины, а не полоска: полоска читается как уходящее время, а времени в этом
   курсе нет. Бусины считают сделанное. */
.hu-beads { display: flex; gap: 5px; align-items: center; }
.hu-bead { width: 7px; height: 7px; border-radius: 50%; background: ${T.uiEdge};
  transition: background .3s, transform .3s; }
.hu-bead.is-on { background: ${T.success}; }
.hu-bead.is-now { background: ${T.ui}; transform: scale(1.35); }
.hu-ask { margin: 0; text-align: center; font-weight: 700; color: ${T.ink};
  line-height: 1.3; }
.hu-all { display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  align-self: center; padding: 8px 16px; border-radius: 12px;
  background: ${T.successSoft}; color: ${T.success}; font-weight: 800;
  font-size: clamp(13px, 2dvh, 16px); }
`;

const KEYBOARD_CSS_6 = `
/* ══════════════════════════════════════════════════════════════
   НИЗКИЙ ЭКРАН И СПОКОЙНОЕ ДВИЖЕНИЕ
   ══════════════════════════════════════════════════════════════ */
/* Окно ниже 620 px — iPhone SE и подобные. Клавиатура тут уже у потолка своих
   40%, поэтому ужимаем не её, а всё вокруг: подпись поля, поля коробки,
   промежутки. Размер клавиш не трогаем — по ним и так попадают впритык. */
@media (max-height: 620px) {
  .kb { --kb-h: clamp(30px, 8.6vw, 38px); padding: 3px 2px; }
  .kb-f { gap: 3px; }
  .kb-f-lab { display: none; }
  .kb-f-box { min-height: 40px; padding: 6px 10px; }
  .km-grid { gap: 4px; padding: 4px; }
  .km-letters { min-height: 58px; }
  .hu { gap: 5px; }
}
/* Очень узкий телефон: на 320 px двенадцать клавиш ЙЦУКЕН дают колпачок 24 px.
   Убираем внутренние поля клавиши почти в ноль — зазор между колпачками
   исчезает, зато буква остаётся читаемой. Область нажатия при этом не
   страдает: она и была равна всей клавише. */
@media (max-width: 340px) {
  .kb { padding: 3px 1px; }
  .kb-k { padding: 2px 1px; }
  .kb-cap { border-radius: 5px; }
}

/* Спокойное движение: гасим всё, что дышит и мигает. Подсветка остаётся, но
   становится неподвижной — иначе ребёнок, которому анимация мешает, теряет
   подсказку вместе с ней. Курсор замирает видимым, а не исчезает. */
@media (prefers-reduced-motion: reduce) {
  .kb-cap, .km-p { transition: none !important; }
  .kb-k.is-lit .kb-cap { animation: none !important;
    box-shadow: inset 0 0 0 2.5px ${T.ui} !important; }
  .kb-cr { animation: none !important; opacity: 1 !important; }
  .hu-bead { transition: none !important; }
}
`;

const KEYBOARD_CSS = KEYBOARD_CSS_1 + KEYBOARD_CSS_2 + KEYBOARD_CSS_3
  + KEYBOARD_CSS_4 + KEYBOARD_CSS_5 + KEYBOARD_CSS_6;

// Своё в уроке — переписка на крючке, три места в сообщении и вспышка.
// Клавиатуру, поле и вспышку-механику рисуют движок и канон.
const LESSON_CSS = CANON_SCREEN_CSS + KEYBOARD_CSS + `
/* ══════════════════════════════════════════════════════════════
   ПЕРЕПИСКА
   Своё сообщение справа, чужое слева — как в любом мессенджере. Ответ друга
   состоит из одного знака, и этого хватает: объяснять, что он не понял, не
   нужно.
   ══════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   ПЕРЕПИСКА КАК В TELEGRAM (заказчик, 28.09.2026)
   Окно чата: шапка (стрелка назад, аватарка-буква, имя и «onlayn»),
   зелёный фон в мелкий горошек, свои пузыри справа светло-зелёные со
   временем и двумя галочками, чужие слева белые, поле ввода и синяя
   круглая кнопка-самолётик. Цвета — телеграмные, а не токены урока:
   ребёнок должен узнать мессенджер с первого взгляда.
   ══════════════════════════════════════════════════════════════ */
.k7-tg { display: flex; flex-direction: column; width: 100%; max-width: 400px; align-self: center;
  border-radius: 18px; overflow: hidden; background: #FFFFFF;
  box-shadow: 0 12px 30px -16px rgba(${T.shadowBase},0.55), 0 0 0 1px rgba(${T.shadowBase},0.08); }
.k7-tg-top { display: flex; align-items: center; gap: 10px; padding: 8px 12px;
  background: #FFFFFF; border-bottom: 1px solid rgba(0,0,0,.06); }
.k7-tg-back { flex: 0 0 auto; color: #3390EC; }
.k7-tg-av { flex: 0 0 auto; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, #FFB35C, #F0804A); color: #FFFFFF; font-size: 17px; font-weight: 800; }
.k7-tg-who { display: flex; flex-direction: column; min-width: 0; line-height: 1.2; text-align: left; }
.k7-tg-who b { font-size: 16px; font-weight: 800; color: ${T.ink}; }
.k7-tg-who i { font-style: normal; font-size: 13px; color: #3390EC; }
.k7-tg-body { display: flex; flex-direction: column; justify-content: flex-end; gap: 6px;
  min-height: clamp(130px, 26dvh, 230px); padding: 12px 10px;
  background-color: #C9DDB6;
  background-image: radial-gradient(rgba(255,255,255,.38) 1.4px, transparent 1.6px),
    linear-gradient(160deg, #D6E9C3, #B2D0A1);
  background-size: 18px 18px, 100% 100%; }
.k7-tg-msg { position: relative; display: inline-flex; align-items: flex-end; gap: 8px; max-width: 84%;
  padding: 7px 10px 6px 12px; border: 0; border-radius: 16px; font: inherit;
  font-size: clamp(15px, 2.2vw, 17px); line-height: 1.3; text-align: left; color: ${T.ink};
  box-shadow: 0 1px 1px rgba(0,0,0,.13); animation: k7TgIn .3s cubic-bezier(.2,.8,.3,1.2) both; }
button.k7-tg-msg { cursor: pointer; }
button.k7-tg-msg:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 2px; }
.k7-tg-msg.is-me { align-self: flex-end; background: #EFFDDE; border-bottom-right-radius: 4px; }
.k7-tg-msg.is-him { align-self: flex-start; background: #FFFFFF; border-bottom-left-radius: 4px; }
.k7-tg-msg.is-big .k7-tg-t { font-size: 22px; font-weight: 800; line-height: 1; }
.k7-tg-meta { display: inline-flex; align-items: center; gap: 2px; flex: 0 0 auto; white-space: nowrap;
  font-size: 11px; color: #9AA3AB; }
.k7-tg-msg.is-me .k7-tg-meta { color: #4FAE4E; }
.k7-tg-dots { gap: 4px; padding: 12px 14px; }
.k7-tg-dots i { width: 7px; height: 7px; border-radius: 50%; background: #9AA3AB;
  animation: k7TgDot 1s ease-in-out infinite; }
.k7-tg-dots i:nth-child(2) { animation-delay: .15s; }
.k7-tg-dots i:nth-child(3) { animation-delay: .3s; }
.k7-tg-bar { display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  background: #FFFFFF; border-top: 1px solid rgba(0,0,0,.06); }
.k7-tg-field { flex: 1 1 auto; min-width: 0; padding: 11px 14px; border-radius: 22px; background: #F1F3F5;
  font-size: clamp(15px, 2.2vw, 17px); color: ${T.ink}; text-align: left;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.k7-tg-field.is-empty { color: #9AA3AB; }
.k7-tg-send { flex: 0 0 auto; display: grid; place-items: center; width: 46px; height: 46px; border: 0;
  border-radius: 50%; background: #3390EC; color: #FFFFFF; cursor: pointer; }
.k7-tg-send:disabled { background: #C9D6E3; cursor: default; }
.k7-tg-send:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.k7-tg-send.is-live { animation: k7TgCall 1.6s ease-in-out infinite; }
.stage.is-speaking .stage-content .k7-tg button { opacity: 1; filter: none; }
.k7-tg.is-compact .k7-tg-body { min-height: 0; }
@keyframes k7TgIn { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
@keyframes k7TgDot { 0%, 100% { opacity: .35; transform: none; } 50% { opacity: 1; transform: translateY(-3px); } }
@keyframes k7TgCall { 0%, 100% { box-shadow: 0 0 0 0 rgba(51,144,236,.35); } 50% { box-shadow: 0 0 0 9px rgba(51,144,236,0); } }
@media (orientation: landscape) and (max-height: 500px) {
  .k7-tg-body { min-height: clamp(90px, 30dvh, 150px); }
  .k7-tg-top { padding-block: 5px; }
}
@media (prefers-reduced-motion: reduce) {
  .k7-tg-msg, .k7-tg-dots i, .k7-tg-send.is-live { animation: none; }
}

/* ══════════════════════════════════════════════════════════════
   ТРИ МЕСТА В СООБЩЕНИИ
   Третье слово целое намеренно: не всё, что выглядит непривычно, испорчено.
   Поэтому у открытого слова нет пометки «верно/неверно» — разбор говорит голос.
   Заказчик, 27.09.2026: слова — карточки показа (.tour), Луми открывает их
   сам по одному; ни галочек, ни счётчика. Три коротких слова стоят одним
   рядом на любом экране (как было): столбиком по строке на слово они
   выглядели бы пустыми полосами.
   ══════════════════════════════════════════════════════════════ */
.tour-n3:has(.k7-spot-w) { grid-template-columns: repeat(3, minmax(0, 1fr)); max-width: 460px; }
.tour-n3 .tour-face:has(.k7-spot-w) { flex-direction: column; justify-content: center; text-align: center;
  min-height: clamp(64px, 13dvh, 110px); padding: 8px 6px; }
.k7-spot-w { font-size: clamp(15px, 2.4vw, 20px); font-weight: 800; color: ${T.ink};
  font-family: 'JetBrains Mono', ui-monospace, monospace; overflow-wrap: anywhere; }
@media (orientation: landscape) and (max-height: 500px) {
  .tour-n3 .tour-face:has(.k7-spot-w) { min-height: clamp(52px, 17dvh, 74px); }
}

/* Слово во вспышке: моноширинно и настолько крупно, насколько остаётся места.
   На этом экране под ним стоят ещё поле и клавиатура — три блока подряд, и
   слово уступает им первым: разглядеть его надо, а вчитываться не во что. */
.k7-flash { display: block; text-align: center; padding: 6px 10px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: clamp(18px, 4vw, 30px); font-weight: 700; color: ${T.ink}; letter-spacing: .04em; }
.stack > .glance { flex: 0 1 auto; min-height: 0; }
.glance-box { min-height: 0; }
@media (max-height: 900px) {
  .k7-flash { padding: 2px 8px; font-size: clamp(17px, 3.4vw, 26px); }
  .glance-btn { min-height: 44px; padding-block: 5px; }
}

/* РЯД ОТВЕТОВ ИТОГА — ЧЁТНЫЙ (UX-14). Вариантов четыре, сетка 2×2, как
   .k5-rf в уроке 5; карточки ниже канонных, чтобы сообщение, вопрос и оба
   ряда стояли над нижней панелью. Каркас не трогаем. */
.k7-rf { display: flex; flex-direction: column; align-items: center; width: 100%; }
.k7-rf .rf { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 420px; }
.k7-rf .rf-o { min-height: 64px; padding-block: clamp(8px, 1.2dvh, 11px); gap: 5px; }


/* Итог (s13) на телефоне лёжа: карточки 2×2 — значок слева от подписи,
   иначе сетка на 740×360 уходила под нижний край (+10 px). */
@media (orientation: landscape) and (max-height: 500px) {
  .k7-rf .rf-o { min-height: 48px; flex-direction: row; justify-content: center; gap: 8px; padding-block: 4px; }
}

/* МИССИЯ (s2) НА ТЕЛЕФОНЕ ЛЁЖА 740×360: три шага стоят столбиком, и
   нижний уходил под край (+15 px). Шаги ниже — 46 px, это всё ещё цель для
   пальца. (Та же прокрутка есть в уроках 1–5: блок каркаса общий.) */
@media (orientation: landscape) and (max-height: 400px) {
  .steps .step { min-height: 46px; padding-block: 4px; }
}

/* ══════════════════════════════════════════════════════════════
   АДАПТИВНОСТЬ (заказчик, 28.09.2026: «уроки не подстраиваются под
   гаджеты»). Замер — аудит стенда на 28 экранах, печатный пузырь включён.
   ══════════════════════════════════════════════════════════════ */
/* КЛАВИАТУРА НА НОУТБУКЕ И ПЛАНШЕТЕ ЛЁЖА. Высоту клавиши движок страхует
   5dvh — на 1366×657 и 1280×720 это 33–36 px, и клавиатура стояла мелкой
   полоской посреди пустого экрана (под ней оставалось 150–200 px). Там, где
   места хватает, клавиша до 50 px, на большом мониторе клавиатура и поле
   шире. На телефоне стоя ничего не меняется: там клавишу держит ширина
   (десять клавиш в ряд), а высоту — правило движка «не больше 40% сцены». */
@media (min-width: 700px) and (min-height: 600px) {
  .kb { --kb-h: clamp(36px, min(9.2vw, 6.2dvh), 50px); }
  /* Вспышка (s7): над полем ещё окошко со словом — клавиша чуть ниже,
     иначе 1024×768 уходил в прокрутку на 4 px. */
  .stack:has(> .glance) > .kb { --kb-h: clamp(34px, min(9.2vw, 5.4dvh), 48px); }
}
/* Телефон лёжа (s10): «salom, ishlar » и бледное «qanday» крупным кеглем
   не влезали в строку, поле росло во вторую, клавиатура уходила под край
   (667×375 +12 px). Кегль поля от высоты окна. */
@media (orientation: landscape) and (max-height: 500px) {
  .kb-f.is-big .kb-f-box { font-size: clamp(20px, 6dvh, 28px); }
}
@media (min-width: 1400px) and (min-height: 860px) {
  .kb { --kb-h: clamp(48px, 5.4dvh, 58px); max-width: 620px; }
  .kb-f { max-width: 620px; }
}

/* Проверка «да / нет» (s12) на 280 px: длинное утверждение резалось
   многоточием — переносится на вторую строку (как в уроке 11). */
.yn-card .fit-line { white-space: normal; text-overflow: clip; }

/* Итог (s13) на iPhone лёжа 844×390 не влезал на 6 px: карточки 44 px. */
@media (orientation: landscape) and (max-height: 500px) {
  .k7-rf .rf { gap: 6px; }
  .k7-rf .rf-o { min-height: 44px; padding-block: 2px; }
}

`;
