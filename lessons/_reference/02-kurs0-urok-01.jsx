// ===========================================================================
// Урок 1. Знакомимся с компьютером
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
// Героя зовут Луми (заказчик, 2026-09-24): он представляется на экране
// знакомства в уроке 1. На экране имя не подписывается — только звучит.
const BOT_NAME = { uz: 'Lumi', ru: 'Луми', en: 'Lumi' };

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
// УРОК 1 · «Знакомимся с компьютером» · модуль 1 «Первые шаги»
//
// Собирается: ./tools/sobrat.sh 01
//
// ПО КАРТЕ МЕХАНИК: крючок — НАХОДКА, изюминка — ГНЁЗДА.
//
// Компьютер привезли разобранным: коробка на полу, детали рядом, и робот не
// знает, что куда. Ребёнок собирает рабочее место деталь за деталью.
//
// ПОЧЕМУ ГНЁЗДА, А НЕ РАССКАЗ. Назвать части можно и списком, но тогда урок
// проверяет память. Гнездо проверяет понимание: монитор не встанет под стол,
// а системный блок не встанет на подставку для экрана — и ребёнок замечает
// это раньше, чем услышит объяснение.
//
// ЛИШНЯЯ ВЕЩЬ В КОРОБКЕ — не подвох, а предмет разговора. Чайник в неё попал
// случайно, и робот честно спрашивает, куда его. Ответ «никуда» — это тоже
// знание о компьютере.
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
  lessonId: 'k0-01-parts',
  module: 'kurs0-block1-start',
  lessonTitle: {
    uz: '1-dars. Kompyuter bilan tanishuv',
    ru: 'Урок 1. Знакомимся с компьютером',
    en: 'Lesson 1. Meet the computer'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });

// Четыре части и одна лишняя вещь. Больше в первый урок не берём: колонки,
// принтер и наушники основными частями не являются и только размывают набор.
const PARTS = {
  screen: { icon: 'screen', text: L3('Ekran', 'Экран', 'Screen') },
  pc: { icon: 'pc', text: L3('Tizim bloki', 'Системный блок', 'Computer box') },
  keyboard: { icon: 'keyboard', text: L3('Klaviatura', 'Клавиатура', 'Keyboard') },
  mouse: { icon: 'mouse', text: L3('Sichqoncha', 'Мышь', 'Mouse') },
  cup: { icon: 'cup', text: L3('Choynak', 'Чайник', 'Kettle') }
};

const C = {
  s1: {
    eyebrow: L3('Topilma', 'Находка', 'A find'),
    say1: L3('Kompyuterni olib kelishdi. Lekin qutida — alohida qismlar. Pastdagi katta qutini bosing.',
      'Компьютер привезли. Только в коробке он по частям. Нажми на большую коробку внизу.',
      'The computer arrived. But it is in pieces in the box. Tap the big box below.'),
    say2: L3('Men qaysi qism qayerga turishini bilmayman. Yordam bering.',
      'Я не знаю, какая часть где стоит. Помоги мне.',
      'I do not know where each part goes. Help me out.'),
    ask: L3('Qutini bosing', 'Нажми на коробку', 'Tap the box'),
    btn: L3('Yordam beraman!', 'Помогу!', 'I will help!')
  },
  // s2 и бывший s3 «Nega kerak» — один экран (заказчик, 28.09.2026: две
  // страницы подряд показывали те же четыре карточки). Про каждую часть Луми
  // говорит сразу обе мысли: где она стоит и что без неё не получится.
  s2: {
    eyebrow: L3('Missiya', 'Миссия', 'Mission'),
    say: L3('Ish joyini yaratamiz. To‘rtta qism bor: har birining o‘z joyi va o‘z vazifasi bor. Ularni birma-bir ko‘rsataman.',
      'Соберём рабочее место. Частей четыре: у каждой своё место и своя задача. Покажу их по очереди.',
      'Let us set up the desk. There are four parts, and each has its own place and its own job. I will show them one by one.'),
    cards: [
      { id: 'screen', text: PARTS.screen.text,
        say: L3('Ekran qarshingizda turadi — unga qaraymiz. U ko‘rsatadi: usiz kompyuter ishlaydi, lekin biz hech nima ko‘rmaymiz.',
          'Экран стоит перед тобой — на него мы смотрим. Он показывает: без него компьютер работает, а мы ничего не видим.',
          'The screen stands in front of you — we look at it. It shows things: without it the computer works, but we see nothing.') },
      { id: 'pc', text: PARTS.pc.text,
        say: L3('Tizim bloki — kompyuterning o‘zi, u o‘ylaydi. Usiz ekran, klaviatura va sichqoncha ishlamaydi.',
          'Системный блок — сам компьютер, он думает. Без него экран, клавиатура и мышь не работают.',
          'The computer box is the computer itself: it thinks. Without it the screen, keyboard and mouse do not work.') },
      { id: 'keyboard', text: PARTS.keyboard.text,
        say: L3('Klaviatura bilan yozamiz: harflar, sonlar, belgilar. Usiz hech nimani yozib bo‘lmaydi.',
          'Клавиатурой мы пишем: буквы, цифры, знаки. Без неё ничего не напишешь.',
          'We type with the keyboard: letters, numbers, symbols. Without it you cannot type anything.') },
      { id: 'mouse', text: PARTS.mouse.text,
        say: L3('Sichqoncha kaft ostiga tushadi. U ko‘rsatadi va tanlaydi: usiz kerakli joyni tanlash qiyin.',
          'Мышь ложится под ладонь. Она показывает и выбирает: без неё трудно выбрать нужное место.',
          'The mouse fits under your palm. It points and picks: without it, picking a spot is hard.') }
    ],
    done: L3('To‘rttalasi ham kerak, har biri o‘z ishida. Boshladik.',
      'Нужны все четыре, и каждая по-своему. Начинаем.',
      'All four are needed, each for its own job. Off we go.')
  },
  // ОДНА СБОРКА ВМЕСТО ЧЕТЫРЁХ (заказчик, 28.09.2026: «hamma qismi bitta
  // sahifada chiqsin, bola o‘zi joyini topib qo‘ysin. Qayerga qo‘yish
  // kerakligini aytishi shart emas»). Раньше стол собирали по частям на
  // экранах 5, 6, 8 и 11, и голос каждый раз называл место. Теперь все четыре
  // части в коробке сразу; куда ставить, голос не говорит — место ребёнок
  // находит сам по рисунку стола. Почему часть стоит именно там, Луми говорит
  // уже ПОСЛЕ того, как её поставили.
  s5: {
    eyebrow: L3('Ish joyi', 'Рабочее место', 'The desk'),
    say: L3('Mana, quti ochiq. Ichida to‘rtta qism. Har birini stolda o‘z joyiga qo‘ying: qutidagi qismni bosing, keyin stoldagi joyni bosing.',
      'Коробка открыта, в ней четыре части. Поставь каждую на её место: нажми на часть в коробке, потом на место на столе.',
      'The box is open, and there are four parts inside. Put each one in its place: tap a part in the box, then a spot on the desk.'),
    items: [
      { id: 'screen', zone: 'z-screen' },
      { id: 'pc', zone: 'z-pc' },
      { id: 'keyboard', zone: 'z-key' },
      { id: 'mouse', zone: 'z-mouse' }
    ],
    zones: [
      { id: 'z-screen',
        why: L3('Ekran o‘z joyida — ko‘z qarshisida. Agar pastda tursa, bo‘yin og‘riydi.',
          'Экран на месте — напротив глаз. Ниже — и шея заболит.',
          'The screen is in place, facing your eyes. Lower down and your neck starts to ache.') },
      { id: 'z-key',
        why: L3('Klaviatura ekran ostida, uning yonida turadi. Shunda yozish qulay.',
          'Клавиатура стоит под экраном, рядом с ним. Так писать удобно.',
          'The keyboard sits below the screen, right next to it. That way typing is easy.') },
      { id: 'z-mouse',
        why: L3('Sichqoncha klaviaturaning yonida turadi. Shunda qo‘lingiz unga oson yetadi.',
          'Мышь лежит рядом с клавиатурой. Так рука легко до неё достаёт.',
          'The mouse sits next to the keyboard. That way your hand reaches it easily.') },
      { id: 'z-pc',
        why: L3('Tizim bloki katta va og‘ir. U stol ostida turadi, shunda stol ustida joy ko‘p bo‘ladi.',
          'Системный блок большой и тяжёлый. Он стоит под столом — так на столе больше места.',
          'The box is big and heavy. It stands under the desk, so there is more room on top.') }
    ],
    done: L3('To‘rttala qism joyida. Ish joyi tayyor!',
      'Все четыре части на месте. Рабочее место готово!',
      'All four parts are in place. The desk is ready!')
  },
  s7: {
    eyebrow: L3('Tekshiramiz', 'Проверим', 'Check'),
    ask: L3('Qaysi qism o‘ylaydi?', 'Какая часть думает?', 'Which part does the thinking?'),
    say: L3('Bitta savol. Qaysi qism ichida hamma ish bo‘ladi? To‘rtta kartochkadan bittasini bosing.',
      'Один вопрос. Внутри какой части идёт вся работа? Нажми на одну из четырёх карточек.',
      'One question. Inside which part does all the work happen? Tap one of the four cards.'),
    // Лесенка сужает выбор: 1 — где стоит, 2 — отсекает экран и клавиатуру
    // (на прежней ступени «кнопка, но нет букв» подходил и экран), 3 — ответ.
    hints: [
      L3('U stol ostida turadi va katta.', 'Он стоит под столом и большой.', 'It stands under the desk and it is big.'),
      L3('Unda harflar yo‘q va u hech nima ko‘rsatmaydi: bu klaviatura ham, ekran ham emas.',
        'На нём нет букв, и он ничего не показывает: это не клавиатура и не экран.',
        'It has no letters and shows nothing: it is not the keyboard or the screen.'),
      L3('Bu tizim bloki.', 'Это системный блок.', 'It is the computer box.')
    ],
    why: L3('Tizim bloki — kompyuterning o‘zi. Ekran faqat ko‘rsatadi.',
      'Системный блок — сам компьютер. Экран только показывает.',
      'The computer box is the computer. The screen only shows.')
  },
  s9: {
    eyebrow: L3('3-daraja', 'Уровень 3', 'Level 3'),
    say: L3('Hamma qism stolda. Lekin qutida yana bir narsa qoldi — choynak. Uni bosing: u kompyuterga kerakmi?',
      'Все части на столе. Но в коробке осталось ещё кое-что — чайник. Нажми на него: он нужен компьютеру?',
      'All the parts are on the desk. But something is still in the box: a kettle. Tap it. Does the computer need it?'),
    pre: ['z-screen', 'z-key', 'z-mouse', 'z-pc'],
    items: [
      { id: 'cup', zone: null,
        why: L3('Choynakning kompyuterga aloqasi yo‘q. Uni oshxonaga olib qo‘yamiz.',
          'Чайник к компьютеру отношения не имеет. Отнесём его на кухню.',
          'A kettle has nothing to do with a computer. Off to the kitchen with it.') }
    ],
    zones: [],
    done: L3('To‘rttala qism joyida. Choynak — oshxonaga.',
      'Все четыре части на месте. Чайник — на кухню.',
      'All four parts in place. The kettle goes to the kitchen.')
  },
  s10: {
    eyebrow: L3('4-daraja', 'Уровень 4', 'Level 4'),
    ask: L3('Nima kompyuterga kerak, nima yo‘q', 'Что компьютеру нужно, а что нет', 'What the computer needs and what it does not'),
    say: L3('Stoldagi hamma narsa ham kompyuterning qismi emas. Ajratamiz. Kartochkani bosing, keyin ikkita qutidan birini bosing.',
      'Не всё на столе — части компьютера. Разберём. Нажми на карточку, потом на одну из двух коробок.',
      'Not everything on the desk is part of the computer. Let us sort. Tap a card, then one of the two boxes.'),
    labels: {
      pick: L3('Kartochkani tanlang', 'Выбери карточку', 'Pick a card'),
      toBin: L3('Endi qutini bosing', 'Теперь нажми коробку', 'Now tap a box'),
      all: L3('Hammasi joyida', 'Всё разложено', 'All sorted')
    },
    items: [
      // hint звучит после неверной корзины: не ответ, а вопрос, который его сужает.
      { id: 'i1', icon: 'screen', text: PARTS.screen.text, bin: 'need',
        hint: L3('Ekransiz biz hech nima ko‘rmaymiz. Bu kompyuterning qismimi?',
          'Без экрана мы ничего не увидим. Это часть компьютера?',
          'Without the screen we see nothing. Is it part of the computer?') },
      { id: 'i2', icon: 'mouse', text: PARTS.mouse.text, bin: 'need',
        hint: L3('Ekrandagi joyni nima bilan tanlaymiz? Eslang.',
          'Чем мы выбираем место на экране? Вспомни.',
          'What do we use to pick a spot on the screen? Think back.') },
      { id: 'i3', icon: 'cup', text: PARTS.cup.text, bin: 'no',
        hint: L3('Choynak suv qaynatadi. Kompyuterga bu kerakmi?',
          'Чайник кипятит воду. Компьютеру это нужно?',
          'A kettle boils water. Does the computer need that?') },
      { id: 'i4', icon: 'book', text: L3('Kitob', 'Книга', 'A book'), bin: 'no',
        hint: L3('Kitobni kompyutersiz ham o‘qiymiz.',
          'Книгу читают и без компьютера.',
          'We read a book without any computer.') }
    ],
    bins: [
      { id: 'need', icon: 'pc', text: L3('Kompyuterga kerak', 'Нужно компьютеру', 'The computer needs it'),
        why: L3('Busiz kompyuter ishlamaydi yoki biz uni boshqara olmaymiz.',
          'Без этого компьютер не работает или им не управлять.',
          'Without this the computer will not work or cannot be controlled.') },
      { id: 'no', icon: 'cup', text: L3('Kompyuterga kerak emas', 'Компьютеру не нужно', 'Not for the computer'),
        why: L3('Yaxshi narsa, lekin kompyuterga aloqasi yo‘q.',
          'Вещь хорошая, но к компьютеру отношения не имеет.',
          'A fine thing, but it has nothing to do with the computer.') }
    ],
    done: L3('Endi kompyuterga nima kerakligi aniq.',
      'Теперь ясно, что нужно компьютеру.',
      'Now it is clear what the computer needs.')
  },
  s12: {
    eyebrow: L3('Tekshiramiz', 'Проверим', 'Check'),
    ask: L3('Ha yoki yo‘q', 'Да или нет', 'Yes or no'),
    say: L3('To‘rtta gap bor, men har birini o‘qib beraman. Rost bo‘lsa — chapdagi yashil tugmani bosing. Rost bo‘lmasa — o‘ngdagi kulrang tugmani bosing.',
      'Четыре утверждения, я прочитаю каждое. Если это правда — нажми зелёную кнопку слева. Если нет — серую кнопку справа.',
      'Four statements, and I will read each one. If it is true, tap the green button on the left. If not, tap the grey button on the right.'),
    yes: L3('Ha', 'Да', 'Yes'),
    no: L3('Yo‘q', 'Нет', 'No'),
    all: L3('Hammasiga javob berildi', 'На все ответы даны', 'All answered'),
    items: [
      { id: 'a', text: L3('Ekran kompyuterning o‘zi', 'Экран — это сам компьютер', 'The screen is the computer itself'),
        yes: false,
        hint: L3('Eslang: qaysi qism o‘ylaydi, qaysi biri faqat ko‘rsatadi?',
          'Вспомни: какая часть думает, а какая только показывает?',
          'Think back: which part thinks, and which one only shows?'),
        why: L3('Ekran faqat ko‘rsatadi. Kompyuterning o‘zi — tizim bloki.',
          'Экран только показывает. Сам компьютер — системный блок.',
          'The screen only shows. The computer itself is the box.') },
      { id: 'b', text: L3('Sichqoncha qo‘l yonida yotadi', 'Мышь лежит рядом с рукой', 'The mouse lies beside your hand'),
        yes: true,
        hint: L3('Stolda sichqonchani qayerga qo‘ydik? Eslang.',
          'Куда мы клали мышь на столе? Вспомни.',
          'Where did we put the mouse on the desk? Think back.'),
        why: L3('Shunda unga yetish oson.', 'Так до неё легко дотянуться.', 'That way it is easy to reach.') },
      { id: 'c', text: L3('Choynak kompyuterga kerak', 'Чайник нужен компьютеру', 'The computer needs a kettle'),
        yes: false,
        hint: L3('Choynakni qaysi qutiga qo‘ygan edik?',
          'В какую коробку мы положили чайник?',
          'Which box did we put the kettle in?'),
        why: L3('Choynakning kompyuterga aloqasi yo‘q.', 'Чайник к компьютеру отношения не имеет.', 'A kettle has nothing to do with a computer.') },
      { id: 'd', text: L3('Klaviatura harflar uchun', 'Клавиатура — для букв', 'The keyboard is for letters'),
        yes: true,
        hint: L3('Klaviatura bilan nima qilamiz? Eslang.',
          'Что мы делаем клавиатурой? Вспомни.',
          'What do we do with the keyboard? Think back.'),
        why: L3('Harflar, raqamlar va belgilar — hammasi unda.',
          'Буквы, цифры и знаки — всё на ней.',
          'Letters, numbers and symbols are all on it.') }
    ],
    done: L3('To‘rttasiga ham to‘g‘ri javob.', 'На все четыре — верно.', 'All four answered right.')
  },
  s13: {
    eyebrow: L3('Sizning joyingiz', 'Твоё место', 'Your desk'),
    ask: L3('Stolga nima qo‘yamiz?', 'Что поставим на стол?', 'What shall we add to the desk?'),
    say: L3('Ish joyi yig‘ildi. Endi uni o‘zingizniki qiling. Pastdagi to‘rtta narsadan bittasini bosing.',
      'Рабочее место собрано. Теперь сделай его своим. Нажми на одну из четырёх вещей внизу.',
      'The desk is set up. Now make it yours. Tap one of the four things below.'),
    // Четыре равноправных варианта — сетка 2×2. Цветок и часы рисуются своим
    // значком урока (P1PickIc): звезда вместо цветка не узнавалась.
    picks: [
      { id: 'plant', icon: 'plant', text: L3('Gul', 'Цветок', 'A flower') },
      { id: 'lamp', icon: 'bulb', text: L3('Chiroq', 'Лампа', 'A lamp') },
      { id: 'book', icon: 'book', text: L3('Kitob', 'Книга', 'A book') },
      { id: 'clock', icon: 'clock', text: L3('Soat', 'Часы', 'A clock') }
    ],
    done: L3('Mana bu — sizning ish joyingiz.',
      'Вот оно — твоё рабочее место.',
      'There it is — your own desk.'),
    btn: L3('Men yig‘dim!', 'У меня получилось!', 'I did it!')
  },
  s14: {
    eyebrow: L3('Tayyor', 'Готово', 'Done'),
    title: L3('Ish joyi yig‘ildi', 'Рабочее место собрано', 'The desk is set up'),
    say: L3('Endi siz to‘rttala qismni ham bilasiz va ularning joyini ham.',
      'Теперь ты знаешь все четыре части и их места.',
      'Now you know all four parts and where they go.'),
    skills: [
      L3('To‘rtta qism nomlandi', 'Четыре части названы', 'Four parts named'),
      L3('Har biri o‘z joyida', 'Каждая на своём месте', 'Each in its place'),
      L3('Ortiqcha narsa topildi', 'Лишняя вещь найдена', 'The extra thing found'),
      L3('Ish joyi tayyor', 'Рабочее место готово', 'The desk is ready')
    ],
    btn: L3('Oxirigacha', 'В конец', 'To the end')
  },
  s15: {
    eyebrow: L3('Ko‘rishguncha', 'До встречи', 'See you'),
    // Какую кнопку нажать, голос больше не говорит: этому учит тур в начале урока.
    say: L3('Keyingi darsda bu joyga o‘zimiz o‘tiramiz.',
      'На следующем уроке мы сами сядем за это место.',
      'Next lesson we will sit down at this desk ourselves.'),
    btn: L3('Darsni yakunlash', 'Завершить урок', 'Finish the lesson')
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//                        Р И С У Н К И   У Р О К А   1
// ═════════════════════════════════════════════════════════════════════════════

// КОРОБКА, В КОТОРОЙ ПРИВЕЗЛИ. Закрытая — просто коробка; открытая — клапаны
// раскрыты, и из неё по очереди выходят НАСТОЯЩИЕ части компьютера (заказчик,
// 2026-09-24: вместо пустых цветных рамок). Рисунок частей тот же, что потом
// на столе (P1Part): тёмный монитор с голубым экраном, светлый системный блок
// с зелёной кнопкой, клавиатура с рядами клавиш, мышь с проводом. Нижняя часть
// каждой вещи спрятана за передней стенкой — они именно ВНУТРИ коробки.
const P1Box = ({ open }) => (
  <svg className={'p1-box' + (open ? ' is-open' : '')} viewBox="0 0 200 140" aria-hidden="true">
    {open ? (
      <>
        {/* раскрытые клапаны и тёмное нутро за частями */}
        <path d="M28 62L34 52 12 37 4 50z" fill="#C8BAA2" stroke={T.uiEdge} strokeWidth="3" strokeLinejoin="round" />
        <path d="M172 62L166 52 188 37 196 50z" fill="#C8BAA2" stroke={T.uiEdge} strokeWidth="3" strokeLinejoin="round" />
        <path d="M28 62L34 52h132l6 10z" fill="#A8977A" stroke={T.uiEdge} strokeWidth="3" strokeLinejoin="round" />
        <g className="p1-box-in">
          {/* монитор: рамка, экран с полосками текста, ножка уходит в коробку */}
          <g transform="rotate(-7 76 40)">
            <rect x="72" y="46" width="8" height="22" fill={T.ink2} />
            <rect x="44" y="8" width="64" height="44" rx="5" fill={T.ink} />
            <rect x="49" y="13" width="54" height="34" rx="3" fill={T.blueSoft} />
            <rect x="54" y="18" width="22" height="5" rx="2.5" fill={T.accent} />
            <rect x="54" y="27" width="40" height="3.5" rx="1.75" fill={T.blue} />
            <rect x="54" y="34" width="30" height="3.5" rx="1.75" fill={T.blue} />
          </g>
          {/* системный блок: высокая коробка-башня, щели и кнопка питания */}
          <g transform="rotate(6 132 44)">
            <rect x="118" y="12" width="30" height="62" rx="4" fill={T.paper} stroke={T.ink2} strokeWidth="2.6" />
            {/* кнопка питания выше клавиатуры — иначе её закрывает край */}
            <rect x="124" y="17" width="18" height="3.4" rx="1.7" fill={T.ink3} />
            <rect x="124" y="23" width="18" height="3.4" rx="1.7" fill={T.ink3} />
            <circle cx="133" cy="34" r="4.6" fill={T.success} />
            <path d="M133 31.4v2.8" stroke={T.paper} strokeWidth="1.6" strokeLinecap="round" />
          </g>
          {/* клавиатура: стоит наискосок перед монитором, видны два ряда клавиш */}
          <g transform="rotate(-10 96 58)">
            <rect x="52" y="44" width="84" height="22" rx="3" fill={T.paper} stroke={T.ink2} strokeWidth="2.4" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
              <rect key={'a' + k} x={56 + k * 7.8} y="48" width="5.8" height="4.4" rx="1.2" fill={T.ink2} />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
              <rect key={'b' + k} x={59.9 + k * 7.8} y="54.5" width="5.8" height="4.4" rx="1.2" fill={T.ink2} />
            ))}
          </g>
          {/* мышь: выглядывает с правого края, провод свисает через стенку */}
          <g>
            <path d="M160 50C166 50 170 56 168 64S160 76 164 88" stroke={T.ink2} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <rect x="146" y="42" width="17" height="22" rx="8.5" fill={T.paper} stroke={T.ink2} strokeWidth="2.4" />
            <path d="M154.5 43v7M147 50h15" stroke={T.ink2} strokeWidth="1.8" />
            <rect x="153.1" y="44.6" width="2.8" height="3.8" rx="1.4" fill={T.accent} />
          </g>
        </g>
        {/* передняя стенка поверх частей */}
        <rect x="28" y="62" width="144" height="66" rx="6" fill="#D9CDB8" stroke={T.uiEdge} strokeWidth="3" />
        <path d="M28 78h144" stroke={T.uiEdge} strokeWidth="3" />
      </>
    ) : (
      <>
        <rect x="28" y="52" width="144" height="76" rx="7" fill="#D9CDB8" stroke={T.uiEdge} strokeWidth="3" />
        <path d="M28 70h144" stroke={T.uiEdge} strokeWidth="3" />
        <path className="p1-lid" d="M22 52h156l-10-14H32z" fill="#C8BAA2" stroke={T.uiEdge} strokeWidth="3" strokeLinejoin="round" />
      </>
    )}
  </svg>
);

// СТОЛ С ЧЕТЫРЬМЯ МЕСТАМИ. Одна и та же картинка на показе, на вызове и в
// итоге — ребёнок собирает ровно то, что видел с самого начала.
//
// Пустое место — пунктирная рамка. Поставленная часть — НАСТОЯЩИЙ рисунок, а
// не зелёная рамка со значком (UI-24): монитор с экраном и подставкой,
// клавиатура с рядами клавиш и пробелом, мышь с кнопкой и проводом, корпус с
// щелями и кнопкой питания. Системный блок стоит на полу РЯДОМ со столом, а
// не на его ножке: стол укорочен, у блока своё место справа.
const P1_SLOTS = {
  'z-screen': { x: 48, y: 6, w: 84, h: 56 },
  'z-key': { x: 38, y: 76, w: 80, h: 21 },
  'z-mouse': { x: 124, y: 78, w: 20, h: 19 },
  'z-pc': { x: 160, y: 92, w: 34, h: 60 }
};

const P1Part = ({ z }) => {
  if (z === 'z-screen') return (
    <g className="p1-part">
      {/* ножка и подставка уходят за клавиатуру, до самой столешницы */}
      <rect x="85" y="58" width="10" height="36" fill={T.ink2} />
      <rect x="70" y="91" width="40" height="7" rx="3" fill={T.ink2} />
      <rect x="48" y="6" width="84" height="56" rx="6" fill={T.ink} />
      <rect x="53" y="11" width="74" height="44" rx="3" fill="#9BD6FF" />
      <circle cx="111" cy="21" r="5.5" fill="#FFD34D" />
      <path d="M53 44C64 35 76 35 88 42S112 37 127 40V55H53z" fill="#6CC46F" />
      <path d="M53 50C70 44 84 46 98 50S118 48 127 48V55H53z" fill="#3F9E4D" />
      <circle cx="90" cy="58.5" r="1.6" fill={T.ink3} />
    </g>
  );
  if (z === 'z-key') return (
    <g className="p1-part">
      <path d="M44 77h68l6 20H38z" fill={T.paper} stroke={T.ink2} strokeWidth="2.4" strokeLinejoin="round" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
        <rect key={'a' + k} x={49 + k * 7.6} y="80.5" width="5.6" height="4.2" rx="1.2" fill={T.ink2} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
        <rect key={'b' + k} x={45.6 + k * 7.6} y="86.5" width="5.6" height="4.2" rx="1.2" fill={T.ink2} />
      ))}
      <rect x="58" y="92.3" width="40" height="3.4" rx="1.5" fill={T.ink2} />
    </g>
  );
  if (z === 'z-mouse') return (
    <g className="p1-part">
      {/* провод идёт к системному блоку, а не висит в воздухе */}
      <path d="M134 80C134 72 147 71 150 80S152 101 161 104" stroke={T.ink2} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <rect x="126" y="79" width="16" height="18" rx="8" fill={T.paper} stroke={T.ink2} strokeWidth="2.4" />
      <path d="M134 80v6M127 86h14" stroke={T.ink2} strokeWidth="1.8" />
      <rect x="132.6" y="81.5" width="2.8" height="3.6" rx="1.4" fill={T.accent} />
    </g>
  );
  return (
    <g className="p1-part">
      <rect x="161" y="93" width="32" height="56" rx="4" fill={T.paper} stroke={T.ink2} strokeWidth="2.6" />
      <rect x="167" y="101" width="20" height="4" rx="2" fill={T.ink3} />
      <rect x="167" y="109" width="20" height="4" rx="2" fill={T.ink3} />
      <circle cx="177" cy="136" r="5" fill={T.success} />
      <path d="M177 133.2v3" stroke={T.paper} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="164" y="149" width="6" height="3" rx="1" fill={T.ink2} />
      <rect x="184" y="149" width="6" height="3" rx="1" fill={T.ink2} />
    </g>
  );
};

// Вещь «на свой вкус» на левом краю стола. Архетип + одна примета:
// цветок — горшок, стебель, лист и пять лепестков (не звезда, UI-23);
// лампа — основание, рычаг и абажур; часы — циферблат со стрелками на
// подставке; книги — две обложки со страницами.
const P1Extra = ({ id }) => {
  if (id === 'plant') return (
    <g className="p1-part">
      <path d="M26 88V70" stroke={T.success} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M26 82c-6 0-9-3-9-7 5 0 9 3 9 7z" fill={T.success} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={26 + 5 * Math.sin(a * Math.PI / 180)} cy={66 - 5 * Math.cos(a * Math.PI / 180)}
          r="4" fill={T.accent} />
      ))}
      <circle cx="26" cy="66" r="3.2" fill="#F0C24A" />
      <path d="M18 87h16l-2.4 11h-11.2z" fill="#C0703E" />
    </g>
  );
  if (id === 'clock') return (
    <g className="p1-part">
      <rect x="21" y="94" width="14" height="4" rx="1.5" fill={T.ink2} />
      <circle cx="28" cy="84" r="11" fill={T.paper} stroke={T.blue} strokeWidth="2.8" />
      <path d="M28 77v7l4.5 3" stroke={T.ink} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </g>
  );
  if (id === 'lamp') return (
    <g className="p1-part">
      <rect x="12" y="94" width="20" height="4" rx="2" fill={T.ink2} />
      <path d="M20 94L14 78 27 66" stroke={T.ink2} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="31" cy="75" r="3" fill="#FFF3C4" />
      <g transform="rotate(-40 29 68)">
        <path d="M24 62h10l5 10H19z" fill="#F0C24A" stroke={T.accentDk} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </g>
  );
  if (id === 'book') return (
    <g className="p1-part">
      <rect x="15" y="89" width="24" height="9" rx="1.6" fill={T.blue} />
      <rect x="17" y="91.6" width="21" height="3.8" fill={T.paper} />
      <rect x="17" y="81" width="20" height="8" rx="1.6" fill={T.accent} />
      <rect x="18.5" y="83.4" width="17.5" height="3.2" fill={T.paper} />
    </g>
  );
  return null;
};

// lit — гнёзда, которые светятся зелёным под поставленной частью. Нужно показу
// (экран 5): герой говорит «joy yashil bo‘ldi», и место обязано позеленеть,
// как гнездо на следующих экранах. Рамка шире гнезда на 4 единицы, иначе
// монитор закрыл бы её целиком.
const P1Desk = ({ put, extra, lit }) => (
  <div className="p1-desk">
    <svg viewBox="0 0 200 160" aria-hidden="true">
      <rect x="4" y="152" width="192" height="2.5" rx="1.2" fill={T.uiEdge} />
      <rect x="8" y="98" width="146" height="8" rx="3" fill="#C8AE86" />
      <rect x="16" y="106" width="8" height="46" rx="3" fill="#B79A72" />
      <rect x="138" y="106" width="8" height="46" rx="3" fill="#B79A72" />
      {Object.keys(P1_SLOTS).map((z) => {
        if (put[z]) return null;
        const s = P1_SLOTS[z];
        return (
          <rect key={z} x={s.x} y={s.y} width={s.w} height={s.h} rx="5" className="p1-slot"
            fill="rgba(255,255,255,.55)" stroke={T.ink3} strokeWidth="2.2" strokeDasharray="6 5" />
        );
      })}
      {lit ? Object.keys(P1_SLOTS).map((z) => {
        if (!put[z] || !lit[z]) return null;
        const s = P1_SLOTS[z];
        return (
          <rect key={'lit-' + z} x={s.x - 4} y={s.y - 4} width={s.w + 8} height={s.h + 8} rx="8"
            className="p1-lit" fill={T.successSoft} stroke={T.success} strokeWidth="2.6" />
        );
      }) : null}
      {/* порядок важен: монитор позади клавиатуры — его ножка уходит под клавиши */}
      {['z-screen', 'z-pc', 'z-key', 'z-mouse'].map((z) => (put[z] ? <P1Part key={z} z={z} /> : null))}
      {extra ? <P1Extra key={extra} id={extra} /> : null}
    </svg>
  </div>
);

// РИСУНКИ ЧАСТЕЙ НА КАРТОЧКАХ (заказчик, 27.09.2026: «kompyuter qismlarini
// rasmlarini yaxshila»). Раньше на карточках стояли линейные значки в 26 px —
// на телефоне экран и системный блок читались одинаковыми прямоугольниками.
// Теперь у каждой части цветной рисунок-архетип с одной приметой:
// · экран — тёмная рамка, на экране картинка (небо, солнце, холмы), ножка;
// · системный блок — башня в объёме: дисковод, решётка, зелёная кнопка;
// · клавиатура — три ряда клавиш, длинный пробел, оранжевый Enter, провод;
// · мышь — вид сверху: две кнопки, оранжевое колёсико, провод.
// Градиентов нет намеренно: id внутри SVG общий на странице, а карточек с
// одним рисунком на экране бывает несколько.
const P1Art = ({ id, className }) => {
  const cls = 'p1-art' + (className ? ' ' + className : '');
  if (id === 'screen') return (
    <svg className={cls} viewBox="0 0 120 90" aria-hidden="true">
      <ellipse cx="60" cy="84" rx="30" ry="3" fill="rgba(58,53,48,.12)" />
      <rect x="53" y="62" width="14" height="15" fill="#8C8C94" />
      <rect x="38" y="76" width="44" height="7" rx="3.5" fill="#6E6E76" />
      <rect x="8" y="5" width="104" height="62" rx="7" fill="#26262B" />
      <rect x="14" y="11" width="92" height="46" rx="3" fill="#9BD6FF" />
      <circle cx="87" cy="23" r="7" fill="#FFD34D" />
      <path d="M14 45C28 34 42 34 56 42S86 36 106 40V57H14z" fill="#6CC46F" />
      <path d="M14 52C34 44 52 46 70 52S96 50 106 49V57H14z" fill="#3F9E4D" />
      <path d="M30 22c3-3 8-3 10 0h-10zM44 27c2-2 6-2 8 0h-8z" fill="#FFFFFF" />
      <circle cx="60" cy="62" r="1.8" fill="#5CE07A" />
    </svg>
  );
  if (id === 'pc') return (
    <svg className={cls} viewBox="0 0 120 90" aria-hidden="true">
      <ellipse cx="62" cy="85" rx="28" ry="3" fill="rgba(58,53,48,.12)" />
      {/* бок башни — видно, что это коробка, а не плоский экран */}
      <path d="M76 6l12 6v70l-12 2z" fill="#B9BCC6" stroke="#5A5A60" strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="38" y="4" width="38" height="80" rx="4" fill="#EEF0F4" stroke="#5A5A60" strokeWidth="2.4" />
      <rect x="44" y="12" width="26" height="8" rx="2" fill="#3A3A40" />
      <rect x="48" y="15.2" width="14" height="1.8" rx=".9" fill="#8C8C94" />
      <rect x="44" y="24" width="26" height="8" rx="2" fill="#3A3A40" />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x="46" y={40 + k * 5} width="22" height="2.2" rx="1.1" fill="#A7A6A2" />
      ))}
      <circle cx="57" cy="70" r="6" fill="#2E9E5B" />
      <path d="M57 66.4v3.4M54.2 68a4 4 0 1 0 5.6 0" stroke="#FFFFFF" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="66" cy="78" r="1.4" fill="#2B7FD4" />
      <rect x="41" y="84" width="6" height="3" rx="1" fill="#5A5A60" />
      <rect x="67" y="84" width="6" height="3" rx="1" fill="#5A5A60" />
    </svg>
  );
  if (id === 'keyboard') return (
    <svg className={cls} viewBox="0 0 120 90" aria-hidden="true">
      <path d="M60 24C60 14 70 14 70 4" stroke="#5A5A60" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="80" rx="52" ry="3" fill="rgba(58,53,48,.12)" />
      <rect x="4" y="24" width="112" height="54" rx="7" fill="#3A3D46" />
      {[0, 1, 2].map((r) => (
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => {
          if (r === 1 && k === 9) return null;
          return <rect key={r + '-' + k} x={10 + r * 3 + k * 10} y={30 + r * 11} width="8" height="8" rx="1.8" fill="#F4F5F8" />;
        })
      ))}
      {/* Enter — одна цветная клавиша: по ней клавиатуру узнают сразу */}
      <rect x="103" y="41" width="9" height="8" rx="1.8" fill="#FF4F28" />
      <rect x="10" y="63" width="12" height="8" rx="1.8" fill="#F4F5F8" />
      <rect x="25" y="63" width="62" height="8" rx="2" fill="#F4F5F8" />
      <rect x="90" y="63" width="10" height="8" rx="1.8" fill="#F4F5F8" />
      <rect x="103" y="63" width="9" height="8" rx="1.8" fill="#F4F5F8" />
    </svg>
  );
  // Чайник — лишняя вещь в коробке: пузатый корпус, носик, ручка сверху.
  if (id === 'cup') return (
    <svg className={cls} viewBox="0 0 120 90" aria-hidden="true">
      <ellipse cx="60" cy="84" rx="30" ry="3" fill="rgba(58,53,48,.12)" />
      <path d="M40 30C48 18 72 18 80 30" stroke="#5A5A60" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M84 50L102 38l3 5-15 16z" fill="#E0543F" stroke="#5A5A60" strokeWidth="2" strokeLinejoin="round" />
      <path d="M34 44C34 34 46 30 60 30S86 34 86 44V74C86 80 80 82 60 82S34 80 34 74z" fill="#F46D55" stroke="#5A5A60" strokeWidth="2.4" />
      <rect x="44" y="44" width="32" height="5" rx="2.5" fill="rgba(255,255,255,.55)" />
      <ellipse cx="60" cy="31" rx="12" ry="3.5" fill="#D9573F" stroke="#5A5A60" strokeWidth="2" />
      <circle cx="60" cy="26" r="3.2" fill="#5A5A60" />
    </svg>
  );
  return (
    <svg className={cls} viewBox="0 0 120 90" aria-hidden="true">
      <path d="M60 22C60 12 48 12 46 2" stroke="#5A5A60" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="86" rx="22" ry="3" fill="rgba(58,53,48,.12)" />
      <path d="M60 20C77 20 84 36 84 54S74 84 60 84 36 72 36 54 43 20 60 20z" fill="#F4F5F8" stroke="#5A5A60" strokeWidth="2.4" />
      <path d="M60 20C45 20 37 33 36.3 46H60z" fill="#DDE9F8" />
      <path d="M60 21V46M36.4 46H83.6" stroke="#5A5A60" strokeWidth="2" />
      <rect x="56.5" y="27" width="7" height="13" rx="3.5" fill="#FF4F28" stroke="#5A5A60" strokeWidth="1.4" />
    </svg>
  );
};

// Значок варианта на экране «сделай место своим». Цветка и часов в общем
// наборе значков нет, а звезда вместо цветка не узнавалась, — рисуем свои тем
// же линейным стилем (сетка 24×24, обводка currentColor).
const P1PickIc = ({ name }) => {
  if (name === 'plant') return (
    <svg className="ic" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      {/* горшок, стебель, лист — и головка из пяти лепестков: это цветок,
          а не росток и не звезда (UI-23) */}
      <path d="M7.6 15.4h8.8l-1.3 5.4H8.9zM12 15.4V9.8M12 13.4c-2.6 0-4-1.4-4-3.2 2.3 0 4 1.2 4 3.2z" />
      <g fill="currentColor" stroke="none">
        <circle cx="12" cy="2.9" r="1.9" /><circle cx="14.6" cy="4.8" r="1.9" /><circle cx="13.6" cy="7.8" r="1.9" />
        <circle cx="10.4" cy="7.8" r="1.9" /><circle cx="9.4" cy="4.8" r="1.9" />
      </g>
      <circle cx="12" cy="5.5" r="1.3" fill="#fff" stroke="none" />
    </svg>
  );
  if (name === 'clock') return (
    <svg className="ic" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.4a8.4 8.4 0 1 0 0-16.8 8.4 8.4 0 0 0 0 16.8zM12 7.4V12l3 2" />
    </svg>
  );
  return <Icon name={name} size={28} />;
};

// ═════════════════════════════════════════════════════════════════════════════
//                             Э К Р А Н Ы
// ═════════════════════════════════════════════════════════════════════════════

function S1({ p }) {
  const pick = usePick();
  const store = useStore();
  const audio = useAudio();
  const [open, setOpen] = useState(() => !!store.get('s1'));
  const [speaker, say, spoken, sayNow] = useVoice([{ text: C.s1.say1, pose: 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(open, spoken);
  const led = useIdleLed(canTap && !open, open ? 1 : 0);
  const said = useRef(open);

  const tap = () => {
    if (!canTap || open) return;
    setOpen(true); store.set('s1', { done: true });
    sfx('pop', audio && audio.on);
    if (said.current) return;
    said.current = true;
    setTimeout(() => say(C.s1.say2, 'sorry'), 320);
  };

  return (
    <Stage hint={C.s1.ask} eyebrow={C.s1.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<NextBtn disabled={!canGo} onClick={p.next} label={C.s1.btn} />}>
      <p className="ask hook-ask">{pick(C.s1.ask)}</p>
      <button type="button" className={'p1-boxbtn' + (led ? ' is-led' : '')}
        disabled={!canTap || open} onClick={tap} aria-label={pick(C.s1.ask)}>
        <P1Box open={open} />
        <Led on={led} />
      </button>
    </Stage>
  );
}

// КАРТОЧКИ ОТКРЫВАЕТ САМ ЛУМИ (заказчик, 27.09.2026): «bola kartochkalarni
// bosish shart emas, o‘zi ketma-ket ochib ko‘rsatsin». Так на экране 2 (экраны «Nega kerak» и «Tanishuv» сняты 27–28.09 — повторяли его):
// никаких мигающих точек, номеров, заголовка и строки задания — только Луми и
// четыре карточки. Сначала все четыре закрыты. Луми говорит вступление, потом
// по очереди: карточка переворачивается и светится, пока звучит её реплика;
// в конце итог — и открывается «Дальше».
//
// Шаг двигает голос, а не таймер — как на показе (S5): вся очередь реплик
// ставится сразу, а какая карточка открыта, берём из того, какая реплика
// звучит сейчас. На узбекском фразы длиннее — карточки просто ждут голос.
//
// После показа открытую карточку можно нажать — Луми повторит её реплику
// (правило «пройденную карточку можно нажать ещё раз»). Во время показа
// нажатие ничего не делает, но кнопки не серые: экран не «сломан», он
// рассказывает.
//
// Вернулись «Назад» на пройденный экран — показ идёт заново, но «Дальше»
// открыт сразу: кто вернулся послушать, послушает, кто листает — пролистает.
// TOUR_SAFETY_MS — из каркаса (показ карточек голосом).

function P1Tour({ p, c, id }) {
  const pick = usePick();
  const store = useStore();
  const audio = useAudio();
  const lines = useMemo(() => [{ text: c.say, pose: 'explain' }]
    .concat(c.cards.map((k) => ({ text: k.say, pose: 'point' })))
    .concat([{ text: c.done, pose: 'cheer' }]), [c]);
  const [speaker, , spoken, sayNow] = useVoice(lines);
  const [upTo, setUpTo] = useState(-1);
  const [ended, setEnded] = useState(false);
  const [passed, setPassed] = useState(() => !!store.get(id));
  const now = c.cards.findIndex((k) => k.say === speaker.text);

  useEffect(() => {
    if (now >= 0) setUpTo((v) => Math.max(v, now));
    if (speaker.text === c.done) setUpTo(c.cards.length - 1);
  }, [speaker.text, speaker.nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = () => {
    setUpTo(c.cards.length - 1);
    setEnded(true);
    setPassed(true);
    store.set(id, { done: true });
  };
  // Очередь впервые договорена целиком — показ окончен.
  useEffect(() => { if (spoken && !ended) finish(); }, [spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  // Озвучка умерла молча — не держим ребёнка: одна реплика висит дольше
  // TOUR_SAFETY_MS — карточки открываются, «Дальше» тоже.
  useEffect(() => {
    if (ended) return undefined;
    const t = setTimeout(finish, TOUR_SAFETY_MS);
    return () => clearTimeout(t);
  }, [speaker.nonce, ended]); // eslint-disable-line react-hooks/exhaustive-deps

  const tap = (i) => {
    if (!ended || !spoken || i > upTo) return;
    sfx('tap', audio && audio.on);
    sayNow(c.cards[i].say, 'point');
  };

  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={ended && spoken}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!passed} onClick={p.next} /></>}>
      <div className="p1-tour">
        {c.cards.map((k, i) => {
          const open = i <= upTo;
          const lit = i === now && !spoken;
          return (
            <button key={k.id} type="button"
              className={'p1-tc' + (open ? ' is-open' : ' is-shut') + (lit ? ' is-reading' : '')}
              onClick={() => tap(i)} aria-label={open ? pick(k.text) : undefined}>
              <span className="p1-tc-face">
                <P1Art id={k.id} className="p1-tc-art" />
                <span className="p1-tc-t">{pick(k.text)}</span>
              </span>
              {open ? null : <span className="p1-tc-back" aria-hidden="true"><i>?</i></span>}
            </button>
          );
        })}
      </div>
    </Stage>
  );
}

const S2 = ({ p }) => <P1Tour p={p} c={C.s2} id="s2" />;

// СБОРКА ИЗ КОРОБКИ (заказчик, 27.09.2026: «bolani o‘zi qismlarni tersin.
// Karobkani ichidan qismlarni oladi va o‘zi teradi»). Раньше на показе Луми
// ставил экран сам, а на уровнях детали лежали в «лотке» из подписанных
// кнопок, и гнёзда тоже были кнопками с подписями «Ekran ostida». Ребёнок
// жал на слова, а стола не видел.
//
// Теперь на каждом экране сборки одна и та же сцена: стол с пунктирными
// местами и открытая коробка под ним. Ребёнок нажимает часть в коробке — она
// приподнимается, а пустые места на столе начинают дышать голубым. Потом
// нажимает место — часть встаёт на стол с подскоком, место зеленеет, Луми
// говорит, почему она стоит именно здесь. Не то место — часть качнулась и
// вернулась в коробку, Луми подбадривает. Лишняя вещь (чайник) — Луми
// объясняет, что компьютеру она не нужна, и чайник уходит из коробки.
//
// pre   — части, которые уже стоят на столе с прошлых экранов: стол растёт от
//         уровня к уровню, как настоящий, а не собирается каждый раз с нуля.
// items — что лежит в коробке: { id, zone } (zone: null — лишняя вещь, why).
// zones — места этого экрана: { id, why }. Место без части — пунктир.
const P1_SLOT_ORDER = ['z-screen', 'z-pc', 'z-key', 'z-mouse'];

function P1Build({ items, zones, pre, stored, canAnswer = true, onSolved, onSay }) {
  const audio = useAudio();
  const pick = usePick();
  const [put, setPut] = useState(() => (stored && stored.put) || {});   // zone -> item id
  const [gone, setGone] = useState(() => (stored && stored.done ? items.filter((x) => x.zone === null).map((x) => x.id) : []));
  const [held, setHeld] = useState(null);
  const [bad, setBad] = useState(null);
  const attempts = useRef(stored ? stored.attempts || 0 : 0);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const need = zones.length;
  const placed = Object.keys(put).map((z) => put[z]);
  const inBox = items.filter((it) => placed.indexOf(it.id) < 0 && gone.indexOf(it.id) < 0);
  const filled = Object.keys(put).length >= need;
  // Экран без мест (уровень с чайником): решён, когда в коробке не осталось лишнего.
  const all = need > 0 ? filled : !inBox.some((it) => it.zone === null);
  const zoneIds = zones.map((z) => z.id);
  const onDesk = {};
  (pre || []).forEach((z) => { onDesk[z] = 1; });
  Object.keys(put).forEach((z) => { onDesk[z] = 1; });

  const take = (it) => {
    if (!canAnswer || all) return;
    // Лишняя вещь: объяснение сразу, без поиска места — места для чайника на
    // столе нет, и заставлять ребёнка его искать было бы нечестно.
    if (it.zone === null) {
      attempts.current += 1;
      sfx('soft', audio && audio.on);
      setHeld(null);
      const g = gone.concat([it.id]);
      setGone(g);
      if (onSay && it.why) onSay(it.why, 'think');
      const left = items.some((x) => x.zone === null && g.indexOf(x.id) < 0);
      if (need === 0 && !left && onSolved) onSolved({ put: {}, attempts: attempts.current });
      return;
    }
    sfx('tap', audio && audio.on);
    setHeld(held === it.id ? null : it.id);
  };

  const drop = (zid) => {
    const z = zones.find((x) => x.id === zid);
    // Поставленную часть можно нажать ещё раз — Луми повторит, почему она здесь.
    if (put[zid]) {
      if (!canAnswer || !z || !z.why) return;
      sfx('tap', audio && audio.on);
      if (onSay) onSay(z.why, 'rule');
      return;
    }
    if (!held || !canAnswer || all) return;
    const it = items.find((x) => x.id === held);
    attempts.current += 1;
    if (it && it.zone === zid) {
      const n = Object.assign({}, put); n[zid] = it.id;
      setPut(n); setHeld(null);
      sfx('ok', audio && audio.on);
      if (onSay && z && z.why) onSay(z.why, 'rule');
      if (Object.keys(n).length >= need && onSolved) onSolved({ put: n, attempts: attempts.current });
      return;
    }
    setBad(zid);
    sfx('soft', audio && audio.on);
    (async () => {
      await sleep(420);
      if (!alive.current) return;
      setBad(null); setHeld(null);
      if (onSay) onSay(nextEncourageL(), 'think');
    })();
  };

  return (
    <div className={'p1-build' + (held ? ' is-holding' : '')}>
      <div className="p1-desk p1-bdesk">
        {/* Внутренняя коробка всегда 200:160 и вписана в стол: рамки мест и кнопки
            поверх них совпадают на любой высоте окна (адаптивность 28.09). */}
        <div className="p1-bdesk-in">
        <svg viewBox="0 0 200 160" aria-hidden="true">
          <rect x="4" y="152" width="192" height="2.5" rx="1.2" fill={T.uiEdge} />
          <rect x="8" y="98" width="146" height="8" rx="3" fill="#C8AE86" />
          <rect x="16" y="106" width="8" height="46" rx="3" fill="#B79A72" />
          <rect x="138" y="106" width="8" height="46" rx="3" fill="#B79A72" />
          {P1_SLOT_ORDER.map((zid) => {
            if (onDesk[zid]) return null;
            const s = P1_SLOTS[zid];
            const live = zoneIds.indexOf(zid) >= 0;
            return (
              <rect key={zid} x={s.x} y={s.y} width={s.w} height={s.h} rx="5"
                className={'p1-slot' + (live ? ' is-live' : '') + (bad === zid ? ' fx-no' : '')}
                fill="rgba(255,255,255,.55)" stroke={T.ink3} strokeWidth="2.2" strokeDasharray="6 5" />
            );
          })}
          {Object.keys(put).map((zid) => {
            const s = P1_SLOTS[zid];
            return (
              <rect key={'lit-' + zid} x={s.x - 4} y={s.y - 4} width={s.w + 8} height={s.h + 8} rx="8"
                className="p1-lit" fill={T.successSoft} stroke={T.success} strokeWidth="2.6" />
            );
          })}
          {/* монитор позади клавиатуры — его ножка уходит под клавиши */}
          {['z-screen', 'z-pc', 'z-key', 'z-mouse'].map((zid) => (onDesk[zid] ? <P1Part key={zid} z={zid} /> : null))}
        </svg>
        {/* Места нажимаются поверх рисунка: прозрачные кнопки ровно по рамкам. */}
        {zones.map((z) => {
          const s = P1_SLOTS[z.id];
          const pad = 6;
          // Кнопка не меньше 44×44 px и на маленьком столе (телефон 320,
          // Fold 280): если рамка меньше, кнопка растёт вокруг её центра.
          const l = ((s.x - pad) / 200) * 100, t = ((s.y - pad) / 160) * 100;
          const w = ((s.w + pad * 2) / 200) * 100, h = ((s.h + pad * 2) / 160) * 100;
          return (
            <button key={z.id} type="button" className={'p1-hit' + (put[z.id] ? ' is-full' : '')}
              style={{ left: `calc(${l}% - max(0px, (44px - ${w}%) / 2))`, top: `calc(${t}% - max(0px, (44px - ${h}%) / 2))`,
                width: `max(44px, ${w}%)`, height: `max(44px, ${h}%)` }}
              onClick={() => drop(z.id)}
              aria-label={put[z.id] ? pick(PARTS[put[z.id]].text) : pick({ uz: 'Bo‘sh joy', ru: 'Пустое место', en: 'Empty spot' })} />
          );
        })}
        </div>
      </div>
      <div className="p1-crate">
        <div className="p1-crate-in">
          {inBox.map((it) => (
            <button key={it.id} type="button"
              className={'p1-take' + (held === it.id ? ' is-held' : '')}
              onClick={() => take(it)} aria-pressed={held === it.id}
              aria-label={pick(PARTS[it.id].text)}>
              <P1Art id={it.id} className="p1-take-art" />
            </button>
          ))}
          {!inBox.length ? <span className="p1-crate-empty" aria-hidden="true" /> : null}
        </div>
      </div>
    </div>
  );
}

// Общий каркас всех экранов сборки: 5 и 9 отличаются только тем,
// что лежит в коробке, какие места пустые и что уже стоит на столе.
function P1Zones({ p, c, id }) {
  const store = useStore();
  const log = useLog();
  const [rec, setRec] = useState(() => store.get(id) || undefined);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(!!rec, spoken);
  const said = useRef(!!rec);

  const solved = (r) => {
    const v = { done: true, put: r.put, attempts: r.attempts };
    store.set(id, v); setRec(v);
    log({ screenId: id, type: 'level', attempts: r.attempts });
    if (said.current) return;
    said.current = true;
    setTimeout(() => say(c.done, 'cheer'), 340);
  };

  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}>
      <P1Build items={c.items} zones={c.zones} pre={c.pre}
        stored={rec} canAnswer={canTap} onSolved={solved}
        onSay={(t, pose) => sayNow(t, pose)} />
    </Stage>
  );
}

const S5 = ({ p }) => <P1Zones p={p} c={C.s5} id="s5" />;

function S7({ p }) {
  const pick = usePick();
  const store = useStore();
  const log = useLog();
  const [rec, setRec] = useState(() => store.get('s7') || undefined);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: C.s7.say, pose: 'think' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(!!rec, spoken);

  // Четыре варианта сеткой 2×2 (ряд из трёх ломал сетку). Верный — третий,
  // а не второй: «жми B» больше не срабатывает.
  const opts = [
    { node: <span className="p1-opt"><P1Art id="screen" className="p1-opt-art" />{pick(PARTS.screen.text)}</span> },
    { node: <span className="p1-opt"><P1Art id="keyboard" className="p1-opt-art" />{pick(PARTS.keyboard.text)}</span> },
    { node: <span className="p1-opt"><P1Art id="pc" className="p1-opt-art" />{pick(PARTS.pc.text)}</span> },
    { node: <span className="p1-opt"><P1Art id="mouse" className="p1-opt-art" />{pick(PARTS.mouse.text)}</span> }
  ];

  return (
    <Stage hint={C.s7.ask} eyebrow={C.s7.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}>
      <p className="ask hook-ask">{pick(C.s7.ask)}</p>
      <HintLadder options={opts} correct={2} hints={C.s7.hints} why={C.s7.why} columns
        stored={rec} canAnswer={canTap}
        onResolved={(r) => {
          const v = Object.assign({ done: true }, r);
          store.set('s7', v); setRec(v);
          log({ screenId: 's7', type: 'check', correct: r.correct, firstTry: r.firstTry, attempts: r.attempts });
        }}
        onSay={(t, pose) => sayNow(t, pose)} />
    </Stage>
  );
}

const S9 = ({ p }) => <P1Zones p={p} c={C.s9} id="s9" />;

function S10({ p }) {
  const pick = usePick();
  const store = useStore();
  const log = useLog();
  const [rec, setRec] = useState(() => store.get('s10') || undefined);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: C.s10.say, pose: 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(!!rec, spoken);
  const said = useRef(!!rec);

  const solved = (r) => {
    const v = { done: true, put: r.put, attempts: r.attempts };
    store.set('s10', v); setRec(v);
    log({ screenId: 's10', type: 'level', attempts: r.attempts });
    if (said.current) return;
    said.current = true;
    setTimeout(() => say(C.s10.done, 'cheer'), 340);
  };

  return (
    <Stage hint={C.s10.ask} eyebrow={C.s10.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}>
      <p className="ask hook-ask">{pick(C.s10.ask)}</p>
      <TapSort items={C.s10.items} bins={C.s10.bins} labels={C.s10.labels}
        stored={rec} canAnswer={canTap} onSolved={solved}
        onSay={(t, pose) => sayNow(t, pose)} />
    </Stage>
  );
}

// СТОЛА НА ВЫЗОВЕ НЕТ НАМЕРЕННО. Четыре гнезда и четыре детали уже занимают
// весь экран телефона; картинка стола поверх них не помещалась и срезалась на
// шесть десятков точек. Да и не нужна: места названы словами, а собранный стол
// ребёнок увидит следующим экраном — как итог, а не как подсказку.

function S12({ p }) {
  const pick = usePick();
  const store = useStore();
  const log = useLog();
  const [rec, setRec] = useState(() => store.get('s12') || undefined);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: C.s12.say, pose: 'think' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(!!rec, spoken);
  const said = useRef(!!rec);

  const solved = (r) => {
    const v = { done: r.done, attempts: r.attempts };
    store.set('s12', v); setRec(v);
    log({ screenId: 's12', type: 'check', attempts: r.attempts });
    if (said.current) return;
    said.current = true;
    setTimeout(() => say(C.s12.done, 'cheer'), 340);
  };

  return (
    <Stage hint={C.s12.ask} eyebrow={C.s12.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}>
      <p className="ask hook-ask">{pick(C.s12.ask)}</p>
      <YesNo items={C.s12.items} labels={{ yes: C.s12.yes, no: C.s12.no, all: C.s12.all }}
        onAsk={(it) => say(it.text, 'think')}
        stored={rec} canAnswer={canTap} onSolved={solved}
        onSay={(t, pose) => sayNow(t, pose)} />
    </Stage>
  );
}

function S13({ p }) {
  const pick = usePick();
  const store = useStore();
  const audio = useAudio();
  const [at, setAt] = useState(() => (store.get('s13') || {}).pick || null);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: C.s13.say, pose: 'celebrate' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(!!at, spoken);
  const led = useIdleLed(canTap && !at, at || '');
  const said = useRef(!!at);
  const full = { 'z-screen': 1, 'z-key': 1, 'z-mouse': 1, 'z-pc': 1 };

  const tap = (o) => {
    if (!canTap) return;
    setAt(o.id); store.set('s13', { pick: o.id });
    sfx('pop', audio && audio.on);
    if (said.current) return;
    said.current = true;
    setTimeout(() => say(C.s13.done, 'cheer'), 340);
  };

  return (
    <Stage hint={C.s13.ask} eyebrow={C.s13.eyebrow} screen={p.screen} total={p.total}
      speaker={speaker} done={canGo}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} label={C.s13.btn} /></>}>
      <P1Desk put={full} extra={at} />
      <p className="ask hook-ask">{pick(C.s13.ask)}</p>
      <div className="p1-pick">
        {C.s13.picks.map((o) => (
          <button key={o.id} type="button"
            className={'p1-pick-b' + (at === o.id ? ' is-on' : '') + (led ? ' is-led' : '')}
            disabled={!canTap} onClick={() => tap(o)} aria-pressed={at === o.id}>
            <P1PickIc name={o.icon} />
            <span className="p1-pick-t">{pick(o.text)}</span>
            <Led on={led} />
          </button>
        ))}
      </div>
    </Stage>
  );
}

const S14 = ({ p }) => <AchievementScreen p={p} c={C.s14} />;
const S15 = ({ p }) => <ByeScreen p={p} c={C.s15} />;

// ═════════════════════════════════════════════════════════════════════════════
// ОНБОРДИНГ — ТУР ПО КНОПКАМ (только урок 1). Перенесён из «Кибер-щита», урок 1
// (ScreenTour1 / ScreenTour2): подсказка затемняет экран и вырезает окно вокруг
// НАСТОЯЩЕЙ кнопки — ребёнок жмёт её саму, а не картинку кнопки.
//   экран 1 — «Назад» и «Дальше» (Orqaga / Davom etish);
//   экран 2 — полоска прогресса, номер страницы, «Подсказка» и «Пауза».
// Перед туром — ЗНАКОМСТВО (как ScreenIntro «Кибер-щита»): робот представляется
// и говорит, что сейчас покажет урок. Кнопок нет, экран сам уходит в тур.
// «Назад» в туре ведёт на знакомство: оно коротко мигает и возвращает сюда,
// уже на шаг «Дальше» — как в «Кибер-щите».
// Место кнопки («справа», «внизу») голос НЕ называет: кнопку показывает
// подсветка, а ребёнок 8 лет может ещё путать право и лево (заказчик, 2026-09-24).
// После тура голос больше не говорит, какую кнопку нажать, чтобы идти дальше:
// ребёнок это уже умеет (заказчик, 2026-09-24).
// ═════════════════════════════════════════════════════════════════════════════
const TOUR = {
  t0: {
    eyebrow: L3('Tanishuv', 'Знакомство', 'Meet the robot'),
    cast: [
      { pose: 'hello', text: L3('Salom! Men robotman. Mening ismim esa Lumi. Men kompyuter ichida yashayman va u qanday ishlashini bilaman.',
        'Привет! Я робот. А зовут меня Луми. Я живу внутри компьютера и знаю, как он работает.',
        'Hi! I am a robot, and my name is Lumi. I live inside the computer and I know how it works.') },
      { pose: 'smile', text: L3('Biz birga kompyuterda ishlashni o‘rganamiz. Qadamma-qadam.',
        'Мы вместе научимся работать на компьютере. Шаг за шагом.',
        'Together we will learn to use the computer, step by step.') },
      { pose: 'point', text: L3('Avval keling, darsimiz qanday ishlashini va nimani bosish kerakligini ko‘rsataman.',
        'А сначала давай я покажу, как устроен наш урок и что здесь нажимать.',
        'But first let me show you how our lesson works and what to press here.') }
    ]
  },
  t1: {
    eyebrow: L3('Hammasi qanday ishlaydi', 'Как всё работает', 'How it all works'),
    title: L3('Darsdan foydalanishni o‘rganamiz', 'Научимся пользоваться уроком', 'Let us learn how to use the lesson'),
    lead: L3('Ko‘rsatma tugmani ko‘rsatadi — aynan o‘shani bosing. Tugmalar haqiqiy.',
      'Подсказка покажет кнопку — нажми именно её. Кнопки настоящие.',
      'The hint will point to a button. Press that one. The buttons are real.'),
    steps: [
      { id: 'back', sel: '.stage-nav .btn-ghost', icon: 'arrowL',
        title: L3('«Orqaga» tugmasi', 'Кнопка «Назад»', 'The “Back” button'),
        short: L3('Oldingi sahifaga qaytaradi', 'Возвращает на предыдущую страницу', 'Takes you to the page before'),
        // Вступление экрана вшито в первую подсказку: ребёнку, который не
        // читает, именно оно объясняет, что сейчас будет и что кнопки настоящие.
        text: L3('Ko‘rsatma tugmani ko‘rsatadi — aynan o‘shani bosing. Tugmalar haqiqiy. Oldingi sahifaga qaytmoqchi bo‘lsangiz, «Orqaga» tugmasidan foydalaning. Hoziroq bosib ko‘ring!',
          'Подсказка покажет кнопку — нажми именно её. Кнопки настоящие. Если захочешь вернуться на предыдущую страницу, используй кнопку «Назад». Попробуй нажать её прямо сейчас!',
          'The hint will point to a button. Press that one. The buttons are real. If you want to go back to the page before, use the “Back” button. Try pressing it right now!') },
      { id: 'next', sel: '.stage-nav .btn-accent', icon: 'arrowR',
        title: L3('«Davom etish» tugmasi', 'Кнопка «Дальше»', 'The “Next” button'),
        short: L3('Darsning keyingi qadamiga olib boradi', 'Ведёт к следующему шагу урока', 'Takes you to the next step of the lesson'),
        text: L3('Endi darsning keyingi qadamiga o‘tish uchun «Davom etish» tugmasini bosing.',
          'Теперь нажми кнопку «Дальше», чтобы перейти к следующему шагу урока.',
          'Now press the “Next” button to go to the next step of the lesson.') }
    ]
  },
  t2: {
    eyebrow: L3('Hammasi qanday ishlaydi', 'Как всё работает', 'How it all works'),
    title: L3('Ekranda yana nimalar bor', 'Что ещё есть на экране', 'What else is on the screen'),
    lead: L3('Yana to‘rtta yordamchi qoldi. Har biriga qarang.',
      'Осталось ещё четыре помощника. Посмотри на каждого.',
      'Four more helpers are left. Look at each one.'),
    steps: [
      { id: 'progress', sel: '.progress-track', icon: 'gauge', auto: true,
        title: L3('Jarayon chizig‘i', 'Полоска прогресса', 'Progress bar'),
        short: L3('Darsning qanchasi o‘tganini ko‘rsatadi', 'Показывает, сколько урока пройдено', 'Shows how much of the lesson is done'),
        text: L3('Yana to‘rtta yordamchi qoldi. Har biriga qarang. Bu chiziq darsning qanchasi o‘tganini ko‘rsatadi. Har bir sahifada u uzayib boradi.',
          'Осталось ещё четыре помощника. Посмотри на каждого. Эта полоска показывает, сколько урока уже пройдено. С каждой страницей она становится длиннее.',
          'Four more helpers are left. Look at each one. This bar shows how much of the lesson is done. It gets longer with every page.') },
      { id: 'counter', sel: '.chrome-side .counter', icon: 'hash', auto: true,
        title: L3('Sahifa raqami', 'Номер страницы', 'Page number'),
        short: L3('Hozir qaysi sahifa va jami nechta', 'Какая страница сейчас и сколько всего', 'Which page you are on and how many there are'),
        text: L3('Bu yerda hozir qaysi sahifada ekaningiz va ular jami nechta ekani ko‘rinadi.',
          'Здесь видно, на какой странице ты сейчас и сколько их всего.',
          'Here you can see which page you are on and how many pages there are.') },
      // «Подсказка» — настоящая кнопка-лампочка в шапке. Ребёнок жмёт её, и она
      // произносит say: так он слышит, что подсказка повторяет задание. Шаг
      // засчитывается, когда робот договорил.
      { id: 'hint', sel: '.chrome-side .ctl-hint', icon: 'bulb',
        title: L3('«Maslahat» tugmasi', 'Кнопка «Подсказка»', 'The “Hint” button'),
        short: L3('Vazifani yana bir bor aytib beradi', 'Повторит задание ещё раз', 'Repeats the task again'),
        text: L3('Nima qilish kerakligini tushunmasangiz, «Maslahat»ni bosing. Hoziroq bosib ko‘ring!',
          'Если не понял, что нужно делать, нажми «Подсказку». Попробуй прямо сейчас!',
          'If you are not sure what to do, press “Hint”. Try it right now!'),
        say: L3('Maslahat vazifani mana shunday takrorlaydi. Nima qilishni bilmasangiz, uni bosing.',
          'Вот так подсказка повторяет задание. Нажимай её, когда не знаешь, что делать.',
          'This is how the hint repeats the task. Press it when you do not know what to do.') },
      // Шаг из ДВУХ нажатий: text — на первое, text2 — после него. Ребёнок на
      // практике понимает, что пауза — переключатель и урок сам не продолжится.
      { id: 'pause', sel: '.chrome-side .ctl-btn:not(.is-exit):not(.ctl-hint)', icon: 'pause',
        title: L3('«Pauza» tugmasi', 'Кнопка «Пауза»', 'The “Pause” button'),
        short: L3('Darsni to‘xtatadi. Davom etish uchun yana bosing', 'Останавливает урок. Нажми ещё раз, чтобы продолжить', 'Stops the lesson. Press again to continue'),
        text: L3('To‘xtash kerak bo‘lsa, «Pauza»ni bosing. Hoziroq bosib ko‘ring!',
          'Если нужно остановиться, нажми «Паузу». Попробуй прямо сейчас!',
          'If you need to stop, press “Pause”. Try it right now!'),
        text2: L3('Dars to‘xtadi. Endi davom etish uchun yana bir marta bosing.',
          'Урок остановился. Теперь нажми ещё раз, чтобы продолжить.',
          'The lesson has stopped. Now press again to continue.') }
    ],
    done: L3('Endi darsni ichidan bilasiz. Davom etamiz!', 'Теперь ты знаешь урок изнутри. Идём дальше!', 'Now you know the lesson inside out. Let us go on!')
  }
};

// Шаг тура звучит голосом робота. auto — шаг «посмотри» без нажатия: после
// реплики и короткой паузы тур сам идёт дальше.
function useTourStep(step, onDone) {
  const pick = usePick();
  const audio = useAudio();
  const lang = useLang();
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; });
  useEffect(() => {
    if (!step) return undefined;
    let dead = false;
    (async () => {
      if (audio && audio.stop) audio.stop();
      if (audio) await audio.speak(pick(step.text), VOICE.bot);
      if (dead || !step.auto) return;
      await sleep(800);
      if (!dead) doneRef.current();
    })();
    return () => { dead = true; };
  }, [step, lang]); // eslint-disable-line react-hooks/exhaustive-deps
}

const TourList = ({ steps, step, done }) => {
  const pick = usePick();
  return (
    <div className="uid">
      {steps.map((s, k) => {
        const ok = done || k < step;
        return (
          <div key={s.id} className={'uid-row' + (ok ? ' uid-done' : '') + (!done && k === step ? ' uid-now' : '')}>
            <span className="uid-ico"><Icon name={s.icon} size={22} /></span>
            <div>
              <div className="uid-h">{pick(s.title)}{ok && <span className="uid-tick"><Icon name="check" size={15} /></span>}</div>
              <p className="uid-p">{pick(s.short)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

function T0({ p }) {
  const pick = usePick();
  const audio = useAudio();
  const store = useStore();
  const c = TOUR.t0;
  // Вернулись «Назад» из тура: знакомство не звучит заново, а мигает
  // последним кадром и отдаёт ребёнка обратно в тур.
  const [bounce] = useState(() => !!store.get('t0bounce'));
  const [speaker, , spoken] = useVoice(bounce ? [] : c.cast.map((m) => ({ text: m.text, pose: m.pose })));
  const left = useRef(false);
  const go = () => { if (!left.current) { left.current = true; p.next(); } };
  useEffect(() => {
    if (!bounce) return undefined;
    store.set('t0bounce', undefined);
    const t = setTimeout(go, 700);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (bounce || !spoken) return undefined;
    const t = setTimeout(go, 900);
    return () => clearTimeout(t);
  }, [spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const last = c.cast[c.cast.length - 1];
  const pose = bounce ? POSES[last.pose] : speaker.pose;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={bounce ? undefined : speaker}
      done={bounce || spoken} hideSpeaker>
      <div className="bye t0-hero">
        <div className="bye-bot t0-bot"><RobotSVG pose={pose} /></div>
        {!bounce && audio && audio.failed && speaker.text ? <p className="bye-say">{pick(speaker.text)}</p> : null}
      </div>
    </Stage>
  );
}

function T1({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = TOUR.t1;
  // Вернулись с кино карты — шаг «Назад» уже пройден, ждём «Дальше».
  const [step, setStep] = useState(() => (store.get('tourBackDone') ? 1 : 0));
  const cur = c.steps[step] || null;
  useTourStep(cur, useCallback(() => setStep((s) => s + 1), []));
  const back = () => { store.set('tourBackDone', true); store.set('t0bounce', true); p.prev(); };
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} done={step >= 1} hint={cur ? cur.text : c.lead}
      nav={<><BackBtn onPrev={back} /><NextBtn disabled={step < 1} onClick={p.next} /></>}
      overlay={cur ? <CoachMark selector={cur.sel} icon={cur.icon} title={cur.title} text={cur.text} nonce={step} /> : null}>
      <h1 className="h1">{pick(c.title)}</h1>
      <p className="lead">{pick(c.lead)}</p>
      <TourList steps={c.steps} step={step} done={false} />
    </Stage>
  );
}

function T2({ p }) {
  const pick = usePick();
  const audio = useAudio();
  const c = TOUR.t2;
  const [step, setStep] = useState(0);
  const finished = step >= c.steps.length;
  const cur = finished ? null : c.steps[step];
  // ПАУЗА ЗАСЧИТЫВАЕТСЯ ЗА ДВА НАЖАТИЯ: остановил и продолжил. Считаем смены
  // audio.paused, а не своим обработчиком — кнопка живёт в шапке Stage, и тур
  // не должен знать, как она устроена. База берётся на входе в шаг.
  const isPause = !!cur && cur.id === 'pause';
  const paused = !!(audio && audio.paused);
  const [hits, setHits] = useState(0);
  const last = useRef(null);
  useEffect(() => {
    if (!isPause) { last.current = null; return; }
    if (last.current !== null && last.current !== paused) setHits((h) => h + 1);
    last.current = paused;
  }, [isPause, paused]);
  useEffect(() => { if (isPause && hits >= 2) setStep((s) => s + 1); }, [isPause, hits]);
  // ШАГ «ПОДСКАЗКА»: ловим нажатие настоящей лампочки в шапке (она живёт в
  // Stage, тур её устройства не знает) и ждём, пока робот договорит её фразу.
  const isHint = !!cur && cur.id === 'hint';
  const [hintHit, setHintHit] = useState(false);
  useEffect(() => {
    if (!isHint) return undefined;
    const h = (e) => { if (e.target && e.target.closest && e.target.closest('.ctl-hint')) setHintHit(true); };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, [isHint]);
  const playing = !!(audio && audio.playing);
  const heard = useRef(false);
  useEffect(() => {
    if (!isHint || !hintHit) return undefined;
    if (playing) { heard.current = true; return undefined; }
    // Голоса нет — фраза видна в карточке; даём её прочитать и идём дальше.
    const t = setTimeout(() => setStep((s) => s + 1), heard.current ? 700 : 5000);
    return () => clearTimeout(t);
  }, [isHint, hintHit, playing]);
  useTourStep(cur, useCallback(() => setStep((s) => s + 1), []));
  // Текст подсказки меняется после первого нажатия — это тот же шаг, не новый.
  const coachText = isPause && hits >= 1 ? cur.text2
    : isHint && hintHit ? cur.say : (cur && cur.text);
  const [speaker, say, spoken] = useVoice([]);
  const said = useRef(false);
  useEffect(() => {
    if (finished && !said.current) { said.current = true; say(c.done, 'celebrate'); }
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps
  const canGo = finished && said.current && spoken;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} done={canGo}
      speaker={finished && said.current ? speaker : undefined} hint={isHint ? cur.say : (coachText || c.done)}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>}
      overlay={cur ? <CoachMark selector={cur.sel} icon={cur.icon} title={cur.title} text={coachText}
        nonce={step * 10 + Math.min(hits, 1) + (hintHit && isHint ? 1 : 0)}
        tappable={!isPause && !isHint} onTap={isPause || isHint ? undefined : () => setStep((s) => s + 1)} /> : null}>
      <h1 className="h1">{pick(c.title)}</h1>
      <p className="lead">{pick(c.lead)}</p>
      <TourList steps={c.steps} step={step} done={finished} />
    </Stage>
  );
}

const TOUR_CSS = `
/* ── ТУР ПО КНОПКАМ: список помощников (как в «Кибер-щите») ── */
.t0-hero { flex-direction: column; gap: clamp(10px, 2dvh, 18px); flex: 1 1 auto; }
.t0-bot { width: clamp(150px, 34dvh, 280px); }
.uid { display: flex; flex-direction: column; gap: 9px; text-align: left; }
.uid-row { display: flex; gap: 12px; align-items: flex-start; background: ${T.paper}; border-radius: 15px;
  padding: 13px 15px; transition: box-shadow .25s, opacity .25s;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5); }
.uid-now { box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5), inset 0 0 0 2.5px ${T.ui}; }
.uid-done { opacity: .62; }
.uid-ico { display: grid; place-items: center; width: 34px; height: 34px; flex-shrink: 0; border-radius: 11px;
  background: ${T.uiSoft}; color: ${T.uiDk}; }
.uid-h { display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 800; margin-bottom: 3px; }
.uid-tick { display: grid; place-items: center; color: ${T.success}; }
.uid-p { font-size: 17px; line-height: 1.45; color: ${T.ink2}; margin: 0; }
@media (min-width: 768px) and (min-height: 560px) {
  .uid-row { padding: clamp(13px, 2vw, 20px) clamp(15px, 2.2vw, 24px); border-radius: 20px; }
  .uid-ico { width: clamp(34px, 4.4vw, 48px); height: clamp(34px, 4.4vw, 48px); border-radius: 14px; }
  .uid-h { font-size: clamp(17px, 2.2vw, 21px); }
  .uid-p { font-size: clamp(17px, 2.1vw, 19px); }
}
/* Адаптивность (28.09): четыре помощника тура не влезали без прокрутки на
   низких окнах — ноутбук-окно 1280×610, телефоны 320×568 / 360×560, Fold 280.
   Низко — строки плотнее и шрифт мельче (не меньше 14 px); лёжа — сетка 2×2. */
@media (max-height: 760px) and (min-width: 768px) {
  .uid { gap: clamp(6px, 1.2dvh, 9px); }
  .uid-row { padding: clamp(9px, 1.7dvh, 16px) clamp(14px, 2vw, 22px); }
  .uid-h { font-size: clamp(17px, 2.6dvh, 20px); }
  .uid-p { font-size: clamp(16px, 2.5dvh, 18px); line-height: 1.35; }
}
@media (max-height: 700px) and (max-width: 767px) {
  .uid { gap: 6px; }
  .uid-row { padding: 9px 12px; gap: 10px; border-radius: 13px; }
  .uid-ico { width: 30px; height: 30px; border-radius: 10px; }
  .uid-h { font-size: 16px; margin-bottom: 1px; }
  .uid-p { font-size: 15px; line-height: 1.3; }
}
@media (max-width: 340px) {
  .uid-row { padding: 8px 10px; gap: 8px; }
  .uid-h { font-size: 15px; }
  .uid-p { font-size: 14px; line-height: 1.28; }
}
@media (orientation: landscape) and (max-height: 500px) {
  .uid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .uid-row { padding: 8px 11px; gap: 9px; border-radius: 13px; }
  .uid-ico { width: 30px; height: 30px; border-radius: 10px; }
  .uid-h { font-size: 15px; margin-bottom: 1px; }
  .uid-p { font-size: 14px; line-height: 1.28; }
}
`;

// Кино карты модуля — до первого экрана (в корне) и перед прощанием (канон,
// см. «КАРТА МОДУЛЯ»). Экран с film: true «Назад» перешагивает: иначе кино
// отыгралось бы заново и само увело бы ребёнка вперёд.
const LESSON_N = 1;
const M1 = ({ p }) => <MapFilm n={LESSON_N} mode="end" onDone={p.next} />;

const SCREENS = [
  { id: 't0',  code: 'HELLO',       Comp: T0  },
  { id: 't1',  code: 'TOUR-1',      Comp: T1  },
  { id: 't2',  code: 'TOUR-2',      Comp: T2  },
  { id: 's1',  code: 'HOOK',        Comp: S1  },
  { id: 's2',  code: 'MISSION',     Comp: S2  },
  { id: 's5',  code: 'SHOW',        Comp: S5  },
  { id: 's7',  code: 'CHECK-1',     Comp: S7  },
  { id: 's9',  code: 'LEVEL-3',     Comp: S9  },
  { id: 's10', code: 'LEVEL-4',     Comp: S10 },
  { id: 's12', code: 'CHECK-2',     Comp: S12 },
  { id: 's13', code: 'RESULT',      Comp: S13 },
  { id: 's14', code: 'ACHIEVEMENT', Comp: S14 },
  { id: 'm1',  code: 'MAP-END',     Comp: M1, film: true },
  { id: 's15', code: 'PREVIEW',     Comp: S15 }
];

const SCREEN_RESET = {
  t1: ['tourBackDone'], s1: ['s1'], s2: ['s2'], s5: ['s5'], s7: ['s7'],
  s9: ['s9'], s10: ['s10'], s12: ['s12'], s13: ['s13']
};

// ═════════════════════════════════════════════════════════════════════════════
// КОРНЕВОЙ КОМПОНЕНТ
// ═════════════════════════════════════════════════════════════════════════════
export default function PartsLesson({ studentName, lang, ttsApiBase, onFinished, startAt, onExit }) {
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({
      artifact: { type: 'desk', value: (store.get('s13') || {}).pick || null },
      badge: 'k0-01-parts'
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
    <R.Shell css={LESSON_CSS + MAP_CSS + TOUR_CSS + CANON_UI_CSS}>
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

// Оформление, которого нет в каноне: коробка из крючка, стол с четырьмя
// местами и ряд выбора в итоге. Всё остальное — сцена, шаги, карточки,
// гнёзда, кубок — приезжает готовым.
const LESSON_CSS = CANON_SCREEN_CSS + `
/* ══════════════════════════════════════════════════════════════
   КОРОБКА. Закрытая — просто коробка; открытая — из неё торчат углы частей.
   Крышка уезжает, а не исчезает: ребёнок должен увидеть, что её открыли.
   ══════════════════════════════════════════════════════════════ */
.p1-boxbtn { position: relative; display: block; width: 100%; max-width: 300px;
  align-self: center; padding: 6px; border: 2px solid transparent; border-radius: 18px;
  background: transparent; cursor: pointer; transition: transform .18s, border-color .2s; }
.p1-boxbtn:hover:not(:disabled) { transform: translateY(-3px); border-color: ${T.ui}; }
.p1-boxbtn:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.p1-boxbtn:disabled { cursor: default; }
.p1-box { display: block; width: 100%; height: auto; }
.p1-lid { transform-box: fill-box; transform-origin: center; }
.p1-box.is-open .p1-box-in > * { animation: p1Rise .42s cubic-bezier(.34,1.4,.64,1) both; }
.p1-box.is-open .p1-box-in > *:nth-child(2) { animation-delay: .1s; }
.p1-box.is-open .p1-box-in > *:nth-child(3) { animation-delay: .2s; }
.p1-box.is-open .p1-box-in > *:nth-child(4) { animation-delay: .3s; }
@keyframes p1Rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

/* ══════════════════════════════════════════════════════════════
   СТОЛ С ЧЕТЫРЬМЯ МЕСТАМИ
   Пустое место — пунктир, занятое — сплошная зелёная рамка. Цветом тут
   говорится ровно одно: «сюда уже поставили». Ошибки цветом не показываются
   нигде в курсе.
   ══════════════════════════════════════════════════════════════ */
/* Стол держит пропорцию коробкой (aspect-ratio), а не картинкой: когда сцене
   не хватает высоты (ноутбук 1280×800, телефон лёжа), коробка ужимается по
   высоте, рисунок вписывается в неё целиком — и прокрутки нет. */
.p1-desk { position: relative; width: 100%; max-width: 300px; align-self: center;
  aspect-ratio: 200 / 160; flex: 0 1 auto; min-height: 120px; }
.p1-desk svg { display: block; width: 100%; height: 100%; }
/* Ноутбук: ребёнок сидит дальше, стол крупнее (по высоте всё равно ужмётся). */
@media (min-width: 1024px) and (min-height: 700px) { .p1-desk { max-width: 380px; } }
/* Поставленная часть «встаёт» на место: короткий пружинный подскок. */
.p1-part { transform-box: fill-box; transform-origin: 50% 100%;
  animation: p1Pop .38s cubic-bezier(.34,1.5,.5,1) both; }
@keyframes p1Pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
/* Зелёное место загорается чуть позже, чем встаёт часть: сначала глаз видит
   предмет, потом — что место его приняло. */
.p1-lit { animation: p1Lit .5s .18s ease-out both; }
@keyframes p1Lit { 0% { opacity: 0; } 100% { opacity: 1; } }

/* ══════════════════════════════════════════════════════════════
   СБОРКА ИЗ КОРОБКИ (экраны 5 и 9)
   Сверху стол с пунктирными местами, под ним открытая коробка с частями.
   Взятая часть приподнимается и обводится голубым, пустые места этого
   экрана дышат голубым — видно, куда её можно поставить. Стол ужимается по
   высоте окна (dvh), поэтому прокрутки нет.
   ══════════════════════════════════════════════════════════════ */
/* Стол занимает ровно ту высоту, что осталась под Луми и над коробкой (flex),
   ширина идёт из пропорции 200:160. Раньше ширину считали формулой от высоты
   окна, и на ноутбуках 1280×720 и 1366×768, где Луми крупнее, экран
   прокручивался (аудит адаптивности 28.09). */
.stack:has(> .p1-build) { flex: 1 1 auto; }
/* Распорки каркаса (::before / ::after у .stage-content) центрируют экран и
   забирали свободную высоту у стола — здесь она нужна столу. */
.stage-content:has(.p1-build)::before, .stage-content:has(.p1-build)::after { flex: 0 0 0px; }
.p1-build { display: flex; flex-direction: column; align-items: center; gap: clamp(8px, 1.8dvh, 16px);
  width: 100%; flex: 1 1 auto; min-height: 0; }
.stage .p1-bdesk { flex: 1 1 0px; min-height: 90px; height: auto; width: auto; max-width: min(100%, 460px);
  aspect-ratio: 200 / 160; }
.p1-build > .p1-crate { flex: 0 0 auto; }
/* Стол по высоте берёт всё свободное место, а по ширине упирается в
   max-width — пропорция его коробки при этом плывёт (390×844: 362×423).
   Рисунок и кнопки мест лежат во внутренней коробке, вписанной в стол
   строго 200:160, поэтому кнопки всегда ровно над пунктирными рамками. */
.stage .p1-bdesk { container-type: size; }
.p1-bdesk-in { position: absolute; inset: 0; margin: auto;
  width: min(100cqw, 125cqh); height: min(100cqh, 80cqw); }
/* Большой монитор (1920, 2560): стол и коробка крупнее, а не полоска в центре. */
@media (min-width: 1600px) and (min-height: 900px) {
  .stage .p1-bdesk { max-width: min(100%, 620px); }
  .stage .p1-crate { max-width: 500px; }
  .stage .p1-take { flex-basis: 110px; }
  .stage .p1-take-art { max-height: clamp(42px, 9dvh, 96px); }
  .stage .p1-crate-empty { height: clamp(42px, 9dvh, 96px); }
}
.p1-hit { position: absolute; padding: 0; border: 0; border-radius: 10px; background: transparent;
  cursor: pointer; }
.p1-hit:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 2px; }
.p1-slot { transition: fill .25s, stroke .25s; }
.p1-build.is-holding .p1-slot.is-live { stroke: ${T.ui}; animation: p1Breath 1.2s ease-in-out infinite; }
@keyframes p1Breath { 0%, 100% { fill: rgba(255,255,255,.55); } 50% { fill: rgba(30,136,229,.2); } }
.p1-slot.fx-no { stroke: ${T.hint}; animation: none; }

.p1-crate { position: relative; width: 100%; max-width: 380px;
  padding: 12px 12px 10px; border-radius: 8px 8px 16px 16px; background: #D9CDB8;
  box-shadow: inset 0 0 0 3px #C4B393, 0 6px 14px -8px rgba(${T.shadowBase},0.4); }
.p1-crate-in { display: flex; justify-content: center; align-items: flex-end; gap: clamp(6px, 1.6vw, 12px);
  min-height: clamp(64px, 12dvh, 100px); padding: 8px 6px 6px; border-radius: 8px;
  background: rgba(96, 72, 40, .16); }
.p1-take { flex: 0 1 88px; min-width: 56px; padding: 5px; border: 2px solid transparent; border-radius: 14px;
  background: ${T.paper}; cursor: pointer; font: inherit;
  box-shadow: 0 3px 0 rgba(${T.shadowBase},0.1);
  transition: transform .22s cubic-bezier(.34,1.4,.64,1), border-color .2s, box-shadow .2s; }
.p1-take:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 2px; }
.p1-take.is-held { transform: translateY(-12px); border-color: ${T.ui};
  box-shadow: 0 0 0 4px rgba(30,136,229,.2), 0 12px 20px -8px rgba(${T.shadowBase},0.45); }
.p1-take-art { display: block; width: 100%; height: auto; max-height: clamp(42px, 9dvh, 72px); }
.p1-crate-empty { display: block; height: clamp(42px, 9dvh, 72px); }
.stage.is-speaking .stage-content .p1-take { opacity: 1; filter: none; }

/* Телефон лёжа: стол слева, коробка справа. */
@media (orientation: landscape) and (max-height: 500px) {
  .p1-build { flex-direction: row; justify-content: center; align-items: center; gap: 16px; }
  /* Стол берёт ширину, что осталась рядом с коробкой (не больше, чем
     позволяет высота окна), высота идёт из пропорции: рамки мест под
     кнопками не съезжают. Раньше стол брал всю высоту, и коробка с
     четырьмя частями в ряд уходила за правый край (667×375, 844×390). */
  .stage .p1-bdesk { flex: 0 1 auto; max-width: none; min-height: 0; height: auto;
    width: min(calc(100% - 190px), calc((100dvh - 140px) * 1.25)); }
  .p1-crate { width: auto; flex: 0 0 auto; max-width: 180px; margin-top: 0; padding: 10px 10px 8px; }
  .p1-crate-in { display: grid; grid-template-columns: repeat(2, 64px); gap: 8px; min-height: 0; }
  .p1-crate-in .p1-take { min-width: 0; }
  .p1-crate-empty { grid-column: 1 / -1; }
}
@media (prefers-reduced-motion: reduce) {
  .p1-build.is-holding .p1-slot.is-live { animation: none; fill: rgba(30,136,229,.2); }
  .p1-take, .p1-take.is-held { transition: none; }
}

/* Вариант ответа с картинкой в проверке. */
.p1-opt { display: flex; flex-direction: column; align-items: center; gap: 5px;
  font-size: clamp(13px, 1.7vw, 15px); font-weight: 800; color: ${T.ink}; }

/* ══════════════════════════════════════════════════════════════
   ЧТО ПОСТАВИТЬ НА СТОЛ
   Правильного ответа нет: это первая вещь, которую ребёнок выбирает сам.
   Поэтому выбранное помечается синим, а не зелёным — зелёный в курсе значит
   «верно», а у вкуса верного варианта не бывает.
   ══════════════════════════════════════════════════════════════ */
.p1-pick { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(6px, 1.4vw, 11px);
  width: 100%; max-width: 360px; align-self: center; }

/* Проверка (s7): четыре варианта — всегда 2×2. Общая auto-fit-сетка на
   средней ширине давала 3+1: последняя карточка висела одна. */
.opts-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.p1-opt-art { display: block; width: clamp(48px, min(9dvh, 14vw), 72px); height: auto; }

/* ══════════════════════════════════════════════════════════════
   КАРТОЧКИ, КОТОРЫЕ ОТКРЫВАЕТ ЛУМИ (экран 2)
   Закрытая карточка — голубая рубашка со знаком вопроса. Открытая —
   рисунок части и её название. Та, о которой Луми говорит сейчас, светится
   голубой рамкой и чуть приподнята. Больше на экране ничего нет: ни точек,
   ни номеров, ни строки задания (заказчик, 27.09.2026).
   Сетка всегда 2×2, и на телефоне лёжа тоже; картинка ужимается по высоте
   экрана (dvh), поэтому прокрутки нет.
   ══════════════════════════════════════════════════════════════ */
.p1-tour { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(8px, 1.8vw, 14px); width: 100%; max-width: 460px; align-self: center; }
@media (min-width: 900px) and (min-height: 640px) { .p1-tour { max-width: 560px; } }
.p1-tc { position: relative; display: block; padding: 0; border: 2px solid transparent;
  border-radius: 18px; background: ${T.paper}; font: inherit; color: ${T.ink}; cursor: default;
  box-shadow: 0 3px 0 rgba(${T.shadowBase},0.06), 0 6px 18px rgba(${T.shadowBase},0.06);
  transition: border-color .25s, box-shadow .25s, transform .25s; }
.p1-tc.is-open { cursor: pointer; }
.p1-tc:focus-visible { outline: 3px solid ${T.ui}; outline-offset: 3px; }
.p1-tc-face { display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: clamp(2px, .8dvh, 6px); padding: clamp(8px, 1.6dvh, 14px) 8px; }
.p1-tc-art { display: block; width: auto; height: clamp(46px, min(16dvh, 26vw), 110px); aspect-ratio: 120 / 90; }
.p1-tc-t { font-size: clamp(14px, 1.9vw, 17px); font-weight: 800; line-height: 1.15; text-align: center; }
/* Рубашка лежит поверх лица той же высоты: карточка не меняет размер, когда
   открывается, и сетка не прыгает. */
.p1-tc.is-shut .p1-tc-face { visibility: hidden; }
.p1-tc-back { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 16px;
  background: repeating-linear-gradient(135deg, ${T.ui} 0 14px, #42A5F5 14px 28px); }
.p1-tc-back i { display: grid; place-items: center; width: clamp(34px, 7dvh, 48px); aspect-ratio: 1;
  border-radius: 50%; background: rgba(255,255,255,.92); color: ${T.uiDk};
  font-size: clamp(20px, 4dvh, 28px); font-weight: 900; line-height: 1; font-style: normal; }
.p1-tc.is-open .p1-tc-face { animation: p1Flip .5s cubic-bezier(.34,1.3,.64,1) both; }
@keyframes p1Flip { 0% { opacity: 0; transform: perspective(500px) rotateY(80deg) scale(.9); }
  100% { opacity: 1; transform: none; } }
.p1-tc.is-reading { border-color: ${T.ui}; background: ${T.uiSoft}; transform: translateY(-3px);
  box-shadow: 0 0 0 4px rgba(30,136,229,.18), 0 10px 22px rgba(${T.shadowBase},0.12); }
/* Замок речи канона гасит кнопки на время реплики — эти карточки не гасим:
   пока Луми говорит, они и есть то, на что надо смотреть. */
.stage.is-speaking .stage-content .p1-tc { opacity: 1; filter: none; }
/* Телефон лёжа: картинка и название одной строкой, сетка 2×2 остаётся. */
@media (orientation: landscape) and (max-height: 500px) {
  .p1-tour { max-width: 560px; gap: 8px; }
  .p1-tc-face { flex-direction: row; gap: 10px; padding: 6px 10px; }
  .p1-tc-art { height: clamp(40px, 17dvh, 66px); }
}
@media (prefers-reduced-motion: reduce) {
  .p1-tc, .p1-tc.is-reading { transition: none; transform: none; }
  .p1-tc.is-open .p1-tc-face { animation: none; }
}
.p1-pick-b { position: relative; display: flex; flex-direction: column; align-items: center;
  gap: 5px; min-height: 62px; padding: 8px 6px; border: 2px solid transparent;
  border-radius: 14px; background: ${T.paper}; font: inherit; cursor: pointer;
  color: ${T.ink}; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05);
  transition: border-color .2s, transform .16s, background .25s; }
.p1-pick-b:hover:not(:disabled) { border-color: ${T.blue}; transform: translateY(-2px); }
.p1-pick-b:focus-visible { outline: 3px solid ${T.blue}; outline-offset: 3px; }
.p1-pick-b.is-on { background: ${T.blueSoft}; border-color: ${T.blue}; }
/* UI-20: подпись варианта не мельче 13 px. */
.p1-pick-t { font-size: clamp(13px, 1.8vw, 16px); font-weight: 700; line-height: 1.15; }
/* Адаптивность (28.09), большой монитор (1920×1080, 2560×1440): выбор вещи
   и варианты проверки крупнее — на 360 px они терялись посреди экрана. */
@media (min-width: 1600px) and (min-height: 900px) {
  .stage .p1-pick { max-width: 500px; }
  .stage .p1-pick-b { min-height: 84px; }
  .stage .p1-pick-t { font-size: 18px; }
  .stage .opts-grid { max-width: 680px; margin-inline: auto; }
  .stage .p1-opt-art { width: 88px; }
  .stage .p1-opt { font-size: 17px; }
}

/* UI-20 на экранах урока 1: подписи общих механик, которые канон пока
   оставил мельче 13 px (замер на SE, UZ): названия корзин сортировки 12,
   строки умений на кубке 11, заголовок лотка частей 12, счётчики 12–12.5.
   .stage впереди — чтобы перебить CANON_UI_CSS, который идёт в каскаде
   последним. Правильнее поднять их в каноне для всех пяти уроков. */
.stage .ts-bin-t { font-size: clamp(13px, 1.8vw, 15px); }
.stage .skill-row { font-size: clamp(13px, min(1.9vw, 2.1dvh), 16px); }
.stage .dz-tray-h, .stage .ask-n { font-size: 13px; }
.stage .fc-count { font-size: clamp(13px, 1.7vw, 14px); }

/* Телефон лёжа: на «Твоём месте» стол слева, вопрос и четыре вещи справа.
   Столбиком (стол, вопрос, 2×2) сцена не влезала по высоте на 60 px. */
@media (orientation: landscape) and (max-height: 500px) {
  .stage .limit:has(> .p1-pick) { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: auto auto; align-content: center; align-items: center; column-gap: 14px; row-gap: 8px; }
  .stage .limit:has(> .p1-pick) > .p1-desk { grid-column: 1; grid-row: 1 / span 2; min-height: 0;
    max-height: calc(100dvh - 130px); }
  .stage .limit:has(> .p1-pick) > .ask { grid-column: 2; grid-row: 1; margin: 0; align-self: end; }
  .stage .limit:has(> .p1-pick) > .p1-pick { grid-column: 2; grid-row: 2; align-self: start; }
}

@media (prefers-reduced-motion: reduce) {
  .p1-box.is-open .p1-box-in > *, .p1-part, .p1-lit { animation: none; opacity: 1; transform: none; }
  .p1-boxbtn, .p1-pick-b, .p1-slot { transition: none; }
}
`;
