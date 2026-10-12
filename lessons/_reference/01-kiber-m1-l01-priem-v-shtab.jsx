// =============================================================================
// КИБЕРБЕЗ — ЩИТ · Модуль 1 · Урок 1 — «Приём в Штаб»
// Дети 8–10. Самодостаточный JSX: инфра-блок INFRA v1 + урок в одном файле.
//
// Пропсы: { studentName, lang, onFinished } — весь список.
//   lang        'ru' | 'uz'
//   озвучки в пропсах НЕТ: она приходит хуками @lesson/runtime
//   onFinished  вызывается РОВНО один раз, payload без скоринга
// Дев-пропсы (в проде не передавать): startAt, skipBoot, holdIntro
//
// 11 экранов. Озвучка — useAudio из @lesson/runtime;
// своего движка и speechSynthesis в уроке нет (запрет контракта).
// Эмодзи запрещены — все иконки SVG из набора ICONS.
// Тумблера звука нет: ребёнок не может выключить голос.
// Экран 1 — без пузыря, только персонажи; текст появляется сам, если голоса нет.
//
// ВНИМАНИЕ при правках: верхняя часть файла (до пометки «УРОК») — общий канон,
// он копируется во все уроки модуля. Править его здесь можно только вместе
// с kiber_INFRA_v1.jsx, иначе уроки снова разъедутся.
// =============================================================================

import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext, useLayoutEffect } from 'react';
import { useAudio as usePlatformAudio, useSfx as usePlatformSfx } from '@lesson/runtime';
// ============================================================================
// КИБЕРБЕЗ — ЩИТ · INFRA v1 — канонический инфра-блок
// ----------------------------------------------------------------------------
// КАК ПОЛЬЗОВАТЬСЯ: этот файл копируется в новый урок ДОСЛОВНО, целиком, без
// правок. Всё, что специфично для урока (CONTENT, SCREEN_META, экраны, свои
// компоненты и свой CSS), дописывается НИЖЕ инфра-блока. Если инфру надо
// поправить — правится ЭТОТ файл, потом изменение разносится по урокам.
// Никогда не правьте инфру внутри урока: именно так уроки 1–3 разъехались.
//
// СНЯТО С: отгруженных уроков kib-m1-01 / 02 / 03 (kiber-shchit-m1-l02.vercel.app).
// Три копии инфры в них расходились — здесь сведён суперсет:
//   · тема       = вариант уроков 2–3 (у урока 1 не было msgBlue/msgTop/hint/hintSoft)
//   · POSES      = 22 позы (добавлена S_angry, которой в уроках 1–3 нет)
//   · --av-lg    = вариант уроков 2–3 (24dvh / 230px), у урока 1 было 22dvh / 224px
//   · Stage      = с пропом overlay (был только в уроке 1 — нужен для CoachMark)
//   · NextBtn    = с пропом force (был только в уроке 1 — нужен для UI-тура)
//   · Choice     = сигнатура уроков 2–3: похвала КОНКРЕТНАЯ, из контента экрана.
//                  Пул случайных похвал урока 1 намеренно выброшен.
//   · Note       = НОВОЕ: в уроке 2 стили .note/.note-hint были, а компонента не было.
//   · @media print = НОВОЕ: без него height:100dvh + overflow:hidden обрезают
//                  печать на первом экране. Нужно для «Кодекса семьи» (урок 4).
//
// КОНТРАКТ УРОКА
//   props: { studentName, lang, onFinished }
//   · RU/UZ через pick(); ВСЕ тексты — объекты { ru, uz }
//   · ЖЕЛЕЗНОЕ ПРАВИЛО API: любой видимый пропс любого компонента канона
//     принимает { ru, uz } и переводится ВНУТРИ компонента. Никогда не требуйте
//     от урока звать pick() перед передачей. Иначе достаточно один раз забыть —
//     и React падает с ошибкой #31 «object with keys {ru, uz}», унося весь экран.
//     Проверено: именно так падал последний экран («Завершить урок»).
//   · озвучка ТОЛЬКО через useAudio(@lesson/runtime); свой движок и
//     speechSynthesis запрещены контрактом. Каждая реплика уходит с маркером
//     языка ([Русское произношение] / [O'zbekcha tallaffuz] / [English pronunciation])
//   · no-scoring: веди-до-верного, firstTry пишется молча, ни очков, ни процентов
//   · «Дальше» заблокирована, пока играет озвучка и пока задание не решено
//   · без прокрутки: 100dvh + clamp/dvh-токены + FitLine
//   · без localStorage; прогресс живёт в useStore() до конца урока
//   · onFinished(payload) — РОВНО один раз
//
// ТОН И ЯЗЫК (правило модуля, нарушено в уроке 1 — не повторять)
//   · RU к ребёнку — «ты». UZ к ребёнку — «сиз». Между персонажами — «сен».
//   · Ошибка = разбор, а не оценка. Слов «неправильно», «ошибка» ребёнку не говорим.
//   · Ошибается Нолик, ребёнок его выручает. Симка никогда не стыдит.
//   · Похвала конкретная («Верно. По адресу могут прийти к твоему дому»), не общая.
// ============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// 1. ДИЗАЙН-ТОКЕНЫ
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg: '#F6F4EF',
  paper: '#FFFFFF',
  ink: '#0E0E10',
  ink2: '#5A5A60',
  ink3: '#A7A6A2',
  accent: '#FF4F28',        // Симка / основной акцент
  accentSoft: '#FFE8E1',
  accentDk: '#D63B16',
  blue: '#2B7FD4',          // Нолик
  blueSoft: '#E4F0FB',
  blueDk: '#1F63A8',
  msgBlue: '#CFE7FB',       // пузырь «моего» сообщения в мессенджере
  msgTop: '#D9ECFB',        // шапка мессенджера
  success: '#1F7A4D',
  successSoft: '#E3F0E8',
  wrong: '#E0543F',
  wrongSoft: '#FFE3DF',
  hint: '#C08A12',          // подсказка (Note) — не «ошибка», отдельный канал
  hintSoft: '#FFF6E0',
  shadowBase: '58, 53, 48'  // тени задаются через rgba(${T.shadowBase}, a)
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. ПЕРСОНАЖИ — позы
// Симка: наставница, голос f, рисуется СЛЕВА. Нолик: торопыга, голос m, СПРАВА.
// Соотношение сторон НЕ совпадает с «портрет/в полный рост»: часть кадров 2:3,
// часть 1:1. Поэтому размер задаём ТОЛЬКО по ширине (--av / --av-lg) и никогда
// не ставим max-height + object-fit — иначе облако перестаёт стоять по центру.
// ─────────────────────────────────────────────────────────────────────────────
const CDN = 'https://crm.junior-it.uz/uploads/media_library/';
const POSES = {
  S_open:    CDN + 'd8ec7fefbec9864f0453074a21fc2067.png', // в полный рост, руки раскрыты
  S_side:    CDN + '9cb4d40fce0492278209290ee3e4ae31.png', // в полный рост, вполоборота
  S_wave:    CDN + '2d280461b029134123f1f1a356e176b1.png', // в полный рост, машет
  S_point:   CDN + '8b89afaf8e00e0a46ea4d76ac473b1a2.png', // в полный рост, палец вверх
  S_thumb:   CDN + 'd9d838896ca0a5e16e7efa2439943fbd.png', // палец вверх + подмигивает — ПОХВАЛА
  S_tablet:  CDN + 'b57532bada44706da665a55d2ce2011e.png', // с планшетом
  S_jump:    CDN + '2f093e72fa038b855c80131ec3fba75c.png', // прыжок радости — финал
  S_face:    CDN + 'c5fe17b7a8d023ade2bbb05e574eef78.png', // портрет, говорит — мелкий аватар
  S_sad:     CDN + '4346ad94c2790cac390e684155a2ecba.png', // портрет, огорчена
  S_angry:   CDN + '9f3d342d38e036a9137ef3e270d9d79c.png', // портрет, нахмурена + молнии.
                                                           // ВНИМАНИЕ: только про опасность/
                                                           // ловушку, НИКОГДА про ребёнка.
  S_rule:    CDN + '8ab84c57bf234ea2e3bf8330b47c2db1.png', // портрет, палец вверх — РАЗБОР
  S_shh:     CDN + '29a83a8a9641bb860a679d7e5ba52d26.png', // портрет, палец у губ — секрет
  N_open:    CDN + 'a3dfec8b6a89762b454f0b5e660c2e78.png',
  N_wave:    CDN + '9dbffba2a03b29811719318b20070b4a.png',
  N_tablet:  CDN + '804a73df74595024fef5c7082428a668.png',
  N_thumb:   CDN + 'd185c5ed37536ac0063f735f7a15dd24.png',
  N_declare: CDN + '2677c94cc946bd788a3828099d6bcd49.png',
  N_jump:    CDN + '6d0893ce02e4926539d6f7e0601c6161.png',
  N_face:    CDN + '55f04ea8d0761b7aff9d21f23ebcbfef.png', // мелкий аватар в пузырях чата
  N_sulk:    CDN + '093c72c52ca8a8488fa54146997aa39d.png', // надулся — экран overblock
  N_idea:    CDN + '37bd8b4bb1cea47935613348ad16c660.png', // «а!» — задаёт вопрос
  N_think:   CDN + '76c0df0665c83c5944ae67cae2739f7e.png'  // думает — просит помощи
};
const VOICE = { simka: 'f', nolik: 'm' };
// ДВА ДЕТСКИХ ГОЛОСА (заказчик, 22.09.2026): Симка говорит kids-f, Нолик kids-m.
// Теги согласованы с заказчиком и заводятся на платформе под этими именами:
// kids-f — женский детский голос, kids-m — мужской детский.
// ⚠ Пол уходит вторым аргументом pushOneOff. Контракт @lesson/runtime сегодня
// объявляет только pushOneOff(text) и выбирает голос сам, поэтому два голоса
// зазвучат ровно тогда, когда раннер начнёт этот аргумент читать; урок со своей
// стороны передаёт его на каждой реплике.
const GOLOS = { f: 'kids-f', m: 'kids-m' };
const CHAR_NAME = { simka: { ru: 'Симка', uz: "Simka", en: 'Simka' }, nolik: { ru: 'Нолик', uz: "Nolik", en: 'Nolik' } };

// ─────────────────────────────────────────────────────────────────────────────
// 3. ЯЗЫК
// pick() принимает { ru, uz } | строку | готовый React-элемент.
// ─────────────────────────────────────────────────────────────────────────────
// Три языка курса. Порядок важен только для стенда приёмки; откат —
// всегда русский (правило курса).
const LANGS = ['ru', 'uz', 'en'];
const LangCtx = createContext('ru');
const useLang = () => useContext(LangCtx);
const usePick = () => {
  const lang = useLang();
  return useCallback((node) => {
    if (node == null) return '';
    if (typeof node === 'string' || React.isValidElement(node)) return node;
    return node[lang] !== undefined ? node[lang] : (node.ru || '');
  }, [lang]);
};
const LangProvider = LangCtx.Provider;

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
const markLang = (text, lang) => {
  const s = String(text || '');
  if (!s) return s;
  const mark = { uz: "[O'zbekcha tallaffuz] ", en: '[English pronunciation] ' }[lang];
  return (mark || '[Русское произношение] ') + s;
};






// ─────────────────────────────────────────────────────────────────────────────
// 5. ОЗВУЧКА — useAudio
// Один <audio> на урок. speak() всегда резолвится: если TTS упал или звук
// выключен — ждём estimateMs и идём дальше. Урок никогда не встаёт из-за звука.
// ─────────────────────────────────────────────────────────────────────────────
const AudioCtx = createContext(null);
const useAudio = () => useContext(AudioCtx);
const AudioProvider = AudioCtx.Provider;


// ─── ПЕРЕХОДНИК НА ОЗВУЧКУ ПЛАТФОРМЫ ───────────────────────────────────────
// Своего движка у урока больше нет (контракт @lesson/runtime). Но урок внутри
// построен на обещаниях: реплика — это speak(), который ОБЯЗАН когда-нибудь
// закрыться, иначе «Дальше» не отопрётся никогда. Платформа такого сигнала не
// даёт: только pushOneOff(text) и флаг isPlaying. Конец реплики выводим сами:
//   · isPlaying поднялся и снова упал — реплика отговорила, это норма;
//   · isPlaying не поднялся за 2,5 с — голоса нет: поднимаем failed (экран
//     обязан показать текст) и держим паузу по длине реплики;
//   · что бы ни случилось — закрываем на est + 8000. Урок не имеет права
//     зависнуть на сером «Дальше».
//
// ⚠ Платформа НЕ умеет обрывать реплику: stop() закрывает наше ожидание, но
// начатую фразу раннер договорит. На смене экрана она может налезть на
// следующую — у своего движка обрыв был, здесь его нет.
const PUSTAYA_OCHERED = [];

// ─── ОЗВУЧКА ВРЕМЕННО ВЫКЛЮЧЕНА (заказчик, 23.09.2026) ─────────────────────
// Сначала правим дизайн, озвучку и диалоги — потом. Пока флаг true: раннер
// платформы не получает ни одной реплики, текст реплик виден на экране
// (failed = true), кнопка паузы скрыта, «Дальше» не ждёт голоса.
// ВЕРНУТЬ ОЗВУЧКУ: поставить false во всех 25 файлах урока.
const OZVUCHKA_VYKL = false;
const pauzaBezGolosa = (text) => Math.max(600, Math.min(3000, String(text || '').length * 35));

function useAudioEngine(lang) {
  const p = usePlatformAudio(PUSTAYA_OCHERED);
  const pRef = useRef(p);
  pRef.current = p;
  // speak мемоизирован пустыми зависимостями — язык берём через ref, иначе
  // маркер застрянет на языке первого рендера.
  const langRef = useRef(lang);
  langRef.current = lang;

  const zvuki = usePlatformSfx();
  PLATF_SFX.verno = zvuki && zvuki.playCorrect;
  PLATF_SFX.neverno = zvuki && zvuki.playWrong;

  const [failed, setFailed] = useState(false);
  const [replayNonce, setReplayNonce] = useState(0);
  // Повтор по подсказке считается отдельно: он повторяет одну реплику, а не
  // пересказывает экран целиком (см. _fix/p4-podskazka.cjs).
  const [nudgeNonce, setNudgeNonce] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const zhdut = useRef([]);
  const tajm = useRef([]);
  // ⚠ Защёлка «озвучки нет» встаёт ОДИН раз и больше не падает: одна ложная
  // тревога — и урок до конца читается текстом вместо голоса. Поэтому failed
  // поднимаем, только пока голоса не было НИ РАЗУ.
  const bylZvuk = useRef(false);
  useEffect(() => () => { tajm.current.forEach(clearTimeout); }, []);

  const TIHO_MS = 6000;     // столько ждём старта дорожки, прежде чем счесть её пропавшей
  const PROMAHOV = 2;       // и только два промаха подряд значат «озвучки нет»

  // ── ОЧЕРЕДЬ РЕПЛИК ───────────────────────────────────────────────────────
  // Раннер платформы не умеет обрывать начатую фразу, а pushOneOff поверх
  // звучащей обрезает её на полуслове (жалоба п.7: «персонаж не договорил, а
  // урок уехал дальше»). Поэтому очередь держим сами: следующая реплика уходит
  // в раннер только после того, как предыдущая отговорила.
  const ochered = useRef(Promise.resolve());
  // Поколение растёт на stop()/abort(). Реплики, вставшие в очередь ДО обрыва,
  // просыпаются с чужим поколением и молча выходят — иначе после ответа
  // ребёнка урок дочитал бы отменённые варианты поверх разбора.
  const pokolenie = useRef(0);
  // Счётчик «сейчас говорим». Считаем ВСЮ реплику — от постановки в очередь до
  // конца звука, а не только время isPlaying: пока раннер грузит дорожку,
  // isPlaying ещё false, и по нему экран разблокировался бы раньше времени.
  const zanyatoRef = useRef(0);
  const [zanyato, setZanyato] = useState(0);
  const schet = useCallback((d) => {
    zanyatoRef.current = Math.max(0, zanyatoRef.current + d);
    setZanyato(zanyatoRef.current);
  }, []);
  const promahi = useRef(0);

  // fon = фоновая реплика: звучит в общей очереди, но замок содержимого не
  // поднимает. Так читаются варианты ответа: объяснение уже закончилось,
  // кнопки живые, и первое нажатие чтение обрывает.
  const speak = useCallback((text, gender, onStart, fon) => {
    const clean = sanitizeForTts(text);
    if (!clean) return Promise.resolve();
    if (OZVUCHKA_VYKL) {
      if (onStart) { try { onStart(); } catch (e) { /* no-op */ } }
      return sleep(pauzaBezGolosa(clean));
    }
    const est = estimateMs(clean);
    const moyo = pokolenie.current;
    if (!fon) schet(1);
    // СТРАХОВКА СЧЁТЧИКА. Потолок реплики лежит в общем списке таймеров, а
    // abort() этот список чистит, не закрывая ждущих: очередь остаётся с
    // незакрытым обещанием, busy не опускается, и экран заперт навсегда.
    // Этот таймер живёт отдельно от списка и опускает счётчик при любом исходе.
    let opuschen = false;
    const opustit = () => { if (!opuschen) { opuschen = true; if (!fon) schet(-1); } };
    const strahovka = setTimeout(opustit, est + 25000);

    const shag = () => {
      // Реплику отменили, пока она стояла в очереди, — не произносим.
      if (pokolenie.current !== moyo) return Promise.resolve();
      return new Promise((resolve) => {
        let gotov = false, zvuchal = false, opros = null, pusk = null;
        const finish = () => {
          if (gotov) return;
          gotov = true;
          if (opros) { clearInterval(opros); opros = null; }
          if (pusk) { clearInterval(pusk); pusk = null; }
          zhdut.current = zhdut.current.filter((f) => f !== finish);
          resolve();
        };
        zhdut.current.push(finish);

        // Фразу отдаём раннеру ТОЛЬКО в тишине. Если он ещё договаривает
        // предыдущую (например ту, которую оборвал stop()), ждём — но не
        // дольше 2,5 с, чтобы разбор ответа не отставал от нажатия.
        const nachalo = Date.now();
        const otdat = () => {
          // Экран узнаёт о начале реплики отсюда, а не по вызову speak():
          // между ними стоит очередь, и подсветка иначе уезжает вперёд голоса.
          if (onStart) { try { onStart(); } catch (e) { /* no-op */ } }
          // Маркер языка обязателен: без него ElevenLabs v3 читает базовый язык
          // неверно. Ставим здесь, а не в контенте, — тексты остаются чистыми.
          // Второй аргумент — голос: kid-f Симке, kid-m Нолику (заказчик,
          // 22.09.2026). Раннер, который его не читает, просто его не заметит.
          try { pRef.current.pushOneOff(markLang(clean, langRef.current), GOLOS[gender === 'm' ? 'm' : 'f']); } catch (e) { /* no-op */ }
          opros = setInterval(() => {
            if (gotov) return;
            if (pRef.current && pRef.current.isPlaying) {
              zvuchal = true;
              promahi.current = 0;
              // Звук пошёл — значит озвучка жива. Снимаем защёлку «голоса нет»:
              // без этого одна медленная дорожка в начале урока оставляла
              // реплики напечатанными до самого конца (жалоба п.1).
              if (!bylZvuk.current) { bylZvuk.current = true; setFailed(false); }
              return;
            }
            if (zvuchal) { finish(); return; }
            if (Date.now() - nachalo > TIHO_MS) {
              promahi.current += 1;
              if (!bylZvuk.current && promahi.current >= PROMAHOV) setFailed(true);
              zvuchal = true;   // больше не ждём старта, досиживаем по длине текста
              tajm.current.push(setTimeout(finish, Math.max(0, est - (Date.now() - nachalo))));
            }
          }, 120);
        };
        if (pRef.current && pRef.current.isPlaying) {
          pusk = setInterval(() => {
            if (gotov) return;
            if (!(pRef.current && pRef.current.isPlaying) || Date.now() - nachalo > 2500) {
              clearInterval(pusk); pusk = null;
              otdat();
            }
          }, 100);
        } else {
          otdat();
        }
        tajm.current.push(setTimeout(finish, est + 10000));
      });
    };

    const zakryt = () => { clearTimeout(strahovka); opustit(); };
    const p = ochered.current.then(shag, shag).then(zakryt, zakryt);
    ochered.current = p.catch(() => {});
    return p;
  }, []);

  // stop — «реплика закончена, идём дальше»: ждущие закрываются.
  const stop = useCallback(() => {
    pokolenie.current += 1;          // очередь отменяем, звучащую фразу раннер договорит сам
    const spisok = zhdut.current;
    zhdut.current = [];
    tajm.current.forEach(clearTimeout); tajm.current = [];
    spisok.forEach((f) => { try { f(); } catch (e) { /* no-op */ } });
  }, []);

  // abort — «этого не было»: ждущие выбрасываются НЕ закрываясь, иначе урок
  // сочтёт реплику договорённой и уедет вперёд вместо перезапуска экрана.
  const abort = useCallback(() => {
    pokolenie.current += 1;
    // Ждущих ВЫБРАСЫВАЕМ не закрывая — иначе урок сочтёт реплику договорённой
    // и уедет вперёд вместо перезапуска экрана. Но очередь при этом обязана
    // рассосаться: за это отвечает страховка счётчика внутри speak().
    zhdut.current = [];
    tajm.current.forEach(clearTimeout); tajm.current = [];
    ochered.current = Promise.resolve();
  }, []);

  const unlock = useCallback(() => { resumeSfx(); }, []);
  const toggle = useCallback(() => {
    try { pRef.current.toggleMute(); } catch (e) { /* no-op */ }
    setPauseCount((n) => n + 1);
  }, []);
  // tiho = повтор пришёл от подсказки при бездействии, а не от ребёнка.
  //
  // РЕПЛИКА ПОВТОРЯЕТСЯ ОДИН РАЗ, А НЕ ДВА (заказчик, 22.09.2026: «персонаж
  // повторяет одну и ту же фразу по нескольку раз»). Здесь было ДВА канала
  // разом: replay() раннера переигрывал последнюю дорожку, а счётчик поднимал
  // PersonaBubble, который произносил ту же строку ЗАНОВО через speak(). Замер
  // на экране «Интернет»: два speak() с разницей 5 мс, и так на каждом круге.
  // Оставлен счётчик: он всегда повторяет реплику ТЕКУЩЕГО экрана и идёт через
  // очередь урока, поэтому наложиться сам на себя не может. replay() раннера
  // переигрывает «последнюю дорожку», а это не обязательно нужная строка.
  const replay = useCallback((tiho) => {
    if (tiho) { setNudgeNonce((n) => n + 1); return; }
    setReplayNonce((n) => n + 1);
  }, []);

  return {
    speak, stop, abort, unlock, toggle, replay,
    paused: !!p.muted, pauseCount, replayNonce, nudgeNonce,
    on: true, playing: OZVUCHKA_VYKL ? false : !!p.isPlaying, failed: OZVUCHKA_VYKL || failed,
    // busy — «реплика в работе»: от постановки в очередь до конца звука.
    // Экраны запирают кнопки по нему, а не по playing (см. п.2 заказчика).
    busy: !OZVUCHKA_VYKL && zanyato > 0,
  };
}

// Проговорить и дождаться — даже если звука нет (тогда просто пауза по длине).
async function say(audio, text, gender) {
  const est = estimateMs(text);
  if (!audio) { await sleep(est); return; }
  await Promise.race([audio.speak(text, gender), sleep(est + 5000)]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SFX — WebAudio, без файлов. Второй аргумент = включён ли звук.
// ─────────────────────────────────────────────────────────────────────────────
let _ctx = null;
// WebAudio-контекст тоже создаётся «приостановленным», пока не было жеста, —
// разбудить его надо в том же касании, что и озвучку, иначе первые щелчки глухие.
function resumeSfx() {
  try { if (_ctx && _ctx.state === 'suspended') _ctx.resume(); } catch (e) { /* no-op */ }
}
// Звуки «верно/неверно» отдаёт платформа (useSfx). Переходник кладёт их
// сюда, а sfx() ниже проверяет их первыми и только потом синтезирует тон
// сам. Так урок звучит одинаково и на платформе, и на стенде.
const PLATF_SFX = { verno: null, neverno: null };

function sfx(kind, enabled) {
  if (kind === 'ok' && PLATF_SFX.verno) { try { PLATF_SFX.verno(); return; } catch (e) { /* no-op */ } }
  if (kind === 'wrong' && PLATF_SFX.neverno) { try { PLATF_SFX.neverno(); return; } catch (e) { /* no-op */ } }
  if (enabled === false || typeof window === 'undefined') return;
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
    if (kind === 'ok') { beep(680, 0.11, 0); beep(900, 0.14, 0.1); }
    else if (kind === 'wrong') { beep(300, 0.16, 0, 'sine', 0.1); beep(225, 0.2, 0.12, 'sine', 0.09); }
    else if (kind === 'tap') beep(760, 0.045, 0, 'triangle', 0.045);
    else if (kind === 'msg') beep(880, 0.06, 0, 'sine', 0.05);
    else if (kind === 'pop') beep(600, 0.06, 0, 'triangle', 0.055);
    else if (kind === 'win') { beep(660, 0.11, 0); beep(880, 0.11, 0.1); beep(1100, 0.2, 0.2); }
    else if (kind === 'boot') { beep(196, 0.34, 0, 'sine', 0.045); beep(294, 0.4, 0.1, 'sine', 0.035); }
    else if (kind === 'blip') beep(1046, 0.05, 0, 'triangle', 0.032);
    else if (kind === 'ready') { beep(523, 0.16, 0, 'sine', 0.05); beep(659, 0.16, 0.09, 'sine', 0.045); beep(784, 0.3, 0.18, 'sine', 0.04); }
  } catch (e) { /* no-op */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ЖУРНАЛ ОТВЕТОВ И ПАМЯТЬ ЭКРАНОВ
// log()   — один ответ на экран, перезапись по screenId (возврат «Назад» не плодит дубли).
// store   — чтобы экран, на который вернулись, показал уже решённое состояние.
//           Живёт до конца урока. localStorage запрещён.
// ВАЖНО: log() зовём только там, где ребёнок действительно ОТВЕЧАЛ. Экраны-
// производство (выбор цвета значка, сбор Кодекса) в журнал не пишем — иначе
// в аналитике они выглядят как правильные ответы.
// ─────────────────────────────────────────────────────────────────────────────
const LogCtx = createContext(() => {});
const StoreCtx = createContext({ get: () => {}, set: () => {} });
// Перезапуск текущей страницы — отдельный маленький контекст: он нужен и шапке
// (кнопка «Повторить»), и в принципе любому экрану, а тащить его пропсами через
// одиннадцать экранов и Stage — лишний шум.
const PageCtx = createContext({ restart: () => {} });
const PageProvider = PageCtx.Provider;
const usePage = () => useContext(PageCtx);
const useLog = () => useContext(LogCtx);
const useStore = () => useContext(StoreCtx);
const LogProvider = LogCtx.Provider;
const StoreProvider = StoreCtx.Provider;

function useAnswerLog() {
  const rows = useRef([]);
  const log = useCallback((row) => {
    const i = rows.current.findIndex((r) => r.screenId === row.screenId);
    const next = Object.assign({}, row, { ts: Date.now() });
    if (i >= 0) rows.current[i] = next; else rows.current.push(next);
  }, []);
  return [rows, log];
}

function useScreenStore() {
  const box = useRef({});
  return useMemo(() => ({
    get: (k) => box.current[k],
    set: (k, v) => { box.current[k] = v; }
  }), []);
}

// Payload для onFinished. Скоринга нет — поля-заглушки нужны раннеру платформы.
function buildPayload({ meta, studentName, lang, startedAt, answers, extra }) {
  return Object.assign({
    lessonId: meta.lessonId,
    lessonTitle: meta.lessonTitle[lang],
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
function PersonaBubble({ who = 'simka', pose, text, onSpoken, nonce }) {
  const pick = usePick();
  const audio = useAudio();
  const lang = useLang();
  const line = pick(text);
  const seen = useRef('');
  const spoken = useRef('');
  const key = String(nonce || 0) + '|' + line;
  const [again, setAgain] = useState(0);

  // Реплику НЕ печатаем на экране (решение 2026-08-04): урок ведётся голосом,
  // ребёнок должен смотреть на Симку и Нолика, а не читать за ними. Это же
  // делает урок проходимым для того, кто ещё не читает. Тот же приём, что уже
  // работает на экране 1 (hero-fallback): текст возвращается ТОЛЬКО когда
  // озвучки фактически нет — иначе экран ничего не сообщит.
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
  // «Повторить» в шапке страницы (audio.replayNonce). Складываем — сторожу ниже
  // важно только то, что счётчик изменился.
  const bump = again + ((audio && audio.replayNonce) || 0) + ((audio && audio.nudgeNonce) || 0);
  // Повтор от подсказки при бездействии отличаем от повтора по просьбе
  // ребёнка: первый уходит фоном, второй запирает экран, как и всякая речь.
  const nudgeN = (audio && audio.nudgeNonce) || 0;
  const nudgeSeen = useRef(nudgeN);

  useEffect(() => {
    if (!line) return;
    // Повтор по просьбе ребёнка обязан пройти сквозь этот сторож.
    if (!bump && seen.current === key) return;
    seen.current = key;
    // ФОН = «звучит, но кнопки живые». Подсказка не должна отнимать у ребёнка
    // право нажать вариант: он как раз надумал ответить, а экран отвечал
    // мёртвым касанием (заказчик, 22.09.2026).
    const fon = nudgeN !== nudgeSeen.current;
    nudgeSeen.current = nudgeN;
    let dead = false;
    (async () => {
      if (audio) await audio.speak(line, VOICE[who] || 'f', undefined, fon);
      else await sleep(estimateMs(line));
      if (dead) return;
      await sleep(400);
      // Проверку dead после паузы снимать НЕЛЬЗЯ. audio.stop() резолвит разом
      // ВСЕ ждущие speak() (resolvers.current в движке общий), поэтому без неё
      // нажатие «послушать ещё раз» дорезольвит прерванную реплику и урок
      // уедет на экран вперёд.
      if (dead) return;
      // ...и сам повтор урок вперёд тоже не двигает: иначе экран проматывался
      // бы на каждом нажатии.
      if (spoken.current === key) return;
      spoken.current = key;
      if (onSpoken) onSpoken();
    })();
    return () => { dead = true; };
  }, [key, lang, bump]); // eslint-disable-line react-hooks/exhaustive-deps

  const replay = () => {
    if (!line) return;
    sfx('tap', audio && audio.on);
    if (audio) audio.stop();
    setAgain((n) => n + 1);
  };

  const speaking = !!(audio && audio.playing);
  const replayLabel = pick({ ru: 'Послушать ещё раз', uz: "Yana bir marta tinglash", en: 'Listen again' });

  return (
    <div className={'speaker speaker-' + who + (silent ? ' speaker-silent' : '')} key={key}>
      <img
        className="speaker-av"
        src={pose || (who === 'nolik' ? POSES.N_face : POSES.S_face)}
        alt=""
        draggable="false"
        onClick={silent ? replay : undefined}
      />
      {silent ? (
        <>
          <button
            type="button"
            className={'speaker-voice' + (speaking ? ' is-on' : '')}
            onClick={replay}
            title={replayLabel}
            aria-label={replayLabel}
          >
            <span className="sv-bars" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          </button>
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

// Статичная реплика: <Stage speaker={persona('simka', 'S_rule', C.s4.say)} />
const persona = (who, poseKey, text) => ({ who, pose: POSES[poseKey], text });

// Живая реплика: [bubble, say] = useSpeaker(...); say(text, 'S_thumb', thenCallback).
// Отвечает всегда Симка — разбор и похвала её работа, даже если экран ведёт Нолик.
function useSpeaker(who, poseKey, text) {
  const [state, setState] = useState({ who, pose: POSES[poseKey], text, then: null, n: 0 });
  const say = useCallback((nextText, nextPoseKey, then) => {
    setState((s) => ({
      who: 'simka',
      pose: nextPoseKey ? POSES[nextPoseKey] : s.pose,
      text: nextText,
      then: then || null,
      n: s.n + 1
    }));
  }, []);
  return [state, say];
}
const toSpeaker = (s) => ({ who: s.who, pose: s.pose, text: s.text, onSpoken: s.then || undefined, nonce: s.n });

// Склеить несколько фраз в одну озвучку.
const join = (...parts) => parts.filter(Boolean).join(' ');

// ─────────────────────────────────────────────────────────────────────────────
// 9. КАРКАС ЭКРАНА
// ─────────────────────────────────────────────────────────────────────────────
// ТУМБЛЕРА ЗВУКА НЕТ — снят намеренно (решение 2026-08-03): урок audio-led,
// ребёнок не должен иметь возможности его выключить. Взамен работает audio.failed:
// если голоса фактически нет, экран обязан показать текст (см. useAudioEngine).
// Кнопка «Послушать ещё раз» — не тумблер, она только переигрывает, её можно ставить.

// heroFixed — закрепить высоту зоны персонажа, чтобы карточка под ней не прыгала
// при смене говорящего (заказчик, prompt-page-04). Включаем ТОЧЕЧНО, там где
// персонажи меняются много раз подряд: на остальных экранах постоянная высота
// добавила бы пустоты под портретными позами и съела запас «без прокрутки».
// Через сколько молчания подсказать и как часто повторять. 14 секунд — это
// примерно вдвое дольше самой длинной реплики экрана: ребёнок успевает
// дослушать и подумать, прежде чем его подтолкнут.
// ── ПОДСКАЗКА ДЕЙСТВИЯ ──────────────────────────────────────────────────────
// Добавляется в ГОЛОС к строке задания, если в ней самой нет глагола действия.
// Печатной строки не касается: она и так занимает три строки на узбекском.
const DEJSTVIE = {
  vybor: { ru: 'Выбери ответ.',
           uz: "Javobni tanlang.",
           en: 'Choose an answer.' },
  odin:  { ru: 'Нажми на него на экране.',
           uz: "Uni ekranda bosing.",
           en: 'Tap it on the screen.' }
};
// Глаголы действия во всех трёх языках. Если хоть один есть — задание уже
// говорит, что делать, и подсказку не добавляем.
const EST_GLAGOL = /нажм|выбер|отмет|поставь|опусти|запусти|собер|найди|отправ|скаж|покаж|послуш|проверь|сделай|введи|напиш|реши|жми|отдай|спрячь|закрой|запри|сними|убер|добав|замен|сыграй|открой|разлож|попроб|тапн|bos|tanla|belgila|top|ayt|qara|tekshir|tushir|yoz|och|yubor|eshit|qil|pick|tap|choose|find|press|listen|check|mark|send|show|drop|pull|open|write|say/i;

const FIRST_MS = 14000;
const AGAIN_MS = 16000;
// СКОЛЬКО РАЗ ПОДСКАЗЫВАТЬ (заказчик, 22.09.2026). Повтор был бесконечным:
// каждые 16 секунд персонаж заново читал реплику, и так до самого ответа.
// Хуже того, повтор поднимал busy, а по busy зона содержимого гасится —
// ребёнок, который как раз надумал нажать вариант, упирался в мёртвый экран.
// Теперь голосом подсказываем дважды, дальше только пульсирует нажимаемое,
// и через пять кругов подсказка умолкает совсем.
// ГОЛОСОМ БОЛЬШЕ НЕ ПОДСКАЗЫВАЕМ (заказчик, 24.09.2026: «ovozlar qayta-qayta
// o'ynayapti»). Замер на экране 2 урока 5: реплика звучала заново через 8 и
// через 24 секунды после конца чтения вариантов — ребёнок слышал вступление
// трижды и принимал это за сбой. Остаётся пульсация нажимаемого, а заново
// послушать можно кнопкой у персонажа.
const PODSKAZOK_GOLOSOM = 0;
const PODSKAZOK_VSEGO = 5;

const Stage = ({ children, eyebrow, screen, total, nav, speaker, overlay, heroFixed, done,
                amplua = 'narrator', feedback = null, feedbackSaid = false }) => {
  const pick = usePick();
  // Нужен подсказке при бездействии: она повторяет реплику голосом.
  // В остальных уроках эта строка появилась вместе со строкой задания;
  // l01 её не получил — он единственный, кто не передаёт feedback.
  const stageAudio = useAudio();
  // Признак «сейчас говорят» для замка содержимого (п.2). Берём busy, а не
  // playing: между «реплику отдали раннеру» и «пошёл звук» playing ещё false,
  // и по нему кнопки успевали ожить прямо посреди фразы.
  const govoryat = !!(stageAudio && stageAudio.busy);
  // РОСТ ПЕРСОНАЖА ВЫБИРАЕТ ЭКРАН, А НЕ ПРОП (п.3). Пустая зона содержимого
  // значит «говорят только персонажи» — тогда крупный рост; есть картинка или
  // задание — рабочий. Проп amplua остался в сигнатуре ради вызовов, но рост
  // больше не задаёт: именно из-за него рост и разъезжался от урока к уроку.
  const deti = (Array.isArray(children) ? children : [children])
    .flat(9).filter((x) => x !== null && x !== undefined && x !== false && x !== '');
  const rost = deti.length === 0 ? 'narrator' : 'helper';
  // ── ПОДСКАЗКА ПРИ БЕЗДЕЙСТВИИ ───────────────────────────────────────────
  // Текстом подсказывать нельзя — часть детей не читает. Поэтому два канала
  // без букв: персонаж повторяет реплику, а нажимаемое пульсирует.
  // СТРОКА ЗАДАНИЯ НЕ ПЕЧАТАЕТСЯ (заказчик, 24.09.2026): «надпись не нужна,
  // персонаж сам расскажет». Задание только звучит — его произносит эффект
  // «ЗАДАНИЕ ЗВУЧИТ» ниже, после реплики и до вариантов. В августе строку уже
  // снимали и возвращали: тогда задание не звучало, реплика уходила только в
  // .sv-sr для скринридера. С 22.09 оно звучит, и печать не возвращаем.
  const askLine = feedback ? String(pick(feedback) || '').trim() : '';
  const sayLine = speaker && speaker.text ? String(pick(speaker.text) || '').trim() : '';
  const nudgeAudioRef = useRef(stageAudio);
  nudgeAudioRef.current = stageAudio;

  // ── ЗАДАНИЕ ЗВУЧИТ, А НЕ ТОЛЬКО ПЕЧАТАЕТСЯ (заказчик, 22.09.2026, п.7) ──
  // Реплика персонажа вводит тему, а что именно делать — говорит эта строка.
  // Она печаталась и молчала: ребёнок слышал рассказ, потом список ответов, а
  // вопроса не слышал вовсе. Теперь Stage произносит её сам — после реплики и
  // до вариантов. Порядок держится сам собой: эффекты React идут снизу вверх,
  // PersonaBubble встаёт в очередь первым, этот эффект вторым, Choice третьим.
  const skazano = useRef('');
  const askRef = useRef(askLine); askRef.current = askLine;
  const sayRef = useRef(sayLine); sayRef.current = sayLine;
  const povtor = (stageAudio && (stageAudio.replayNonce || 0)) || 0;
  useEffect(() => {
    const a = nudgeAudioRef.current;
    const vopros = askRef.current;
    // feedbackSaid — задание уже прозвучало в реплике персонажа слово в слово.
    // Второй раз тот же вопрос — это и есть дубль, на который жаловались.
    if (!a || typeof a.speak !== 'function' || !vopros || feedbackSaid) return;
    const kluch = povtor + '|' + vopros;
    if (skazano.current === kluch) return;
    skazano.current = kluch;
    // Реплика уже содержит задание слово в слово — второй раз не нужно.
    if (sayRef.current && sayRef.current.indexOf(vopros) >= 0) return;
    // ЕСЛИ В ЗАДАНИИ НЕТ ГЛАГОЛА, ДОБАВЛЯЕМ ЕГО ГОЛОСОМ. «Что скажешь Нолику?»
    // — вопрос, а не задание: тому, кто не читает, он не говорит ни где ответ,
    // ни что с ним делать. Смотрим, сколько нажимаемого на экране, и называем
    // действие. В печатную строку это НЕ уходит — она остаётся короткой.
    let skazat = vopros;
    if (!EST_GLAGOL.test(vopros)) {
      const el = stageRef.current;
      const knopki = el ? el.querySelectorAll('.stage-content button, .stage-content [role="button"]') : [];
      if (knopki.length >= 2) skazat = vopros + ' ' + pick(DEJSTVIE.vybor);
      else if (knopki.length === 1) skazat = vopros + ' ' + pick(DEJSTVIE.odin);
    }
    a.speak(skazat);
  }, [askLine, povtor]); // eslint-disable-line react-hooks/exhaustive-deps
  const stageRef = useRef(null);
  const [nudging, setNudging] = useState(false);

  useEffect(() => {
    if (done) return undefined;                  // задание решено — молчим
    let wait = null;
    let calm = null;
    let krug = 0;                                // сколько раз уже подсказали

    const fire = () => {
      const el = stageRef.current;
      const a = nudgeAudioRef.current;
      // В содержимом жать нечего — значит, ждут «Дальше», и подсвечивать надо
      // её. Раньше подсказка на таком экране молча уходила на следующий круг,
      // и ребёнок, который не понял, что делать, не получал вообще ничего.
      let targets = el ? el.querySelectorAll(
        '.stage-content button:not([disabled]), .stage-content [role="button"]') : [];
      if (!targets.length && el) targets = el.querySelectorAll('.stage-nav .btn-accent:not([disabled])');
      if (!targets.length) { wait = setTimeout(fire, AGAIN_MS); return; }
      // Персонаж ещё говорит — не перебиваем и отсчёт тишины начинаем ЗАНОВО.
      // По busy, а не по playing: в паузе между «отдали» и «зазвучало» playing
      // false, и подсказка успевала влезть в середину реплики.
      // Досиживать остаток круга нельзя: на экране с длинной репликой (реплика
      // экрана «Интернет» — 14 с) подсказка падала через пару секунд после
      // того, как Симка договорила, и ребёнок не успевал даже посмотреть на
      // варианты. Теперь после каждой реплики отсчёт идёт с нуля.
      if (a && (a.busy || a.playing)) { wait = setTimeout(fire, FIRST_MS); return; }
      krug += 1;
      // true = «тихий» повтор: одна реплика, без перечитывания вариантов, и
      // фоном — замок содержимого он не поднимает.
      if (krug <= PODSKAZOK_GOLOSOM) {
        try { if (a && a.replay) a.replay(true); } catch (e) { /* no-op */ }
      }
      setNudging(true);
      calm = setTimeout(() => setNudging(false), 2200);
      if (krug < PODSKAZOK_VSEGO) wait = setTimeout(fire, AGAIN_MS);
    };

    const arm = () => { krug = 0; clearTimeout(wait); setNudging(false); wait = setTimeout(fire, FIRST_MS); };
    arm();

    const el = stageRef.current;
    const reset = () => arm();
    if (el) {
      el.addEventListener('pointerdown', reset, true);
      el.addEventListener('keydown', reset, true);
    }
    return () => {
      clearTimeout(wait); clearTimeout(calm);
      if (el) {
        el.removeEventListener('pointerdown', reset, true);
        el.removeEventListener('keydown', reset, true);
      }
    };
    // govoryat в зависимостях НЕ случайно: цикл перезаводится на каждой смене
    // «говорят / молчат», то есть отсчёт тишины всегда начинается от КОНЦА
    // реплики. Без этого таймер шёл от появления экрана, и на длинной реплике
    // подсказка срабатывала почти сразу после неё, а потом на каждом круге —
    // ровно то, что видно в записи заказчика.
  }, [done, govoryat]);

  return (
    <div ref={stageRef} className={'stage lc-slide lc-' + rost + (heroFixed ? ' stage-hero-fixed' : '') + (nudging ? ' is-nudge' : '') + (govoryat ? ' is-speaking' : '')}>
      {/* ЗОНА 1 — прогресс: 6px, во всю ширину, приклеен к верху (Конституция
          §2 и §5). Полоса вынута из шапки: раньше она стояла внутри .limit и
          зависела от полей шапки.
          .progress-track ОСТАВЛЕН ВНУТРИ ЗОНЫ НАМЕРЕННО: на него смотрит
          UI-тур (шаг 'progress', sel: '.progress-track'), и без этого узла
          подсветка тура целилась бы в пустоту. */}
      <div className="lc-progress">
        <div className="progress-track">
          <div className="progress-bar" style={{ width: ((screen + 1) / total) * 100 + '%' }} />
        </div>
      </div>
      <div className="stage-header">
        <div className="limit">
          <div className="chrome">
            <div className="eyebrow"><span className="dot" />{pick(eyebrow)}</div>
            {/* Счётчик и кнопка стоят в одной строке справа и выровнены по
                центру по вертикали. Кнопка идёт ПОСЛЕ счётчика и ничего не
                перекрывает: это обычные соседи во флексе с общим gap.
                На первом экране (интро) кнопки нет — там Stage вызывают без nav,
                и это же условие гасит её. */}
            <div className="chrome-side">
              <div className="mono counter">{String(screen + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
              {nav && <PauseBtn done={done} />}
            </div>
          </div>
        </div>
      </div>
      {/* ЗОНА 3 — Stage: персонаж и содержимое в ОДНОЙ зоне, чтобы доли роста
          и картинки считались от неё, а не от всего экрана (Конституция §4).
          ЗОНЫ ОБРАТНОЙ СВЯЗИ ЗДЕСЬ НЕТ. В эталоне l1b она заведена и погашена
          (строку вопроса заказчик зачеркнула на живом экране 24.08.2026); в
          уроке 1 задание с самого начала живёт только в речи, поэтому пустую
          зону не заводим вовсе — иначе она держала бы высоту (замер эталона:
          43px пустоты между содержимым и навигацией на 844x390). */}
      <div className="lc-stage">
        {speaker && (
          <div className="speaker-wrap"><div className="limit"><PersonaBubble {...speaker} /></div></div>
        )}
        {/* Строки задания здесь нет (заказчик, 24.09.2026): задание звучит
            голосом, см. «ЗАДАНИЕ ЗВУЧИТ» и комментарий у askLine выше. */}
        <div className={'stage-content' + (speaker ? ' has-speaker' : '')}>
          <div className="limit stack stagger">{children}</div>
        </div>
      </div>
      {/* Пауза стоит МЕЖДУ «Назад» и «Дальше» — все три кнопки, которым учит
          тур, оказываются в одном ряду, и подсказки идут слева направо.
          Позиционируется абсолютно, чтобы не трогать контракт пропса nav
          (там ровно две кнопки, и экраны передают их сами). */}
      {nav && <div className="stage-nav"><div className="limit navrow">{nav}</div></div>}
      {overlay}
    </div>
  );
};

// ПАУЗА. Останавливает озвучку, а вместе с ней и весь урок: экраны ведёт голос,
// автоперелистывания по таймеру в уроке нет. Иконка сама показывает состояние —
// подпись ребёнку не нужна.
// ЭТО НЕ ТУМБЛЕР ЗВУКА. Кнопка «послушать ещё раз» рядом с персонажем живёт своей
// жизнью: пауза её не трогает, она паузу не трогает. Кнопки намеренно разнесены
// по экрану — низ против верха, — чтобы ребёнок их не путал. Полного отключения
// звука в уроке по-прежнему нет и быть не должно.
const PauseBtn = ({ done }) => {
  const pick = usePick();
  const audio = useAudio();
  const page = usePage();
  // ОДИН СЛОТ, ДВЕ РОЛИ (заказчик, 2026-08-06). Пока страница идёт — «Пауза».
  // Когда страница закончилась — «Повторить».
  //
  // ПРИЗНАК КОНЦА СТРАНИЦЫ ПРИХОДИТ ОТ ЭКРАНА (проп done), а не угадывается по
  // тишине. Прежняя догадка «озвучка молчит дольше секунды» ломала главное:
  // между репликами и между кадрами киноленты тишина длится дольше секунды, и
  // кнопка успевала превратиться в «Повторить». Ребёнок жал на неё, думая, что
  // ставит паузу, — и переигрывал реплику. Ровно на это и жаловался заказчик.
  // Теперь done = то же условие, по которому разблокируется «Дальше»: страница
  // отработала. Пока оно ложно, кнопка остаётся «Паузой», сколько бы ни молчали.
  const playing = !!(audio && audio.playing);
  const paused = !!(audio && audio.paused);
  if (OZVUCHKA_VYKL || !audio || !audio.toggle) return null;
  const replayMode = !!done && !playing && !paused;
  const label = pick(replayMode ? { ru: 'Повторить', uz: "Takrorlash", en: 'Replay' }
    : paused ? { ru: 'Продолжить', uz: "Davom etish", en: 'Continue' } : { ru: 'Пауза', uz: "Pauza", en: 'Pause' });
  return (
    <button type="button" className={'pause-btn' + (paused ? ' is-paused' : '') + (replayMode ? ' is-replay' : '')}
      onClick={() => {
        sfx('tap', true);
        // На паузе кнопка ВСЕГДА снимает паузу и никогда не переигрывает.
        // «Повторить» = перезапуск страницы с первой реплики, а не переигрывание
        // последней. Раньше здесь звался audio.replay(), и на конце страницы это
        // выглядело как «ничего не произошло»: последняя реплика уже отзвучала,
        // повтор её же ничего не менял.
        if (replayMode) { page.restart(); return; }
        audio.toggle();
      }} title={label} aria-label={label}>
      {replayMode ? (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 11.5a8 8 0 1 1-2.5-5.8" /><path d="M20 4v5h-5" />
        </svg>
      ) : paused ? (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="7" y="5.5" width="3.6" height="13" rx="1.6" fill="currentColor" />
          <rect x="13.4" y="5.5" width="3.6" height="13" rx="1.6" fill="currentColor" />
        </svg>
      )}
    </button>
  );
};

const BackBtn = ({ onPrev }) => {
  const pick = usePick();
  const audio = useAudio();
  if (!onPrev) return <span />;
  return (
    <button className="btn-ghost" onClick={() => { sfx('tap', audio && audio.on); onPrev(); }}>
      {pick({ ru: 'Назад', uz: "Orqaga", en: 'Back' })}
    </button>
  );
};

// force=true — кнопка живёт даже во время озвучки (нужно только UI-туру,
// где ребёнок обязан нажать именно её). Везде остальном force НЕ ставить:
// правило модуля — не пускать вперёд, пока наставница не договорила.
const NextBtn = ({ disabled, onClick, label, id, force }) => {
  const pick = usePick();
  const audio = useAudio();
  // busy движка, а не playing: «Дальше» должна быть серой и те секунды, пока
  // раннер только грузит дорожку, иначе ребёнок проскакивает реплику целиком.
  const busy = !!(audio && audio.busy);
  // Кольцо (референс uiverse/friendly-dragon-76) вешаем на одноразовый класс, а не
  // на :active — палец поднимается раньше, чем анимация доигрывает, и она обрывается.
  const [ring, setRing] = useState(0);
  const ringTimer = useRef(null);
  useEffect(() => () => clearTimeout(ringTimer.current), []);
  return (
    <button
      id={id}
      className="btn-accent"
      data-ring={ring || undefined}
      disabled={disabled || (!force && busy)}
      onClick={() => {
        sfx('tap', audio && audio.on);
        setRing((n) => n + 1);
        clearTimeout(ringTimer.current);
        ringTimer.current = setTimeout(() => setRing(0), 460);
        if (onClick) onClick();
      }}
      style={{ marginLeft: 'auto' }}
    >
      {pick(label || { ru: 'Дальше', uz: "Davom etish", en: 'Next' })}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. МЕЛКИЕ КОМПОНЕНТЫ
// ─────────────────────────────────────────────────────────────────────────────

// Одна строка без переноса: карточки ответов держат одинаковую высоту.
// Шрифт сжимается шагами по 0.25px, пока строка не влезет; дальше — многоточие.
//
// ПОЧЕМУ ResizeObserver, а не только window.resize (было в уроках 1–3):
// строку сжимает не окно, а её собственная ширина. Она меняется и без ресайза —
// появился чип, выросло облако Симки, колонка переехала на другую строку сетки.
// Плюс Manrope грузится асинхронно: до подмены шрифта метрики другие, и первый
// расчёт врёт. Поэтому: ResizeObserver на родителе + document.fonts.ready.
// Наблюдаем РОДИТЕЛЯ, а не саму строку: его ширина от размера шрифта внутри
// не зависит, поэтому обратной связи и зацикливания нет.
// КЕГЛИ ПО ЭТАЛОНУ l1b (27.08.2026): было 15/11. Потолок 15 — это меньше
// разрешённых регламентом 17px, то есть вариант ответа выходил заведомо мелким
// (замер 1920x949: 15px при кегле кнопки «Дальше» 22). Пол 12, а не 11: на 15
// длинный узбекский текст не сжимается, а разъезжается.
function FitLine({ children, max = 19, min = 12 }) {
  const ref = useRef(null);
  const lastW = useRef(-1);
  const text = String(children ?? '');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let size = max;
      el.style.fontSize = size + 'px';
      let guard = 0;
      while (el.scrollWidth > el.clientWidth + 1 && size > min && guard++ < 60) {
        size -= 0.25;
        el.style.fontSize = size + 'px';
      }
    };
    // Пересчитываем только когда реально изменилась ограничивающая ширина.
    const measure = (force) => {
      const w = el.clientWidth;
      if (!force && w === lastW.current) return;
      lastW.current = w;
      fit();
    };
    measure(true);
    if (typeof window === 'undefined') return;
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure(false));
      ro.observe(el.parentElement || el);
    }
    let t = null;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => measure(true), 160); };
    window.addEventListener('resize', onResize);
    // после подмены веб-шрифта метрики меняются — пересчитываем принудительно
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
// ИКОНКИ. ЭМОДЗИ В УРОКАХ ЗАПРЕЩЕНЫ (решение 2026-08-03) — ни 🎮, ни ✓, ни ★.
// Причины: эмодзи рисуются шрифтом системы (на Windows, Android и iOS выглядят
// по-разному и ломают единый стиль), не принимают цвет из токенов и читаются
// скринридером как отдельное слово. Любая иконка — только отсюда.
// Стиль: линия 2.1px, currentColor, viewBox 24 — как у остальных SVG в уроках.
// ─────────────────────────────────────────────────────────────────────────────
const ICONS = {
  check:   { d: 'M4.5 12.6l5 5 10-11.2' },
  cross:   { d: 'M6.5 6.5l11 11M17.5 6.5l-11 11' },
  star:    { d: 'M12 3.6l2.7 5.7 6.2.8-4.5 4.3 1.1 6.1-5.5-3-5.5 3 1.1-6.1L3.1 10.1l6.2-.8z', solid: true },
  shield:  { d: 'M12 3.2l7.6 2.8v6.4c0 4.9-3.3 8.1-7.6 9.8-4.3-1.7-7.6-4.9-7.6-9.8V6z', solid: true },
  bolt:    { d: 'M13.2 2.6L5.6 13.8h5.3l-1 7.6 7.6-11.2h-5.3z', solid: true },
  lock:    { d: 'M5.8 10.8h12.4v9.4H5.8zM8.8 10.8V8.2a3.2 3.2 0 0 1 6.4 0v2.6' },
  eye:     { d: 'M2.4 12s3.7-6.2 9.6-6.2S21.6 12 21.6 12s-3.7 6.2-9.6 6.2S2.4 12 2.4 12zM12 9.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2z' },
  key:     { d: 'M15.4 3.4a5.1 5.1 0 1 0-4.6 7.6l-7.4 7.4v2.2h2.4l.4-1.8h1.9v-1.9h1.9l1.5-1.5a5.1 5.1 0 0 0 3.9-12zM16.6 7.2h.02' },
  gamepad: { d: 'M7.2 9.4h9.6a4.4 4.4 0 0 1 0 8.8H7.2a4.4 4.4 0 0 1 0-8.8zM9.6 13.8H7.4M8.5 12.7v2.2M15.4 12.9h.02M17.3 14.8h.02' },
  screen:  { d: 'M3.4 5.4h17.2v10.4H3.4zM9 19.4h6M10.4 8.6l4.4 2.6-4.4 2.6z' },
  chat:    { d: 'M4 5.6h16v9.8H9.2l-5.2 4.2z' },
  search:  { d: 'M10.8 4.4a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8zM15.6 15.8l4.6 4.6' },
  family:  { d: 'M8.6 10.4a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6zM3.4 20c0-3 2.3-5.2 5.2-5.2s5.2 2.2 5.2 5.2M16.8 8.2a2.4 2.4 0 1 0 0 4.8M20.6 20c0-2.2-1.4-3.9-3.4-4.5' },
  teacher: { d: 'M4 4.8h13.4v9.4H4zM7.4 18.6h6.6M20.4 7.4v7.6M9 8.6h4' },
  person:  { d: 'M12 11.2a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6zM5.4 20c0-3.5 3-6.2 6.6-6.2s6.6 2.7 6.6 6.2' },
  robot:   { d: 'M6.8 8.8h10.4v9.4H6.8zM9.6 12.6h.02M14.4 12.6h.02M12 5.4v3.4M3.6 11.8v3.4M20.4 11.8v3.4M10.4 15.6h3.2' },
  photo:   { d: 'M3.4 7.6h4l1.5-2.6h6.2l1.5 2.6h4v11.8H3.4zM12 10.4a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z' },
  clock:   { d: 'M12 4.2a7.8 7.8 0 1 0 0 15.6 7.8 7.8 0 0 0 0-15.6zM12 8.2v4.4l3 1.9' },
  pause:   { d: 'M9.2 5.4v13.2M14.8 5.4v13.2' },
  arrowL:  { d: 'M19 12H5.4M11 5.6L4.6 12l6.4 6.4' },
  arrowR:  { d: 'M5 12h13.6M13 5.6L19.4 12 13 18.4' },
  gauge:   { d: 'M3.4 15.4a8.6 8.6 0 0 1 17.2 0M12 15.4l4.4-4.4' },
  hash:    { d: 'M8.4 4.4L6.8 19.6M16.4 4.4l-1.6 15.2M4.6 9h15.2M3.8 15h15.2' },
  hourglass: { d: 'M7 4.4h10M7 19.6h10M8.2 4.4v3.2L12 12l3.8-4.4V4.4M8.2 19.6v-3.2L12 12l3.8 4.4v3.2' }
};
const ICON_NAMES = Object.keys(ICONS);

const Icon = ({ name, size = 24, className }) => {
  const ic = ICONS[name];
  if (!ic) return null;
  return (
    <svg className={'ic' + (className ? ' ' + className : '')} width={size} height={size} viewBox="0 0 24 24"
      aria-hidden="true" focusable="false"
      fill={ic.solid ? 'currentColor' : 'none'} stroke={ic.solid ? 'none' : 'currentColor'}
      strokeWidth={ic.solid ? 0 : 2.1} strokeLinecap="round" strokeLinejoin="round">
      <path d={ic.d} />
    </svg>
  );
};

const Hero = ({ src, size = 150, anim = 'in' }) => (
  <img src={src} alt="" className={'hero hero-' + anim} draggable="false" style={{ width: size, maxWidth: '42vw' }} />
);

// Подсказка / промежуточный вывод. Отдельный визуальный канал: не «ошибка»
// (жёлтый hint, а не красный wrong). Место под лестницу подсказок.
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
// 11. ВЫБОР ОТВЕТА (веди-до-верного)
// options: [{ text:{ru,uz}, ok?:{ru,uz}, why?:{ru,uz} }] — ok у верного, why у остальных.
// Неверный вариант гаснет насовсем, Симка проговаривает его why и ребёнок пробует
// снова. Похвала — из ok самого варианта, никаких общих «молодец».
// onSay(text, isCorrect) — урок сам решает, какую позу поставить и идти ли дальше.
// ─────────────────────────────────────────────────────────────────────────────
function Choice({ options, correct, onResolved, stored, onSay }) {
  const pick = usePick();
  const audio = useAudio();
  // Пока звучит вопрос или читаются варианты, ряд не принимает нажатие (п.2).
  // Каркас уже гасит касания по .is-speaking, но у кнопок должен быть и честный
  // disabled: иначе они остаются в фокусе и берут Enter с клавиатуры.
  const govoryat = !!(audio && audio.busy);
  const [dead, setDead] = useState(stored ? stored.dead : []);
  const [done, setDone] = useState(stored ? stored.done : false);
  const [shaking, setShaking] = useState(null);
  const firstTry = useRef(stored ? stored.firstTry : null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  // ── ВАРИАНТЫ ВСЛУХ НЕ ЧИТАЮТСЯ (заказчик, 22.09.2026) ─────────────────────
  // Было: экран дочитывал вопрос, затем голос по очереди зачитывал каждый
  // вариант и подсвечивал звучащий. Заказчик: «сначала пусть прочитает вопрос,
  // потом скажет „выбери ответ“; читать ответы не обязательно». Ряд ответов
  // ребёнок разбирает сам, а голос экрана держит на себе задание и указание,
  // что нажать, — озвучка вопроса (Stage/реплика экрана) не тронута.
  // Ожидание тишины тоже больше не нужно: кнопки и так заперты по audio.busy,
  // поэтому нажать раньше, чем вопрос дочитан, нельзя.

  const tap = (i) => {
    if (done || dead.indexOf(i) >= 0 || shaking !== null) return;
    // Ребёнок выбрал — обрываем то, что ещё звучит, иначе реплика экрана
    // будет договариваться поверх разбора. stop(), а не abort(): stop мягко
    // закрывает очередь, не бросая ожидающие вызовы.
    if (audio && typeof audio.stop === 'function') audio.stop();
    const right = i === correct;
    sfx('tap', audio && audio.on);
    if (firstTry.current === null) firstTry.current = right;
    if (right) {
      setDone(true);
      sfx('ok', audio && audio.on);
      if (onResolved) onResolved({ correct: true, firstTry: firstTry.current, index: i, dead, done: true });
      (async () => { await sleep(450); if (alive.current) onSay(options[i].ok, true); })();
    } else {
      setShaking(i);
      sfx('wrong', audio && audio.on);
      (async () => {
        await sleep(700);
        if (!alive.current) return;
        setShaking(null);
        setDead((d) => d.concat([i]));
        onSay(options[i].why, false);
      })();
    }
  };

  return (
    // .answered гасит блик и наведение, когда вопрос закрыт (из quiz-choose-hint).
    <div className={'opts' + (done ? ' answered' : '')}>
      {options.map((o, i) => {
        // После верного ответа гаснут и те варианты, которые ребёнок не пробовал:
        // в присланном файле после ответа погашен весь ряд, кроме верного.
        const isDead = dead.indexOf(i) >= 0 || (done && i !== correct);
        const isOk = done && i === correct;
        const isBad = shaking === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => tap(i)}
            disabled={isDead || done || govoryat}
            className={'opt' + (isDead ? ' opt-dead' : '') + (isOk ? ' opt-ok' : '') + (isBad ? ' opt-wrong' : '')}
          >
            {/* §5 · БУКВЫ A/B/C УБРАНЫ: ребёнок не диктует ответ по букве и не
                сверяется с бланком — это визуальный шум. Пустой маркер несёт
                ТИП вопроса своей формой: круг = «выбери один». */}
            <span className="opt-mark opt-mark-one">
              {isOk ? <Icon name="check" size={16} /> : (isDead || isBad) ? <Icon name="cross" size={16} /> : null}
            </span>
            <FitLine>{pick(o.text)}</FitLine>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. COACH-MARK — подсветка настоящей кнопки (UI-тур, урок 1).
// Прорезает «дырку» по CSS-селектору и сама расставляет карточку над/под целью.
// step.auto=true — шаг проходится сам после озвучки; иначе ждём нажатия.
// ─────────────────────────────────────────────────────────────────────────────
const HOLE_PAD = 8, CARD_GAP = 14, EDGE = 12;

function useRect(selector, nonce) {
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!selector || typeof window === 'undefined') { setRect(null); return; }
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
  // ТЕКСТ ПОДСКАЗКИ НЕ ПЕЧАТАЕМ (заказчик, 22.09.2026, п.1 и п.4): ту же фразу
  // в эту же секунду говорит Симка, а часть детей ещё не читает. Абзац
  // возвращается ТОЛЬКО когда озвучки фактически нет — то же правило, по
  // которому живёт реплика персонажа (см. PersonaBubble).
  const coachAudio = useAudio();
  const nemo = !!(coachAudio && coachAudio.failed);
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
        {nemo
          ? <p className="coach-text coach-text-fallback">{pick(text)}</p>
          /* Экранному диктору фраза по-прежнему нужна — отдаём её скрыто. */
          : <p className="coach-text sv-sr">{pick(text)}</p>}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. КОРЕНЬ УРОКА — useLessonRoot
// Держит номер экрана, журнал, стор, озвучку и финиш. Экраны урок задаёт сам.
//
//   const R = useLessonRoot({ meta: META, total: SCREENS.length, studentName, lang, onFinished });
//   ...
//   return <R.Shell css={LESSON_CSS}>{R.done ? <DoneScreen/> : screens[R.i]}</R.Shell>;
// ─────────────────────────────────────────────────────────────────────────────
// startAt — только для отладки и приёмки: открыть урок сразу на нужном экране,
// не проходя его целиком. В продакшене платформа его не передаёт, и урок
// начинается с нуля. Держим здесь, а не в уроке, чтобы не плодить дев-код в 26 файлах.
// Код языка от платформы приводим к своему виду: регистр и регион не наши.
// До этого сравнивали точной строкой, и 'UZ' или 'uz-UZ' молча давали русский.
const normLang = (v) => {
  const s = String(v == null ? '' : v).trim().toLowerCase().replace(/[_].*$/, '').replace(/-.*$/, '');
  return (s === 'uz' || s === 'en' || s === 'ru') ? s : 'ru';
};

function useLessonRoot({ meta, total, studentName, lang: rawLang, onFinished, extraPayload, startAt }) {
  const lang = normLang(rawLang);
  const [i, setI] = useState(() => Math.max(0, Math.min(total - 1, Number(startAt) || 0)));
  const [done, setDone] = useState(false);
  const audio = useAudioEngine(lang);
  const startedAt = useRef(Date.now());
  const [rows, log] = useAnswerLog();
  const store = useScreenStore();
  const finished = useRef(false);

  const go = useCallback((step) => {
    audio.stop();
    setI((prev) => Math.max(0, Math.min(total - 1, prev + step)));
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [audio, total]);
  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  const finish = useCallback(() => {
    audio.stop();
    setDone(true);
    // Платформе о конце урока сообщаем РОВНО один раз (договор в шапке файла) —
    // даже если ребёнок прошёл урок заново и дошёл до финала ещё раз. А вот сам
    // финальный экран показываем каждый раз, иначе кнопка «Пройти заново»
    // приводила бы во второй раз в никуда.
    if (finished.current) return;
    finished.current = true;
    const payload = buildPayload({
      meta, studentName, lang,
      startedAt: startedAt.current,
      answers: rows.current,
      extra: typeof extraPayload === 'function' ? extraPayload(store) : extraPayload
    });
    if (typeof onFinished === 'function') onFinished(payload);
  }, [audio, meta, studentName, lang, rows, store, onFinished, extraPayload]);

  // ПЕРЕЗАПУСК СТРАНИЦЫ. Пересобираем экран заново (runN входит в его key), а
  // перед этим глушим озвучку жёстким обрывом и стираем память экрана. Порядок
  // важен: сначала abort (иначе ждущая реплика закроется и уведёт урок вперёд),
  // потом чистка памяти, и только потом смена key.
  const [runN, setRunN] = useState(0);
  const restart = useCallback(() => {
    if (audio && audio.abort) audio.abort();
    const id = SCREENS[i] && SCREENS[i].id;
    (SCREEN_RESET[id] || []).forEach((k) => store.set(k, undefined));
    setRunN((v) => v + 1);
  }, [audio, i, store]);
  // ПРОЙТИ УРОК ЗАНОВО с финального экрана. Значок НЕ сбрасываем: экран сам
  // обещает, что он «остаётся с тобой». Чистим только память экранов —
  // иначе урок проскочит уже сделанные шаги и ребёнок увидит готовые ответы.
  const again = useCallback(() => {
    if (audio && audio.abort) audio.abort();
    Object.keys(SCREEN_RESET).forEach((id) => {
      (SCREEN_RESET[id] || []).forEach((k) => store.set(k, undefined));
    });
    setDone(false);
    setI(0);
    setRunN((v) => v + 1);
  }, [audio, store]);
  const page = useMemo(() => ({ restart }), [restart]);

  // Shell ОБЯЗАН иметь стабильную идентичность. Если собирать его через useCallback
  // с [audio] в зависимостях, то любое изменение audio.playing/failed даёт новый
  // тип компонента — React размонтирует и смонтирует ВСЁ дерево урока заново:
  // анимации рестартуют с нуля, состояние экрана теряется, озвучка начинается
  // сначала. Поэтому идентичность фиксируем через useMemo([]), а живые значения
  // читаем из ref — при обычном ре-рендере он уже обновлён.
  const liveRef = useRef(null);
  liveRef.current = { lang, audio, log, store, page };
  const Shell = useMemo(() => function LessonShell({ children, css }) {
    const v = liveRef.current;
    return (
      <LangProvider value={v.lang}>
        <AudioProvider value={v.audio}>
          <LogProvider value={v.log}>
            <StoreProvider value={v.store}>
              <PageProvider value={v.page}>
              <div className={'lesson-root' + (v.audio && v.audio.paused ? ' is-paused' : '')}>
                <style>{CSS_BASE + (css || '')}</style>
                {children}
              </div>
              </PageProvider>
            </StoreProvider>
          </LogProvider>
        </AudioProvider>
      </LangProvider>
    );
  }, []);

  // Имя для подписей: пустое имя не должно превращаться в пустую строку на значке.
  const displayName = studentName || ({ uz: "O'quvchi", en: 'Student' }[lang] || 'Ученик');

  return { i, lang, audio, store, log, next, prev, go, finish, again, done, displayName, Shell, runN };
}

// ============================================================================
// 14. БАЗОВЫЙ CSS
// Копируется как есть. CSS урока дописывается ОТДЕЛЬНОЙ строкой и склеивается
// в <Shell css={LESSON_CSS}> — так канон и урок не перемешиваются.
// ============================================================================
const CSS_BASE = `
.lesson-root *, .lesson-root *::before, .lesson-root *::after { box-sizing: border-box; }
/* ПАУЗА ЗАМОРАЖИВАЕТ КАДР. Голос встаёт сам (дорожка на паузе), а вот CSS-
   анимации шли бы дальше: ребёнок нажал паузу, а сцена продолжает собираться.
   animation-play-state отматывает не с нуля, а замирает на текущем кадре и с
   него же продолжает — ровно то поведение, которое просил заказчик. */
.lesson-root.is-paused *, .lesson-root.is-paused *::before, .lesson-root.is-paused *::after {
  animation-play-state: paused !important; }
.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; }

/* ── АДАПТИВНАЯ СЕТКА ─────────────────────────────────────────
   Все размеры считаются от ширины И высоты окна, без точек перелома.
   Телефон, планшет, ноутбук и широкий монитор берут одни и те же правила. */
.lesson-root {
  --pad: clamp(14px, 3.6vw, 48px);            /* боковые поля */
  --limit: 936px;                             /* ширина колонки контента */
  --gap-stack: clamp(10px, 1.6dvh, 18px);     /* между блоками контента */
  --gap-dlg: clamp(10px, 2.2vw, 20px);        /* персонаж <-> облако */
  /* ШИРИНА персонажа. Кадры бывают 2:3 и 1:1, поэтому размер задаём по ширине
     и не ставим max-height — иначе object-fit добавит поля внутрь рамки
     и облако перестанет стоять по центру. */
  --av: clamp(76px, min(30vw, 17dvh), 176px);
  --av-lg: clamp(104px, min(38vw, 24dvh), 230px);   /* крупный персонаж (живой диалог) */
  --bar-y: clamp(7px, 1.5dvh, 12px);          /* вертикальные поля панелей */
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: ${T.ink}; background: ${T.bg}; height: 100dvh; overflow: hidden;
  -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent;
}
@media (min-width: 1440px) { .lesson-root { --limit: 1040px; } }
.mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.stage { display: flex; flex-direction: column; height: 100dvh; }
.limit { width: 100%; max-width: var(--limit); margin: 0 auto; }
.stage-header { flex: 0 0 auto; padding-inline: var(--pad);
  padding-top: var(--bar-y); padding-bottom: calc(var(--bar-y) * .6);
  background: ${T.bg}; position: sticky; top: 0; z-index: 20; }
/* gap 14px — тот самый одинаковый отступ между счётчиком и кнопкой управления. */
.chrome-side { display: flex; align-items: center; gap: 14px; }
.navrow { display: flex; gap: 12px; align-items: center; position: relative; }
/* Кнопка управления страницей: в правом верхнем углу, сразу справа от счётчика
   (заказчик, 2026-08-06). Отступ задаёт gap у .chrome-side — он общий для обоих
   элементов, поэтому кнопка не наезжает на счётчик и не сдвигает его.
   Круглая и белая: это управление уроком, а не его действие; спутать её с
   «Дальше» нельзя ни формой, ни цветом, ни местом. */
.pause-btn { width: 38px; height: 38px; border: none; border-radius: 50%; cursor: pointer;
  flex: 0 0 auto; display: grid; place-items: center; background: ${T.paper}; color: ${T.ink2};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), 0 8px 18px -12px rgba(${T.shadowBase},0.55);
  transition: transform .14s ease-out, box-shadow .2s, color .2s, background .2s; }
.pause-btn:hover { box-shadow: 0 3px 0 rgba(${T.shadowBase},0.06), 0 12px 22px -12px rgba(${T.shadowBase},0.6); }
.pause-btn:active { transform: scale(.93); }
/* «Повторить» — та же кнопка после конца страницы. Тон спокойный: она не зовёт
   нажать, она просто доступна, если ребёнок не расслышал. */
.pause-btn.is-replay { color: ${T.blueDk}; }
.pause-btn:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 3px; }
/* На паузе кнопка сама себя объясняет: она горит акцентом, потому что теперь
   именно она — то, что ждёт нажатия. */
.pause-btn.is-paused { background: ${T.accent}; color: #fff;
  box-shadow: 0 2px 0 ${T.accentDk}, 0 12px 24px -10px rgba(255,79,40,0.55); }
.progress-track { height: 6px; border-radius: 99px; background: rgba(${T.shadowBase}, 0.10); overflow: hidden; }
.progress-bar { height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accent}, #FF7A45);
  box-shadow: 0 0 14px rgba(255,79,40,0.5); transition: width .45s cubic-bezier(.4,0,.2,1); }
.chrome { display: flex; align-items: center; justify-content: space-between; margin-top: 9px; gap: 10px; }
.eyebrow { display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 800;
  letter-spacing: .1em; text-transform: uppercase; color: ${T.ink2}; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 4px rgba(255,79,40,0.16); }
.counter { font-size: 17px; font-weight: 700; color: ${T.ink3}; }

.speaker-wrap { flex: 0 0 auto; padding-inline: var(--pad);
  padding-top: 2px; padding-bottom: clamp(4px, 0.9dvh, 10px); background: ${T.bg}; z-index: 15; }
/* ЕДИНЫЙ ШАБЛОН ДИАЛОГА: Симка слева / Нолик справа, облако по центру персонажа.
   align-items:center выравнивает облако по центру персонажа в обе стороны —
   и когда выше персонаж, и когда выше текст. */
.speaker { display: flex; align-items: center; gap: var(--gap-dlg); animation: sayIn .34s cubic-bezier(.2,.8,.3,1) both; }
/* Экран с частой сменой говорящего: высота зоны персонажа постоянна, поэтому
   карточка под ней не двигается, даже если подставят спрайт другой пропорции.
   1.5 — пропорция полноростовых поз (1024×1536). Персонаж и облако остаются по
   центру строки, поэтому облако не съезжает вниз, как было бы при flex-end. */
.stage-hero-fixed .speaker { min-height: calc(var(--av) * 1.5); }
.speaker-simka { flex-direction: row; }
.speaker-nolik { flex-direction: row-reverse; }
@keyframes sayIn { from { opacity:0; transform: translateY(-12px) scale(.96);} to { opacity:1; transform:none; } }
/* Персонаж: влёт, затем бесконечное тихое покачивание — кадр никогда не мёртвый.
   Две анимации на одном элементе: вторая стартует с задержкой после первой. */
.speaker-av { width: var(--av); height: auto; flex: 0 0 auto; align-self: center;
  filter: drop-shadow(0 12px 20px rgba(${T.shadowBase},0.22));
  animation: avIn .4s cubic-bezier(.34,1.4,.5,1) both, idleFloat 4.2s .5s ease-in-out infinite; }
@keyframes avIn { from { opacity:0; transform: translateY(10px) scale(.9);} to { opacity:1; transform:none; } }
@keyframes idleFloat { 0%, 100% { translate: 0 0; } 50% { translate: 0 -5px; } }
.speaker-bubble { background: ${T.paper}; border-radius: 18px;
  padding: clamp(12px, 2.2vw, 16px) clamp(14px, 2.4vw, 19px); font-size: clamp(17px, 2.6vw, 17px); line-height: 1.45; font-weight: 500;
  flex: 1 1 auto; min-width: 0; align-self: center; max-height: min(38dvh, 340px); overflow-y: auto;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5); }
.speaker-simka .speaker-bubble { border-bottom-left-radius: 6px; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5), inset 3px 0 0 ${T.accent}; }
.speaker-nolik .speaker-bubble { border-bottom-right-radius: 6px; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5), inset -3px 0 0 ${T.blue}; }

/* Контент начинается сразу под персонажем. Сверху — только небольшой воздух
   (верхняя распорка ограничена), остаток свободной высоты уходит вниз. */
.stage-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden;
  display: flex; flex-direction: column; align-items: center;
  padding-inline: var(--pad); padding-bottom: 10px; -webkit-overflow-scrolling: touch; }
.stage-content::before { content: ''; flex: 1 1 0; max-height: clamp(8px, 6dvh, 56px); }
.stage-content::after { content: ''; flex: 3 1 0; }
.stage-content.has-speaker::before { max-height: clamp(6px, 4.5dvh, 44px); }
.stage-center::before, .stage-center::after { max-height: none; }
.stack { flex: 0 0 auto; width: 100%; display: flex; flex-direction: column; gap: var(--gap-stack); }
.stage-nav { flex: 0 0 auto; padding-inline: var(--pad);
  padding-top: calc(var(--bar-y) * .8); padding-bottom: var(--bar-y); background: ${T.bg};
  box-shadow: 0 -10px 24px -12px rgba(${T.shadowBase}, 0.22); }

.h1 { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(20px, 4vw, 28px);
  line-height: 1.24; font-weight: 600; letter-spacing: -0.01em; }
.lead { font-size: clamp(17px, 2.5vw, 17px); line-height: 1.55; color: ${T.ink2}; }
.ask { font-size: clamp(17px, 2.7vw, 17px); line-height: 1.45; font-weight: 700; }

.opt:active:not(:disabled), .card:active:not(:disabled), .chip-btn:active:not(:disabled),
.btn-ghost:active:not(:disabled) {
  transform: scale(.95); transition: transform .1s ease-out;
}
.opt, .card, .chip-btn, .btn-accent, .btn-ghost { transition: transform .14s ease-out, box-shadow .2s, background .2s; }

.btn-accent, .btn-ghost { font: inherit; font-weight: 700; border-radius: 14px; cursor: pointer;
  border: none; padding: 13px 26px; font-size:  17px; min-height: 50px; }
/* pill-кнопка: подъём + расходящееся кольцо (референс uiverse/friendly-dragon-76).
   position+z-index обязательны — кольцо живёт в ::after под кнопкой (z-index:-1). */
.btn-accent { position: relative; z-index: 0; background: ${T.paper}; color: ${T.accentDk};
  transition: transform .18s ease-out, box-shadow .2s;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.08), 0 10px 22px -12px rgba(255,79,40,0.55), inset 0 0 0 2px ${T.accentSoft}; }
.btn-accent::after { content: ''; position: absolute; inset: 0; border-radius: inherit; z-index: -1;
  background: ${T.accent}; opacity: 0; }
.btn-accent[data-ring]::after { animation: ringOut .46s cubic-bezier(.2,.7,.3,1) both; }
@keyframes ringOut { from { transform: scale(1); opacity: .38; } to { transform: scaleX(1.34) scaleY(1.5); opacity: 0; } }
.btn-accent:hover:not(:disabled) { transform: translateY(-2px);
  box-shadow: 0 4px 0 rgba(${T.shadowBase},0.08), 0 16px 30px -14px rgba(255,79,40,0.7), inset 0 0 0 2px ${T.accent}; }
.btn-accent:active:not(:disabled) { transform: translateY(0); }
.btn-accent:disabled { opacity: .38; cursor: not-allowed; transform: none;
  box-shadow: inset 0 0 0 2px rgba(${T.shadowBase},0.12); color: ${T.ink3}; }
.btn-ghost { background: transparent; color: ${T.ink2}; box-shadow: inset 0 0 0 2px rgba(${T.shadowBase},0.14); }

/* крупная кнопка действия (промотать время, отправить, забрать обратно) */
.bigbtn { align-self: center; width: 100%; max-width: 340px; padding: 15px 18px; border: none; border-radius: 18px;
  background: ${T.accent}; color: #fff; font: inherit; font-size: clamp(17px, 3vw, 17px); font-weight: 800;
  cursor: pointer; box-shadow: 0 5px 0 ${T.accentDk}, 0 16px 28px -14px rgba(255,79,40,0.7); }
.bigbtn:active { transform: translateY(2px); box-shadow: 0 3px 0 ${T.accentDk}; }
.bigbtn-ghost { background: ${T.paper}; color: ${T.accentDk};
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.08), inset 0 0 0 2.5px ${T.accentSoft}; }
.bigbtn-ghost:active { box-shadow: inset 0 0 0 2.5px ${T.accent}; }

.hero { display: block; height: auto; filter: drop-shadow(0 14px 22px rgba(${T.shadowBase},0.20)); }
.hero-in { animation: heroIn .5s cubic-bezier(.34,1.4,.5,1) both; }
.hero-pop { animation: heroPop .6s cubic-bezier(.34,1.6,.5,1) both; }
@keyframes heroIn { from { opacity: 0; transform: translateY(14px) scale(.94); } to { opacity: 1; transform: none; } }
@keyframes heroPop { 0% { opacity:0; transform: scale(.5) rotate(-8deg);} 70% { opacity:1; transform: scale(1.06) rotate(2deg);} 100% { opacity:1; transform: none; } }

/* ── КАРТОЧКИ ОТВЕТА ─────────────────────────────────────────
   Одна строка, не переносим: при нехватке места FitLine сжимает шрифт,
   дальше — многоточие. Высота карточек одинаковая при любой длине текста. */
.ic { display: block; flex-shrink: 0; }
.fit-line { display: block; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* ОФОРМЛЕНИЕ ОТВЕТОВ ПЕРЕНЕСЕНО ИЗ quiz-choose-hint.html (заказчик, 2026-08-06:
   «изменим все анимация ответов на то что я дала»). Взято из файла дословно:
   рамка 2px вместо внутренней тени, блик, пробегающий по ряду, подъём на hover,
   тряска на неверном, зелёная плашка на верном, погасший ряд после ответа.
   Три отличия от файла, каждое — требование урока, а не вкус:
     · оранжевый берём из токена урока (#FF4F28), а не #F0442E из файла: разница
       на глаз неразличима, но иначе ответы звучали бы мимо всего остального;
     · высота карточки остаётся фиксированной (58px, на низком окне 48px). В файле
       она задана паддингами, а у нас внутри FitLine и контракт «без прокрутки» —
       плавающая высота ломает и то и другое;
     · блик живёт только пока на вопрос не ответили (класс .answered на .opts) —
       так в файле и есть, и это важно: после ответа экран должен затихнуть. */
.opts { display: flex; flex-direction: column; gap: 10px; }
.opts .opt { width: 100%; align-self: stretch; }
.opt { position: relative; overflow: hidden;
  display: flex; align-items: center; gap: 14px; text-align: left; width: 100%; padding: 0 18px;
  border: 2px solid transparent; border-radius: 15px; background: ${T.paper};
  font: inherit; font-size:  17px; line-height: 1.4;
  font-weight: 600; color: ${T.ink}; cursor: pointer; height: 58px; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(80,65,45,.07);
  transition: border-color .25s, box-shadow .25s, background .3s, color .3s, transform .18s; }
/* Блик пробегает по ряду с отставанием — ряд читается как живой, а не как список. */
.opt::after { content: ''; position: absolute; top: 0; bottom: 0; width: 130px; pointer-events: none;
  background: linear-gradient(100deg, transparent, rgba(255,79,40,.11), transparent);
  transform: translateX(-160px); animation: optSweep 3s ease-in-out infinite; }
.opt:nth-child(2)::after { animation-delay: .35s; }
.opt:nth-child(3)::after { animation-delay: .7s; }
.opt:nth-child(4)::after { animation-delay: 1.05s; }
@keyframes optSweep { 0%, 60% { transform: translateX(-160px); } 100% { transform: translateX(830px); } }
.opt:hover:not(:disabled) { border-color: ${T.accent}; box-shadow: 0 8px 20px rgba(255,79,40,.16);
  transform: translateY(-2px); }
.opt:hover:not(:disabled) .opt-mark { background: ${T.accent}; color: #fff; }
.opt:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 3px; }
/* Круг = «выбери один»: форма маркера и заменила убранную букву. */
.opt-mark-one { border-radius: 50% !important; }
.opt-mark { width: 26px; height: 26px; flex-shrink: 0; border-radius: 8px; background: #F1F1F3;
  display: flex; align-items: center; justify-content: center; font-size:  17px; font-weight: 800;
  color: ${T.ink3}; transition: background .25s, color .25s, border-radius .25s; }
/* Неверный: ряд вздрагивает и обводка розовеет — но текст не краснеет.
   Ошибка у нас разбирается голосом Симки, а не отчитывается цветом. */
.opt-wrong { animation: shake .4s; border-color: #E0A0A0; }
/* Погасший: цветом, а не прозрачностью — вариант должен остаться читаемым,
   ребёнок к нему возвращается глазами, пока Симка разбирает, почему он не подошёл. */
.opt-dead { background: #F0ECE6; color: #B4B0AA; box-shadow: none; cursor: default; }
.opt-dead .opt-mark { background: #E4E0DA; color: #B4B0AA; border-radius: 50%; }
.opt-ok { background: #EAF7EE; border-color: #3E8E5A; animation: okPop .38s; }
.opt-ok .opt-mark { background: #34A853; color: #fff; border-radius: 50%; }
/* Ответ дан — ряд затихает: блик выключен, наведение больше ничего не поднимает. */
.answered .opt { cursor: default; }
.answered .opt::after { animation: none; opacity: 0; }
.answered .opt:hover { transform: none; border-color: transparent; box-shadow: 0 2px 8px rgba(80,65,45,.07); }
.answered .opt:hover .opt-mark { background: #F1F1F3; color: ${T.ink3}; }
.answered .opt-ok:hover { border-color: #3E8E5A; }
.answered .opt-ok:hover .opt-mark { background: #34A853; color: #fff; }
.answered .opt-dead:hover { box-shadow: none; }
.answered .opt-dead:hover .opt-mark { background: #E4E0DA; color: #B4B0AA; }
@keyframes shake { 0%,100% { transform: translateX(0);} 25% { transform: translateX(-7px);}
  75% { transform: translateX(7px);} }
@keyframes okPop { 0% { transform: scale(1);} 45% { transform: scale(1.05);} 100% { transform: scale(1.02);} }

/* карточки-галочки (выбери всё, что подходит) */
.cards { display: flex; flex-direction: column; gap: 9px; }
.cards .card { width: 100%; align-self: stretch; }
.card { display: flex; align-items: center; gap: 12px; padding: 0 15px; border: none; border-radius: 14px;
  background: ${T.paper}; font: inherit; font-size:  17px; font-weight: 600; cursor: pointer; text-align: left;
  height: 56px; flex-shrink: 0; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5); }
.card-box { width: 26px; height: 26px; flex-shrink: 0; border-radius: 8px; background: rgba(${T.shadowBase},0.07);
  display: flex; align-items: center; justify-content: center; font-weight: 800; font-size:  17px; }
.card-got { background: ${T.successSoft}; animation: okPop .38s;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5), inset 0 0 0 2.5px ${T.success}; }
.card-got .card-box { background: ${T.success}; color: #fff; }
.card-wrong { background: ${T.wrongSoft} !important; color: ${T.wrong} !important; animation: shake .4s;
  box-shadow: inset 0 0 0 2.5px ${T.wrong}; }
.card-wrong .card-box { background: ${T.wrong}; color: #fff; }

/* ── ЧАТ (разбор переписки) ───────────────────────────────── */
.chat { display: flex; flex-direction: column; gap: 9px; }
.chat-live { min-height: 170px; }
.bub { max-width: 88%; padding: 11px 15px; border-radius: 18px; font-size:  17px; line-height: 1.45;
  animation: bubIn .34s cubic-bezier(.34,1.3,.5,1) both; display: flex; align-items: center; gap: 9px; }
.bub-x { background: ${T.paper}; align-self: flex-start; border-bottom-left-radius: 6px;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 10px 22px -16px rgba(${T.shadowBase},0.5); }
.bub-n { background: ${T.blueSoft}; color: ${T.blueDk}; align-self: flex-end; border-bottom-right-radius: 6px; font-weight: 600; }
.bub-av { width: 28px; height: 28px; border-radius: 50%; object-fit: contain; background: ${T.paper}; flex-shrink: 0; }
.bub-flag { box-shadow: 0 0 0 3px ${T.accentSoft}, 0 0 0 5px ${T.accent}; }
@keyframes bubIn { from { opacity:0; transform: translateY(9px) scale(.97);} to { opacity:1; transform:none; } }

/* ── ДВЕ КОЛОНКИ / ЧИПЫ (сортировки) ─────────────────────── */
.two { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); gap: clamp(9px, 1.6vw, 14px); }
.col { background: ${T.paper}; border-radius: 18px; padding: 13px; display: flex; flex-direction: column; gap: 7px;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5); }
.col-open { box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5), inset 0 4px 0 ${T.success}; }
.col-priv { box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5), inset 0 4px 0 ${T.accent}; }
.col-h { font-size:  17px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; color: ${T.ink2};
  display: flex; flex-direction: column; gap: 2px; padding: 4px 2px 5px; }
.col-h span { font-size:  17px; font-weight: 600; text-transform: none; letter-spacing: 0; color: ${T.ink3}; }
.col-drop { border: none; font: inherit; text-align: left; cursor: default; min-height: 120px; }
.col-live { cursor: pointer; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5), inset 0 0 0 3px ${T.hint}; }
.col-shake { animation: shake .4s; box-shadow: inset 0 0 0 3px ${T.wrong}; background: ${T.wrongSoft}; }
.chip { background: ${T.bg}; border-radius: 12px; padding: 0 13px; font-size:  17px; font-weight: 600;
  line-height: 1.35; display: flex; align-items: center; gap: 8px; height: 48px; flex-shrink: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chip-open { background: ${T.successSoft}; color: ${T.success}; }
.chip-priv { background: ${T.accentSoft}; color: ${T.accentDk}; }
.chip-btn { border: none; font: inherit; font-weight: 600; cursor: pointer; width: 100%; text-align: left; }
.chip-btn:disabled { cursor: default; }
.chip-fixed { box-shadow: inset 0 0 0 2px currentColor; animation: okPop .35s; }
.chip-shake { background: ${T.wrongSoft} !important; color: ${T.wrong} !important; animation: shake .4s;
  box-shadow: inset 0 0 0 2px ${T.wrong}; }
.chip-tick { margin-left: auto; font-weight: 800; }
.chip-tray { background: ${T.paper}; color: ${T.ink}; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 8px 18px -12px rgba(${T.shadowBase},0.5); }
.chip-sel { box-shadow: 0 0 0 3px ${T.hint}, 0 8px 18px -10px rgba(${T.shadowBase},0.5); }
.tray { display: flex; flex-wrap: wrap; gap: 9px; min-height: 54px; align-items: center; }
.tray .chip-btn { width: auto; }
.tray-empty { font-size:  17px; color: ${T.success}; font-weight: 700; }
.drop { animation: dropIn .38s cubic-bezier(.34,1.4,.5,1) both; }
@keyframes dropIn { from { opacity:0; transform: translateY(-14px) scale(.94);} to { opacity:1; transform:none; } }

/* ── ПРАВИЛО, ПАРЫ, ПОДСКАЗКА, ИТОГИ ─────────────────────── */
.rulebox { background: linear-gradient(135deg, ${T.accentSoft}, #FFF4EE); border-radius: 20px; padding: 18px 20px;
  box-shadow: inset 0 0 0 2px rgba(255,79,40,0.24); }
.rulebox p { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(17px, 3.4vw, 23px); line-height: 1.35; font-weight: 600; color: ${T.accentDk}; }
.rulebox-big { text-align: center; }
.pairs { display: flex; flex-direction: column; gap: 9px; }
.pair { display: flex; align-items: center; gap: 11px; flex-wrap: wrap; background: ${T.paper}; border-radius: 14px;
  padding: 13px 15px; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5); }
.pair-a { font-weight: 800; color: ${T.accentDk}; font-size:  17px; }
.pair-arrow { color: ${T.ink3}; font-weight: 700; }
.pair-b { color: ${T.ink2}; font-size:  17px; flex: 1; min-width: 150px; }

/* Подсказка — отдельный канал: жёлтый, не красный. Это НЕ «ошибка». */
.note { border-radius: 16px; padding: 14px 16px; animation: noteIn .32s ease-out both; }
.note-hint { background: ${T.hintSoft}; box-shadow: inset 3px 0 0 ${T.hint}; }
.note-ok { background: ${T.successSoft}; box-shadow: inset 3px 0 0 ${T.success}; }
.note-lbl { display: block; font-size:  17px; font-weight: 800; text-transform: uppercase; letter-spacing: .09em; margin-bottom: 5px; }
.note-hint .note-lbl { color: ${T.hint}; }
.note-ok .note-lbl { color: ${T.success}; }
.note-body { font-size:  17px; line-height: 1.5; }
@keyframes noteIn { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform:none; } }

.badge-mini { display: inline-block; margin-left: 8px; padding: 3px 10px; border-radius: 99px;
  background: rgba(${T.shadowBase},0.08); font-size:  17px; font-weight: 800; color: ${T.ink2}; vertical-align: middle; }
.step-row { display: flex; }
.step-row .badge-mini { margin-left: 0; }
.stamp { display: flex; align-items: center; gap: 10px; align-self: center; padding: 12px 20px; border-radius: 99px;
  background: ${T.paper}; font-weight: 800; font-size:  17px; color: ${T.accentDk}; flex-wrap: wrap; justify-content: center;
  box-shadow: 0 0 0 2.5px ${T.accentSoft}, 0 14px 28px -14px rgba(255,79,40,0.6); animation: heroPop .6s cubic-bezier(.34,1.6,.5,1) both; }
.stamp-star { display: grid; place-items: center; color: ${T.accent}; }
.stamp-name { color: ${T.ink3}; font-weight: 700; font-size:  17px; }
.mainbox { display: flex; flex-direction: column; gap: 8px; }
.mainrow { display: flex; align-items: flex-start; gap: 11px; background: ${T.paper}; border-radius: 14px; padding: 13px 15px;
  font-size:  17px; line-height: 1.45; box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5); }
.mainnum { width: 25px; height: 25px; flex-shrink: 0; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accentDk};
  display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 800; }
.donebox { display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: clamp(12px, 2.2dvh, 20px); padding: clamp(14px, 3dvh, 30px) 0; }
/* ── САЛЮТ НА ФИНАЛЕ ──────────────────────────────────────────
   Ленты вылетают ИЗ-ЗА значка, поэтому .salute лежит под ним в одном
   позиционированном блоке и не ловит нажатия. Блок не добавляет высоты
   (ленты абсолютные) — контракт «без прокрутки» не трогаем. */
.done-hero { position: relative; display: grid; place-items: center; isolation: isolate; }
/* ── СИЯНИЕ ВОКРУГ ЗНАЧКА (badge-reward.html, заказчик 2026-08-07) ──
   Слой абсолютный и лежит ПОД значком, поэтому не добавляет ни пикселя высоты:
   контракт «100dvh без прокрутки» не трогаем. Размер ограничен вьюпортом
   (min от ширины и высоты) — иначе на телефоне слой оказался бы больше экрана и
   создал прокрутку, ради которой пришлось бы резать сам эффект.
   Лучи и ореол ТЁПЛЫЕ и одинаковые для всех значков: заказчик просил, чтобы
   сияло «именно как в примере», какой бы значок ребёнок ни выбрал.
   Слою НАМЕРЕННО разрешено быть шире экрана (132vw): в примере лучи уходят за
   край кадра, и если вписать слой в ширину, они превратятся в аккуратный кружок
   вокруг значка. По горизонтали это безопасно — у .stage-content стоит
   overflow-x: hidden, лучи просто подрезаются краем. По вертикали слой держим в
   86dvh: там overflow-y: auto, и лишняя высота дала бы прокрутку. */
.award { position: absolute; left: 50%; top: 50%; translate: -50% -50%;
  width: min(132vw, 86dvh); aspect-ratio: 1; z-index: -1; pointer-events: none; }
.award .aw-glow, .award .aw-burst, .award .aw-spark, .award .aw-ray { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  /* Без движения кадр всё равно обязан быть праздничным, а не пустым. */
  .award .aw-glow, .award .aw-spark, .award .aw-ray { opacity: 1; }
}
@media (prefers-reduced-motion: no-preference) {
  @keyframes awIn { to { opacity: 1; } }
  @keyframes awSpinA { to { transform: rotate(360deg); } }
  @keyframes awSpinB { to { transform: rotate(-360deg); } }
  @keyframes awBreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
  @keyframes awBurst { 0% { transform: scale(.62); opacity: .85; } 100% { transform: scale(1.9); opacity: 0; } }
  @keyframes awTw { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.7); } }
  /* Вращение и проявление — на РАЗНЫХ узлах: на одном два animation не уживаются,
     поэтому появление даёт .aw-ray, а кручение — вложенный слой. */
  .award .aw-ray { transform-box: view-box; transform-origin: 340px 340px;
    animation: awIn 1s ease-out both .06s; }
  .award .aw-rayA path { transform-box: view-box; transform-origin: 340px 340px;
    animation: awSpinA 34s linear infinite; }
  .award .aw-rayB path { transform-box: view-box; transform-origin: 340px 340px;
    animation: awSpinB 46s linear infinite; }
  .award .aw-glow { transform-box: fill-box; transform-origin: center;
    animation: awIn .8s ease-out both .06s, awBreathe 4.4s ease-in-out infinite .9s; }
  .award .aw-burst { transform-box: fill-box; transform-origin: center;
    animation: awBurst .85s cubic-bezier(.2,.7,.3,1) both .54s; }
  /* Искры выходят каскадом по 45мс — как в примере. */
  .award .aw-spark { transform-box: fill-box; transform-origin: center;
    animation: awIn .3s ease-out both calc(760ms + var(--k) * 45ms),
      awTw 2.8s ease-in-out infinite calc(1100ms + var(--k) * 45ms); }
}
.salute { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.salute-bit { position: absolute; left: 50%; top: 50%; width: 9px; height: 15px; margin: -7px 0 0 -4px;
  border-radius: 2px; opacity: 0; background: ${T.accent}; }
/* Цвета: две ленты из значка ребёнка, три — акценты урока. */
.salute-bit.sb0 { background: var(--bcA, #5CE7FF); }
.salute-bit.sb1 { background: var(--bcB, #7A1FE0); }
.salute-bit.sb2 { background: #FFD639; }
.salute-bit.sb3 { background: ${T.accent}; }
.salute-bit.sb4 { background: #12D69C; border-radius: 50%; height: 9px; }
@media (prefers-reduced-motion: no-preference) {
  /* Три залпа: rotate(--a) задаёт направление, translateY(--d) — дальность.
     Лента крутится вокруг себя, поэтому кажется, что она настоящая, из бумаги. */
  .salute-bit { animation: saluteFly 1.6s cubic-bezier(.16,.72,.32,1) var(--t) 3 both; }
  @keyframes saluteFly {
    0%   { opacity: 0; transform: rotate(var(--a)) translateY(0) rotate(0deg) scale(.6); }
    10%  { opacity: 1; }
    70%  { opacity: 1; }
    100% { opacity: 0; transform: rotate(var(--a)) translateY(calc(var(--d) * -1)) rotate(540deg) scale(1); }
  }
}

/* ── COACH-MARK (UI-тур) ─────────────────────────────────── */
.coach-block { position: fixed; background: rgba(14,14,16,0.62); z-index: 60; }
.coach-hole { position: fixed; border-radius: 16px; z-index: 61; pointer-events: none; }
.coach-ring { position: fixed; border-radius: 16px; z-index: 62; pointer-events: none;
  box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 9px rgba(255,79,40,0.28); animation: ringPulse 1.6s ease-in-out infinite; }
.coach-ring.is-tappable { pointer-events: auto; cursor: pointer; }
@keyframes ringPulse { 0%,100% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 9px rgba(255,79,40,0.28);} 50% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 14px rgba(255,79,40,0.10);} }
.coach-card { position: fixed; z-index: 63; max-width: min(320px, calc(100vw - 24px));
  background: ${T.paper}; border-radius: 18px; padding: 14px 16px;
  box-shadow: 0 18px 40px -14px rgba(${T.shadowBase},0.7); animation: fadeUp .3s cubic-bezier(.2,.8,.3,1) both; }
.coach-title { display: flex; align-items: center; gap: 8px; font-size:  17px; font-weight: 800; margin-bottom: 5px; color: ${T.accentDk}; }
.coach-text { font-size:  17px; line-height: 1.5; color: ${T.ink2}; }

/* ── ПОЯВЛЕНИЯ ─────────────────────────────────────────────
   Подтянуто по темпу: было .42s + лестница задержек до .37s — последний блок
   доезжал почти через 0.8s и ощутимо тормозил ритм. Теперь .28s и шаг .05s. */
.fade-up { animation: fadeUp .28s cubic-bezier(.2,.7,.3,1) both; }
@keyframes fadeUp { from { opacity:0; transform: translateY(10px);} to { opacity:1; transform:none; } }
.stagger > * { animation: fadeUp .28s cubic-bezier(.2,.7,.3,1) both; }
.stagger > *:nth-child(1) { animation-delay: 0s; }    .stagger > *:nth-child(2) { animation-delay: .05s; }
.stagger > *:nth-child(3) { animation-delay: .10s; }  .stagger > *:nth-child(4) { animation-delay: .15s; }
.stagger > *:nth-child(5) { animation-delay: .20s; }  .stagger > *:nth-child(6) { animation-delay: .25s; }

/* ── REVEAL ИНФО-СТРОК (порт jh3y/YzjEGMm без scroll-timeline) ─────────
   В оригинале строки выезжают по прокрутке. Прокрутки у нас нет, поэтому тот же
   приём — строка едет из translateY(100%) внутри overflow:hidden — запускается
   на монтировании, с шагом задержки. Ставится на .reveal-rows у контейнера. */
.reveal-rows > * { animation: rowIn .34s cubic-bezier(.2,.8,.3,1) both; }
.reveal-rows > *:nth-child(1) { animation-delay: .02s; } .reveal-rows > *:nth-child(2) { animation-delay: .09s; }
.reveal-rows > *:nth-child(3) { animation-delay: .16s; } .reveal-rows > *:nth-child(4) { animation-delay: .23s; }
.reveal-rows > *:nth-child(5) { animation-delay: .30s; } .reveal-rows > *:nth-child(6) { animation-delay: .37s; }
@keyframes rowIn { from { opacity: 0; transform: translateY(14px) scale(.97); } to { opacity: 1; transform: none; } }
.reveal-line { display: block; overflow: hidden; }
.reveal-line > span { display: block; animation: moveOnUp .42s cubic-bezier(.2,.8,.3,1) both; }
@keyframes moveOnUp { from { translate: 0 100%; } to { translate: 0 0; } }

/* Низкое окно (телефон в альбомной ориентации, маленький ноутбук):
   панели и кнопки поджимаются, чтобы всё помещалось без прокрутки. */
@media (max-height: 560px) {
  .lesson-root { --gap-stack: clamp(7px, 1.3dvh, 12px); }
  .btn-accent, .btn-ghost { min-height: 42px; padding: 9px 20px; }
  .opt { height: 48px; }
  .card { height: 46px; }
  .chip { height: 42px; }
  .bigbtn { padding: 11px 16px; }
  .stage-nav { box-shadow: 0 -8px 18px -12px rgba(${T.shadowBase}, 0.22); }
}

/* ── КАДР — ЭЛАСТИЧНЫЙ ЭЛЕМЕНТ ЭКРАНА ──────────────────────────
   .stack был flex: 0 0 auto, то есть не сжимался вообще: если сумма блоков
   превышала высоту .stage-content, лишнее просто уезжало под кнопку «Дальше».
   Замер прода (без всякого крупного яруса): экран «Выбери всё, что подходит»
   на 1280×800 уходил за край на 120px, на 1024×768 — на 132px, а «Расскажи
   дома» на 1024×768 — на 10px. То есть max-height у кадра работал как приказ,
   а не как потолок.

   Теперь стопке разрешено сжиматься, но сжимается в ней ТОЛЬКО кадр: текст,
   карточки, кнопки и колонки помечены flex-shrink:0 и держат свой размер.
   Кадр — единственное, что можно уменьшить без потери смысла. Побочный
   эффект: если контент влезает, не сжимается ничего (flex-shrink работает
   только при переполнении), поэтому телефон это правило не меняет. */
.stack { flex: 0 1 auto; min-height: 0; }
.stack > * { flex-shrink: 0; }

/* ── КАДР — ЭЛАСТИЧНЫЙ ЭЛЕМЕНТ ЭКРАНА ──────────────────────────
   .stack был flex: 0 0 auto, то есть не сжимался вообще: если сумма блоков
   превышала высоту .stage-content, лишнее просто уезжало под кнопку «Дальше».
   Замер прода (без всякого крупного яруса): экран «Выбери всё, что подходит»
   на 1280×800 уходил за край на 120px, на 1024×768 — на 132px, а «Расскажи
   дома» на 1024×768 — на 10px. То есть max-height у кадра работал как приказ,
   а не как потолок.

   Теперь стопке разрешено сжиматься, но сжимается в ней ТОЛЬКО кадр: текст,
   карточки, кнопки и колонки помечены flex-shrink:0 и держат свой размер.
   Кадр — единственное, что можно уменьшить без потери смысла. Побочный
   эффект: если контент влезает, не сжимается ничего (flex-shrink работает
   только при переполнении), поэтому телефон это правило не меняет. */
.stack { flex: 0 1 auto; min-height: 0; }
.stack > * { flex-shrink: 0; }

/* ── КАДР — ЭЛАСТИЧНЫЙ ЭЛЕМЕНТ ЭКРАНА ──────────────────────────
   .stack был flex: 0 0 auto, то есть не сжимался вообще: если сумма блоков
   превышала высоту .stage-content, лишнее просто уезжало под кнопку «Дальше».
   Замер прода (без всякого крупного яруса): экран «Выбери всё, что подходит»
   на 1280×800 уходил за край на 120px, на 1024×768 — на 132px, а «Расскажи
   дома» на 1024×768 — на 10px. То есть max-height у кадра работал как приказ,
   а не как потолок.

   Теперь стопке разрешено сжиматься, но сжимается в ней ТОЛЬКО кадр: текст,
   карточки, кнопки и колонки помечены flex-shrink:0 и держат свой размер.
   Кадр — единственное, что можно уменьшить без потери смысла. Побочный
   эффект: если контент влезает, не сжимается ничего (flex-shrink работает
   только при переполнении), поэтому телефон это правило не меняет. */
.stack { flex: 0 1 auto; min-height: 0; }
.stack > * { flex-shrink: 0; }

/* ── КАДР — ЭЛАСТИЧНЫЙ ЭЛЕМЕНТ ЭКРАНА ──────────────────────────
   .stack был flex: 0 0 auto, то есть не сжимался вообще: если сумма блоков
   превышала высоту .stage-content, лишнее просто уезжало под кнопку «Дальше».
   Замер прода (без всякого крупного яруса): экран «Выбери всё, что подходит»
   на 1280×800 уходил за край на 120px, на 1024×768 — на 132px, а «Расскажи
   дома» на 1024×768 — на 10px. То есть max-height у кадра работал как приказ,
   а не как потолок.

   Теперь стопке разрешено сжиматься, но сжимается в ней ТОЛЬКО кадр: текст,
   карточки, кнопки и колонки помечены flex-shrink:0 и держат свой размер.
   Кадр — единственное, что можно уменьшить без потери смысла. Побочный
   эффект: если контент влезает, не сжимается ничего (flex-shrink работает
   только при переполнении), поэтому телефон это правило не меняет. */
.stack { flex: 0 1 auto; min-height: 0; }
.stack > * { flex-shrink: 0; }

/* ── КАДР — ЭЛАСТИЧНЫЙ ЭЛЕМЕНТ ЭКРАНА ──────────────────────────
   .stack был flex: 0 0 auto, то есть не сжимался вообще: если сумма блоков
   превышала высоту .stage-content, лишнее просто уезжало под кнопку «Дальше».
   Замер прода (без всякого крупного яруса): экран «Выбери всё, что подходит»
   на 1280×800 уходил за край на 120px, на 1024×768 — на 132px, а «Расскажи
   дома» на 1024×768 — на 10px. То есть max-height у кадра работал как приказ,
   а не как потолок.

   Теперь стопке разрешено сжиматься, но сжимается в ней ТОЛЬКО кадр: текст,
   карточки, кнопки и колонки помечены flex-shrink:0 и держат свой размер.
   Кадр — единственное, что можно уменьшить без потери смысла. Побочный
   эффект: если контент влезает, не сжимается ничего (flex-shrink работает
   только при переполнении), поэтому телефон это правило не меняет. */
.stack { flex: 0 1 auto; min-height: 0; }
.stack > * { flex-shrink: 0; }

/* ── КАДР — ЭЛАСТИЧНЫЙ ЭЛЕМЕНТ ЭКРАНА ──────────────────────────
   .stack был flex: 0 0 auto, то есть не сжимался вообще: если сумма блоков
   превышала высоту .stage-content, лишнее просто уезжало под кнопку «Дальше».
   Замер прода (без всякого крупного яруса): экран «Выбери всё, что подходит»
   на 1280×800 уходил за край на 120px, на 1024×768 — на 132px, а «Расскажи
   дома» на 1024×768 — на 10px. То есть max-height у кадра работал как приказ,
   а не как потолок.

   Теперь стопке разрешено сжиматься, но сжимается в ней ТОЛЬКО кадр: текст,
   карточки, кнопки и колонки помечены flex-shrink:0 и держат свой размер.
   Кадр — единственное, что можно уменьшить без потери смысла. Побочный
   эффект: если контент влезает, не сжимается ничего (flex-shrink работает
   только при переполнении), поэтому телефон это правило не меняет. */
.stack { flex: 0 1 auto; min-height: 0; }
.stack > * { flex-shrink: 0; }

/* ── КАДР — ЭЛАСТИЧНЫЙ ЭЛЕМЕНТ ЭКРАНА ──────────────────────────
   .stack был flex: 0 0 auto, то есть не сжимался вообще: если сумма блоков
   превышала высоту .stage-content, лишнее просто уезжало под кнопку «Дальше».
   Замер прода (без всякого крупного яруса): экран «Выбери всё, что подходит»
   на 1280×800 уходил за край на 120px, на 1024×768 — на 132px, а «Расскажи
   дома» на 1024×768 — на 10px. То есть max-height у кадра работал как приказ,
   а не как потолок.

   Теперь стопке разрешено сжиматься, но сжимается в ней ТОЛЬКО кадр: текст,
   карточки, кнопки и колонки помечены flex-shrink:0 и держат свой размер.
   Кадр — единственное, что можно уменьшить без потери смысла. Побочный
   эффект: если контент влезает, не сжимается ничего (flex-shrink работает
   только при переполнении), поэтому телефон это правило не меняет. */
.stack { flex: 0 1 auto; min-height: 0; }
.stack > * { flex-shrink: 0; }

/* ── КРУПНЫЙ ЯРУС: планшет и компьютер ─────────────────────────
   Базовые clamp'ы кончаются на телефонных потолках — текст 17px, персонаж
   176px, кнопка 50px — и выше не растут. На мониторе это выглядело так:
   экран в 3,4 раза шире телефона, а кадр, кнопки и подписи ровно те же
   (замер 1280×800 против 375×812: кадр 450×287 против 317×291, кнопка
   «Дальше» 110×50 и там и там). Ребёнок за компьютером сидит в 60–70 см
   от экрана против 25–30 см с телефоном, поэтому физический размер должен
   быть больше, а он был одинаковый.

   Три правила, по которым подобраны числа — каждое стоило замера:

   1. vw-множители остаются базовыми, растут только dvh и потолки. Первая
      попытка занижала и vw — планшет 834×1112 получил персонажа МЕНЬШЕ
      прежнего (200px против 210px): на узком и высоком окне связывает vw.

   2. Высоты повторяющихся строк (.opt, .card, .chip) НЕ растут вовсе.
      Прибавка множится: пять карточек по +6px — это уже 30px, и экран
      «Выбери всё, что подходит» уносило под кнопку «Дальше» на 277px.
      Крупный шрифт в базовую высоту 56–64px помещается свободно.

   3. Порог по высоте 700px. На 1280×600 ярус уносил контент за экран на
      33px: расти там просто некуда, а «без прокрутки» важнее крупных букв.
      Планшеты (768×1024, 834×1112), iPad в альбомной (1024×768) и мониторы
      порог проходят. */
@media (min-width: 760px) and (min-height: 700px) {
  .lesson-root {
    --pad: clamp(28px, 3.6vw, 76px);
    --gap-stack: clamp(11px, 1.7dvh, 20px);
    --gap-dlg: clamp(18px, 2.4vw, 32px);
    --av: clamp(120px, min(30vw, 20dvh), 280px);
    --av-lg: clamp(150px, min(38vw, 26dvh), 360px);
    --bar-y: clamp(8px, 1.5dvh, 15px);
  }
  /* шапка */
  .progress-track { height: clamp(6px, .9dvh, 10px); }
  .eyebrow { font-size: clamp(17px, 1.8vw, 17px); }
  .counter { font-size: clamp(17px, 1.9vw, 17px); }
  .dot { width: 9px; height: 9px; }
  /* Пауза сидит в шапке и растит её на всех экранах сразу — потолок 54px
     стоил 17px высоты и уносил «Твой значок» за край. */
  .pause-btn { width: clamp(38px, 5vw, 46px); height: clamp(38px, 5vw, 46px); }
  /* текст */
  .h1 { font-size: clamp(28px, 4.2vw, 46px); }
  .lead { font-size: clamp(17px, 2.4vw, 24px); }
  .ask { font-size: clamp(17px, 2.5vw, 25px); }
  .speaker-bubble { font-size: clamp(17px, 2.5vw, 25px); border-radius: 24px;
    padding: clamp(15px, 1.9vw, 22px) clamp(19px, 2.6vw, 28px); }
  /* Кнопки: высота от dvh, но скромно — на невысоком окне низ уезжает
     под «Дальше» первым делом. */
  .btn-accent, .btn-ghost { font-size: clamp(17px, 2.3vw, 22px); border-radius: 18px;
    min-height: clamp(56px, 6.6dvh, 62px);
    padding: clamp(11px, 1.3dvh, 15px) clamp(26px, 3.4vw, 40px); }
  .bigbtn { font-size: clamp(17px, 2.5vw, 25px); max-width: 480px; border-radius: 22px;
    padding: clamp(15px, 1.6dvh, 20px) 22px; }
  /* Карточки ответа: растут шрифт, отступы по бокам и метка. Высота строки —
     базовая (см. правило 2 выше). */
  .opt { font-size: clamp(17px, 2.3vw, 22px); gap: 16px;
    padding: 0 clamp(16px, 2.2vw, 24px); border-radius: 19px; }
  .opt-mark { width: clamp(28px, 3.8vw, 40px); height: clamp(28px, 3.8vw, 40px);
    border-radius: 12px; font-size: clamp(17px, 1.9vw, 18px); }
  .card { font-size: clamp(17px, 2.3vw, 22px); gap: 16px;
    padding: 0 clamp(15px, 2.1vw, 22px); border-radius: 18px; }
  .card-box { width: clamp(26px, 3.5vw, 36px); height: clamp(26px, 3.5vw, 36px);
    border-radius: 11px; font-size: clamp(17px, 1.9vw, 19px); }
  /* Список карточек-галочек в две колонки: на широком экране пять карточек
     в один столбец не только тратят ширину, но и не влезают по высоте —
     на 1024×768 экран уезжал за нижний край на 132px ЕЩЁ ДО этого яруса. */
  .cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(9px, 1.4vw, 14px); align-items: stretch; }
  /* чат */
  .bub { font-size: clamp(17px, 2.3vw, 22px); border-radius: 24px;
    padding: clamp(11px, 1.6vw, 16px) clamp(15px, 2.3vw, 24px); }
  .bub-av { width: clamp(28px, 3.8vw, 40px); height: clamp(28px, 3.8vw, 40px); }
  /* колонки и чипы */
  /* Колонки сортировки — самый тесный по вертикали экран: внутренние отступы
     и шапка колонки НЕ растут (это стоило регресса на 1024×768), растёт
     только зазор между колонками и радиус. */
  .two { gap: clamp(14px, 2.2vw, 26px); }
  .col { border-radius: 24px; }
  .col-h { font-size: clamp(17px, 1.9vw, 17px); }
  .col-h span { font-size: clamp(17px, 1.7vw, 17px); }
  .chip { font-size: clamp(17px, 2.2vw, 21px);
    padding: 0 clamp(13px, 2vw, 20px); border-radius: 16px; }
  /* правило, пары, подсказка, итоги */
  .rulebox { padding: clamp(18px, 2.4vw, 28px) clamp(20px, 3.2vw, 36px); border-radius: 26px; }
  .rulebox p { font-size: clamp(23px, 3.4vw, 38px); }
  .pair { padding: clamp(13px, 1.8vw, 18px) clamp(15px, 2.2vw, 24px); border-radius: 18px; }
  .pair-a, .pair-b { font-size: clamp(17px, 2.2vw, 21px); }
  .note { padding: clamp(14px, 1.9vw, 20px) clamp(16px, 2.4vw, 26px); border-radius: 20px; }
  .note-lbl { font-size: clamp(17px, 1.6vw, 17px); }
  .note-body { font-size: clamp(17px, 2.2vw, 21px); }
  .badge-mini { font-size: clamp(17px, 1.9vw, 18px); padding: 5px 14px; }
  .stamp { font-size: clamp(17px, 2.2vw, 21px);
    padding: clamp(12px, 1.7vw, 16px) clamp(20px, 3vw, 32px); }
  .stamp-name { font-size: clamp(17px, 2vw, 19px); }
  .mainrow { font-size: clamp(17px, 2.2vw, 21px); border-radius: 18px;
    padding: clamp(13px, 1.8vw, 18px) clamp(15px, 2.2vw, 24px); }
  .mainnum { width: clamp(25px, 3.4vw, 34px); height: clamp(25px, 3.4vw, 34px);
    font-size: clamp(17px, 1.8vw, 17px); }
  /* coach-mark */
  .coach-card { max-width: min(440px, calc(100vw - 40px));
    padding: clamp(14px, 2vw, 22px) clamp(16px, 2.5vw, 28px); }
  .coach-title { font-size: clamp(17px, 2.2vw, 21px); }
  .coach-text { font-size: clamp(17px, 2.1vw, 20px); }
}

@media (prefers-reduced-motion: reduce) {
  .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}

/* ── ПЕЧАТЬ ───────────────────────────────────────────────────
   Экран живёт в 100dvh с overflow:hidden — при печати это обрезало бы
   документ на первой видимой области. Здесь распускаем высоту, убираем
   служебную обвязку и тени (тени в печати становятся серой грязью).
   Сам печатаемый документ (Кодекс и т.п.) — забота урока: он рисует свой
   блок и помечает его .print-only, а прочее — .no-print. */
@page { size: A4 portrait; margin: 14mm; }
@media print {
  .lesson-root { height: auto !important; overflow: visible !important; background: #fff !important; }
  .stage { height: auto !important; }
  .stage-content { overflow: visible !important; padding: 0 !important; }
  .stage-content::before, .stage-content::after { content: none !important; }
  .stage-header, .stage-nav, .speaker-wrap,
  .coach-block, .coach-hole, .coach-ring, .coach-card, .no-print { display: none !important; }
  .print-only { display: revert !important; }
  .lesson-root * { box-shadow: none !important; animation: none !important; transition: none !important;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .stack { gap: 8mm !important; }
}
/* ПОДСКАЗКА ПРИ БЕЗДЕЙСТВИИ. Без текста: пульсирует то, что можно нажать.
   Тень, а не рамка: рамка сдвинула бы содержимое кнопки. */
@keyframes lcNudgePulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(${T.shadowBase}, 0); }
  50%      { transform: scale(1.03); box-shadow: 0 0 0 4px ${T.accentSoft}; }
}
/* Пульсация достаёт и до «Дальше»: на повествовательном экране она —
   единственное, что ждёт нажатия. */
.is-nudge .stage-nav .btn-accent:not([disabled]),
.is-nudge .stage-content button:not([disabled]),
.is-nudge .stage-content [role="button"] {
  animation: lcNudgePulse 1.05s ease-in-out 2;
}
@media (prefers-reduced-motion: reduce) {
  .is-nudge .stage-content button:not([disabled]),
  .is-nudge .stage-content [role="button"] { animation: none; outline: 3px solid ${T.accent}; outline-offset: 2px; }
}

.print-only { display: none; }
`;

// =============================================================================
// ==============================  У Р О К  =====================================
// =============================================================================
// ============================================================================
// КИБЕРБЕЗ — ЩИТ · Модуль 1 · Урок 1 «Приём в Штаб»
// Пересобран на INFRA v1 (2026-08-03). Состав взят с отгруженного урока
// (kiber-shchit-m1-l02.vercel.app/?lesson=1), 14 микроэкранов.
//
// ЧТО ИЗМЕНЕНО ПРОТИВ ОТГРУЖЕННОГО:
// 1. Экран 1 — БЕЗ пузырька с репликой. Персонаж крупно, подсветка, кольца речи,
//    дуга длины фразы, каст-строка снизу. Ребёнок смотрит на героя и слушает.
//    Только этот экран: на всех остальных текст на месте.
//    Страховка: если голоса фактически нет (audio.failed) — реплика показывается.
// 2. Тумблер звука снят (в каноне). Из тура убран шаг «кнопка звука» —
//    иначе шаг ждал бы нажатия несуществующей кнопки и «Дальше» не разблокировалась.
//    tour2 стал двухшаговым, текст «три помощника» → «два помощника».
// 3. Анимации: reveal инфо-строк, покачивание персонажей, кольцо на кнопке,
//    общий темп появлений подтянут (см. канон).
// 4. Обращение приведено к правилу модуля: RU к ребёнку «ты», UZ к ребёнку «сиз»,
//    «сен» — только между персонажами. В отгруженном уроке 1 они путались.
// ============================================================================

const META = {
  lessonId: 'kib-m1-01-priem-v-shtab-v2',
  lessonTitle: { ru: 'Приём в Штаб', uz: "Shtabga qabul", en: 'Joining the Base' },
  module: 'kiberbez-shchit-m1'
};

// ПРАВКА 2026-08-05 (заказчик): из урока сняты четыре экрана.
//   · «найди ошибку» + «разбор» + «получилось» (были 6–8) — длинная переписка
//     Нолика читалась 8-леткой как стена текста, а разбор её не спасал;
//   · «допуск» (был 13) — пересказ всего урока списком, ребёнку он ничего не
//     добавлял и дублировал «расскажи дома».
// Ветка «за экраном живой человек» после этого держится на экране «кто рядом»,
// а «интернет помнит» — на экране «интернет запоминает»: обе реплики финала
// («правило дня», «расскажи дома») по-прежнему обеспечены содержанием.
// ПРАВКА 2026-08-05 (вторая, заказчик):
//   + два экрана перед «Интернет и я»: диалог Симки и Нолика «что такое
//     Интернет» и «как летит сообщение». Оба — сцена с рисунком, не текст.
//   − «Правило дня» снято: Стоп/Подумай/Отправь — навык безопасности, он уезжает
//     во второй урок, который теперь и анонсируется в финале.
//   + финал «Итог и мостик»: та же кинолента, что на экранах «кто рядом» и
//     «интернет помнит». Стоит ПОСЛЕ «расскажи дома», чтобы прощание
//     «До встречи в следующем приключении!» звучало последним.
const SCREENS = [
  { id: 'intro', type: 'intro',      takt: 'scene' },
  { id: 'tour1', type: 'ui_tour',    takt: 'scene' },
  { id: 'tour2', type: 'ui_tour',    takt: 'scene' },
  { id: 'dlg',   type: 'dialog',     takt: 'scene' },
  { id: 'travel',type: 'send_demo',  takt: 'watch' },
  { id: 'net',   type: 'internet',   takt: 'watch' },
  { id: 's4',    type: 'who_is_near',takt: 'watch' },
  { id: 's8',    type: 'net_memory', takt: 'watch' },
  { id: 's9',    type: 'badge_make', takt: 'own'   },
  { id: 's10',   type: 'badge_done', takt: 'own'   },
  { id: 'outro', type: 'outro',      takt: 'close' }
];
const TOTAL = SCREENS.length;

// ЧТО СБРАСЫВАЕТ «ПОВТОРИТЬ» (заказчик, 2026-08-07). Экран помнит, что его уже
// проходили, — иначе при возврате «Назад» он проигрывал бы всё заново. Для
// перезапуска эту память надо стереть, иначе пересобранный экран сразу покажет
// конечное состояние вместо первой реплики.
// Значок (badgeColor/badgeSymbol) НЕ трогаем намеренно: это работа ребёнка,
// она уезжает в payload и показывается на следующих страницах. «Повторить»
// перезапускает рассказ страницы, а не стирает сделанное.
const SCREEN_RESET = {
  tour1: ['tourBackDone'], dlg: ['dlgSeen'], travel: ['travelSeen'],
  net: ['netCardsSeen', 'net'], s4: ['s4seen'], s8: ['s8seen'], outro: ['outroSeen']
};

// Цвета значка подняты по яркости ДВАЖДЫ (заказчик, 2026-08-05: сначала
// «сделай ярче», потом «всё ещё слишком тёмно»). Второй заход показал, что
// дело было не столько в самих квадратиках, сколько в кольце значка: оно
// заливалось градиентом с подмесом 38% ЧЁРНОГО — см. .badge-ring, чёрного там
// больше нет. Здесь — «леденцовые» тона на пару шагов светлее и чище.
// В скобках — контраст белого знака на этом фоне (WCAG, посчитан):
//   #FF7A18 = 2.61 · #1FA7FF = 2.62 · #00CB7A = 2.14 · #AE63FF = 3.48
// Зелёный — узкое место набора; ниже него не опускаться, иначе белый знак
// поплывёт. Именно поэтому у .badge-sym усилена тень.
// ЦВЕТА ЗНАЧКА ПЕРЕВЕДЕНЫ НА НАСЫЩЕННЫЕ ПАРЫ СЛАЙДОВ (заказчик, 2026-08-06:
// «сделай цвета ярче и глянцевой как на картинке»). Пары взяты ДОСЛОВНО из
// присланных файлов, а не подобраны на глаз: это те же градиенты, которыми
// залиты экраны устройств на слайдах, поэтому значок и кадры урока звучат в один
// голос. hex — тёмный конец пары, lit — светлый.
//   ВАЖНО ДЛЯ ПЛАТФОРМЫ: в store и в payload по-прежнему уезжает ровно hex, как
//   и раньше. Поле lit — только для отрисовки, наружу оно не идёт, поэтому
//   контракт onFinished не поменялся. Значения hex при этом стали ДРУГИМИ
//   (#FF7A18 → #FF6A00 и т.д.): значки, выбранные до этой правки, в аналитике
//   останутся со старыми кодами.
//   Контраст белого знака на тёмном конце пары (WCAG, посчитан):
//   #FF6A00 = 2.94 · #0A7CFF = 3.99 · #0FA968 = 3.04 · #7A1FE0 = 6.44 —
//   каждый выше прежнего, а зелёный (узкое место набора) поднялся с 2.14.
//   Именно поэтому светлый конец пары гаснет к 52% (см. .badge-ring): под самим
//   знаком должен лежать тёмный конец, иначе глянец съедает белый знак.
// ЗНАЧОК ЖДЁТ ЗАКАЗЧИКА (2026-08-07). Пробное осветление пары и эффект вручения
// откачены: заказчик пришлёт свой вариант значка отдельно. Здесь ровно то, что
// стоит в проде, — пары из присланных слайдов.
const BADGE_COLORS = [
  { id: 'orange', hex: '#FF6A00', lit: '#FFC53D', name: { ru: 'Оранжевый', uz: "Zarg'aldoq", en: 'Orange' } },
  { id: 'blue',   hex: '#0A7CFF', lit: '#5CE7FF', name: { ru: 'Синий',     uz: "Ko'k", en: 'Blue' } },
  { id: 'green',  hex: '#0FA968', lit: '#6BF5B8', name: { ru: 'Зелёный',   uz: "Yashil", en: 'Green' } },
  { id: 'violet', hex: '#7A1FE0', lit: '#D48CFF', name: { ru: 'Фиолетовый',uz: "Binafsha", en: 'Purple' } }
];
// Знаки значка — SVG-иконки, а не эмодзи: значок ребёнка идёт через всю линейку,
// и он не должен выглядеть по-разному на Windows, Android и iOS.
// В payload уезжает ИМЯ иконки ('shield'), а не символ — платформе так надёжнее.
// 'key' снят (заказчик, 2026-08-05): в ряду из пяти знаков ключ читался хуже
// остальных — мелкая бородка на 44px превращалась в пятно.
// 'eye' снят (заказчик, 2026-08-06). Иконка глаза остаётся в наборе ICONS — она
// общая для модуля, — но в конструкторе значка её больше нет.
const BADGE_SYMBOLS = ['shield', 'star', 'bolt', 'lock'];
// Имя знака. У кнопок цвета подпись была с самого начала, у знака — нет
// вовсе: экранный диктор читал четыре безымянные кнопки подряд.
const BADGE_SYMBOL_NAME = {
  shield: { ru: 'Щит', uz: "Qalqon", en: 'Shield' },
  star: { ru: 'Звезда', uz: "Yulduz", en: 'Star' },
  bolt: { ru: 'Молния', uz: "Chaqmoq", en: 'Lightning' },
  lock: { ru: 'Замок', uz: "Qulf", en: 'Lock' }
};
// Пара «светлый/тёмный» по сохранённому hex. Ищем по hex, а не по id, потому что
// store хранит именно hex (см. выше). Неизвестный цвет — не падаем, а рисуем им же.
const badgePair = (hex) => {
  const c = BADGE_COLORS.find((x) => x.hex === hex);
  return { a: (c && c.lit) || hex || '#C9C7C2', b: hex || '#C9C7C2' };
};

const C = {
  intro: {
    eyebrow: { ru: 'Знакомство', uz: "Tanishuv", en: 'Meet the team' },
    replay: { ru: 'Послушать ещё раз', uz: "Yana bir marta tinglash", en: 'Listen again' },
    cast: [
      { who: 'simka', pose: 'S_wave', after: 900,
        say: { ru: 'Привет! Я Симка. Я живу внутри твоего телефона и планшета — там, где всё работает.',
               uz: "Salom! Men Simkaman. Men telefoningiz va planshetingiz ichida yashayman — hamma narsa ishlaydigan joyda.", en: 'Hi! I am Simka. I live inside your phone and tablet, where everything works.' } },
      { who: 'nolik', pose: 'N_wave', after: 900,
        say: { ru: 'Привет! Я Нолик. Честно скажу: я часто тороплюсь и делаю ошибки. Будешь мне помогать?',
               uz: "Salom! Men Nolikman. Rostini aytsam, men tez-tez shoshaman va xato qilaman. Menga yordam berasizmi?", en: 'Hi! I am Nolik. To be honest, I often rush and make mistakes. Will you help me?' } },
      { who: 'simka', pose: 'S_point', after: 900,
        say: { ru: 'Отлично! Теперь давай я познакомлю тебя с нашей платформой и покажу, как здесь всё работает.',
               uz: "Zo'r! Endi keling, sizni platformamiz bilan tanishtiraman va bu yerda hammasi qanday ishlashini ko'rsataman.", en: 'Great! Now let me show you our platform and how everything works here.' } }
    ]
  },
  tour1: {
    eyebrow: { ru: 'Как всё работает', uz: "Hammasi qanday ishlaydi", en: 'How it all works' },
    title: { ru: 'Научимся пользоваться уроком', uz: "Darsdan foydalanishni o'rganamiz", en: 'Let us learn how to use the lesson' },
    lead: { ru: 'Подсказка покажет кнопку — нажми именно её. Кнопки настоящие.',
            uz: "Ko'rsatma tugmani ko'rsatadi — aynan o'shani bosing. Tugmalar haqiqiy.", en: 'The hint will point to a button. Press that one. The buttons are real.' },
    steps: [
      { id: 'back', sel: '.stage-nav .btn-ghost', icon: 'arrowL',
        title: { ru: 'Кнопка «Назад»', uz: "«Orqaga» tugmasi", en: 'The “Back” button' },
        short: { ru: 'Возвращает на предыдущую страницу', uz: "Oldingi sahifaga qaytaradi", en: 'Takes you to the page before' },
        // Вступление экрана вшито в первую подсказку: оно печаталось абзацем и
        // не звучало, а ребёнку, который не читает, именно оно и объясняет, что
        // сейчас будет и что кнопки настоящие.
        text: { ru: 'Подсказка покажет кнопку — нажми именно её. Кнопки настоящие. Если захочешь вернуться на предыдущую страницу, используй кнопку «Назад». Попробуй нажать её прямо сейчас!',
                uz: "Oldingi sahifaga qaytmoqchi bo'lsangiz, «Orqaga» tugmasidan foydalaning. Hoziroq bosib ko'ring!", en: 'If you want to go back to the page before, use the “Back” button. Try pressing it right now!' } },
      { id: 'next', sel: '.stage-nav .btn-accent', icon: 'arrowR',
        title: { ru: 'Кнопка «Дальше»', uz: "«Davom etish» tugmasi", en: 'The “Next” button' },
        short: { ru: 'Ведёт к следующему шагу урока', uz: "Darsning keyingi qadamiga olib boradi", en: 'Takes you to the next step of the lesson' },
        text: { ru: 'Теперь нажми кнопку «Дальше», чтобы перейти к следующему шагу урока.',
                uz: "Endi darsning keyingi qadamiga o'tish uchun «Davom etish» tugmasini bosing.", en: 'Now press the “Next” button to go to the next step of the lesson.' } }
    ]
  },
  tour2: {
    eyebrow: { ru: 'Как всё работает', uz: "Hammasi qanday ishlaydi", en: 'How it all works' },
    title: { ru: 'Что ещё есть на экране', uz: "Ekranda yana nimalar bor", en: 'What else is on the screen' },
    // Помощников снова трое: полоска, счётчик и «Пауза». Раньше их было два —
    // шаг с кнопкой звука убрали вместе с самой кнопкой, а пауза приехала сюда
    // 2026-08-06, потому что живёт в шапке рядом с этими двумя.
    lead: { ru: 'Осталось три помощника наверху. Посмотри на каждого.', uz: "Yuqorida yana uchta yordamchi qoldi. Har biriga qarang.", en: 'Three more helpers are at the top. Look at each one.' },
    // Озвучка выключена (OZVUCHKA_VYKL) → кнопки паузы в шапке нет, и шаг «нажми
    // паузу» стал тупиком: подсвечивать нечего, «Дальше» не просыпается. Пока флаг
    // стоит, тур знакомит с двумя помощниками — этими текстами (см. TOUR2_STEPS).
    leadBezPauzy: { ru: 'Осталось два помощника наверху. Посмотри на каждого.', uz: "Yuqorida yana ikkita yordamchi qoldi. Har biriga qarang.", en: 'Two more helpers are at the top. Look at each one.' },
    steps: [
      { id: 'progress', sel: '.progress-track', icon: 'gauge', auto: true,
        title: { ru: 'Полоска прогресса', uz: "Jarayon chizig'i", en: 'Progress bar' },
        short: { ru: 'Показывает, сколько урока пройдено', uz: "Darsning qanchasi o'tganini ko'rsatadi", en: 'Shows how much of the lesson is done' },
        // Вступление экрана вшито в первую подсказку — см. tour1.
        text: { ru: 'Осталось три помощника наверху. Посмотри на каждого. Эта полоска показывает, сколько урока уже пройдено. С каждой страницей она становится длиннее.',
                uz: "Bu chiziq darsning qanchasi o'tganini ko'rsatadi. Har bir sahifada u uzayib boradi.", en: 'This bar shows how much of the lesson is done. It gets longer with every page.' },
        textBezPauzy: { ru: 'Осталось два помощника наверху. Посмотри на каждого. Эта полоска показывает, сколько урока уже пройдено. С каждой страницей она становится длиннее.',
                uz: "Bu chiziq darsning qanchasi o'tganini ko'rsatadi. Har bir sahifada u uzayib boradi.", en: 'This bar shows how much of the lesson is done. It gets longer with every page.' } },
      { id: 'counter', sel: '.counter', icon: 'hash', auto: true,
        title: { ru: 'Номер страницы', uz: "Sahifa raqami", en: 'Page number' },
        short: { ru: 'Какая страница сейчас и сколько всего', uz: "Hozir qaysi sahifa va jami nechta", en: 'Which page you are on and how many there are' },
        text: { ru: 'Здесь видно, на какой странице ты сейчас и сколько их всего.',
                uz: "Bu yerda hozir qaysi sahifada ekaningiz va ular jami nechta ekani ko'rinadi.", en: 'Here you can see which page you are on and how many pages there are.' } },
      // ПАУЗА ЗНАКОМИТСЯ ЗДЕСЬ (заказчик, 2026-08-06), а не на странице 2: кнопка
      // живёт в шапке рядом с полоской прогресса и счётчиком, то есть ровно среди
      // тех помощников, которым учит эта страница. Идёт последней — после неё
      // ребёнок уже ничего не ищет глазами.
      // Шаг из ДВУХ нажатий: text — на первое, text2 — после него. Ребёнок должен
      // на практике понять, что пауза это переключатель и урок сам не продолжится.
      { id: 'pause', sel: '.chrome-side .pause-btn', icon: 'pause',
        title: { ru: 'Кнопка «Пауза»', uz: "«Pauza» tugmasi", en: 'The “Pause” button' },
        short: { ru: 'Останавливает урок. Нажми ещё раз, чтобы продолжить',
                 uz: "Darsni to'xtatadi. Davom etish uchun yana bosing", en: 'Stops the lesson. Press again to continue' },
        text: { ru: 'Если нужно остановиться, нажми «Паузу». Попробуй прямо сейчас!',
                uz: "To'xtash kerak bo'lsa, «Pauza»ni bosing. Hoziroq bosib ko'ring!", en: 'If you need to stop, press “Pause”. Try it right now!' },
        text2: { ru: 'Урок остановился. Теперь нажми ещё раз, чтобы продолжить.',
                 uz: "Dars to'xtadi. Endi davom etish uchun yana bir marta bosing.", en: 'The lesson has stopped. Now press again to continue.' } },
    ],
    done: { ru: 'Теперь ты знаешь урок изнутри. Идём дальше!', uz: "Endi darsni ichidan bilasiz. Davom etamiz!", en: 'Now you know the lesson inside out. Let us go on!' }
  },
  // ДИАЛОГ СИМКИ И НОЛИКА «что такое Интернет» (добавлен 2026-08-05).
  // На экране — только сеть из трёх устройств; реплики идут голосом, говорящий
  // виден по тому, кто стоит в шапке (Симка слева, Нолик справа — канон).
  // net: до какой стадии дорисована сеть к этой реплике.
  //   0 — устройства стоят по отдельности, дорожек ещё нет
  //   1 — дорожки прочерчиваются (реплика про «невидимые дорожки»)
  //   2 — по дорожке летит пакет (реплика про рисунок другу)
  //   3 — сеть работает целиком
  //
  // step: до какого шага доведена сцена к концу этой реплики (заказчик,
  // 2026-08-06: «изображения будут выходить компьютер, планшет и телефон по
  // очереди, когда говорит Симка про них»). Расшифровка шагов — у NetworkArt.
  // Компьютер выходит на догадке Нолика «это огромный компьютер?» — и остаётся
  // один в кадре, пока Симка не поправит его. Это не награда за неверный ответ,
  // а зримый аргумент: один компьютер — не Интернет, Интернет начинается, когда
  // рядом встают ещё два устройства и между ними появляются дорожки.
  //
  // lead: через сколько мс ПОСЛЕ НАЧАЛА реплики выходит первое устройство. Слова
  // не размечены по времени (HTTP-TTS не отдаёт тайминги слов), поэтому задержки
  // подобраны на слух под русскую фразу; шаг между устройствами — DEV_STEP,
  // дорожки — через NET_LAG после последнего устройства. UZ-фраза длиннее, там
  // устройства выходят чуть раньше слов — это допустимо, обратное хуже.
  // «Сен» между персонажами — правило модуля; к ребёнку в UZ обращаемся на «сиз».
  dlg: {
    eyebrow: { ru: 'Что такое интернет', uz: "Internet nima", en: 'What the internet is' },
    beats: [
      { who: 'simka', pose: 'S_point', step: 0,
        say: { ru: 'Нолик, как ты думаешь, что такое интернет?',
               uz: "Nolik, sizningcha internet nima?", en: 'Nolik, what do you think the internet is?' } },
      // «Это огромный компьютер?» — карточка выезжает, и на слове «компьютер»
      // в её центре появляется большой компьютер, ровно как сказал Нолик.
      { who: 'nolik', pose: 'N_tablet', step: 2, lead: 700,
        say: { ru: 'Это огромный компьютер?', uz: "Bu ulkan kompyutermi?", en: 'Is it a huge computer?' } },
      // Самая длинная реплика ведёт сразу четыре шага, каждый под своё слово:
      // «…компьютеры» — компьютер уменьшается и уезжает влево вниз,
      // «…планшеты» — приходит планшет, «…телефоны» — телефон,
      // «…соединены невидимыми дорожками» — вытягиваются нити.
      // «Не совсем. Представь, что» звучит ≈1,9 с — отсюда lead.
      { who: 'simka', pose: 'S_point', step: 6, lead: 1900,
        say: { ru: 'Не совсем. Представь, что компьютеры, планшеты и телефоны по всему миру соединены между собой невидимыми дорожками. Эти дорожки и помогают устройствам обмениваться информацией.',
               uz: "Unchalik emas. Tasavvur qiling: butun dunyodagi kompyuterlar, planshetlar va telefonlar bir-biriga ko'rinmas yo'llar bilan ulangan. Aynan shu yo'llar qurilmalarga ma'lumot almashishga yordam beradi.", en: 'Not quite. Imagine that computers, tablets and phones all over the world are joined by invisible paths. These paths help devices share information.' } },
      { who: 'nolik', pose: 'N_tablet', step: 6,
        say: { ru: 'Значит, если я отправлю другу рисунок...',
               uz: "Demak, agar men do'stimga rasm yuborsam...", en: 'So if I send my friend a drawing...' } },
      // «Он пройдёт через Интернет» — вот теперь по нитям бегут кружки.
      { who: 'simka', pose: 'S_point', step: 7, lead: 300,
        say: { ru: 'Он пройдёт через интернет и почти сразу окажется у друга!',
               uz: "U internet orqali o'tadi va deyarli darrov do'stingizda paydo bo'ladi!", en: 'It goes through the internet and reaches your friend almost at once!' } },
      { who: 'nolik', pose: 'N_tablet', step: 7,
        say: { ru: 'А видео и игры тоже?', uz: "Video va o'yinlar ham shundaymi?", en: 'What about videos and games?' } },
      { who: 'simka', pose: 'S_point', step: 7,
        say: { ru: 'Конечно! Через интернет можно смотреть мультфильмы, учиться, играть вместе с друзьями и искать полезную информацию. Но пользоваться интернетом нужно внимательно и безопасно.',
               uz: "Albatta! Internet orqali multfilm ko'rish, o'qish, do'stlar bilan birga o'ynash va foydali ma'lumot qidirish mumkin. Lekin internetdan diqqat bilan va xavfsiz foydalanish kerak.", en: 'Of course! On the internet you can watch cartoons, learn, play with friends and look for useful information. But you need to use the internet carefully and safely.' } }
    ]
  },
  // «КАК ЛЕТИТ СООБЩЕНИЕ» (добавлен 2026-08-05). Одна мысль, одно действие:
  // ребёнок сам жмёт «Отправить» и смотрит, как самолётик превращается в пакет
  // данных и долетает до друга. Кнопка — чтобы после двух экранов подряд, где
  // только смотрят, у ребёнка снова была своя роль.
  travel: {
    eyebrow: { ru: 'Как летит сообщение', uz: "Xabar qanday uchadi", en: 'How a message flies' },
    pose: 'S_tablet',
    // Симка ОБЯЗАНА проговорить, что нужно нажать (заказчик, 2026-08-05):
    // раньше кнопка просто появлялась, и ребёнок не знал, что ход за ним.
    // Правило теперь общее для урока: требуется действие — Симка его называет.
    say: { ru: 'Когда ты отправляешь сообщение, фотографию или видео, они путешествуют по этой сети и быстро находят получателя. Нажми кнопку «Отправить» — и посмотри сам.',
           uz: "Siz xabar, surat yoki video yuborganingizda, ular shu tarmoq bo'ylab sayohat qilib, qabul qiluvchini tez topadi. «Yuborish» tugmasini bosing va o'zingiz ko'ring.", en: 'When you send a message, a photo or a video, it travels through this network and quickly finds the person it is for. Press “Send” and see for yourself.' },
    btn: { ru: 'Отправить', uz: "Yuborish", en: 'Send' },
    again: { ru: 'Отправить ещё раз', uz: "Yana yuborish", en: 'Send again' },
    done: { ru: 'Видишь? Оно уже у друга. Так летит каждое твоё сообщение.',
            uz: "Ko'rdingizmi? U allaqachon do'stingizda. Har bir xabaringiz shunday uchadi.", en: 'See? It is already with your friend. Every message you send flies like this.' }
  },
  net: {
    eyebrow: { ru: 'Интернет и я', uz: "Internet va men", en: 'Internet and me' },
    pose: 'S_tablet',
    say: { ru: 'Сначала про интернет. Это огромный мир внутри экрана: там играют, смотрят мультики и пишут друг другу.',
           uz: "Avval internet haqida. Bu ekran ichidagi ulkan dunyo: u yerda o'ynashadi, multfilm ko'rishadi va bir-biriga yozishadi.", en: 'First, about the internet. It is a huge world inside the screen: people play there, watch cartoons and write to each other.' },
    // ПЕРЕРАБОТАН 2026-08-05 (заказчик: «текстовые карточки запрещены»).
    // Было: карточка = заголовок + АБЗАЦ описания, и тот же смысл ещё раз
    // голосом. Стало: та же кинолента, что на экранах «кто рядом» и «интернет
    // помнит» — рисунок объясняет сам, подпись в 2–3 слова только называет
    // сцену, всё остальное произносит Симка. Поле text удалено целиком.
    cards: [
      { art: 'play', tone: 'ok',
        t: { ru: 'Играешь в игры', uz: "O'yin o'ynaysiz", en: 'You play games' },
        cap: { ru: 'Один и с друзьями', uz: "Yolg'iz va do'stlar bilan", en: 'Alone and with friends' },
        voice: { ru: 'Любишь играть? Многие игры работают через интернет. Благодаря этому можно играть даже вместе с друзьями.',
                 uz: "O'ynashni yoqtirasizmi? Ko'p o'yinlar internet orqali ishlaydi. Shu sababli do'stlar bilan ham o'ynash mumkin.", en: 'Do you like playing? Many games work through the internet. That is how you can play together with friends.' } },
      { art: 'watch', tone: 'ok',
        t: { ru: 'Смотришь мультики', uz: "Multfilm ko'rasiz", en: 'You watch cartoons' },
        cap: { ru: 'В любое время', uz: "Istalgan paytda", en: 'Any time' },
        voice: { ru: 'А мультики? Их тоже показывает интернет — в любое время, когда тебе удобно.',
                 uz: "Multfilmlar-chi? Ularni ham internet ko'rsatadi — o'zingizga qulay istalgan paytda.", en: 'And cartoons? The internet shows them too, any time you like.' } },
      { art: 'write', tone: 'ok',
        t: { ru: 'Пишешь друзьям', uz: "Do'stlarga yozasiz", en: 'You write to friends' },
        cap: { ru: 'Слово летит за секунду', uz: "So'z bir soniyada", en: 'A word flies in a second' },
        voice: { ru: 'Через интернет пишут друзьям, отправляют фотографии и звонят. Слова доходят за секунду.',
                 uz: "Internet orqali do'stlarga yozadi, surat yuboradi va qo'ng'iroq qiladi. So'z bir soniyada yetib boradi.", en: 'People use the internet to write to friends, send photos and call. Words arrive in a second.' } },
      { art: 'search', tone: 'ok',
        t: { ru: 'Ищешь ответы', uz: "Javob qidirasiz", en: 'You look for answers' },
        cap: { ru: 'Интернет подскажет', uz: "Internet aytib beradi", en: 'The internet will help' },
        voice: { ru: 'И если хочется что-то узнать — интернет быстро находит ответ.',
                 uz: "Va biror narsani bilmoqchi bo'lsangiz — internet javobni tez topadi.", en: 'And if you want to find something out, the internet finds the answer fast.' } }
    ],
    // praise здесь — не похвала, а связка: бывший экранный текст lead ушёл в
    // ГОЛОС (заказчик: «это и так говорит Симка, не надо показывать в тексте»),
    // и сразу за ним звучит вопрос с прямым указанием, что нужно нажать.
    praise: { ru: 'И самое важное: в интернете ты не один. Рядом миллионы людей — знакомые и совсем незнакомые. Так что же такое интернет? Выбери ответ.',
              uz: "Eng muhimi: internetda siz yolg'iz emassiz. Yoningizda millionlab odam — tanishlar ham, mutlaqo notanishlar ham. Xo'sh, internet nima? Javobni tanlang.", en: 'And the most important thing: on the internet you are not alone. Millions of people are near you, ones you know and ones you do not. So what is the internet? Choose an answer.' },
    ask: { ru: 'Так что же такое интернет?', uz: "Xo'sh, internet nima?", en: 'So what is the internet?' },
    opts: [
      { text: { ru: 'Место, где живут только игры', uz: "Faqat o'yinlar yashaydigan joy", en: 'A place where only games live' },
        why: { ru: 'Игры там есть, но это лишь часть. Ещё там люди: они пишут, смотрят и общаются.',
               uz: "O'yinlar bor, lekin bu faqat bir qismi. Yana u yerda odamlar bor: yozishadi, ko'rishadi va muloqot qilishadi.", en: 'Games are there, but that is only a part of it. There are people there too: they write, watch and talk.' } },
      { text: { ru: 'Огромный цифровой мир', uz: "Ulkan raqamli dunyo", en: 'A huge digital world' },
        // ВЕРНЫЙ ОТВЕТ — ТОЛЬКО ПОХВАЛА (заказчик, 2026-08-06: «когда ребёнок
        // отвечает правильно, не нужно заново объяснять — только хвали и идём
        // дальше»). Прежний разбор пересказывал то, что ребёнок и так понял, и
        // задерживал его на экране ещё на десять секунд. Разборы неверных
        // вариантов (why) остаются: там объяснение как раз нужно.
        ok: { ru: 'Верно! Молодец. Идём дальше.', uz: "To'g'ri! Barakalla. Davom etamiz.", en: 'That is right! Well done. Let us go on.' } },
      { text: { ru: 'Волшебная коробка, которая всё знает', uz: "Hamma narsani biladigan sehrli quti", en: 'A magic box that knows everything' },
        why: { ru: 'Интернет не волшебный. Всё, что там есть, придумали люди — а люди иногда ошибаются.',
               uz: "Internet sehrli emas. U yerdagi hamma narsani odamlar yaratgan — odamlar esa ba'zan xato qiladi.", en: 'The internet is not magic. Everything in it was made by people, and people sometimes make mistakes.' } },
      // ЧЕТВЁРТЫЙ ВАРИАНТ (заказчик, 22.09.2026, п.5): ряд чётный, сетка 2x2.
      // «Экран телефона» — самая близкая догадка семилетнего: он видит устройство
      // и считает интернетом его. Разбор возвращает к дорожкам и людям.
      { text: { ru: 'Экран моего телефона', uz: 'Telefonimning ekrani', en: 'The screen of my phone' },
        why: { ru: 'Экран — это окно, а не сам интернет. За окном дорожки и люди по всему миру.',
               uz: "Ekran — deraza, internetning o'zi emas. Deraza ortida yo'llar va butun dunyo bo'ylab odamlar bor.", en: 'A screen is a window, not the internet itself. Behind it are the paths and people all over the world.' } }
    ],
    correct: 1
  },
  // ЭКРАН «КТО РЯДОМ» — переработан 2026-08-05 (заказчик).
  // Было: четыре карточки одновременно, в каждой заголовок + пояснение + вывод.
  // Ребёнок 8–10 лет получал двенадцать строк текста разом и терял Симку из виду.
  // Стало: КИНОЛЕНТА. Одна сцена на экране, крупная картинка, подпись в 2–3
  // слова, всё остальное — голосом Симки. Договорила — сцена уезжает влево,
  // справа приезжает следующая. Текст на карточке НЕ дублирует реплику
  // (принцип избыточности Майера): подпись — это ярлык, а не пересказ.
  s4: {
    eyebrow: { ru: 'Кто рядом', uz: "Yoningizda kim bor", en: 'Who is near' },
    pose: 'S_open',
    say: { ru: 'Смотри, кто может быть рядом с тобой в интернете.',
           uz: "Qarang, internetda yoningizda kim bo'lishi mumkin.", en: 'Look who can be near you on the internet.' },
    // tone: 'ok' — рядом безопасно, 'warn' — здесь нужна осторожность. Знака
    // опасности на семье и учителях быть не может: ребёнок 8–10 читает его
    // буквально и начнёт бояться своих же взрослых.
    cards: [
      { art: 'family', tone: 'ok',
        t: { ru: 'Семья и друзья', uz: "Oila va do'stlar", en: 'Family and friends' },
        cap: { ru: 'Можно писать', uz: "Yozish mumkin", en: 'You can write to them' },
        voice: { ru: 'Это твоя семья и друзья. Ты знаешь их в жизни, поэтому им можно писать.',
                 uz: "Bu sizning oilangiz va do'stlaringiz. Ularni hayotda taniysiz, shuning uchun ularga yozsangiz bo'ladi.", en: 'These are your family and friends. You know them in real life, so you can write to them.' } },
      { art: 'teacher', tone: 'ok',
        t: { ru: 'Учителя и взрослые', uz: "O'qituvchi va kattalar", en: 'Teachers and grown-ups' },
        cap: { ru: 'Можно рассказать', uz: "Aytish mumkin", en: 'You can tell them' },
        voice: { ru: 'Учителя и другие взрослые помогают детям. Если что-то случилось, обязательно расскажи им.',
                 uz: "O'qituvchilar va boshqa kattalar bolalarga yordam beradi. Biror narsa bo'lsa, albatta ularga ayting.", en: 'Teachers and other grown-ups help children. If something happens, be sure to tell them.' } },
      { art: 'stranger', tone: 'warn',
        t: { ru: 'Незнакомые', uz: "Notanishlar", en: 'Strangers' },
        cap: { ru: 'Не верь сразу', uz: "Darrov ishonmang", en: 'Do not trust at once' },
        voice: { ru: 'Если человека ты не знаешь в жизни, не верь всему, что он пишет.',
                 uz: "Agar odamni hayotda tanimasangiz, u yozgan hamma narsaga ishonmang.", en: 'If you do not know a person in real life, do not believe everything they write.' } },
      { art: 'robot', tone: 'warn',
        t: { ru: 'Роботы и программы', uz: "Robot va dasturlar", en: 'Robots and programs' },
        cap: { ru: 'Не всегда человек', uz: "Har doim odam emas", en: 'Not always a person' },
        voice: { ru: 'Иногда сообщения пишет робот. Он может выглядеть как настоящий друг.',
                 uz: "Ba'zan xabarni robot yozadi. U xuddi haqiqiy do'stdek ko'rinishi mumkin.", en: 'Sometimes a robot writes the messages. It can look just like a real friend.' } }
    ],
    praise: { ru: 'Отлично! Теперь ты знаешь, кто может встретиться в интернете.',
              uz: "Zo'r! Endi internetda kim uchrashi mumkinligini bilasiz.", en: 'Great! Now you know who you can meet on the internet.' }
  },
  // ЭКРАН «ИНТЕРНЕТ ЗАПОМИНАЕТ» — та же кинолента, что и «кто рядом»
  // (переработан 2026-08-05 по той же причине: три строки-абзаца разом).
  s8: {
    eyebrow: { ru: 'Интернет помнит', uz: "Internet eslab qoladi", en: 'The internet remembers' },
    pose: 'S_tablet',
    say: { ru: 'А ещё интернет умеет запоминать. Смотри, как это работает.',
           uz: "Internet yana eslab qolishni ham biladi. Qarang, bu qanday ishlaydi.", en: 'And the internet can also remember. Look how it works.' },
    cards: [
      { art: 'msg', tone: 'warn',
        t: { ru: 'Сообщение', uz: "Xabar", en: 'A message' },
        cap: { ru: 'Его сохранят', uz: "Uni saqlashadi", en: 'It will be saved' },
        voice: { ru: 'Ты отправил сообщение. Его можно сохранить и переслать кому угодно.',
                 uz: "Siz xabar yubordingiz. Uni saqlab, istalgan odamga yuborish mumkin.", en: 'You sent a message. It can be saved and passed on to anyone.' } },
      { art: 'photo', tone: 'warn',
        t: { ru: 'Фото', uz: "Surat", en: 'A photo' },
        cap: { ru: 'Увидят многие', uz: "Ko'pchilik ko'radi", en: 'Many will see it' },
        voice: { ru: 'Фото уходит дальше. Оно может оказаться сразу у многих людей.',
                 uz: "Surat uzoqqa ketadi. U bir vaqtda ko'p odamda paydo bo'lishi mumkin.", en: 'A photo goes further. It can reach many people at once.' } },
      { art: 'kept', tone: 'warn',
        t: { ru: 'Даже удалённое', uz: "Hatto o'chirilgani ham", en: 'Even a deleted one' },
        cap: { ru: 'Копия осталась', uz: "Nusxasi qoladi", en: 'A copy stayed' },
        voice: { ru: 'Ты удалил у себя, а копия осталась у другого. Интернет уже запомнил.',
                 uz: "Siz o'zingizdan o'chirdingiz, nusxasi esa boshqada qoldi. Internet allaqachon eslab qolgan.", en: 'You deleted it on your side, but the copy stayed with someone else. The internet has already remembered it.' } }
    ],
    praise: { ru: 'Молодец! Теперь ты знаешь: интернет всё запоминает.',
              uz: "Barakalla! Endi bilasiz: internet hammasini eslab qoladi.", en: 'Well done! Now you know: the internet remembers everything.' }
  },
  s9: {
    eyebrow: { ru: 'Твой значок', uz: "Sizning nishoningiz", en: 'Your badge' },
    pose: 'S_open',
    // ЗАКАЗЧИК, 22.09.2026: реплика должна объяснять, ЗАЧЕМ значок (это пропуск
    // в Штаб), и вести по порядку — сначала цвет, потом знак. Прежнее обещание
    // «он будет с тобой во всех уроках» убрано.
    say: { ru: 'Теперь сделай себе значок. Чтобы тебя приняли в Штаб, у тебя должен быть свой личный значок. Сначала выбери цвет, потом знак.',
           uz: "Endi o'zingiz uchun nishon yasang. Siz shtabga qabul qilinishingiz uchun o'zingizning shaxsiy nishoningiz bo'lishi lozim. Avval rang, keyin belgini tanlang.", en: 'Now make your own badge. To be accepted into the Base you need your own personal badge. First choose a colour, then a sign.' },
    colorLabel: { ru: 'Цвет', uz: "Rang", en: 'Color' },
    symbolLabel: { ru: 'Знак', uz: "Belgi", en: 'Sign' },
    done: { ru: 'Готово. Такой значок ни у кого больше не будет.', uz: "Tayyor. Bunday nishon boshqa hech kimda bo'lmaydi.", en: 'Done. No one else will have a badge like this.' }
  },
  s10: {
    eyebrow: { ru: 'Твой значок', uz: "Sizning nishoningiz", en: 'Your badge' },
    pose: 'S_jump',
    say: { ru: 'Вот он, твой значок! Теперь ты в Штабе по-настоящему.', uz: "Mana u, nishoningiz! Endi siz chindan ham Shtabdasiz.", en: 'Here it is, your badge! Now you are really part of the Base.' },
    // ПОДПИСЬ УБРАНА (заказчик, 22.09.2026): «Запомни его — он будет расти
    // вместе с тобой» обещала то, чего в уроках не происходит.
  },
  s13: {
    eyebrow: { ru: 'Расскажи дома', uz: "Uyda gapirib bering", en: 'Tell them at home' },
    pose: 'S_thumb',
    say: { ru: 'Дома спросят, что было на первом уроке. Выбери, как расскажешь.',
           uz: "Uyda birinchi darsda nima bo'lganini so'rashadi. Qanday aytishingizni tanlang.", en: 'At home they will ask what happened in the first lesson. Choose how you will tell them.' },
    ask: { ru: 'Что расскажешь дома про интернет?', uz: "Uyda internet haqida nima aytasiz?", en: 'What will you tell them at home about the internet?' },
    // ВАРИАНТЫ ПЕРЕСОБРАНЫ 2026-08-05 (заказчик: «ответ странный, не подойдёт
    // на урок»). Две настоящие причины, обе подтвердились:
    //  1. ДЛИНА. Прежний ВЕРНЫЙ вариант — 52 знака RU / 66 UZ. Замерено в
    //     браузере на 375px: FitLine дожимал его до предельных 11px и всё равно
    //     обрезал многоточием («…он всё запомин…»). Ребёнок физически не мог
    //     прочитать тот вариант, который обязан выбрать. Лимит: RU <= 40, UZ <= 44.
    //  2. СОДЕРЖАНИЕ. Прежний верный вариант держался на «живых людях» — а
    //     линия «за каждым экраном живой человек» из урока удалена, и карточка
    //     s4 про робота говорит буквально обратное («иногда пишет робот, он
    //     может выглядеть как настоящий друг»). Теперь верный вариант собран
    //     из того, что урок ДЕЙСТВИТЕЛЬНО закрепил: «рядом много других людей»
    //     (экран net) + «интернет всё помнит» (экран s8).
    // Неверный вариант №1 — дословная догадка Нолика с экрана-диалога: ребёнок
    // её слышал, она правдоподобна, а разбор даёт уроку второй шанс повторить
    // определение интернета. Порядок важен: первым стоит вариант, чей разбор
    // НЕ проговаривает верный ответ, иначе первый же тык выдал бы решение.
    opts: [
      { text: { ru: 'Интернет — это огромный компьютер', uz: "Internet — ulkan kompyuter", en: 'The internet is one huge computer' },
        why: { ru: 'Нолик тоже так подумал! А это компьютеры, планшеты и телефоны по всему миру — их соединяют невидимые дорожки.',
               uz: "Nolik ham shunday o'ylagan edi! Bu — dunyodagi kompyuter, planshet va telefonlar, ko'rinmas yo'llar bilan ulangan.", en: 'Nolik thought so too! But it is computers, tablets and phones all over the world, joined by invisible paths.' } },
      { text: { ru: 'Рядом люди, и интернет всё помнит', uz: "Yonida odam bor, internet hammasini eslaydi", en: 'There are people around, and the internet remembers everything' },
        ok: { ru: 'Верно! Молодец. Идём дальше.', uz: "To'g'ri! Barakalla. Davom etamiz.", en: 'That is right! Well done. Let us go on.' } },
      { text: { ru: 'Интернет — это просто игры и мультики', uz: "Internet — faqat o'yin va multfilmlar", en: 'The internet is just games and cartoons' },
        why: { ru: 'Игры и мультики там правда есть. Но это лишь часть — рядом ещё много других людей.',
               uz: "O'yin va multfilmlar bor, to'g'ri. Lekin bu faqat bir qismi — yonida yana ko'p odam bor.", en: 'Games and cartoons really are there. But that is only a part of it — there are many other people around.' } },
      // ЧЕТВЁРТЫЙ ВАРИАНТ (заказчик, 22.09.2026, п.5): ряд чётный, сетка 2x2.
      // «Что отправил, то и стёр» — прямая противоположность второму правилу
      // урока, и разбор повторяет его ещё раз, теперь от обратного.
      { text: { ru: 'Что отправил, то можно стереть', uz: "Yuborganni o'chirsa bo'ladi", en: 'Whatever you send, you can erase' },
        why: { ru: 'Наоборот: интернет всё помнит. Стёр у себя — у других осталось.',
               uz: "Aksincha: internet hammasini eslaydi. O'zingizdan o'chirdingiz — boshqalarda qoldi.", en: 'The other way round: the internet remembers. Erased on your side, still there on theirs.' } }
    ],
    correct: 1
  },
  // ИТОГ И МОСТИК В УРОК 2 (добавлен 2026-08-05, текст заказчика).
  // Четыре абзаца итога — это ровно та стена текста, которую с урока убирали,
  // поэтому они разложены на четыре сцены киноленты: абзац звучит голосом,
  // на экране рисунок и подпись в 2–3 слова. Прощание идёт отдельной репликой
  // после последней сцены — как похвала на экранах «кто рядом» и «интернет
  // помнит», только поза S_jump: это конец урока, а не разбор.
  outro: {
    eyebrow: { ru: 'Итог урока', uz: "Dars yakuni", en: 'Summary' },
    pose: 'S_open',
    praisePose: 'S_jump',
    say: { ru: 'Давай вспомним, что ты сегодня узнал.',
           uz: "Keling, bugun nimalarni bilib olganingizni eslaymiz.", en: 'Let us remember what you learned today.' },
    cards: [
      { art: 'globe', tone: 'ok',
        t: { ru: 'Что такое интернет', uz: "Internet nima", en: 'What the internet is' },
        cap: { ru: 'Учит и соединяет', uz: "O'rgatadi va bog'laydi", en: 'It teaches and connects' },
        voice: { ru: 'Сегодня ты узнал, что такое интернет и зачем он нужен людям. Благодаря интернету мы можем учиться, общаться, искать полезную информацию, смотреть мультфильмы и играть вместе с друзьями.',
                 uz: "Bugun siz internet nimaligini va u odamlarga nima uchun kerakligini bildingiz. Internet tufayli biz o'qishimiz, muloqot qilishimiz, foydali ma'lumot qidirishimiz, multfilm ko'rishimiz va do'stlar bilan birga o'ynashimiz mumkin.", en: 'Today you learned what the internet is and why people need it. Thanks to the internet we can learn, talk to each other, look for useful information, watch cartoons and play with friends.' } },
      { art: 'city', tone: 'ok',
        t: { ru: 'Интернет — как город', uz: "Internet — katta shahar", en: 'The internet is like a city' },
        cap: { ru: 'Огромный город', uz: "Ulkan shahar", en: 'A huge city' },
        // Раньше здесь метафора города ВВОДИЛАСЬ впервые — в самом уроке её не
        // было ни разу, и итог вместо закрепления учил новому. Теперь она
        // опирается на экран «Кто рядом», который ребёнок только что прошёл.
        voice: { ru: 'Мы уже видели: в интернете рядом много людей — как в большом городе. В городе есть кинотеатры, библиотеки и площадки. И есть правила, которые берегут людей.',
                 uz: "Biz ko'rdik: internetda yoningizda ko'p odam bor — xuddi katta shahardagidek. Shaharda kinoteatrlar, kutubxonalar va maydonchalar bor. Va odamlarni asraydigan qoidalar ham bor.", en: 'We have seen it already: on the internet many people are near you, just like in a big city. A city has cinemas, libraries and playgrounds. And it has rules that keep people safe.' } },
      { art: 'rules', tone: 'warn',
        t: { ru: 'В городе есть правила', uz: "Shaharda qoidalar bor", en: 'A city has rules' },
        cap: { ru: 'Правила берегут', uz: "Qoidalar asraydi", en: 'Rules keep you safe' },
        voice: { ru: 'Если знать эти правила, интернет станет твоим помощником. А если забыть о них — можно случайно попасть в неприятную ситуацию.',
                 uz: "Bu qoidalarni bilsangiz, internet sizning yordamchingizga aylanadi. Agar ularni unutsangiz — tasodifan ko'ngilsiz vaziyatga tushib qolishingiz mumkin.", en: 'If you know these rules, the internet becomes your helper. And if you forget them, you can get into trouble by accident.' } },
    ],
    // ПРОЩАНИЕ БЕЗ АНОНСА (заказчик, 2026-08-05). Четвёртая сцена «кибердетективы»
    // снята: рассказывать, что будет в следующем уроке, нельзя.
    // КАДР «ДО ВСТРЕЧИ!» СНЯТ (заказчик, 2026-08-06). Поле bye удалено, и по
    // договору SceneScreen лента на последней реплике оставляет стоять последнюю
    // сцену — «В городе есть правила». Прощание Симки звучит под ней.
    // Рисунок ART.bye намеренно ОСТАВЛЕН в наборе: он нарисован и проверен, а
    // вернуть кадр — это одна строка bye обратно. Ни на что не влияет: сцены
    // рисуются только по ссылке из cards/bye.
    praise: { ru: 'До встречи в следующем приключении!', uz: "Keyingi sarguzashtda ko'rishguncha!", en: 'See you in the next adventure!' },
    finish: { ru: 'Завершить урок', uz: "Darsni yakunlash", en: 'Finish the lesson' }
  },
  boot: {
    brand: { ru: 'Кибербез · Щит', uz: "Kiberxavfsizlik · Qalqon", en: 'Cyber Safety · Shield' },
    lines: [
      { q: { ru: 'Подключение к Штабу...', uz: "Shtabga ulanish...", en: 'Connecting to the Base...' }, a: { ru: 'Выполнено', uz: "Bajarildi", en: 'Done' } },
      { q: { ru: 'Поиск агента...', uz: "Agent qidirilmoqda...", en: 'Looking for the agent...' }, a: { ru: 'Агент найден', uz: "Agent topildi", en: 'Agent found' } },
      { q: { ru: 'Проверка доступа...', uz: "Ruxsat tekshirilmoqda...", en: 'Checking access...' }, a: { ru: 'Доступ подтверждён', uz: "Ruxsat tasdiqlandi", en: 'Access confirmed' } },
      { q: { ru: 'Подготовка новой миссии...', uz: "Yangi missiya tayyorlanmoqda...", en: 'Preparing a new mission...' }, a: { ru: 'Загрузка...', uz: "Yuklanmoqda...", en: 'Loading...' }, wait: true }
    ],
    welcome: { ru: 'Добро пожаловать в Штаб защиты!', uz: "Himoya shtabiga xush kelibsiz!", en: 'Welcome to the Safety Base!' },
    // Кнопка входа появилась 2026-08-06 не ради красоты: без касания браузер
    // глушит озвучку (см. unlock в useAudioEngine). Поэтому текст обещает не
    // «дальше», а именно вход — ребёнок нажимает её один раз за урок.
    start: { ru: 'Войти в Штаб', uz: "Shtabga kirish", en: 'Enter the Base' }
  },
  // ФИНАЛЬНОГО ЭКРАНА БОЛЬШЕ НЕТ (заказчик, 22.09.2026). Он открывался после
  // «Завершить урок» и показывал «Добро пожаловать в Штаб!», значок, похвалу и
  // «Пройти заново» — ровно под окном платформы «Начать тест», которое всплывает
  // в ту же секунду. Значок ребёнок уже видел крупно на своём экране (s10),
  // второй раз он не нужен; после завершения остаётся чистый фон урока, и
  // платформа спокойно показывает своё окно поверх него.
};

// ─────────────────────────────────────────────────────────────────────────────
// Значок агента
// ИМЕНИ НА ЗНАЧКЕ НЕТ (заказчик, 2026-08-05). Раньше под кольцом печаталось имя
// из props.studentName, а на стенде — подставное «Азиза», и ребёнок видел на
// СВОЁМ значке чужое имя. Имя по-прежнему приходит в урок и уезжает в payload,
// но на экране не рисуется нигде: значок — это цвет и знак, которые выбрал сам
// ребёнок. Пропса name у компонента больше нет намеренно — чтобы имя нельзя
// было вернуть на значок случайно, из другого экрана.
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ color, symbol, size = 'md' }) => {
  const p = badgePair(color);
  return (
    <div className={'badge badge-' + size} style={{ '--bcA': p.a, '--bcB': p.b }}>
      <div className="badge-ring">
        <span className="badge-sym">{symbol ? <Icon name={symbol} size="100%" /> : null}</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// РИСОВАННЫЕ СЦЕНЫ (заказчик, 2026-08-05)
// Крупная иллюстрация вместо абзаца — принцип Майера: картинка + голос учат
// лучше, чем картинка + голос + тот же текст на экране. Поэтому подпись под
// картинкой в 2–3 слова НЕ пересказывает реплику Симки, а только называет сцену.
//
// Почему собственный SVG, а не иконки канона: иконки — линия 2.1px в квадрате
// 24px, они держат строку, но на полкарточки превращаются в проволочный контур.
// Здесь нужна «кадр мультфильма»: заливки, узнаваемые фигуры, три-четыре цвета.
// Единый viewBox 680×420, чтобы все сцены занимали в карточке одинаковое место.
// (Было 240×150 — от той системы остались только цифры в этой строке: сцены v1
//  рисовались мелко и после перехода на 680×420 занимали десятую часть кадра.)
//
// ═══ ХУДОЖЕСТВЕННЫЙ СТИЛЬ v2 (заказчик, 2026-08-05, по присланным референсам)
// Референсы: family_home_animated_demo + devices_network_animated_demo.
// Прошлый стиль (тёмно-синий контур на всём + градиент на каждом объекте) снят
// целиком: заказчик прислал плоский флэт БЕЗ градиентов. Правила:
//   1. НИКАКИХ ГРАДИЕНТОВ. Только плоские hex-заливки из палитры P ниже.
//   2. Контур #3A1E5C — ТОЧЕЧНО, только там, где он нужен по макету
//      (телефон в референсе). Стройность даёт форма, а не обводка везде.
//   3. Фон — <ArtBg/>: две пересекающиеся полупрозрачные кляксы-эллипса,
//      голубая #D7EDFA и мятная #D6F1EA. Ставится ПЕРВЫМ элементом.
//   4. Декор — <Sparkle/> (4-конечная звёздочка #FFC93C) и короткие чёрточки
//      #4C9AF5 по углам кадра.
//   5. Тень — <ArtShadow/>: мягкий эллипс #B9CBE8 opacity .45.
//   6. Толстые скругления, крупные формы, много воздуха.
//   7. viewBox 0 0 680 420 у ВСЕХ сцен — как в референсах.
//
// ПОЭЛЕМЕНТНЫЙ ВЫХОД (второе требование заказчика: «пусть каждый элемент
// выйдет по очереди или когда об этом говорит Симка»).
// Каждый смысловой объект сцены обёрнут в <g className="rv rv-N">, N = 1…8 —
// это порядок появления. CSS даёт им нарастающую задержку, поэтому сцена
// собирается на глазах у ребёнка, пока Симка её проговаривает, а не падает
// готовой картинкой. Сцена перемонтируется при каждой смене карточки, значит
// сборка играет заново.
//   · Зацикленное движение (tw/sw/beat/bob/fl/shine) вешается на ВЛОЖЕННУЮ
//     группу внутри .rv — на одном узле два animation не уживаются.
//   · Экран диалога синхронизирован иначе и точнее: там сеть достраивается
//     ровно под реплику (стадии nw-s0…nw-s3), см. NetworkArt.
// ─────────────────────────────────────────────────────────────────────────────
const P = {
  bgA: '#D7EDFA', bgB: '#D6F1EA',
  blue: '#2F80ED', blueDk: '#1B63C4', blueLt: '#A8D4F7',
  violet: '#7A5AF8', violetDk: '#5B3FD6', violetLt: '#DCD3FC',
  orange: '#F2833A', orangeDk: '#D9662A', orangeLt: '#FBDCC6',
  green: '#2FA84F', coral: '#EE8B6A', red: '#E8402A',
  skin: '#F8CFA9', hair: '#8A5A3B', hairDk: '#2B2B3D', hairMid: '#6B4226',
  ink: '#3A1E5C', eye: '#3A2418', mouth: '#8E3A2E', blush: '#F7A9A0',
  spark: '#FFC93C', dash: '#4C9AF5', shadow: '#B9CBE8',
  paper: '#FFFFFF', floor: '#E4D9C6', floorLt: '#F1E9DC'
};

// Две кляксы фона. Одинаковые во всех сценах — именно они склеивают набор.
const ArtBg = () => (
  <g className="art-bg" aria-hidden="true">
    <ellipse cx="250" cy="215" rx="218" ry="158" fill={P.bgA} />
    <ellipse cx="435" cy="228" rx="215" ry="155" fill={P.bgB} opacity=".85" />
  </g>
);

// Мягкая тень под объектом.
const ArtShadow = ({ cx, cy, rx, ry = 10 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={P.shadow} opacity=".45" />
);

// Четырёхконечная искорка. Формула взята из референса: при r=24 путь совпадает
// с присланным «l7 17 17 7-17 7-7 17-7-17-17-7 17-7z» до последнего числа.
const Sparkle = ({ cx, cy, r = 24, color = '#FFC93C', cls = '' }) => {
  const a = +(r * 0.29).toFixed(1), b = +(r * 0.71).toFixed(1);
  return (
    <path className={'tw' + (cls ? ' ' + cls : '')} fill={color}
      d={`M${cx} ${cy - r}l${a} ${b} ${b} ${a}-${b} ${a}-${a} ${b}-${a}-${b}-${b}-${a} ${b}-${a}z`} />
  );
};

// Короткие чёрточки-акценты по углам.
const Dashes = ({ d, color = '#4C9AF5', w = 10, cls = '' }) => (
  <g className={'tw' + (cls ? ' ' + cls : '')} stroke={color} strokeWidth={w} strokeLinecap="round">
    {d.map((p, k) => <path key={k} d={p} />)}
  </g>
);

// Кит совместимости со стилем v1 (спреды AS/AS2, белый блик Gloss, градиенты
// ArtDefs по url(#ag…)) УДАЛЁН 2026-08-06: последняя сцена переехала на новый
// стиль, ссылаться на него больше нечему. Возвращать его нельзя — градиент в
// наборе означает, что сцена нарисована не по промту заказчика.

// ── ЧЕЛОВЕК-ЭТАЛОН «КИБЕР-ЩИТА» (заказчик, 23.09.2026: «люди как на картинке») ─
// Один рисунок человека на весь курс. Уроки самодостаточны, поэтому блок
// КОПИРУЕТСЯ в урок целиком, а не импортируется. Правка эталона разносится во
// все уроки скриптом: блок от этой шапки до конца PersonCanon заменяется целиком.
// Четвёртая редакция (23.09.2026, образец — изометрическая толпа): РЕАЛИСТИЧНЫЕ
// пропорции (голова ~1/7 роста, узкие плечи, длинные ноги), фигура вполоборота
// вправо, одежда в два тона — освещённая сторона и теневая, лицо БЕЗ черт, как
// в образце. Черты лица рисуются только там, где урок держится на эмоции
// (face='sad' | 'smile' | ...). Без контура.
// Симка и Нолик — персонажи-картинки, этот рисунок их НЕ заменяет.
//
// Система координат: ноги стоят на (0,0), человек растёт вверх. Взрослый
// ~100 единиц, ребёнок ~76 (тот же рисунок в масштабе .76, голова крупнее).
// Голова взрослого: центр PERSON_HEAD (0,-92.5), овал 5.6×6.8. Кисти рук в
// позах point/phone/sit стоят там же, где в прежних редакциях.
// Ставится снаружи:
//   <g transform="translate(x,y) scale(s)"><PersonCanon ... /></g>
//
// Пропсы:
//   kid     true — ребёнок
//   pose    'stand' | 'walk' | 'wave' | 'phone' | 'call' | 'point' | 'think' | 'worry'
//           | 'shrug' | 'cross' | 'hip' | 'sit' | 'laptop'
//           call — телефон у уха; sit/laptop — сидит лицом вправо, сиденье рисует
//           сцена, его верх на высоте бёдер: y = -46 у взрослого, -35 у ребёнка
//   hair    'short' | 'long' | 'bun' | 'pony' | 'cap' | 'bald' | 'curly' | 'wavy' | 'bob'
//   skin    'light' | 'mid' | 'dark' или цвет
//   outfit  'tee' (по умолчанию) | 'tank' | 'hoodie' | 'sweater' | 'shirt' | 'jacket' | 'dress'
//   pattern 'none' | 'stripes' | 'dots'
//   bottom  'pants' (по умолчанию) | 'shorts' | 'skirt'
//   bag     'none' | 'shopper' | 'backpack' | 'shoulder' | 'folder'
//   heels   true — туфли на каблуке
//   top, pants, hairColor, capColor, shoes — цвета; dress — то же, что outfit='dress'
//   face    'none' (по умолчанию) | 'smile' | 'grin' | 'sad' | 'calm' | 'wow'
//   shadow  false — без тени
const PERSON_SKIN = { light: '#F3C6A5', mid: '#D9A07A', dark: '#8E5E42' };
const PERSON_SKIN_SHADE = { light: '#DDA885', mid: '#BD845E', dark: '#6F4630' };
const PERSON_INK = '#2B2233';
const PERSON_HEAD = { x: 0, y: -92.5, rx: 5.6, ry: 6.8 };
const PersonCanon = ({ kid = false, pose = 'stand', hair = 'short', skin = 'light', top = '#3D6BE0',
  pants = '#27305A', hairColor = '#2B2233', capColor = '#E0412F', dress = false, face = 'none',
  shadow = true, outfit, pattern = 'none', bottom, shoes = '#22222E', bag = 'none', heels = false }) => {
  const s = PERSON_SKIN[skin] || skin;
  const sd = PERSON_SKIN_SHADE[skin] || 'rgba(0,0,0,.16)';
  const P = (...a) => a.map((v) => (typeof v === 'number' ? +(v.toFixed(2)) : v)).join(' ');
  const shade = 'rgba(20,16,40,.17)';            // теневая сторона ткани
  const wear = outfit || (dress ? 'dress' : 'tee');
  const btm = wear === 'dress' ? 'none' : (bottom || 'pants');
  const longSleeve = wear === 'hoodie' || wear === 'sweater' || wear === 'shirt' || wear === 'jacket';
  const sit = pose === 'sit' || pose === 'laptop';
  const walk = pose === 'walk';

  // Опорные высоты взрослого. Ребёнок — тот же рисунок в масштабе .76.
  const SH = -82.5, WAIST = -61, HIP = -50, KNEE = -26;
  const hx = PERSON_HEAD.x, hy = PERSON_HEAD.y, hrx = PERSON_HEAD.rx, hry = PERSON_HEAD.ry;

  // ── РУКИ: плечо → локоть → кисть, сужаются к запястью. Дальняя рука в тени.
  const arm = (x1, y1, x2, y2, x3, y3, key, far) => {
    const d = P('M', x1, y1, 'L', x2, y2, 'L', x3, y3);
    const sleeve = longSleeve ? d : P('M', x1, y1, 'L', x1 + (x2 - x1) * 0.55, y1 + (y2 - y1) * 0.55);
    return (
      <g key={key}>
        <path d={d} stroke={far ? sd : s} strokeWidth="2.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* плечо: круг цвета рукава закрывает круглый торец руки */}
        <circle cx={x1} cy={y1} r="2.2" fill={top} />
        {far ? <circle cx={x1} cy={y1} r="2.2" fill={shade} /> : null}
        <path d={sleeve} stroke={top} strokeWidth={longSleeve ? 3.7 : 3.9} fill="none"
          strokeLinecap={longSleeve ? 'round' : 'butt'} strokeLinejoin="round" />
        {far ? <path d={sleeve} stroke={shade} strokeWidth={longSleeve ? 3.7 : 3.9} fill="none"
          strokeLinecap={longSleeve ? 'round' : 'butt'} strokeLinejoin="round" /> : null}
        <ellipse cx={x3} cy={y3} rx="1.6" ry="2.1" fill={far ? sd : s} />
      </g>
    );
  };
  const SL = [-6.8, SH + 2], SR = [6.8, SH + 2];
  const hangL = arm(SL[0], SL[1], -8.6, -66, -8.2, -52, 'a', true);
  const hangR = arm(SR[0], SR[1], 8.6, -66, 8.2, -52, 'b');
  let back = [], front = [], over = [];
  if (walk) {
    back = [arm(SL[0], SL[1], -9.6, -66, -12.5, -53, 'a', true)];
    front = [arm(SR[0], SR[1], 8.4, -66, 11.5, -53.5, 'b')];
  } else if (pose === 'wave') { back = [hangL]; front = [arm(SR[0], SR[1], 14, -76, 16.5, -90, 'b')]; }
  else if (pose === 'point') { back = [hangL]; front = [arm(SR[0], SR[1], 19, -78, 31, -77, 'b')]; }
  else if (pose === 'phone') { back = [hangL]; front = [arm(SR[0], SR[1], 9.5, -66.5, 3, -67.5, 'b')]; }
  else if (pose === 'call') { back = [hangL]; front = [arm(SR[0], SR[1], 9.8, -66, 4.4, -90.5, 'b')]; }
  else if (pose === 'think') {
    front = [arm(SL[0], SL[1], -8.4, -65, 4, -62.5, 'a', true), arm(SR[0], SR[1], 4.5, -66, 2.2, -86.5, 'b')];
  } else if (pose === 'worry') {
    over = [arm(SL[0], SL[1], -13, -86, -4.6, -96.5, 'a', true), arm(SR[0], SR[1], 13, -86, 4.6, -96.5, 'b')];
  } else if (pose === 'shrug') {
    back = [arm(SL[0], SL[1], -10.5, -66, -17.5, -70, 'a', true), arm(SR[0], SR[1], 10.5, -66, 17.5, -70, 'b')];
  } else if (pose === 'cross') {
    front = [arm(SL[0], SL[1], -9, -67, 5.5, -69, 'a', true), arm(SR[0], SR[1], 9, -66, -5.5, -67.5, 'b')];
  } else if (pose === 'hip') { back = [hangL]; front = [arm(SR[0], SR[1], 13.5, -66, 7, -55, 'b')]; }
  else if (sit) { back = [hangL]; front = [arm(SR[0], SR[1], 10, -66.5, 24.5, -63, 'b')]; }
  else { back = [hangL]; front = [hangR]; }

  // ── НОГИ: бедро широкое, к щиколотке сужается; дальняя нога в тени.
  const legPoly = (side, ax, kx) => {
    const o = side * 6.6, i = side * 0.4;
    return P('M', o, HIP, 'L', i, HIP, 'L', kx + side * 0.6, KNEE, 'L', ax + side * 0.8, -3.2,
      'L', ax + side * 3.8, -3.2, 'L', kx + side * 5.3, KNEE, 'Z');
  };
  const thin = (side, ax, kx, from) => P('M', side * 5.4, from, 'L', side * 1.2, from, 'L', kx + side * 0.9, KNEE,
    'L', ax + side * 1.1, -3.2, 'L', ax + side * 3.3, -3.2, 'L', kx + side * 4.4, KNEE, 'Z');
  const L = walk ? { la: -6.5, lk: -4.2, ra: 5.2, rk: 2.6 } : { la: -1.4, lk: -1.6, ra: 1.4, rk: 1.6 };
  // Обувь смотрит носком вправо (фигура вполоборота вправо).
  const shoeAt = (x0, x1) => (heels
    ? <path d={P('M', x0, -3.4, 'L', x1, -3.4, 'L', x1 + 3.4, -0.4, 'L', x1 + 3.4, 0.2, 'L', x0 + 0.2, 0.2, 'L', x0 + 0.2, -1.4, 'Z')} fill={shoes} />
    : <path d={P('M', x0, -3.6, 'L', x1, -3.6, 'Q', x1 + 4.2, -3, x1 + 4.2, 0.2, 'L', x0, 0.2, 'Z')} fill={shoes} />);
  let legs;
  if (sit) {
    const knee = (x, far) => (
      <g>
        <path d={P('M', x - 5, HIP + 1, 'L', x + 16, HIP + 1, 'L', x + 16, -2.5)} stroke={pants} strokeWidth="6"
          fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {far ? <path d={P('M', x - 5, HIP + 1, 'L', x + 16, HIP + 1, 'L', x + 16, -2.5)} stroke={shade} strokeWidth="6"
          fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
        {shoeAt(x + 13.6, x + 16.4)}
      </g>
    );
    legs = <g>{knee(0, true)}{knee(5)}</g>;
  } else {
    let farLeg, nearLeg;
    if (btm === 'pants') {
      const pl = legPoly(-1, L.la, L.lk);
      farLeg = <g><path d={pl} fill={pants} /><path d={pl} fill={shade} /></g>;
      nearLeg = <path d={legPoly(1, L.ra, L.rk)} fill={pants} />;
    } else {
      const from = btm === 'shorts' ? HIP + 12 : HIP + 6;
      farLeg = <path d={thin(-1, L.la, L.lk, from)} fill={sd} />;
      nearLeg = <path d={thin(1, L.ra, L.rk, from)} fill={s} />;
    }
    legs = (
      <g>
        {farLeg}{shoeAt(L.la - 3.8, L.la - 0.8)}
        {nearLeg}{shoeAt(L.ra + 0.8, L.ra + 3.8)}
        {btm === 'shorts' ? (
          <g>
            <path d={P('M', -6.8, HIP - 1, 'L', 6.8, HIP - 1, 'L', 7.4, HIP + 12, 'L', 0.6, HIP + 12, 'L', 0, HIP + 5,
              'L', -0.6, HIP + 12, 'L', -7.4, HIP + 12, 'Z')} fill={pants} />
            <path d={P('M', -6.8, HIP - 1, 'L', -2.4, HIP - 1, 'L', -2.8, HIP + 12, 'L', -7.4, HIP + 12, 'Z')} fill={shade} />
          </g>
        ) : null}
        {btm === 'skirt' ? (
          <g>
            <path d={P('M', -6.6, HIP - 2, 'L', 6.6, HIP - 2, 'L', 9, KNEE + 4, 'Q', 0, KNEE + 6, -9, KNEE + 4, 'Z')} fill={pants} />
            <path d={P('M', -6.6, HIP - 2, 'L', -2.2, HIP - 2, 'L', -3, KNEE + 5.4, 'Q', -6, KNEE + 5, -9, KNEE + 4, 'Z')} fill={shade} />
          </g>
        ) : null}
      </g>
    );
  }

  // ── КОРПУС: плечи узкие, талия, бёдра; левая треть в тени.
  const hem = KNEE + 3;
  const torsoD = wear === 'dress'
    ? P('M', -7.6, SH + 3, 'Q', -7.6, SH - 0.5, -4.4, SH - 0.5, 'L', 4.4, SH - 0.5, 'Q', 7.6, SH - 0.5, 7.6, SH + 3,
      'L', 5.6, WAIST, 'L', 9.6, hem, 'Q', 0, hem + 2.4, -9.6, hem, 'L', -5.6, WAIST, 'Z')
    : P('M', -7.6, SH + 3, 'Q', -7.6, SH - 0.5, -4.4, SH - 0.5, 'L', 4.4, SH - 0.5, 'Q', 7.6, SH - 0.5, 7.6, SH + 3,
      'L', 5.8, WAIST, 'L', 7, HIP + 1.5, 'L', -7, HIP + 1.5, 'L', -5.8, WAIST, 'Z');
  const torsoShade = wear === 'dress'
    ? P('M', -7.6, SH + 3, 'Q', -7.6, SH - 0.5, -4.4, SH - 0.5, 'L', -2.6, SH - 0.5, 'L', -2, WAIST, 'L', -3.4, hem + 1.6,
      'Q', -6.6, hem + 1, -9.6, hem, 'L', -5.6, WAIST, 'Z')
    : P('M', -7.6, SH + 3, 'Q', -7.6, SH - 0.5, -4.4, SH - 0.5, 'L', -2.6, SH - 0.5, 'L', -2, WAIST, 'L', -2.4, HIP + 1.5,
      'L', -7, HIP + 1.5, 'L', -5.8, WAIST, 'Z');
  let detail = null;
  if (pattern === 'stripes') detail = <path d={P('M', -7.2, SH + 6, 'H', 7.2, 'M', -6.4, SH + 11, 'H', 6.4, 'M', -5.8, SH + 16, 'H', 5.8)} stroke="rgba(255,255,255,.45)" strokeWidth="1.6" />;
  else if (pattern === 'dots') detail = <g fill="rgba(255,255,255,.5)">{[[-3, SH + 6], [3, SH + 8], [0, SH + 13], [-4, SH + 16], [4, SH + 15]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r=".8" />)}</g>;
  if (wear === 'tank') {
    detail = <g>{detail}<path d={P('M', -3, SH - 0.5, 'Q', 0, SH + 3.5, 3, SH - 0.5, 'Z')} fill={s} /></g>;
  } else if (wear === 'shirt' || wear === 'jacket') {
    detail = (
      <g>
        <path d={P('M', -1.4, SH - 0.5, 'L', 3, SH - 0.5, 'L', 3.2, HIP + 1.5, 'L', -1.2, HIP + 1.5, 'Z')}
          fill={wear === 'jacket' ? '#FFFFFF' : 'rgba(255,255,255,.35)'} />
        <path d={P('M', -1.4, SH - 0.5, 'L', 0.8, SH + 5, 'L', 3, SH - 0.5)} fill="none" stroke="rgba(0,0,0,.2)" strokeWidth=".8" />
      </g>
    );
  } else if (wear === 'hoodie') {
    detail = (
      <g>
        <path d={P('M', -4.6, SH - 0.5, 'Q', 0, SH + 4.5, 4.6, SH - 0.5, 'Q', 4, SH - 4, 0, SH - 4, 'Q', -4, SH - 4, -4.6, SH - 0.5, 'Z')} fill={top} />
        <path d={P('M', -4.6, SH - 0.5, 'Q', 0, SH + 4.5, 4.6, SH - 0.5)} fill="none" stroke="rgba(0,0,0,.15)" strokeWidth=".9" />
        <path d={P('M', -1, SH + 2, 'l', -0.3, 5, 'M', 1.4, SH + 2, 'l', 0.3, 5)} stroke="#FFF" strokeWidth=".7" strokeLinecap="round" />
        <path d={P('M', -4, HIP - 7, 'L', 4.6, HIP - 7, 'L', 5.2, HIP - 1, 'L', -4.4, HIP - 1, 'Z')} fill="rgba(0,0,0,.1)" />
      </g>
    );
  }

  // ── СУМКИ
  let bagBack = null, bagFront = null;
  if (bag === 'backpack') {
    bagBack = (
      <g>
        <path d={P('M', -12.8, SH + 3, 'Q', -13.4, SH, -9.6, SH, 'L', -6, SH, 'L', -6, SH + 22, 'Q', -9.8, SH + 23.6, -12.8, SH + 21, 'Z')} fill="#2E8C7E" />
        <path d={P('M', -12.8, SH + 12, 'L', -8, SH + 12, 'L', -8, SH + 20, 'Q', -11, SH + 20.6, -12.8, SH + 19, 'Z')} fill="rgba(0,0,0,.18)" />
      </g>
    );
    bagFront = <path d={P('M', -6.4, SH, 'Q', -3.6, SH + 8, -4.6, SH + 19)} fill="none" stroke="#236E63" strokeWidth="1.4" strokeLinecap="round" />;
  } else if (bag === 'shoulder') {
    bagFront = (
      <g>
        <path d={P('M', 5.6, SH, 'L', -5.2, HIP - 2)} stroke="#3A2E2A" strokeWidth=".9" />
        <rect x="-9" y={HIP - 4} width="7.4" height="5.6" rx="1.4" fill="#3A2E2A" />
      </g>
    );
  } else if (bag === 'shopper') {
    const bx = walk ? -12.5 : -8.2, by = walk ? -53 : -52;
    bagBack = (
      <g>
        <path d={P('M', bx - 2.6, by + 4.5, 'Q', bx, by - 1.5, bx + 2.6, by + 4.5)} fill="none" stroke="#C9CCD6" strokeWidth=".9" />
        <rect x={bx - 4.2} y={by + 4} width="8.4" height="10" rx="0.6" fill="#FFFFFF" />
        <rect x={bx - 4.2} y={by + 4} width="2.4" height="10" fill="rgba(0,0,0,.08)" />
        <rect x={bx - 1.6} y={by + 8} width="1.6" height="1.6" fill="#E0412F" />
        <rect x={bx + 0.6} y={by + 8} width="1.6" height="1.6" fill="#E0412F" />
      </g>
    );
  } else if (bag === 'folder') {
    bagFront = <path d={P('M', 1, -70, 'L', 10.5, -73, 'L', 12.5, -62, 'L', 3, -59, 'Z')} fill="#4FB3A5" />;
  }

  // ── ГОЛОВА: овал вполоборота вправо, затылок и ухо слева, черт нет.
  let hb = null, hf = null;
  const crop = P('M', -5.9, 1.4, 'C', -6.7, -5, -3.6, -8, 0.6, -7.8, 'C', 4.4, -7.7, 6.4, -5.3, 5.9, -2.2,
    'C', 4.2, -4, 1.6, -4.7, -1, -3.7, 'C', -2.6, -3.1, -3.6, -1.2, -3.8, 2.2, 'Z');
  const sidePart = P('M', -6.2, -0.8, 'C', -6.8, -6.8, -3.2, -8.2, 0.6, -8, 'C', 4.5, -7.9, 6.6, -5.2, 6, -1.8,
    'C', 4.2, -4.4, 1.2, -5, -1.6, -3.9, 'C', -3, -2.8, -3.4, 0, -3.3, 3.4, 'Z');
  if (hair === 'short') hf = <path d={crop} fill={hairColor} />;
  else if (hair === 'long' || hair === 'wavy') {
    const tail = hair === 'wavy'
      ? P('M', -6.3, -1, 'C', -7, -7, -3.2, -8.4, 0.6, -8.2, 'C', 4.6, -8, 6.8, -5.2, 6.1, -1.6, 'L', 5.4, -2.6,
        'C', 3.8, -4.7, 1, -5.1, -1.6, -4, 'L', -3, 3, 'Q', -1.6, 7, -3.4, 10.5, 'Q', -2.4, 14, -4.2, 17, 'L', -8.6, 16,
        'Q', -7, 13, -8.4, 9.6, 'Q', -6.8, 6, -8, 2.6, 'Z')
      : P('M', -6.3, -1, 'C', -7, -7, -3.2, -8.4, 0.6, -8.2, 'C', 4.6, -8, 6.8, -5.2, 6.1, -1.6, 'L', 5.4, -2.6,
        'C', 3.8, -4.7, 1, -5.1, -1.6, -4, 'L', -3, 3, 'L', -3.2, 16, 'L', -8.4, 15.4, 'C', -8.2, 8, -7.4, 3, -6.3, -1, 'Z');
    hb = <path d={tail} fill={hairColor} />;
    hf = <path d={sidePart} fill={hairColor} />;
  } else if (hair === 'bob') {
    hf = <path d={P('M', -6.4, -1, 'C', -7, -7, -3.2, -8.4, 0.6, -8.2, 'C', 4.6, -8, 6.9, -5.2, 6.4, -1.4, 'L', 6.2, 3.6,
      'L', 4.8, 3.6, 'L', 4.8, -2.4, 'C', 3, -4.6, 0, -4.8, -2, -3.6, 'L', -3, 5.6, 'L', -7.2, 5.6, 'C', -7.2, 2.6, -6.9, 0.6, -6.4, -1, 'Z')}
      fill={hairColor} />;
  } else if (hair === 'bun') {
    hf = <g fill={hairColor}><circle cx="-3.4" cy="-7.2" r="2.8" /><path d={crop} /></g>;
  } else if (hair === 'pony') {
    hb = <path d={P('M', -4.4, -5, 'C', -8.6, -5, -9.6, 0, -8.8, 6.6, 'C', -8.4, 9, -7.2, 10.6, -6.4, 11.6,
      'C', -6.8, 7.6, -6.2, 3, -3.6, -1, 'Z')} fill={hairColor} />;
    hf = <path d={crop} fill={hairColor} />;
  } else if (hair === 'curly') {
    const cc = [[-5.4, -1], [-5.6, -4.6], [-3.4, -7.2], [0, -8], [3.4, -7.2], [5.4, -4.6], [-5.8, 2.6], [-4.4, 5]];
    hb = <g fill={hairColor}>{cc.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.7" />)}</g>;
    hf = <path d={crop} fill={hairColor} />;
  } else if (hair === 'cap') {
    hf = (
      <g>
        <path d={P('M', -5.9, 1.4, 'L', -6, -2, 'L', -3.6, -2, 'L', -3.8, 2.2, 'Z')} fill={hairColor} />
        <path d={P('M', -6.2, -2.2, 'C', -6.6, -6.8, -3.4, -8.8, 0.4, -8.8, 'C', 4, -8.8, 6.6, -6.8, 6.1, -2.2, 'Z')} fill={capColor} />
        <path d={P('M', 3.4, -3, 'Q', 8.4, -3.6, 10.4, -1.8, 'Q', 8, -1, 3.4, -1.6, 'Z')} fill={capColor} />
        <path d={P('M', -6.2, -2.2, 'C', -6.6, -6.8, -3.4, -8.8, -1.6, -8.8, 'L', -2.4, -2.2, 'Z')} fill="rgba(0,0,0,.15)" />
      </g>
    );
  }
  let feat = null;
  if (face !== 'none') {
    const ink = PERSON_INK;
    let mouth;
    if (face === 'sad') mouth = <path d={P('M', 1, 3.8, 'Q', 2.4, 2.8, 3.8, 3.8)} stroke={ink} strokeWidth=".7" fill="none" strokeLinecap="round" />;
    else if (face === 'calm') mouth = <path d={P('M', 1.2, 3.4, 'L', 3.4, 3.4)} stroke={ink} strokeWidth=".7" strokeLinecap="round" />;
    else if (face === 'wow') mouth = <ellipse cx="2.4" cy="3.6" rx=".8" ry="1" fill="#8A2E3B" />;
    else if (face === 'grin') mouth = <path d={P('M', 0.8, 2.8, 'Q', 2.5, 5.4, 4.2, 2.8, 'Z')} fill="#8A2E3B" />;
    else mouth = <path d={P('M', 0.9, 2.8, 'Q', 2.5, 4.6, 4.1, 2.8)} stroke={ink} strokeWidth=".7" fill="none" strokeLinecap="round" />;
    feat = (
      <g>
        <circle cx="0.9" cy="-0.4" r=".75" fill={ink} />
        <circle cx="3.9" cy="-0.4" r=".7" fill={ink} />
        <path d={face === 'sad'
          ? P('M', 0, -2.4, 'L', 1.8, -2.9, 'M', 4.8, -2.4, 'L', 3.1, -2.9)
          : P('M', 0, -2.4, 'Q', 0.9, -3.1, 1.8, -2.5, 'M', 3.1, -2.5, 'Q', 4, -3.1, 4.8, -2.4)}
          stroke={hair === 'bald' ? '#8C7A70' : hairColor} strokeWidth=".6" fill="none" strokeLinecap="round" />
        {mouth}
      </g>
    );
  }
  const HT = 'translate(' + hx + ' ' + hy + ')';
  const headEl = (
    <g transform={HT}>
      <ellipse cx="0" cy="0" rx={hrx} ry={hry} fill={s} />
      <path d={P('M', -hrx, 0, 'C', -hrx, -4.2, -3, -hry, 0, -hry, 'C', -1.6, -3.4, -2.4, 1.6, -1.2, hry - 0.6,
        'C', -3.6, hry - 1, -hrx, 3.6, -hrx, 0, 'Z')} fill={sd} opacity=".45" />
      <ellipse cx="-2.6" cy="0.6" rx="1.1" ry="1.6" fill={sd} />
      {feat}
      {hf}
    </g>
  );
  const neckY = hy + hry;
  const body = (
    <g>
      <g transform={HT}>{hb}</g>
      {bagBack}
      {back}
      {legs}
      <path d={torsoD} fill={top} />
      <path d={torsoShade} fill={shade} />
      {detail}
      <path d={P('M', -2, neckY - 1.8, 'L', 2.2, neckY - 1.8, 'L', 2.5, SH + 0.5, 'L', -2.3, SH + 0.5, 'Z')} fill={s} />
      <path d={P('M', -2, neckY - 1.8, 'L', -0.4, neckY - 1.8, 'L', -0.6, SH + 0.5, 'L', -2.3, SH + 0.5, 'Z')} fill={sd} />
      {pose === 'laptop' ? (
        <g>
          <path d={P('M', 8, HIP - 2, 'L', 30, HIP - 2)} stroke="#B9C3D6" strokeWidth="2" strokeLinecap="round" />
          <path d={P('M', 28.5, HIP - 3, 'L', 23.5, HIP - 17)} stroke="#8E99B0" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      ) : null}
      {bagFront}
      {front}
      {pose === 'phone' ? (
        <g>
          <rect x="0" y="-74" width="5.4" height="9" rx="1.2" fill="#1E1E2A" />
          <rect x="0.8" y="-73.1" width="3.8" height="7.2" rx=".7" fill="#8FD3FF" />
        </g>
      ) : null}
      {pose === 'call' ? <rect x="3" y="-96" width="2.6" height="6.4" rx="1" fill="#1E1E2A" /> : null}
      {kid ? <g transform={'translate(0 ' + neckY + ') scale(1.24) translate(0 ' + (-neckY) + ')'}>{headEl}</g> : headEl}
      {over}
    </g>
  );
  return (
    <g>
      {shadow ? <ellipse cx={sit ? 10 : 0} cy="0.6" rx={kid ? 11 : 13} ry="2.4" fill="#3A4A6B" opacity=".13" /> : null}
      {kid ? <g transform="scale(.76)">{body}</g> : body}
    </g>
  );
};

const ART = {
  // Семья и друзья. Мама, папа и ребёнок под крышей дома с красным сердцем — близкие люди, которым можно писать.
  family: (
    <>
      <g className="fmGo">
        <defs>
        <linearGradient id="fmRoofG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC53D"/><stop offset="1" stopColor="#FF6A00"/></linearGradient>
        <linearGradient id="fmHg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF6F7D"/><stop offset="1" stopColor="#E01B24"/></linearGradient>
        <linearGradient id="fmB1g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFA6D5"/><stop offset="1" stopColor="#E8368F"/></linearGradient>
        <linearGradient id="fmB2g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6BF5B8"/><stop offset="1" stopColor="#0FA968"/></linearGradient>
        <linearGradient id="fmB3g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="fmSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE0BE"/><stop offset="1" stopColor="#F3BE8C"/></linearGradient>
        <clipPath id="fmCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="fmH1"><circle cx="235" cy="208" r="32"/></clipPath>
        <clipPath id="fmH2"><circle cx="340" cy="236" r="26"/></clipPath>
        <clipPath id="fmH3"><circle cx="445" cy="208" r="32"/></clipPath>
        <clipPath id="fmC1"><circle cx="235" cy="270" r="44"/></clipPath>
        <clipPath id="fmC2"><circle cx="340" cy="282" r="32"/></clipPath>
        <clipPath id="fmC3"><circle cx="445" cy="270" r="44"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#fmCard)">
        <ellipse cx="200" cy="118" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="505" cy="262" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="462" cy="88" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <path className="fmRoof" d="M186 226L340 106L494 226" fill="none" stroke="url(#fmRoofG)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>

        <circle className="fmRing" cx="340" cy="182" r="34" fill="none" stroke="#FF3D9A" strokeWidth="7"/>
        <g className="fmHeart fmSt"><g className="fmBeat">
        <path d="M340 210c-27-18-38-31-38-45 0-11 11-16 20-11 8 3 15 11 18 18 3-7 10-15 18-18 9-5 20 0 20 11 0 14-11 27-38 45z" fill="url(#fmHg)"/>
        <path d="M320 168c-6 0-10 4-10 10 0 7 4 14 11 21-3-9-4-16-2-21 2-5 6-8 11-9-3-1-6-1-10-1z" fill="#FFFFFF" opacity=".45"/>
        </g></g>

        <ellipse className="fmShad fmSt" cx="262" cy="322" rx="38" ry="8" fill="#4E6BA8" opacity=".28"/>
        <ellipse className="fmShad fmSt" cx="340" cy="326" rx="30" ry="7" fill="#3C8F76" opacity=".28"/>
        <ellipse className="fmShad fmSt" cx="418" cy="322" rx="38" ry="8" fill="#4E6BA8" opacity=".28"/>

        {/* эталон человека, заказчик 23.09.2026 */}
        {/* Мама, папа и ребёнок. Стоят ближе к середине, чтобы головы не легли на скаты крыши. */}
        <g className="fmFig fmG1 fmSt"><g transform="translate(262 321) scale(1.4)">
          <PersonCanon hair="long" hairColor="#7A3E1F" top="#E8368F" pants="#3B2F6B" shadow={false} />
        </g></g>

        <g className="fmFig fmG3 fmSt"><g transform="translate(418 321) scale(1.4)">
          <PersonCanon hair="short" hairColor="#2B2B33" skin="mid" top="#0A7CFF" pants="#27305A" shadow={false} />
        </g></g>

        <g className="fmFig fmG2 fmSt"><g transform="translate(340 325) scale(1.4)">
          <PersonCanon kid hair="short" hairColor="#B06A2E" top="#0FA968" pants="#27305A" shadow={false} />
        </g></g>

        <path className="fmSpk fmS1 fmSt" d="M542 108l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="fmSpk fmS2 fmSt" d="M132 148l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="fmSpk fmS3 fmSt" cx="566" cy="196" r="7" fill="#00E0A4"/>
        <circle className="fmSpk fmS4 fmSt" cx="112" cy="252" r="6" fill="#FF3D9A"/>
      </g>
    </>
  ),
  // Учителя и взрослые. Взрослый у доски указывает на неё рукой, рядом ребёнок — тем, кому можно рассказать.
  teacher: (
    <>
      <g className="tcGo">
        <defs>
        <linearGradient id="tcScr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8CF7BE"/><stop offset="1" stopColor="#0FA968"/></linearGradient>
        <linearGradient id="tcAd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D48CFF"/><stop offset="1" stopColor="#7A1FE0"/></linearGradient>
        <linearGradient id="tcCh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC53D"/><stop offset="1" stopColor="#FF6A00"/></linearGradient>
        <linearGradient id="tcSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE0BE"/><stop offset="1" stopColor="#F3BE8C"/></linearGradient>
        <clipPath id="tcCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="tcS"><rect x="158" y="86" width="214" height="144" rx="16"/></clipPath>
        <clipPath id="tcAb"><rect x="420" y="202" width="104" height="110" rx="52"/></clipPath>
        <clipPath id="tcCb"><rect x="360" y="272" width="62" height="42" rx="21"/></clipPath>
        <clipPath id="tcHa"><circle cx="472" cy="158" r="38"/></clipPath>
        <clipPath id="tcHc"><circle cx="391" cy="254" r="22"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#tcCard)">
        <ellipse cx="215" cy="118" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="500" cy="266" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="470" cy="86" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="tcShad tcSt" cx="265" cy="326" rx="120" ry="11" fill="#4E6BA8" opacity=".26"/>
        <ellipse className="tcShad tcSt" cx="468" cy="318" rx="40" ry="9" fill="#4E6BA8" opacity=".28"/>
        <ellipse className="tcShad tcSt" cx="385" cy="320" rx="26" ry="7" fill="#3C8F76" opacity=".28"/>

        <g className="tcLegs tcSt">
        <rect x="186" y="246" width="13" height="76" rx="6.5" fill="#172363"/>
        <rect x="331" y="246" width="13" height="76" rx="6.5" fill="#172363"/>
        </g>

        <g className="tcBoard tcSt">
        <rect x="142" y="70" width="246" height="176" rx="28" fill="#172363"/>
        <rect x="151" y="79" width="228" height="158" rx="21" fill="#FFFFFF"/>
        <rect x="158" y="86" width="214" height="144" rx="16" fill="url(#tcScr)"/>
        <g clipPath="url(#tcS)"><rect x="186" y="62" width="26" height="192" fill="#FFFFFF" opacity=".55" transform="rotate(20 199 158)"/><rect x="220" y="62" width="11" height="192" fill="#FFFFFF" opacity=".35" transform="rotate(20 225 158)"/></g>
        <rect className="tcLn tcL1 tcSt" x="182" y="118" width="164" height="14" rx="7" fill="#FFFFFF" opacity=".92"/>
        <rect className="tcLn tcL2 tcSt" x="182" y="154" width="116" height="14" rx="7" fill="#FFFFFF" opacity=".92"/>
        </g>
        <rect className="tcRing tcSt" x="142" y="70" width="246" height="176" rx="28" fill="none" stroke="#00E5FF" strokeWidth="8"/>

        {/* эталон человека, заказчик 23.09.2026 */}
        {/* Учительница: поза point отражена, рука тянется к доске. tcArm теперь указка
            из её ладони; поворот указки идёт вокруг ладони (см. .tcArm в стилях). */}
        <g className="tcFig tcF1 tcSt"><g transform="translate(472 318) scale(-1.9 1.9)">
          <PersonCanon pose="point" hair="bun" hairColor="#2B2B33" skin="mid" top="#7A1FE0" pants="#172363" shadow={false} />
        </g></g>
        <line className="tcArm tcSt" x1="412" y1="172" x2="352" y2="146" stroke="#8E5A3B" strokeWidth="5" strokeLinecap="round"/>

        <g className="tcFig tcF2 tcSt"><g transform="translate(385 320) scale(1.4)">
          <PersonCanon kid hair="short" hairColor="#8E3F1F" top="#FF6A00" pants="#27305A" shadow={false} />
        </g></g>

        <path className="tcSpk tcS1 tcSt" d="M556 108l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="tcSpk tcS2 tcSt" d="M110 128l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="tcSpk tcS3 tcSt" cx="576" cy="200" r="7" fill="#00E0A4"/>
        <circle className="tcSpk tcS4 tcSt" cx="418" cy="88" r="6" fill="#FF3D9A"/>
      </g>
    </>
  ),
  // Незнакомые. Аватарка-заглушка в цвет сообщения: силуэт человека с вопросительным знаком вместо лица, справа непрочитанное сообщение с жёлтым счётчиком.
  stranger: (
    <>
      <g className="unGo">
        <defs>
        <linearGradient id="unAvg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E4F0FF"/><stop offset="1" stopColor="#C7DEFF"/></linearGradient>
        <linearGradient id="unSilg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9BC6F8"/><stop offset="1" stopColor="#7FB2F5"/></linearGradient>
        <linearGradient id="unBubg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E4F0FF"/><stop offset="1" stopColor="#C7DEFF"/></linearGradient>
        <linearGradient id="unCntg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE066"/><stop offset="1" stopColor="#FFB300"/></linearGradient>
        <clipPath id="unCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="unAvc"><circle cx="220" cy="206" r="104"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#unCard)">
        <ellipse cx="220" cy="120" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="500" cy="266" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="466" cy="90" rx="130" ry="88" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="unShad unSt" cx="220" cy="322" rx="98" ry="13" fill="#4E6BA8" opacity=".22"/>

        <g className="unAv unSt">
        <circle cx="220" cy="206" r="104" fill="url(#unAvg)" stroke="#172363" strokeWidth="7"/>
        <g clipPath="url(#unAvc)">
        {/* эталон человека, заказчик 23.09.2026 */}
        {/* Незнакомец: кепка, приглушённые цвета, лица нет — вместо него «?». Ниже плеч
            фигуру срезает круг аватарки. */}
        <g className="unSil unSt"><g transform="translate(220 631) scale(5)">
          <PersonCanon hair="cap" capColor="#56627A" skin="mid" top="#6F7F99" pants="#4A5670" face="none" shadow={false} />
        </g></g>
        <rect x="160" y="100" width="26" height="212" fill="#FFFFFF" opacity=".28" transform="rotate(20 173 206)"/>
        <rect x="196" y="100" width="11" height="212" fill="#FFFFFF" opacity=".18" transform="rotate(20 201 206)"/>
        </g>
        </g>

        <g className="unQ unSt"><g className="unWob">
        <text x="220" y="204" textAnchor="middle" fontSize="62" fontWeight="700" fill="#172363">?</text>
        </g></g>

        <g className="unBub unSt">
        <path d="M386 96h178a26 26 0 0 1 26 26v78a26 26 0 0 1-26 26H432l-34 36 20-36h-32a26 26 0 0 1-26-26v-78a26 26 0 0 1 26-26z" fill="url(#unBubg)" stroke="#172363" strokeWidth="7" strokeLinejoin="round"/>
        <rect className="unLn unL1 unSt" x="384" y="128" width="108" height="13" rx="6.5" fill="#7FB2F5"/>
        <rect className="unLn unL2 unSt" x="384" y="156" width="148" height="13" rx="6.5" fill="#7FB2F5"/>
        <rect className="unLn unL3 unSt" x="384" y="184" width="168" height="13" rx="6.5" fill="#7FB2F5"/>
        <g className="unCnt unSt"><g className="unBeat">
        <circle cx="574" cy="102" r="40" fill="url(#unCntg)"/>
        <circle cx="560" cy="86" r="11" fill="#FFFFFF" opacity=".45"/>
        <text x="574" y="123" textAnchor="middle" fontSize="54" fontWeight="700" fill="#172363">1</text>
        </g></g>
        </g>

        <path className="unSpk unS1 unSt" d="M604 262l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="unSpk unS2 unSt" d="M76 106l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="unSpk unS3 unSt" cx="352" cy="316" r="7" fill="#FF3D9A"/>
      </g>
    </>
  ),
  // Роботы и программы. Сначала видно человеческое лицо, затем маска съезжает в сторону, и под ней оказывается робот с экраном вместо лица.
  robot: (
    <>
      <g className="rbGo">
        <defs>
        <linearGradient id="rbScr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="rbEarg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="rbSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE3C4"/><stop offset="1" stopColor="#F0B98A"/></linearGradient>
        <clipPath id="rbCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="rbScrC"><rect x="206" y="112" width="188" height="158" rx="38"/></clipPath>
        <clipPath id="rbMaskC"><ellipse cx="300" cy="190" rx="112" ry="116"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#rbCard)">
        <ellipse cx="205" cy="122" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="505" cy="264" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="470" cy="88" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="rbShad rbSt" cx="300" cy="318" rx="118" ry="14" fill="#4E6BA8" opacity=".24"/>

        <g className="rbAnt rbSt"><line x1="300" y1="92" x2="300" y2="54" stroke="#172363" strokeWidth="9" strokeLinecap="round"/></g>
        <g className="rbBall rbSt"><g className="rbLed"><circle cx="300" cy="44" r="13" fill="#FFD200"/><circle cx="295" cy="39" r="4.5" fill="#FFFFFF" opacity=".8"/></g></g>
        <g className="rbEar rbSt"><rect x="158" y="158" width="28" height="58" rx="14" fill="url(#rbEarg)"/></g>
        <g className="rbEar rbSt"><rect x="414" y="158" width="28" height="58" rx="14" fill="url(#rbEarg)"/></g>

        <g className="rbHead rbSt">
        <rect x="180" y="86" width="240" height="210" rx="58" fill="#172363"/>
        <rect x="192" y="98" width="216" height="186" rx="48" fill="#FFFFFF"/>
        <rect x="206" y="112" width="188" height="158" rx="38" fill="url(#rbScr)"/>
        <g clipPath="url(#rbScrC)"><rect x="226" y="100" width="24" height="182" fill="#FFFFFF" opacity=".3" transform="rotate(20 238 191)"/><rect x="266" y="100" width="10" height="182" fill="#FFFFFF" opacity=".2" transform="rotate(20 271 191)"/></g>
        <g className="rbBlink">
        <circle cx="258" cy="172" r="18" fill="#FFFFFF"/>
        <circle cx="342" cy="172" r="18" fill="#FFFFFF"/>
        <circle cx="258" cy="172" r="8" fill="#0A4FA8"/>
        <circle cx="342" cy="172" r="8" fill="#0A4FA8"/>
        </g>
        <path d="M258 224q42 34 84 0" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round"/>
        </g>

        <g className="rbStreak rbT1 rbSt"><path d="M318 148h30" stroke="#FFB27A" strokeWidth="8" strokeLinecap="round" fill="none"/></g>
        <g className="rbStreak rbT2 rbSt"><path d="M330 192h38" stroke="#FFB27A" strokeWidth="8" strokeLinecap="round" fill="none"/></g>
        <g className="rbStreak rbT3 rbSt"><path d="M318 238h30" stroke="#FFB27A" strokeWidth="8" strokeLinecap="round" fill="none"/></g>

        <g className="rbMaskOn rbSt"><g className="rbSway">
        <ellipse cx="300" cy="190" rx="112" ry="116" fill="url(#rbSk)" stroke="#D89A66" strokeWidth="5"/>
        <rect x="188" y="74" width="224" height="52" fill="#8E3F1F" clipPath="url(#rbMaskC)"/>
        <g clipPath="url(#rbMaskC)"><rect x="216" y="70" width="26" height="248" fill="#FFFFFF" opacity=".38" transform="rotate(20 229 194)"/><rect x="256" y="70" width="11" height="248" fill="#FFFFFF" opacity=".24" transform="rotate(20 261 194)"/></g>
        <path d="M250 152q16-10 34 0M316 152q16-10 34 0" fill="none" stroke="#3A2A1E" strokeWidth="7" strokeLinecap="round"/>
        <circle cx="267" cy="180" r="12" fill="#3A2A1E"/>
        <circle cx="333" cy="180" r="12" fill="#3A2A1E"/>
        <circle cx="263" cy="176" r="4" fill="#FFFFFF" opacity=".9"/>
        <circle cx="329" cy="176" r="4" fill="#FFFFFF" opacity=".9"/>
        <circle cx="234" cy="216" r="14" fill="#FF9A8A" opacity=".45"/>
        <circle cx="366" cy="216" r="14" fill="#FF9A8A" opacity=".45"/>
        <path d="M262 238q38 30 76 0" fill="none" stroke="#3A2A1E" strokeWidth="8" strokeLinecap="round"/>
        </g></g>

        <path className="rbSpk rbS1 rbSt" d="M96 110l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="rbSpk rbS2 rbSt" d="M120 296l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="rbSpk rbS3 rbSt" cx="596" cy="330" r="7" fill="#FF3D9A"/>
      </g>
    </>
  ),
  // Сообщение. Телефон с перепиской: отправленное синее сообщение стрелками копируется в два чужих сообщения справа.
  msg: (
    <>
      <g className="msGo">
        <defs>
        <linearGradient id="msFr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="msMine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4FC3FF"/><stop offset="1" stopColor="#0A66E0"/></linearGradient>
        <linearGradient id="msCop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF6EE"/><stop offset="1" stopColor="#FFE2C8"/></linearGradient>
        <clipPath id="msCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="msPh"><rect x="104" y="52" width="152" height="290" rx="36"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#msCard)">
        <ellipse cx="200" cy="120" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="505" cy="266" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="474" cy="88" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="msShad msSt" cx="180" cy="352" rx="86" ry="11" fill="#4E6BA8" opacity=".26"/>
        <ellipse className="msShad msSt" cx="520" cy="344" rx="76" ry="10" fill="#3C8F76" opacity=".22"/>

        <g className="msDev msSt">
        <rect x="104" y="52" width="152" height="290" rx="36" fill="#172363"/>
        <rect x="114" y="62" width="132" height="270" rx="28" fill="#F7FAFF"/>
        <g clipPath="url(#msPh)"><rect x="132" y="40" width="20" height="316" fill="#FFFFFF" opacity=".28" transform="rotate(20 142 198)"/><rect x="160" y="40" width="9" height="316" fill="#FFFFFF" opacity=".2" transform="rotate(20 164 198)"/></g>
        <g className="msUi msSt">
        <rect x="152" y="70" width="56" height="9" rx="4.5" fill="#172363" opacity=".7"/>
        <rect x="156" y="316" width="48" height="7" rx="3.5" fill="#C4D2E8"/>
        <rect x="114" y="88" width="132" height="2" fill="#DDE7F5"/>
        </g>

        <g className="msBIn msB1 msSt">
        <path d="M138 100h62a16 16 0 0 1 16 16v22a16 16 0 0 1-16 16h-62a16 16 0 0 1-16-16v-8l-10 8 10-14v-8a16 16 0 0 1 16-16z" fill="#E4EDF9"/>
        <rect x="136" y="112" width="58" height="8" rx="4" fill="#A7B6CE"/>
        <rect x="136" y="128" width="36" height="8" rx="4" fill="#A7B6CE"/>
        </g>

        <g className="msBOut msB2 msSt">
        <path d="M152 162h68a16 16 0 0 1 16 16v34a16 16 0 0 1-16 16h-68a16 16 0 0 1-16-16v-34a16 16 0 0 1 16-16z" fill="url(#msMine)"/>
        <path d="M236 212v14l14-10z" fill="#0A66E0"/>
        <rect x="150" y="176" width="66" height="9" rx="4.5" fill="#FFFFFF" opacity=".95"/>
        <rect x="150" y="192" width="42" height="9" rx="4.5" fill="#FFFFFF" opacity=".8"/>
        <path d="M198 208l5 5 10-11M208 208l5 5 10-11" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".95"/>
        </g>

        <g className="msBIn msB3 msSt">
        <path d="M138 244h52a15 15 0 0 1 15 15v18a15 15 0 0 1-15 15h-52a15 15 0 0 1-15-15v-6l-10 7 10-13v-6a15 15 0 0 1 15-15z" fill="#E4EDF9"/>
        <rect x="136" y="255" width="46" height="8" rx="4" fill="#A7B6CE"/>
        <rect x="136" y="270" width="28" height="8" rx="4" fill="#A7B6CE"/>
        </g>
        </g>
        <rect className="msRing msSt" x="136" y="162" width="100" height="66" rx="16" fill="none" stroke="#00E5FF" strokeWidth="7"/>

        <g className="msArr msA1 msSt">
        <path className="msFlow" d="M272 178Q330 138 392 150" fill="none" stroke="#FF6A00" strokeWidth="8" strokeLinecap="round" strokeDasharray="16 14"/>
        <path d="M392 138l26 12-26 12z" fill="#FF6A00" transform="rotate(11 405 150)"/>
        </g>
        <g className="msArr msA2 msSt">
        <path className="msFlow" d="M272 212Q332 258 392 272" fill="none" stroke="#FF6A00" strokeWidth="8" strokeLinecap="round" strokeDasharray="16 14"/>
        <path d="M392 260l26 12-26 12z" fill="#FF6A00" transform="rotate(13 405 272)"/>
        </g>

        <g className="msCopy msC1 msSt">
        <path d="M462 92h118a26 26 0 0 1 26 26v46a26 26 0 0 1-26 26H462a26 26 0 0 1-26-26v-20l-20 13 20-21v-18a26 26 0 0 1 26-26z" fill="url(#msCop)" stroke="#FF8A3D" strokeWidth="5" strokeLinejoin="round"/>
        <rect className="msLn msL1 msSt" x="460" y="114" width="104" height="11" rx="5.5" fill="#FF8A3D"/>
        <rect className="msLn msL2 msSt" x="460" y="136" width="68" height="11" rx="5.5" fill="#FFB584"/>
        <rect className="msLn msL2 msSt" x="460" y="163" width="30" height="8" rx="4" fill="#FFC9A3"/>
        <path className="msLn msL2 msSt" d="M556 166l5 5 10-11M566 166l5 5 10-11" fill="none" stroke="#FF8A3D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </g>

        <g className="msCopy msC2 msSt">
        <path d="M462 230h118a26 26 0 0 1 26 26v46a26 26 0 0 1-26 26H462a26 26 0 0 1-26-26v-20l-20 13 20-21v-18a26 26 0 0 1 26-26z" fill="url(#msCop)" stroke="#FF8A3D" strokeWidth="5" strokeLinejoin="round"/>
        <rect className="msLn msL1 msSt" x="460" y="252" width="104" height="11" rx="5.5" fill="#FF8A3D"/>
        <rect className="msLn msL2 msSt" x="460" y="274" width="68" height="11" rx="5.5" fill="#FFB584"/>
        <rect className="msLn msL2 msSt" x="460" y="301" width="30" height="8" rx="4" fill="#FFC9A3"/>
        <path className="msLn msL2 msSt" d="M556 304l5 5 10-11M566 304l5 5 10-11" fill="none" stroke="#FF8A3D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </g>

        <path className="msSpk msS1 msSt" d="M326 78l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="msSpk msS2 msSt" d="M70 148l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="msSpk msS3 msSt" cx="330" cy="330" r="7" fill="#FF3D9A"/>
      </g>
    </>
  ),
  // Фото. Фотография в оранжевой рамке и стопка снимков позади, вокруг четыре человека, которые её видят.
  photo: (
    <>
      <g className="phGo">
        <defs>
        <linearGradient id="phFr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC53D"/><stop offset="1" stopColor="#FF5A00"/></linearGradient>
        <linearGradient id="phSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#DCF0FF"/><stop offset="1" stopColor="#8FCBFF"/></linearGradient>
        <linearGradient id="phMt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6BF5B8"/><stop offset="1" stopColor="#0FA968"/></linearGradient>
        <linearGradient id="phSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE0BE"/><stop offset="1" stopColor="#F3BE8C"/></linearGradient>
        <linearGradient id="phP1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D48CFF"/><stop offset="1" stopColor="#7A1FE0"/></linearGradient>
        <linearGradient id="phP2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="phP3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC53D"/><stop offset="1" stopColor="#FF6A00"/></linearGradient>
        <linearGradient id="phP4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6BF5B8"/><stop offset="1" stopColor="#0FA968"/></linearGradient>
        <clipPath id="phCardClip"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="phScr"><rect x="282" y="130" width="116" height="106" rx="16"/></clipPath>
        <clipPath id="phFrC"><rect x="262" y="110" width="156" height="186" rx="32"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#phCardClip)">
        <ellipse cx="210" cy="118" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="500" cy="264" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="466" cy="88" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="phShad phSt" cx="340" cy="308" rx="96" ry="12" fill="#4E6BA8" opacity=".26"/>

        <g className="phBack1 phSt"><rect x="248" y="114" width="150" height="178" rx="28" fill="#FFFFFF" stroke="#B9D6F5" strokeWidth="6"/></g>
        <g className="phBack2 phSt"><rect x="282" y="114" width="150" height="178" rx="28" fill="#FFFFFF" stroke="#B9D6F5" strokeWidth="6"/></g>

        <g className="phCard phSt">
        <rect x="262" y="110" width="156" height="186" rx="32" fill="url(#phFr)"/>
        <rect x="274" y="122" width="132" height="162" rx="24" fill="#FFFFFF"/>
        <rect x="282" y="130" width="116" height="106" rx="16" fill="url(#phSky)"/>
        <g clipPath="url(#phScr)">
        <circle cx="372" cy="156" r="14" fill="#FFD200"/>
        <path d="M282 240l38-62 26 34 22-26 34 54z" fill="url(#phMt)"/>
        </g>
        <rect x="292" y="250" width="96" height="14" rx="7" fill="#DCE6F2"/>
        <g clipPath="url(#phFrC)"><rect x="288" y="96" width="22" height="220" fill="#FFFFFF" opacity=".35" transform="rotate(20 299 206)"/><rect x="318" y="96" width="9" height="220" fill="#FFFFFF" opacity=".25" transform="rotate(20 322 206)"/></g>
        </g>
        <rect className="phRing phSt" x="262" y="110" width="156" height="186" rx="32" fill="none" stroke="#FF3D9A" strokeWidth="8"/>

        {/* эталон человека, заказчик 23.09.2026 */}
        {/* Четыре человека по бокам — те, кто увидит фото. Стоят на одной линии пола. */}
        <g className="phBust phU1 phSt"><g transform="translate(116 316) scale(1.45)">
          <PersonCanon hair="bun" hairColor="#2B2233" top="#7A1FE0" pants="#3B2F6B" />
        </g></g>
        <g className="phBust phU2 phSt"><g transform="translate(192 316) scale(1.45)">
          <PersonCanon kid hair="short" hairColor="#2B2233" skin="dark" top="#0A7CFF" pants="#27305A" />
        </g></g>
        <g className="phBust phU3 phSt"><g transform="translate(564 316) scale(1.45)">
          <PersonCanon hair="short" hairColor="#8A5A3B" skin="mid" top="#FF6A00" pants="#27305A" />
        </g></g>
        <g className="phBust phU4 phSt"><g transform="translate(488 316) scale(1.45)">
          <PersonCanon kid hair="pony" hairColor="#B06A2E" top="#0FA968" pants="#3B2F6B" />
        </g></g>

        <path className="phSpk phS1 phSt" d="M596 128l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="phSpk phS2 phSt" d="M76 136l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="phSpk phS3 phSt" cx="248" cy="82" r="7" fill="#FF3D9A"/>
        <circle className="phSpk phS4 phSt" cx="440" cy="330" r="6" fill="#00E0A4"/>
      </g>
    </>
  ),
  // Даже удалённое. Запись улетает к получателю и сохраняется у него, а у отправителя остаётся пустой пунктирный контур с корзиной.
  kept: (
    <>
      <g className="dlGo">
        <defs>
        <linearGradient id="dlOr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC53D"/><stop offset="1" stopColor="#FF5A00"/></linearGradient>
        <linearGradient id="dlPo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#B9C6DC"/><stop offset="1" stopColor="#8496B5"/></linearGradient>
        <clipPath id="dlCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="dlL"><rect x="92" y="62" width="180" height="240" rx="42"/></clipPath>
        <clipPath id="dlR"><rect x="408" y="62" width="180" height="240" rx="42"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#dlCard)">
        <ellipse cx="200" cy="120" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="505" cy="266" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="474" cy="88" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="dlShad dlSt" cx="182" cy="318" rx="92" ry="12" fill="#4E6BA8" opacity=".24"/>
        <ellipse className="dlShad dlSt" cx="498" cy="318" rx="92" ry="12" fill="#3C8F76" opacity=".24"/>

        <g className="dlDev dlSt">
        <rect x="92" y="62" width="180" height="240" rx="42" fill="#172363"/>
        <rect x="104" y="74" width="156" height="216" rx="32" fill="#F7FAFF"/>
        <g clipPath="url(#dlL)"><rect x="124" y="50" width="20" height="264" fill="#FFFFFF" opacity=".25" transform="rotate(20 134 182)"/></g>
        <rect className="dlDash dlSt" x="120" y="104" width="124" height="72" rx="22" fill="none" stroke="#B9C6DC" strokeWidth="5" strokeDasharray="15 13" strokeLinecap="round"/>
        <g className="dlOrig">
        <g className="dlNote dlSt">
        <rect x="120" y="104" width="124" height="72" rx="22" fill="url(#dlOr)"/>
        <rect x="138" y="122" width="74" height="12" rx="6" fill="#FFFFFF" opacity=".95"/>
        <rect x="138" y="144" width="46" height="12" rx="6" fill="#FFFFFF" opacity=".8"/>
        </g>
        </g>
        <g className="dlTrash dlSt">
        <rect x="170" y="198" width="24" height="9" rx="4.5" fill="url(#dlPo)"/>
        <rect x="148" y="211" width="68" height="11" rx="5.5" fill="url(#dlPo)"/>
        <path d="M158 228h48l-6 46h-36z" fill="none" stroke="#8496B5" strokeWidth="7" strokeLinejoin="round"/>
        </g>
        </g>

        <path className="dlD1 dlSt" d="M296 142l18-9" fill="none" stroke="#FF8A3D" strokeWidth="8" strokeLinecap="round"/>
        <path className="dlD2 dlSt" d="M322 128l18-6" fill="none" stroke="#FF8A3D" strokeWidth="8" strokeLinecap="round"/>
        <path className="dlD3 dlSt" d="M348 118l14-2" fill="none" stroke="#FF8A3D" strokeWidth="8" strokeLinecap="round"/>
        <path className="dlDh dlSt" d="M366 104l18 9-18 10z" fill="#FF8A3D" stroke="#FF8A3D" strokeWidth="6" strokeLinejoin="round"/>

        <g className="dlDev dlSt">
        <rect x="408" y="62" width="180" height="240" rx="42" fill="#172363"/>
        <rect x="420" y="74" width="156" height="216" rx="32" fill="#FFF7F0"/>
        <g clipPath="url(#dlR)"><rect x="440" y="50" width="20" height="264" fill="#FFFFFF" opacity=".25" transform="rotate(20 450 182)"/></g>
        <g className="dlCopy dlSt">
        <rect x="436" y="104" width="124" height="72" rx="22" fill="url(#dlOr)"/>
        <rect x="454" y="122" width="74" height="12" rx="6" fill="#FFFFFF" opacity=".95"/>
        <rect x="454" y="144" width="46" height="12" rx="6" fill="#FFFFFF" opacity=".8"/>
        </g>
        <g className="dlEye dlSt">
        <path d="M458 232q40-44 80 0q-40 44-80 0z" fill="#FFE6D3" stroke="#FF6A00" strokeWidth="8" strokeLinejoin="round"/>
        <circle cx="498" cy="232" r="16" fill="#FF6A00"/>
        <circle cx="492" cy="226" r="5.5" fill="#FFF3EA"/>
        </g>
        </g>

        <g className="dlFly dlSt">
        <rect x="120" y="104" width="124" height="72" rx="22" fill="url(#dlOr)"/>
        <rect x="138" y="122" width="74" height="12" rx="6" fill="#FFFFFF" opacity=".95"/>
        <rect x="138" y="144" width="46" height="12" rx="6" fill="#FFFFFF" opacity=".8"/>
        </g>

        <path className="dlSpk dlS1 dlSt" d="M614 128l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="dlSpk dlS2 dlSt" d="M62 178l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="dlSpk dlS3 dlSt" cx="340" cy="326" r="7" fill="#FF3D9A"/>
      </g>
    </>
  ),
  // Земной шар с вращающейся сушей, вокруг по кругу компьютер, планшет и два телефона,
  // соединённые дорожками; по дорожкам в обе стороны бегут кружки-данные.
  // Перенесено из what-is-internet.html (заказчик, 2026-08-06): демо-пульт и стили body
  // не переносились, id заскоуплены префиксом gl, автозапуск play() убран — кадр живёт
  // внутри киноленты и выходит вместе с ней.
  globe: (
    <>
      <defs>
        <linearGradient id="glBlue" x1="0" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#5CDDFF" /><stop offset="1" stopColor="#1F80EA" /></linearGradient>
        <linearGradient id="glPurp" x1="0" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#D28AFF" /><stop offset="1" stopColor="#7A34C4" /></linearGradient>
        <linearGradient id="glOr" x1="0" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#FFC04A" /><stop offset="1" stopColor="#FF7501" /></linearGradient>
        <linearGradient id="glTeal" x1="0" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#7BF5C8" /><stop offset="1" stopColor="#17A97C" /></linearGradient>
        <linearGradient id="glSea" x1="0" y1="0" x2=".7" y2="1">
          <stop offset="0" stopColor="#6FE0FF" /><stop offset="1" stopColor="#2277D8" /></linearGradient>
        <clipPath id="glLap"><rect x="-57" y="-38" width="114" height="76" rx="13" /></clipPath>
        <clipPath id="glTab"><rect x="-57" y="-45" width="114" height="90" rx="17" /></clipPath>
        <clipPath id="glPho"><rect x="-36" y="-63" width="72" height="126" rx="18" /></clipPath>
        <clipPath id="glIn"><rect width="640" height="400" rx="24" /></clipPath>
        <clipPath id="glGlobe"><circle cx="320" cy="200" r="70" /></clipPath>
      </defs>
      <rect width="680" height="440" rx="34" fill="#FFFFFF" />
      <g transform="translate(20,20)">
        <rect width="640" height="400" rx="24" fill="#F1F6FE" />
        <g clipPath="url(#glIn)">
          <ellipse cx="150" cy="110" rx="205" ry="132" fill="#BAEEFD" />
          <ellipse cx="500" cy="90" rx="160" ry="100" fill="#E5C7FD" />
          <ellipse cx="470" cy="310" rx="190" ry="128" fill="#AFFED8" />
        </g>
        <path className="gl-spark" d="M50 196l7 16 16 7-16 7-7 16-7-16-16-7 16-7z" fill="#FFD639" />
        <path className="gl-spark" d="M600 186l7 16 16 7-16 7-7 16-7-16-16-7 16-7z" fill="#FFD639" />
        <circle cx="318" cy="52" r="6" fill="#B349F0" />
        <circle cx="322" cy="352" r="6" fill="#E0338A" />

        <g className="gl-wire w1">
          <line className="base" x1="245" y1="163" x2="152" y2="122" stroke="#1F80EA" strokeWidth="6" strokeLinecap="round" pathLength="1" />
          <line className="dash" x1="245" y1="163" x2="152" y2="122" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="8 10" />
        </g>
        <g className="gl-wire w2">
          <line className="base" x1="395" y1="163" x2="490" y2="118" stroke="#7A34C4" strokeWidth="6" strokeLinecap="round" pathLength="1" />
          <line className="dash" x1="395" y1="163" x2="490" y2="118" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="8 10" />
        </g>
        <g className="gl-wire w3">
          <line className="base" x1="395" y1="237" x2="500" y2="286" stroke="#FF7501" strokeWidth="6" strokeLinecap="round" pathLength="1" />
          <line className="dash" x1="395" y1="237" x2="500" y2="286" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="8 10" />
        </g>
        <g className="gl-wire w4">
          <line className="base" x1="245" y1="237" x2="142" y2="288" stroke="#17A97C" strokeWidth="6" strokeLinecap="round" pathLength="1" />
          <line className="dash" x1="245" y1="237" x2="142" y2="288" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="8 10" />
        </g>

        <g className="gl-globe">
          <ellipse cx="320" cy="292" rx="66" ry="10" fill="#5B6BA8" opacity=".16" />
          <circle cx="320" cy="200" r="78" fill="#171E60" />
          <circle cx="320" cy="200" r="70" fill="url(#glSea)" />
          <g clipPath="url(#glGlobe)">
            <g className="gl-land">
              <g>
                <path d="M258 158c14-9 30-6 40 3s4 20-8 24-30 2-36-8-6-14 4-19z" fill="#63E0A8" />
                <path d="M300 206c16-6 34 2 38 14s-8 22-24 22-28-8-28-19 4-14 14-17z" fill="#63E0A8" />
                <path d="M338 148c12-5 26 0 28 9s-8 15-20 15-18-5-18-12 4-10 10-12z" fill="#63E0A8" />
                <path d="M244 236c12-4 24 2 24 11s-10 14-22 12-16-8-14-15 6-7 12-8z" fill="#63E0A8" />
              </g>
              <g transform="translate(140,0)">
                <path d="M258 158c14-9 30-6 40 3s4 20-8 24-30 2-36-8-6-14 4-19z" fill="#63E0A8" />
                <path d="M300 206c16-6 34 2 38 14s-8 22-24 22-28-8-28-19 4-14 14-17z" fill="#63E0A8" />
                <path d="M338 148c12-5 26 0 28 9s-8 15-20 15-18-5-18-12 4-10 10-12z" fill="#63E0A8" />
                <path d="M244 236c12-4 24 2 24 11s-10 14-22 12-16-8-14-15 6-7 12-8z" fill="#63E0A8" />
              </g>
            </g>
            <path d="M250 200h140" stroke="#fff" strokeWidth="2.5" opacity=".38" />
            <ellipse cx="320" cy="200" rx="34" ry="70" fill="none" stroke="#fff" strokeWidth="2.5" opacity=".3" />
            <ellipse cx="320" cy="200" rx="64" ry="70" fill="none" stroke="#fff" strokeWidth="2.5" opacity=".22" />
            <path d="M262 168h116M262 232h116" stroke="#fff" strokeWidth="2.2" opacity=".22" />
          </g>
          <circle cx="320" cy="200" r="70" fill="none" stroke="#fff" strokeWidth="3" opacity=".28" />
        </g>

        <g className="gl-dev gl-d1">
          <ellipse cx="0" cy="86" rx="82" ry="11" fill="#5B6BA8" opacity=".18" />
          <rect x="-70" y="-51" width="140" height="102" rx="24" fill="#171E60" />
          <rect x="-62" y="-43" width="124" height="86" rx="18" fill="#fff" />
          <g clipPath="url(#glLap)">
            <rect x="-57" y="-38" width="114" height="76" fill="url(#glBlue)" />
            <path d="M-13 -60 L16 -60 L-26 60 L-55 60 Z" fill="#fff" opacity=".42" />
            <path d="M22 -60 L31 -60 L-11 60 L-20 60 Z" fill="#fff" opacity=".26" />
          </g>
          <rect x="-88" y="51" width="176" height="21" rx="10.5" fill="#171E60" />
          <rect x="-78" y="54" width="156" height="10" rx="5" fill="#3FC4DF" />
        </g>

        <g className="gl-dev gl-d2">
          <ellipse cx="0" cy="72" rx="62" ry="10" fill="#5B6BA8" opacity=".18" />
          <rect x="-70" y="-58" width="140" height="116" rx="30" fill="#171E60" />
          <rect x="-62" y="-50" width="124" height="100" rx="23" fill="#fff" />
          <g clipPath="url(#glTab)">
            <rect x="-57" y="-45" width="114" height="90" fill="url(#glPurp)" />
            <path d="M-13 -60 L16 -60 L-26 60 L-55 60 Z" fill="#fff" opacity=".40" />
            <path d="M22 -60 L31 -60 L-11 60 L-20 60 Z" fill="#fff" opacity=".26" />
          </g>
        </g>

        <g className="gl-dev gl-d3">
          <ellipse cx="0" cy="92" rx="46" ry="9" fill="#5B6BA8" opacity=".18" />
          <rect x="-49" y="-76" width="98" height="152" rx="30" fill="#171E60" />
          <rect x="-41" y="-68" width="82" height="136" rx="23" fill="#fff" />
          <g clipPath="url(#glPho)">
            <rect x="-36" y="-63" width="72" height="126" fill="url(#glOr)" />
            <path d="M7 -84 L29 -84 L-29 84 L-51 84 Z" fill="#fff" opacity=".42" />
            <path d="M34 -84 L41 -84 L-17 84 L-24 84 Z" fill="#fff" opacity=".26" />
          </g>
        </g>

        <g className="gl-dev gl-d4">
          <ellipse cx="0" cy="92" rx="46" ry="9" fill="#5B6BA8" opacity=".18" />
          <rect x="-49" y="-76" width="98" height="152" rx="30" fill="#171E60" />
          <rect x="-41" y="-68" width="82" height="136" rx="23" fill="#fff" />
          <g clipPath="url(#glPho)">
            <rect x="-36" y="-63" width="72" height="126" fill="url(#glTeal)" />
            <path d="M7 -84 L29 -84 L-29 84 L-51 84 Z" fill="#fff" opacity=".42" />
            <path d="M34 -84 L41 -84 L-17 84 L-24 84 Z" fill="#fff" opacity=".26" />
          </g>
        </g>
      </g>

    </>
  ),
  // Интернет — как город. Ряд домов-приложений: синий дом с кнопкой видео, высокий сиреневый дом с окнами, зелёный дом с круглой крышей и оранжевый магазин.
  city: (
    <>
      <g className="ctGo">
        <defs>
        <linearGradient id="ctBlu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="ctPu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D48CFF"/><stop offset="1" stopColor="#7A1FE0"/></linearGradient>
        <linearGradient id="ctGrn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6BF5B8"/><stop offset="1" stopColor="#0B9A5E"/></linearGradient>
        <linearGradient id="ctOr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC53D"/><stop offset="1" stopColor="#FF5A00"/></linearGradient>
        <clipPath id="ctCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="ctC1"><rect x="146" y="164" width="104" height="140" rx="26"/></clipPath>
        <clipPath id="ctC2"><rect x="268" y="132" width="96" height="172" rx="18"/></clipPath>
        <clipPath id="ctC3"><path d="M382 304V229a43 43 0 0 1 86 0v75z"/></clipPath>
        <clipPath id="ctC4"><rect x="488" y="212" width="96" height="92" rx="20"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#ctCard)">
        <ellipse cx="210" cy="120" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="500" cy="268" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="468" cy="90" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="ctGround ctSt" cx="365" cy="320" rx="230" ry="12" fill="#4E6BA8" opacity=".2"/>
        <rect className="ctGround ctSt" x="128" y="302" width="474" height="16" rx="8" fill="#C3D5EE"/>

        <g className="ctBld ctB1 ctSt">
        <rect x="146" y="164" width="104" height="140" rx="26" fill="url(#ctBlu)"/>
        <rect x="160" y="180" width="76" height="60" rx="14" fill="#FFFFFF" opacity=".92"/>
        <g clipPath="url(#ctC1)"><rect x="166" y="152" width="18" height="168" fill="#FFFFFF" opacity=".3" transform="rotate(20 175 236)"/></g>
        <rect x="176" y="258" width="44" height="46" rx="10" fill="#FFFFFF" opacity=".45"/>
        </g>
        <g className="ctPlay ctSt"><g className="ctBeat"><path d="M188 194l28 16-28 16z" fill="#0A7CFF"/></g></g>

        <path className="ctRoof ctSt" d="M262 136l54-46 54 46z" fill="url(#ctPu)"/>
        <g className="ctBld ctB2 ctSt">
        <rect x="268" y="132" width="96" height="172" rx="18" fill="url(#ctPu)"/>
        <g clipPath="url(#ctC2)"><rect x="282" y="120" width="18" height="196" fill="#FFFFFF" opacity=".28" transform="rotate(20 291 218)"/></g>
        <rect x="294" y="240" width="44" height="64" rx="12" fill="#FFFFFF" opacity=".45"/>
        </g>
        <rect className="ctWin ctW1 ctSt" x="284" y="158" width="15" height="52" rx="7.5" fill="#FFFFFF" opacity=".8"/>
        <rect className="ctWin ctW2 ctSt" x="308" y="158" width="15" height="52" rx="7.5" fill="#FFFFFF" opacity=".8"/>
        <rect className="ctWin ctW3 ctSt" x="332" y="158" width="15" height="52" rx="7.5" fill="#FFFFFF" opacity=".8"/>

        <g className="ctBld ctB3 ctSt">
        <path d="M382 304V229a43 43 0 0 1 86 0v75z" fill="url(#ctGrn)"/>
        <g clipPath="url(#ctC3)"><rect x="396" y="180" width="18" height="150" fill="#FFFFFF" opacity=".32" transform="rotate(20 405 255)"/><rect x="422" y="180" width="8" height="150" fill="#FFFFFF" opacity=".22" transform="rotate(20 426 255)"/></g>
        <path d="M406 304v-38a19 19 0 0 1 38 0v38z" fill="#FFFFFF" opacity=".5"/>
        </g>
        <circle className="ctWin ctW4 ctSt" cx="425" cy="216" r="17" fill="#FFFFFF" opacity=".8"/>

        <g className="ctAwn ctSt"><rect x="484" y="192" width="104" height="18" rx="9" fill="url(#ctOr)"/></g>
        <g className="ctBld ctB4 ctSt">
        <rect x="488" y="212" width="96" height="92" rx="20" fill="url(#ctOr)"/>
        <rect x="506" y="234" width="60" height="56" rx="14" fill="#FFFFFF" opacity=".55"/>
        <g clipPath="url(#ctC4)"><rect x="502" y="200" width="18" height="116" fill="#FFFFFF" opacity=".3" transform="rotate(20 511 258)"/></g>
        </g>

        <path className="ctSpk ctS1 ctSt" d="M600 118l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="ctSpk ctS2 ctSt" d="M92 152l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="ctSpk ctS3 ctSt" cx="416" cy="112" r="7" fill="#FF3D9A"/>
        <circle className="ctSpk ctS4 ctSt" cx="124" cy="248" r="6" fill="#00E0A4"/>
      </g>
    </>
  ),
  // В городе есть правила. Светофор, у которого по очереди загораются красный, жёлтый и зелёный сигналы, рядом знак «пешеходный переход» с идущим человечком и полосами, и ребёнок.
  rules: (
    <>
      <g className="ruGo">
        <defs>
        <linearGradient id="ruRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8A80"/><stop offset="1" stopColor="#E01B24"/></linearGradient>
        <linearGradient id="ruYel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE066"/><stop offset="1" stopColor="#FFB300"/></linearGradient>
        <linearGradient id="ruGrn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6BF5B8"/><stop offset="1" stopColor="#0FA968"/></linearGradient>
        <linearGradient id="ruBlu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="ruSign" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4FA8F5"/><stop offset="1" stopColor="#0A5FD0"/></linearGradient>
        <linearGradient id="ruSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE0BE"/><stop offset="1" stopColor="#F3BE8C"/></linearGradient>
        <linearGradient id="ruPo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#B9C6DC"/><stop offset="1" stopColor="#8496B5"/></linearGradient>
        <clipPath id="ruCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="ruBc"><rect x="284" y="82" width="82" height="176" rx="30"/></clipPath>
        <clipPath id="ruKb"><rect x="190" y="252" width="40" height="56" rx="20"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#ruCard)">
        <ellipse cx="205" cy="118" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="500" cy="268" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="466" cy="86" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="ruGround ruSt" cx="340" cy="322" rx="200" ry="12" fill="#4E6BA8" opacity=".2"/>
        <rect className="ruGround ruSt" x="140" y="304" width="400" height="16" rx="8" fill="#C3D5EE"/>

        <rect className="ruPost ruSt" x="316" y="248" width="18" height="58" fill="url(#ruPo)"/>
        <g className="ruBox ruSt">
        <rect x="284" y="82" width="82" height="176" rx="30" fill="#172363"/>
        <g clipPath="url(#ruBc)"><rect x="296" y="70" width="18" height="200" fill="#FFFFFF" opacity=".16" transform="rotate(20 305 170)"/></g>
        <circle cx="325" cy="118" r="23" fill="#0B1233"/>
        <circle cx="325" cy="170" r="23" fill="#0B1233"/>
        <circle cx="325" cy="222" r="23" fill="#0B1233"/>
        </g>

        <g className="ruLamp ruR ruSt"><g className="ruCyc ruCr"><circle cx="325" cy="118" r="22" fill="url(#ruRed)"/><circle cx="318" cy="110" r="6" fill="#FFFFFF" opacity=".55"/></g></g>
        <g className="ruLamp ruY ruSt"><g className="ruCyc ruCy"><circle cx="325" cy="170" r="22" fill="url(#ruYel)"/><circle cx="318" cy="162" r="6" fill="#FFFFFF" opacity=".55"/></g></g>
        <g className="ruLamp ruG ruSt"><g className="ruCyc ruCg"><circle cx="325" cy="222" r="22" fill="url(#ruGrn)"/><circle cx="318" cy="214" r="6" fill="#FFFFFF" opacity=".55"/></g></g>

        <rect className="ruSignPost ruSt" x="428" y="196" width="16" height="110" fill="url(#ruPo)"/>
        <g className="ruSign ruSt">
        <rect x="384" y="94" width="104" height="104" rx="22" fill="url(#ruSign)"/>
        <rect x="394" y="104" width="84" height="84" rx="15" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity=".85"/>
        </g>

        <g className="ruWalk ruSt"><g className="ruStep">
        <circle cx="443" cy="126" r="9" fill="#FFFFFF"/>
        <path d="M443 137l-5 22" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M438 159l-9 18M438 159l12 16" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M442 143l13 9M442 143l-12 8" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" fill="none"/>
        </g></g>
        <rect className="ruZ ruZ1 ruSt" x="401" y="177" width="11" height="10" rx="2.5" fill="#FFFFFF"/>
        <rect className="ruZ ruZ2 ruSt" x="419" y="177" width="11" height="10" rx="2.5" fill="#FFFFFF"/>
        <rect className="ruZ ruZ3 ruSt" x="437" y="177" width="11" height="10" rx="2.5" fill="#FFFFFF"/>
        <rect className="ruZ ruZ4 ruSt" x="455" y="177" width="11" height="10" rx="2.5" fill="#FFFFFF"/>

        {/* эталон человека, заказчик 23.09.2026 */}
        <g className="ruKid ruSt"><g transform="translate(206 305) scale(1.6)">
          <PersonCanon kid pose="point" hair="pony" hairColor="#2B2233" skin="dark" top="#0A7CFF" pants="#27305A" />
        </g></g>

        <path className="ruSpk ruS1 ruSt" d="M574 116l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="ruSpk ruS2 ruSt" d="M104 148l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="ruSpk ruS3 ruSt" cx="250" cy="104" r="7" fill="#FF3D9A"/>
      </g>
    </>
  ),
  // До встречи! Ребёнок машет большой раскрытой ладонью: одна рука поднята, справа от неё три дуги-волны движения, вокруг всплывают сердечки и искры, за фигурой тёплое гало. Финальный кадр-награда, устройств в кадре нет.
  bye: (
    <>
      <g className="hwGo">
        <defs>
        <linearGradient id="hwSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE0BE"/><stop offset="1" stopColor="#F3BE8C"/></linearGradient>
        <linearGradient id="hwBd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="hwHr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF6F7D"/><stop offset="1" stopColor="#E01B24"/></linearGradient>
        <linearGradient id="hwHp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFA6D5"/><stop offset="1" stopColor="#E8368F"/></linearGradient>
        <clipPath id="hwCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="hwBc"><rect x="196" y="200" width="124" height="134" rx="62"/></clipPath>
        <clipPath id="hwHc"><circle cx="258" cy="162" r="44"/></clipPath>
        <clipPath id="hwPc"><rect x="380" y="130" width="96" height="88" rx="34"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#hwCard)">
        <ellipse cx="198" cy="118" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="505" cy="266" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="470" cy="88" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <circle className="hwHalo" cx="258" cy="210" r="132" fill="#FFC53D" opacity="0"/>
        <ellipse className="hwShad hwSt" cx="304" cy="338" rx="52" ry="10" fill="#4E6BA8" opacity=".28"/>

        <g className="hwPu hwU1" opacity=".95"><path className="hwArc hwA1" d="M494 219A80 80 0 0 0 494 129" fill="none" stroke="#FF6A00" strokeWidth="8" strokeLinecap="round"/></g>
        <g className="hwPu hwU2" opacity=".95"><path className="hwArc hwA2" d="M511 230A100 100 0 0 0 511 118" fill="none" stroke="#FF8A00" strokeWidth="8" strokeLinecap="round"/></g>
        <g className="hwPu hwU3" opacity=".95"><path className="hwArc hwA3" d="M528 241A120 120 0 0 0 528 107" fill="none" stroke="#FFC53D" strokeWidth="8" strokeLinecap="round"/></g>

        {/* эталон человека, заказчик 23.09.2026 */}
        {/* Ребёнок в позе point: его кисть (367,202) упирается в основание большой
            ладони, вокруг этой точки ладонь и поднимается, и машет (.hwArm/.hwWv). */}
        <g className="hwFig hwSt"><g transform="translate(300 336) scale(2.3)">
          <PersonCanon kid pose="point" hair="short" hairColor="#7A3E1F" top="#0A7CFF" pants="#27305A" shadow={false} />
        </g></g>

        <g className="hwArm hwSt">
          <g className="hwWv">
          <rect x="386" y="80" width="22" height="104" rx="11" fill="url(#hwSk)" transform="rotate(-14 397 182)"/>
          <rect x="410" y="70" width="22" height="114" rx="11" fill="url(#hwSk)" transform="rotate(-5 421 182)"/>
          <rect x="434" y="74" width="22" height="110" rx="11" fill="url(#hwSk)" transform="rotate(9 445 182)"/>
          <rect x="458" y="88" width="22" height="96" rx="11" fill="url(#hwSk)" transform="rotate(20 469 182)"/>
          <rect x="377" y="146" width="26" height="68" rx="13" fill="url(#hwSk)" transform="rotate(-38 390 210)"/>
          <line x1="367" y1="202" x2="398" y2="202" stroke="#F3BE8C" strokeWidth="12" strokeLinecap="round"/>
          <rect x="380" y="130" width="96" height="88" rx="34" fill="url(#hwSk)"/>
          <g clipPath="url(#hwPc)"><rect x="400" y="118" width="20" height="112" fill="#FFFFFF" opacity=".3" transform="rotate(20 410 174)"/><rect x="428" y="118" width="9" height="112" fill="#FFFFFF" opacity=".2" transform="rotate(20 432 174)"/></g>
          </g>
        </g>
        <rect className="hwRing hwSt" x="380" y="130" width="96" height="88" rx="34" fill="none" stroke="#00E5FF" strokeWidth="8"/>

        <g transform="translate(588 142) scale(.9)"><g className="hwHt hwH1 hwSt"><g className="hwFl hwF1">
        <path d="M0 0c-27-18-38-31-38-45 0-11 11-16 20-11 8 3 15 11 18 18 3-7 10-15 18-18 9-5 20 0 20 11 0 14-11 27-38 45z" fill="url(#hwHr)"/>
        <path d="M-20 -42c-6 0-10 4-10 10 0 7 4 14 11 21-3-9-4-16-2-21 2-5 6-8 11-9-3-1-6-1-10-1z" fill="#FFFFFF" opacity=".45"/>
        </g></g></g>
        <g transform="translate(576 300) scale(.72)"><g className="hwHt hwH2 hwSt"><g className="hwFl hwF2">
        <path d="M0 0c-27-18-38-31-38-45 0-11 11-16 20-11 8 3 15 11 18 18 3-7 10-15 18-18 9-5 20 0 20 11 0 14-11 27-38 45z" fill="url(#hwHp)"/>
        <path d="M-20 -42c-6 0-10 4-10 10 0 7 4 14 11 21-3-9-4-16-2-21 2-5 6-8 11-9-3-1-6-1-10-1z" fill="#FFFFFF" opacity=".45"/>
        </g></g></g>
        <g transform="translate(152 116) scale(.72)"><g className="hwHt hwH3 hwSt"><g className="hwFl hwF3">
        <path d="M0 0c-27-18-38-31-38-45 0-11 11-16 20-11 8 3 15 11 18 18 3-7 10-15 18-18 9-5 20 0 20 11 0 14-11 27-38 45z" fill="url(#hwHp)"/>
        <path d="M-20 -42c-6 0-10 4-10 10 0 7 4 14 11 21-3-9-4-16-2-21 2-5 6-8 11-9-3-1-6-1-10-1z" fill="#FFFFFF" opacity=".45"/>
        </g></g></g>
        <g transform="translate(112 244) scale(.6)"><g className="hwHt hwH4 hwSt"><g className="hwFl hwF4">
        <path d="M0 0c-27-18-38-31-38-45 0-11 11-16 20-11 8 3 15 11 18 18 3-7 10-15 18-18 9-5 20 0 20 11 0 14-11 27-38 45z" fill="url(#hwHr)"/>
        <path d="M-20 -42c-6 0-10 4-10 10 0 7 4 14 11 21-3-9-4-16-2-21 2-5 6-8 11-9-3-1-6-1-10-1z" fill="#FFFFFF" opacity=".45"/>
        </g></g></g>

        <path className="hwSpk hwS1 hwSt" d="M312 58l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="hwSpk hwS2 hwSt" d="M96 150l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="hwSpk hwS3 hwSt" cx="618" cy="196" r="8" fill="#00E0A4"/>
        <circle className="hwSpk hwS4 hwSt" cx="200" cy="76" r="7" fill="#FF3D9A"/>
        <circle className="hwSpk hwS5 hwSt" cx="372" cy="318" r="7" fill="#C24BFF"/>
      </g>
    </>
  ),
  // Играешь в игры: большой геймпад парит в центре кадра (синий градиент, тёмный контур, крестовина и две кнопки), внизу по краям двое детей, от каждого к своей рукоятке идёт пунктирная линия связи с бегущим огоньком — одна игра на двоих.
  play: (
    <>
      <g className="pgGo">
        <defs>
        <linearGradient id="pgBl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="pgGr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6BF5B8"/><stop offset="1" stopColor="#0B9A5E"/></linearGradient>
        <linearGradient id="pgPu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D48CFF"/><stop offset="1" stopColor="#7A1FE0"/></linearGradient>
        <linearGradient id="pgSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE0BE"/><stop offset="1" stopColor="#F3BE8C"/></linearGradient>
        <clipPath id="pgCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="pgPd"><path d="M284 76H396A48 48 0 0 1 444 124V150Q456 208 428 242Q404 264 394 222Q388 196 368 188Q354 184 340 184Q326 184 312 188Q292 196 286 222Q276 264 252 242Q224 208 236 150V124A48 48 0 0 1 284 76Z"/></clipPath>
        <clipPath id="pgH1"><circle cx="128" cy="230" r="32"/></clipPath>
        <clipPath id="pgH2"><circle cx="552" cy="230" r="32"/></clipPath>
        <clipPath id="pgC1"><circle cx="128" cy="292" r="44"/></clipPath>
        <clipPath id="pgC2"><circle cx="552" cy="292" r="44"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#pgCard)">
        <ellipse cx="210" cy="116" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="500" cy="268" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="466" cy="88" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="pgShad pgSt" cx="340" cy="270" rx="88" ry="11" fill="#4E6BA8" opacity=".22"/>
        <ellipse className="pgShad pgSt" cx="128" cy="340" rx="32" ry="8" fill="#4E6BA8" opacity=".28"/>
        <ellipse className="pgShad pgSt" cx="552" cy="340" rx="32" ry="8" fill="#3C8F76" opacity=".28"/>

        <g className="pgFloat"><g className="pgPad pgSt">
        <path d="M284 76H396A48 48 0 0 1 444 124V150Q456 208 428 242Q404 264 394 222Q388 196 368 188Q354 184 340 184Q326 184 312 188Q292 196 286 222Q276 264 252 242Q224 208 236 150V124A48 48 0 0 1 284 76Z" fill="url(#pgBl)" stroke="#172363" strokeWidth="10" strokeLinejoin="round"/>
        <g clipPath="url(#pgPd)"><rect x="270" y="62" width="22" height="132" fill="#FFFFFF" opacity=".45" transform="rotate(20 281 128)"/><rect x="302" y="62" width="9" height="132" fill="#FFFFFF" opacity=".3" transform="rotate(20 307 128)"/></g>
        <path d="M288 102h16v14h14v16h-14v14h-16v-14h-14v-16h14z" fill="#172363"/>
        <rect x="328" y="114" width="26" height="12" rx="6" fill="#172363" opacity=".85"/>
        <g className="pgBtn"><circle cx="388" cy="110" r="14" fill="#FFD200" stroke="#172363" strokeWidth="5"/></g>
        <g className="pgBtn pgB2"><circle cx="412" cy="138" r="14" fill="#00E0A4" stroke="#172363" strokeWidth="5"/></g>
        </g></g>
        <path className="pgRing pgSt" d="M284 76H396A48 48 0 0 1 444 124V150Q456 208 428 242Q404 264 394 222Q388 196 368 188Q354 184 340 184Q326 184 312 188Q292 196 286 222Q276 264 252 242Q224 208 236 150V124A48 48 0 0 1 284 76Z" fill="none" stroke="#00E5FF" strokeWidth="8"/>

        {/* эталон человека, заказчик 23.09.2026 */}
        <g className="pgFig pgF1 pgSt"><g className="pgBob"><g transform="translate(128 338) scale(1.85)">
          <PersonCanon kid hair="short" hairColor="#7A3E1F" skin="mid" top="#0B9A5E" pants="#27305A" shadow={false} />
        </g></g></g>

        <g className="pgFig pgF2 pgSt"><g className="pgBob pgW2"><g transform="translate(552 338) scale(1.85)">
          <PersonCanon kid hair="bun" hairColor="#2B2B33" top="#7A1FE0" pants="#3B2F6B" shadow={false} />
        </g></g></g>

        <line className="pgLine pgK1 pgSt" x1="184" y1="272" x2="250" y2="240" stroke="#0B9A5E" strokeWidth="9" strokeLinecap="round"/>
        <line className="pgLine pgK2 pgSt" x1="496" y1="272" x2="430" y2="240" stroke="#7A1FE0" strokeWidth="9" strokeLinecap="round"/>
        <g className="pgNode pgO1 pgSt"><circle cx="250" cy="240" r="8" fill="#00E0A4" stroke="#FFFFFF" strokeWidth="3"/></g>
        <g className="pgNode pgO2 pgSt"><circle cx="430" cy="240" r="8" fill="#C24BFF" stroke="#FFFFFF" strokeWidth="3"/></g>
        <circle className="pgDot pgT1 pgSt" cx="184" cy="272" r="7" fill="#00E5FF"/>
        <circle className="pgDot pgT2 pgSt" cx="496" cy="272" r="7" fill="#C24BFF"/>

        <path className="pgSpk pgS1 pgSt" d="M604 93l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="pgSpk pgS2 pgSt" d="M74 143l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="pgSpk pgS3 pgSt" cx="618" cy="240" r="7" fill="#00E0A4"/>
        <circle className="pgSpk pgS4 pgSt" cx="340" cy="336" r="7" fill="#FF3D9A"/>
        <circle className="pgSpk pgS5 pgSt" cx="150" cy="80" r="6" fill="#C24BFF"/>
      </g>

    </>
  ),
  // Смотришь мультики: большой телевизор на подставке с сиреневым экраном и белой кнопкой play, по стеклу проходит блик, слева на переднем плане ведро попкорна, справа ребёнок смотрит на экран.
  watch: (
    <>
      <g className="cnGo">
        <defs>
        <linearGradient id="cnPu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D48CFF"/><stop offset="1" stopColor="#7A1FE0"/></linearGradient>
        <linearGradient id="cnOr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC53D"/><stop offset="1" stopColor="#FF6A00"/></linearGradient>
        <linearGradient id="cnYe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC53D"/><stop offset="1" stopColor="#FF5A00"/></linearGradient>
        <linearGradient id="cnBl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="cnSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE0BE"/><stop offset="1" stopColor="#F3BE8C"/></linearGradient>
        <clipPath id="cnCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="cnScr"><rect x="94" y="72" width="372" height="196" rx="16"/></clipPath>
        <clipPath id="cnBk"><path d="M100 266h80l-12 76a8 8 0 0 1-8 7h-40a8 8 0 0 1-8-7z"/></clipPath>
        <clipPath id="cnH1"><circle cx="566" cy="222" r="32"/></clipPath>
        <clipPath id="cnC1"><circle cx="566" cy="284" r="44"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#cnCard)">
        <ellipse cx="200" cy="122" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="508" cy="264" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="474" cy="86" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="cnShad cnSt" cx="280" cy="328" rx="126" ry="12" fill="#4E6BA8" opacity=".26"/>
        <ellipse className="cnShad cnSt" cx="566" cy="336" rx="34" ry="8" fill="#3C8F76" opacity=".28"/>
        <ellipse className="cnShad cnSt" cx="140" cy="350" rx="44" ry="9" fill="#4E6BA8" opacity=".24"/>

        <g className="cnTv cnSt">
        <rect x="244" y="286" width="72" height="16" fill="#2A3A6E"/>
        <rect x="196" y="298" width="168" height="20" rx="10" fill="#172363"/>
        <rect x="76" y="54" width="408" height="232" rx="30" fill="#172363"/>
        <rect x="86" y="64" width="388" height="212" rx="22" fill="#FFFFFF"/>
        <rect x="94" y="72" width="372" height="196" rx="16" fill="url(#cnPu)"/>
        <g clipPath="url(#cnScr)">
        <rect x="140" y="48" width="30" height="244" fill="#FFFFFF" opacity=".6" transform="rotate(20 155 170)"/>
        <rect x="182" y="48" width="12" height="244" fill="#FFFFFF" opacity=".4" transform="rotate(20 188 170)"/>
        <g className="cnSweep"><rect x="104" y="48" width="44" height="244" fill="#FFFFFF" opacity=".25" transform="rotate(20 126 170)"/></g>
        </g>
        </g>
        <rect className="cnRing cnSt" x="76" y="54" width="408" height="232" rx="30" fill="none" stroke="#00E5FF" strokeWidth="8"/>

        <g className="cnPlay cnSt"><g className="cnPulse">
        <circle cx="280" cy="170" r="56" fill="#FFFFFF" opacity=".96"/>
        <path d="M262 140l52 30-52 30z" fill="url(#cnOr)"/>
        </g></g>
        <circle className="cnRing2 cnSt" cx="280" cy="170" r="56" fill="none" stroke="#FF8A00" strokeWidth="8"/>

        {/* эталон человека, заказчик 23.09.2026 */}
        <g className="cnFig cnSt"><g transform="translate(566 334) scale(1.9)">
          <PersonCanon kid hair="pony" hairColor="#8E3F1F" top="#0A7CFF" pants="#27305A" shadow={false} />
        </g></g>

        <g className="cnBuck cnSt">
        <path d="M100 266h80l-12 76a8 8 0 0 1-8 7h-40a8 8 0 0 1-8-7z" fill="url(#cnYe)" stroke="#172363" strokeWidth="6" strokeLinejoin="round"/>
        <g clipPath="url(#cnBk)"><rect x="118" y="258" width="17" height="98" fill="#FFFFFF" opacity=".6"/><rect x="146" y="258" width="17" height="98" fill="#FFFFFF" opacity=".45"/></g>
        </g>
        <circle className="cnKern cnN1 cnSt" cx="106" cy="258" r="14" fill="#FFF6D8" stroke="#172363" strokeWidth="5"/>
        <circle className="cnKern cnN2 cnSt" cx="176" cy="258" r="13" fill="#FFF6D8" stroke="#172363" strokeWidth="5"/>
        <circle className="cnKern cnN3 cnSt" cx="132" cy="246" r="16" fill="#FFFFFF" stroke="#172363" strokeWidth="5"/>
        <circle className="cnKern cnN4 cnSt" cx="158" cy="248" r="15" fill="#FFF6D8" stroke="#172363" strokeWidth="5"/>
        <circle className="cnKern cnN5 cnSt" cx="145" cy="226" r="13" fill="#FFFFFF" stroke="#172363" strokeWidth="5"/>

        <path className="cnSpk cnS1 cnSt" d="M600 83l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="cnSpk cnS2 cnSt" d="M60 165l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="cnSpk cnS3 cnSt" cx="624" cy="196" r="7" fill="#00E0A4"/>
        <circle className="cnSpk cnS4 cnSt" cx="466" cy="344" r="7" fill="#FF3D9A"/>
        <circle className="cnSpk cnS5 cnSt" cx="512" cy="72" r="6" fill="#C24BFF"/>
      </g>

    </>
  ),
  // Пишешь друзьям: двое друзей по краям кадра держат телефоны, между ними две дуги бегущего пунктира — по верхней летит зелёный пузырь сообщения вправо, по нижней синий пузырь-ответ влево; когда сообщение доходит, экран второго телефона вспыхивает.
  write: (
    <>
      <g className="wfGo">
        <defs>
        <linearGradient id="wfPu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D48CFF"/><stop offset="1" stopColor="#7A1FE0"/></linearGradient>
        <linearGradient id="wfOr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC53D"/><stop offset="1" stopColor="#FF6A00"/></linearGradient>
        <linearGradient id="wfGr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6BF5B8"/><stop offset="1" stopColor="#0B9A5E"/></linearGradient>
        <linearGradient id="wfBl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5CE7FF"/><stop offset="1" stopColor="#0A7CFF"/></linearGradient>
        <linearGradient id="wfSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE0BE"/><stop offset="1" stopColor="#F3BE8C"/></linearGradient>
        <clipPath id="wfCard"><rect x="40" y="30" width="600" height="330" rx="34"/></clipPath>
        <clipPath id="wfH1"><circle cx="128" cy="208" r="32"/></clipPath>
        <clipPath id="wfH2"><circle cx="552" cy="208" r="32"/></clipPath>
        <clipPath id="wfC1"><circle cx="128" cy="270" r="44"/></clipPath>
        <clipPath id="wfC2"><circle cx="552" cy="270" r="44"/></clipPath>
        <clipPath id="wfSl"><rect x="190" y="208" width="32" height="66" rx="8"/></clipPath>
        <clipPath id="wfSr"><rect x="458" y="208" width="32" height="66" rx="8"/></clipPath>
        </defs>

        <rect x="46" y="42" width="588" height="326" rx="34" fill="#8FA8D8" opacity=".3"/>
        <rect x="40" y="30" width="600" height="330" rx="34" fill="#F2F8FF"/>
        <g clipPath="url(#wfCard)">
        <ellipse cx="196" cy="118" rx="180" ry="124" fill="#B6ECFF"/>
        <ellipse cx="504" cy="268" rx="182" ry="118" fill="#A9F5D8"/>
        <ellipse cx="470" cy="90" rx="128" ry="86" fill="#E5C4FF" opacity=".8"/>
        </g>

        <ellipse className="wfShad wfSt" cx="132" cy="322" rx="34" ry="8" fill="#4E6BA8" opacity=".28"/>
        <ellipse className="wfShad wfSt" cx="548" cy="322" rx="34" ry="8" fill="#3C8F76" opacity=".28"/>

        {/* эталон человека, заказчик 23.09.2026 */}
        {/* Рука-«держатель» у эталона своя (поза point), кисть уходит под телефон,
            поэтому отдельных линий-рук wfArm больше нет. */}
        <g className="wfFig wfG1 wfSt"><g transform="translate(128 320) scale(1.9)">
          <PersonCanon kid pose="point" hair="short" hairColor="#7A3E1F" skin="mid" top="#7A1FE0" pants="#27305A" shadow={false} />
        </g></g>

        <g className="wfFig wfG2 wfSt"><g transform="translate(552 320) scale(-1.9 1.9)">
          <PersonCanon kid pose="point" hair="long" hairColor="#2B2B33" skin="dark" top="#FF6A00" pants="#3B2F6B" shadow={false} />
        </g></g>

        <g className="wfDev wfD1 wfSt">
        <rect x="178" y="196" width="56" height="90" rx="16" fill="#172363"/>
        <rect x="185" y="203" width="42" height="76" rx="11" fill="#FFFFFF"/>
        <rect x="190" y="208" width="32" height="66" rx="8" fill="url(#wfBl)"/>
        <rect x="196" y="218" width="20" height="8" rx="4" fill="#FFFFFF" opacity=".9"/>
        <rect x="196" y="232" width="14" height="8" rx="4" fill="#FFFFFF" opacity=".7"/>
        <rect x="196" y="246" width="18" height="8" rx="4" fill="#FFFFFF" opacity=".55"/>
        <g clipPath="url(#wfSl)"><rect x="196" y="200" width="12" height="84" fill="#FFFFFF" opacity=".5" transform="rotate(20 202 241)"/><rect x="212" y="200" width="6" height="84" fill="#FFFFFF" opacity=".34" transform="rotate(20 215 241)"/></g>
        </g>
        <rect className="wfRing wfSt" x="178" y="196" width="56" height="90" rx="16" fill="none" stroke="#00E5FF" strokeWidth="7"/>

        <g className="wfDev wfD2 wfSt"><g className="wfBump">
        <rect x="446" y="196" width="56" height="90" rx="16" fill="#172363"/>
        <rect x="453" y="203" width="42" height="76" rx="11" fill="#FFFFFF"/>
        <rect x="458" y="208" width="32" height="66" rx="8" fill="url(#wfGr)"/>
        <rect x="464" y="218" width="20" height="8" rx="4" fill="#FFFFFF" opacity=".9"/>
        <rect x="464" y="232" width="14" height="8" rx="4" fill="#FFFFFF" opacity=".7"/>
        <rect className="wfFlash" x="458" y="208" width="32" height="66" rx="8" fill="#FFFFFF" opacity="0"/>
        <g clipPath="url(#wfSr)"><rect x="464" y="200" width="12" height="84" fill="#FFFFFF" opacity=".5" transform="rotate(20 470 241)"/><rect x="480" y="200" width="6" height="84" fill="#FFFFFF" opacity=".34" transform="rotate(20 483 241)"/></g>
        </g></g>

        <path className="wfArc wfK1 wfSt" d="M232 192Q340 78 448 192" fill="none" stroke="#0B9A5E" strokeWidth="8" strokeLinecap="round"/>
        <path className="wfArc wfK2 wfSt" d="M448 254Q340 350 232 254" fill="none" stroke="#0A7CFF" strokeWidth="8" strokeLinecap="round"/>

        <g className="wfBub wfB1 wfSt">
        <path d="M218 124h64a24 24 0 0 1 24 24v36a24 24 0 0 1-24 24h-28l-26 26 14-26h-24a24 24 0 0 1-24-24v-36a24 24 0 0 1 24-24z" fill="url(#wfGr)" stroke="#172363" strokeWidth="6" strokeLinejoin="round"/>
        <rect x="212" y="142" width="76" height="12" rx="6" fill="#FFFFFF" opacity=".95"/>
        <rect x="212" y="164" width="52" height="12" rx="6" fill="#FFFFFF" opacity=".8"/>
        </g>
        <g className="wfBub wfB2 wfSt">
        <path d="M420 240h44a22 22 0 0 1 22 22v28a22 22 0 0 1-22 22h-8l10 22-26-22h-20a22 22 0 0 1-22-22v-28a22 22 0 0 1 22-22z" fill="url(#wfBl)" stroke="#172363" strokeWidth="6" strokeLinejoin="round"/>
        <rect x="414" y="256" width="58" height="11" rx="5.5" fill="#FFFFFF" opacity=".95"/>
        <rect x="414" y="274" width="38" height="11" rx="5.5" fill="#FFFFFF" opacity=".8"/>
        </g>
        <path className="wfPing" d="M476 295l6 13 13 6-13 6-6 13-6-13-13-6 13-6z" fill="#FFD200"/>

        <path className="wfSpk wfS1 wfSt" d="M608 93l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="#FFD200"/>
        <path className="wfSpk wfS2 wfSt" d="M66 119l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#FFD200"/>
        <circle className="wfSpk wfS3 wfSt" cx="622" cy="214" r="7" fill="#00E0A4"/>
        <circle className="wfSpk wfS4 wfSt" cx="340" cy="52" r="7" fill="#FF3D9A"/>
        <circle className="wfSpk wfS5 wfSt" cx="112" cy="80" r="6" fill="#C24BFF"/>
      </g>

    </>
  ),
  // Строка поиска: вопрос набирается по буквам, нажимается кнопка, приходят три ответа,
  // лупа наводится и подсвечивает подходящий.
  // Перенесено из how-to-search.html (заказчик, 2026-08-06). Набор текста в демо вёл JS
  // побуквенно; здесь буквы открывает clipPath, ширина которого едет steps(21) — в наборе
  // сцен нет своего JS, только разметка и CSS.
  search: (
    <>
      <defs>
        <linearGradient id="hsI0" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#5CDDFF" /><stop offset="1" stopColor="#1F80EA" /></linearGradient>
        <linearGradient id="hsI1" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#D28AFF" /><stop offset="1" stopColor="#7A34C4" /></linearGradient>
        <linearGradient id="hsI2" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#7BF5C8" /><stop offset="1" stopColor="#17A97C" /></linearGradient>
        <clipPath id="hsIn"><rect width="640" height="400" rx="24" /></clipPath>
        <clipPath id="hsType"><rect className="hs-typebox" x="126" y="50" width="0" height="32" /></clipPath>
      </defs>
      <rect width="680" height="440" rx="34" fill="#FFFFFF" />
      <g transform="translate(20,20)">
        <rect width="640" height="400" rx="24" fill="#F1F6FE" />
        <g clipPath="url(#hsIn)">
          <ellipse className="hs-blob" cx="140" cy="90" rx="200" ry="120" fill="#BAEEFD" />
          <ellipse className="hs-blob" cx="510" cy="70" rx="155" ry="95" fill="#E5C7FD" />
          <ellipse className="hs-blob" cx="480" cy="330" rx="190" ry="125" fill="#AFFED8" />
        </g>

        <g className="hs-bar">
          <rect x="50" y="34" width="540" height="66" rx="33" fill="#171E60" />
          <rect x="57" y="41" width="526" height="52" rx="26" fill="#fff" />
          <g stroke="#171E60" strokeWidth="4.5" fill="none" strokeLinecap="round">
            <circle cx="94" cy="63" r="12" /><path d="M103 72l10 10" />
          </g>
          <g clipPath="url(#hsType)">
            <text x="128" y="74" fontFamily="Manrope, system-ui, sans-serif" fontSize="21" fontWeight="700" fill="#2B2F3A">Почему небо голубое?</text>
          </g>
          <rect className="hs-caret" x="128" y="53" width="3" height="24" rx="1.5" fill="#171E60" />
          <circle className="hs-ripple" cx="546" cy="67" r="26" fill="none" stroke="#F0442E" strokeWidth="4" />
          <g className="hs-btn">
            <circle cx="546" cy="67" r="26" fill="#F0442E" />
            <g stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round">
              <circle cx="543" cy="64" r="9" /><path d="M550 71l7 7" />
            </g>
          </g>
        </g>

        <g className="hs-dots">
          <circle cx="300" cy="215" r="9" fill="#171E60" />
          <circle cx="326" cy="215" r="9" fill="#171E60" />
          <circle cx="352" cy="215" r="9" fill="#171E60" />
        </g>

        <g className="hs-res hs-r0">
          <rect x="50" y="142" width="540" height="70" rx="20" fill="#fff" />
          <rect className="hs-pick" x="50" y="142" width="540" height="70" rx="20" fill="none" stroke="#17A97C" strokeWidth="4" />
          <rect x="70" y="158" width="38" height="38" rx="12" fill="url(#hsI0)" />
          <rect x="126" y="163" width="300" height="11" rx="5.5" fill="#D6DEEC" />
          <rect x="126" y="183" width="196" height="9" rx="4.5" fill="#E4E9F2" />
          <g className="hs-pick">
            <circle cx="558" cy="177" r="15" fill="#17A97C" />
            <path d="M551 177.5l5 5 9-9.5" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <g className="hs-res hs-r1">
          <rect x="50" y="228" width="540" height="70" rx="20" fill="#fff" />
          <rect x="70" y="244" width="38" height="38" rx="12" fill="url(#hsI1)" />
          <rect x="126" y="249" width="256" height="11" rx="5.5" fill="#D6DEEC" />
          <rect x="126" y="269" width="164" height="9" rx="4.5" fill="#E4E9F2" />
        </g>
        <g className="hs-res hs-r2">
          <rect x="50" y="314" width="540" height="70" rx="20" fill="#fff" />
          <rect x="70" y="330" width="38" height="38" rx="12" fill="url(#hsI2)" />
          <rect x="126" y="335" width="284" height="11" rx="5.5" fill="#D6DEEC" />
          <rect x="126" y="355" width="140" height="9" rx="4.5" fill="#E4E9F2" />
        </g>

        <g className="hs-lens">
          <circle r="34" fill="#BAEEFD" opacity=".45" />
          <circle r="34" fill="none" stroke="#171E60" strokeWidth="7" />
          <path d="M24 24l22 22" stroke="#171E60" strokeWidth="11" strokeLinecap="round" />
          <path d="M-16 -8a18 18 0 0 1 12-12" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".8" />
        </g>
      </g>

    </>
  )
};

// Общего <defs> здесь нет: каждая сцена объявляет свои градиенты и clipPath сама,
// с собственным двухбуквенным префиксом в id — так они размонтируются вместе со
// сценой и не могут перебить заливку соседней.
// viewBox 680×400 — система координат слайдов заказчика (была 680×420).
const SceneArt = ({ name }) => (
  <svg className="art" viewBox="0 0 680 400" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
    {ART[name] || null}
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// ЭКРАН 1 — ЗНАКОМСТВО. Без пузырька: персонаж крупно + слушаем.
// Чем занят экран вместо текста:
//   · персонаж во весь кадр (--av-hero), тёплое пятно-подсветка в его цвете
//   · кольца речи, пока идёт голос  · дуга по длине фразы (не «зависло ли?»)
//   · каст-строка снизу: кто говорит, кто уже выступил, сколько всего
// Текст возвращается сам, если голоса фактически нет (audio.failed).
// ─────────────────────────────────────────────────────────────────────────────
// hold — дев-режим: не уезжать с экрана автоматически. Нужен, чтобы можно было
// спокойно смотреть анимации и арт первого экрана. В продакшене не передаётся.
function ScreenIntro({ onNext, bounce, hold }) {
  const pick = usePick();
  const lang = useLang();
  const audio = useAudio();
  const c = C.intro;
  const [i, setI] = useState(bounce ? c.cast.length - 1 : 0);
  const [leaving, setLeaving] = useState(false);
  const [replay, setReplay] = useState(0);
  const guard = useRef(false);
  const cur = c.cast[i];
  const line = pick(cur.say);
  const dur = estimateMs(line);
  // Ряд каста — список УНИКАЛЬНЫХ персонажей в порядке первого выхода.
  const castRow = useMemo(() => {
    const seen = [];
    c.cast.forEach((m) => { if (seen.indexOf(m.who) < 0) seen.push(m.who); });
    return seen;
  }, [c.cast]);
  // Кто уже говорил до текущей реплики — их кружки тусклые, но не погасшие.
  const spokenWho = useMemo(() => new Set(c.cast.slice(0, i).map((m) => m.who)), [c.cast, i]);

  useEffect(() => () => { guard.current = true; }, []);

  const step = useCallback(async (nextIdx) => {
    setLeaving(true);
    await sleep(280);
    if (guard.current) return;
    if (nextIdx < c.cast.length) { setI(nextIdx); setLeaving(false); }
    else { guard.current = true; onNext(); }
  }, [c.cast.length, onNext]);

  useEffect(() => {
    if (guard.current) return;
    let dead = false;
    (async () => {
      if (bounce) { await sleep(700); if (!dead) { guard.current = true; onNext(); } return; }
      await say(audio, line, VOICE[cur.who]);
      if (dead || hold) return;
      await sleep(cur.after);
      if (!dead) step(i + 1);
    })();
    return () => { dead = true; };
  }, [i, replay, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const again = () => {
    if (leaving || bounce) return;
    sfx('tap', true);
    if (audio) audio.stop();
    setReplay((n) => n + 1);
  };

  const speaking = !!(audio && audio.playing);

  return (
    <Stage eyebrow={c.eyebrow} screen={0} total={TOTAL}>
      <div className={'hero-zone hero-' + cur.who + (leaving ? ' is-out' : '')} key={i}>
        <div className="hero-glow" aria-hidden="true" />

        <div className="hero-figure">
          {/* дуга: заполняется за длину реплики — видно, что персонаж ещё говорит */}
          <svg className="hero-halo hero-arc" viewBox="0 0 100 100" aria-hidden="true">
            <circle className="hero-arc-track" cx="50" cy="50" r="47" pathLength="100" />
            <circle className="hero-arc-fill" cx="50" cy="50" r="47" pathLength="100"
              style={{ animationDuration: dur + 'ms' }} key={i + '-' + replay} />
          </svg>
          <span className={'hero-halo hero-rings' + (speaking ? ' is-speaking' : '')} aria-hidden="true" />
          <img className="hero-av" src={POSES[cur.pose]} alt="" draggable="false" />
        </div>

        <div className="hero-name">
          <span>{pick(CHAR_NAME[cur.who])}</span>
          <button type="button" className="hero-say" onClick={again}
            title={pick(c.replay)} aria-label={pick(c.replay)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            </svg>
          </button>
        </div>

        {/* Голоса нет — текст обязан появиться, иначе экран ничего не сообщает */}
        {audio && audio.failed && <p className="hero-fallback">{line}</p>}

        {/* Каст: кто говорит сейчас, кто уже выступил.
            КАЖДЫЙ ПЕРСОНАЖ РОВНО ОДИН РАЗ (заказчик, 2026-08-06: «удали третьего
            персонажа Симку»). Реплик по-прежнему три — Симка говорит первой и
            третьей, — но в ряду она не двоится: её кружок просто загорается
            второй раз. Ряд лежит во флексе с выравниванием по центру, поэтому
            после удаления третьего кружка композиция центрируется сама, а
            расстояние между кружками (gap) остаётся прежним. */}
        <div className="hero-cast" aria-hidden="true">
          {castRow.map((who) => (
            <span key={who} className={'hero-dot'
              + (who === cur.who ? ' is-now' : (spokenWho.has(who) ? ' is-done' : ''))}>
              <img src={POSES[who === 'nolik' ? 'N_face' : 'S_face']} alt="" draggable="false" />
            </span>
          ))}
        </div>
      </div>
    </Stage>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UI-ТУР
// ─────────────────────────────────────────────────────────────────────────────
function useTourStep(step, onDone) {
  const pick = usePick();
  const audio = useAudio();
  const lang = useLang();
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; });
  useEffect(() => {
    if (!step) return;
    let dead = false;
    (async () => {
      if (step.auto) await say(audio, pick(step.text), 'f');
      else if (audio) await audio.speak(pick(step.text), 'f');
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
    <div className="uid reveal-rows">
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

function ScreenTour1({ onNext, onBackDemo, backDone }) {
  const pick = usePick();
  const audio = useAudio();
  const c = C.tour1;
  const [step, setStep] = useState(backDone ? 1 : 0);
  const cur = c.steps[step] || null;
  useTourStep(cur, useCallback(() => setStep((s) => s + 1), []));
  return (
    <Stage
      eyebrow={c.eyebrow} screen={1} total={TOTAL} done={step >= 1}
      nav={<><BackBtn onPrev={onBackDemo} /><NextBtn disabled={step < 1} onClick={() => { if (audio) audio.stop(); onNext(); }} /></>}
      overlay={cur ? <CoachMark selector={cur.sel} icon={cur.icon} title={cur.title} text={cur.text} nonce={step} /> : null}
    >
      <h1 className="h1">{pick(c.title)}</h1>
      <p className="lead">{pick(c.lead)}</p>
      <TourList steps={c.steps} step={step} done={false} />
    </Stage>
  );
}

const TOUR2_STEPS = OZVUCHKA_VYKL
  ? C.tour2.steps.filter((s) => s.id !== 'pause').map((s) => (s.textBezPauzy ? { ...s, text: s.textBezPauzy } : s))
  : C.tour2.steps;
const TOUR2_LEAD = OZVUCHKA_VYKL ? C.tour2.leadBezPauzy : C.tour2.lead;

function ScreenTour2({ onNext, onPrev }) {
  const pick = usePick();
  const audio = useAudio();
  const c = C.tour2;
  const [step, setStep] = useState(0);
  const finished = step >= TOUR2_STEPS.length;
  const cur = finished ? null : TOUR2_STEPS[step];
  // ШАГ ПАУЗЫ ЗАСЧИТЫВАЕТСЯ ТОЛЬКО ЗА ДВА НАЖАТИЯ: ребёнок должен на практике
  // понять, что пауза — переключатель и урок сам не продолжится. Считаем нажатия
  // по pauseCount движка, а не своим обработчиком: кнопка живёт в шапке Stage, и
  // тур не должен знать, как она устроена. База берётся на входе в шаг, иначе
  // нажатия с других экранов зачлись бы за пройденный шаг.
  const pauseCount = (audio && audio.pauseCount) || 0;
  const base = useRef(null);
  const isPause = !!cur && cur.id === 'pause';
  useEffect(() => { if (isPause && base.current === null) base.current = pauseCount; }, [isPause, pauseCount]);
  const hits = isPause && base.current !== null ? pauseCount - base.current : 0;
  useEffect(() => {
    if (isPause && hits >= 2) setStep((s) => s + 1);
  }, [isPause, hits]);
  useTourStep(cur, useCallback(() => setStep((s) => s + 1), []));
  // Текст подсказки меняется после первого нажатия — это тот же шаг, не новый.
  const coachText = isPause && hits >= 1 ? cur.text2 : (cur && cur.text);
  const [bubble, sayIt] = useSpeaker('simka', 'S_thumb', '');
  const once = useRef(false);
  useEffect(() => {
    if (finished && !once.current) { once.current = true; sayIt(c.done, 'S_thumb'); }
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Stage
      eyebrow={c.eyebrow} screen={2} total={TOTAL} done={finished}
      speaker={finished ? toSpeaker(bubble) : undefined}
      nav={<><BackBtn onPrev={onPrev} /><NextBtn disabled={!finished} onClick={onNext} /></>}
      overlay={cur ? <CoachMark selector={cur.sel} icon={cur.icon} title={cur.title} text={coachText}
        nonce={step * 10 + Math.min(hits, 1)}
        tappable={!isPause} onTap={isPause ? undefined : () => setStep((s) => s + 1)} /> : null}
    >
      <h1 className="h1">{pick(c.title)}</h1>
      <p className="lead">{pick(TOUR2_LEAD)}</p>
      <TourList steps={TOUR2_STEPS} step={step} done={finished} />
    </Stage>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// СЦЕНА «ЧТО ТАКОЕ ИНТЕРНЕТ» — экран 4. Перенесена из internet-picture.html
// (заказчик, 2026-08-06) вместе с техзаданием prompt-internet-scene.md.
// Пропорции устройств, цвета градиентов и порядок шагов оттуда — на глаз здесь
// ничего не правится.
//
// ЧТО ИЗ ДЕМО-ФАЙЛА НЕ ПЕРЕНЕСЕНО, намеренно:
//   · пульт .ctrl («Показать сначала», «К нитям», «Убрать фон») — он был нужен
//     для отладки тайминга;
//   · стили body (бежевый фон #F2EEE8, флекс-центрирование) — у урока свой фон
//     и своя сетка, эти правила её ломают;
//   · автозапуск reset()+play() в конце скрипта — сцена стартует не при загрузке,
//     а по репликам;
//   · подключение Nunito — урок уже грузит свои шрифты.
//
// ИДЕНТИФИКАТОРЫ ЗАСКОУПЛЕНЫ. В демо скрипт обращался к элементам через неявные
// глобальные переменные (pic, dComp, dTab, dPho, packets) — в приложении так
// нельзя: имена столкнутся с чужими. Здесь узлы ищутся внутри своего корня по
// ref, а id градиентов и обрезок несут префикс ip.
//
// ШАГИ ИДУТ ОТ РЕПЛИК, А НЕ ОТ ТАЙМЕРОВ ДЕМО. Жёсткие задержки at(1000)…at(6100)
// заменены полем step у реплики: ScreenDialog доводит сцену до нужного шага, а
// внутри длинной реплики раскладывает шаги по словам (см. STEP_LEAD/STEP_GAP).
//   0 — пусто            1 — выехала карточка с пятнами
//   2 — большой компьютер 3 — компьютер уменьшился и уехал влево вниз
//   4 — планшет           5 — телефон
//   6 — нити              7 — по нитям побежали кружки
// ─────────────────────────────────────────────────────────────────────────────
const NET_POS = {
  compHide: [320, 150, 0.2], compBig: [320, 150, 1.75], compSmall: [140, 232, 1],
  tabHide: [335, 118, 0.2], tab: [335, 118, 1.08],
  phoHide: [515, 232, 0.2], pho: [515, 232, 1]
};
const netTf = (p) => 'translate(' + p[0] + 'px,' + p[1] + 'px) scale(' + p[2] + ')';
// Маршруты кружков: компьютер → планшет → телефон → компьютер. Координаты те же,
// что у нитей, иначе кружки поедут мимо дорожки.
const NET_ROUTES = [
  { path: 'M206 206 L270 172', dur: 1.3 },
  { path: 'M404 168 L470 200', dur: 1.3 },
  { path: 'M466 258 L208 256', dur: 2.6 }
];

function NetworkArt({ step }) {
  const root = useRef(null);

  // Кружки бегут только на последнем шаге. begin="indefinite" — запуск отсюда,
  // по два на нить со сдвигом в половину длительности, как в исходном файле.
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const anims = Array.prototype.slice.call(el.querySelectorAll('animateMotion'));
    if (step < 7) {
      anims.forEach((m) => { try { m.endElement(); } catch (e) { /* no-op */ } });
      return undefined;
    }
    const timers = anims.map((m, k) => setTimeout(() => {
      try { m.beginElement(); } catch (e) { /* no-op */ }
    }, (k % 2) * NET_ROUTES[Math.floor(k / 2)].dur * 500));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  // КАРТОЧКА СТОИТ С САМОГО НАЧАЛА (заказчик, 2026-08-06: «чтобы до начала не
  // было пусто»). В демо-файле шаг 0 — пустой кадр, и первая реплика Симки шла
  // на белом месте. Теперь на нулевом шаге карточка с пятнами уже на экране, а
  // устройства по-прежнему выходят под слова. Отсюда is-on от step >= 0.
  const comp = step < 2 ? NET_POS.compHide : (step < 3 ? NET_POS.compBig : NET_POS.compSmall);
  const tab = step < 4 ? NET_POS.tabHide : NET_POS.tab;
  const pho = step < 5 ? NET_POS.phoHide : NET_POS.pho;

  return (
    <svg ref={root} className={'art ip is-on' + (step >= 6 ? ' is-wired' : '')}
      viewBox="0 0 680 440" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ipBlue" x1="0" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#5CDDFF" /><stop offset="1" stopColor="#1F80EA" /></linearGradient>
        <linearGradient id="ipPurp" x1="0" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#D28AFF" /><stop offset="1" stopColor="#7A34C4" /></linearGradient>
        <linearGradient id="ipOr" x1="0" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#FFC04A" /><stop offset="1" stopColor="#FF7501" /></linearGradient>
        <clipPath id="ipLap"><rect x="-57" y="-38" width="114" height="76" rx="13" /></clipPath>
        <clipPath id="ipTab"><rect x="-57" y="-45" width="114" height="90" rx="17" /></clipPath>
        <clipPath id="ipPho"><rect x="-36" y="-49" width="72" height="98" rx="18" /></clipPath>
        <clipPath id="ipIn"><rect width="640" height="400" rx="24" /></clipPath>
      </defs>

      <g className="ip-card">
        <rect width="680" height="440" rx="34" fill="#FFFFFF" />
        <g transform="translate(20,20)">
          <rect width="640" height="400" rx="24" fill="#F1F6FE" />

          <g className="ip-blobs">
            <g clipPath="url(#ipIn)">
              <ellipse cx="195" cy="120" rx="215" ry="140" fill="#BAEEFD" />
              <ellipse cx="470" cy="95" rx="165" ry="105" fill="#E5C7FD" />
              <ellipse cx="480" cy="300" rx="185" ry="135" fill="#AFFED8" />
            </g>
            <path className="ip-spark" d="M54 122l7 16 16 7-16 7-7 16-7-16-16-7 16-7z" fill="#FFD639" />
            <path className="ip-spark" d="M578 92l7 16 16 7-16 7-7 16-7-16-16-7 16-7z" fill="#FFD639" />
            <circle cx="232" cy="152" r="6" fill="#B349F0" />
            <circle cx="442" cy="112" r="6" fill="#12D69C" />
            <circle cx="398" cy="352" r="6" fill="#E0338A" />
          </g>

          {/* НИТИ. Рисуются под устройствами, поэтому линия выходит из-за корпуса. */}
          <g className="ip-wires">
            <g className="ip-wire w1">
              <line className="base" x1="206" y1="206" x2="270" y2="172" stroke="#1F80EA" strokeWidth="7" strokeLinecap="round" pathLength="1" />
              <line className="dash" x1="206" y1="206" x2="270" y2="172" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="9 11" />
            </g>
            <g className="ip-wire w2">
              <line className="base" x1="404" y1="168" x2="470" y2="200" stroke="#7A34C4" strokeWidth="7" strokeLinecap="round" pathLength="1" />
              <line className="dash" x1="404" y1="168" x2="470" y2="200" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="9 11" />
            </g>
            <g className="ip-wire w3">
              <line className="base" x1="466" y1="258" x2="208" y2="256" stroke="#FF7501" strokeWidth="7" strokeLinecap="round" pathLength="1" />
              <line className="dash" x1="466" y1="258" x2="208" y2="256" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="9 11" />
            </g>
          </g>

          {/* КОМПЬЮТЕР */}
          <g className={'ip-dev' + (step >= 2 ? ' show' : '')} style={{ transform: netTf(comp) }}>
            <ellipse cx="0" cy="86" rx="82" ry="11" fill="#5B6BA8" opacity=".18" />
            <rect x="-70" y="-51" width="140" height="102" rx="24" fill="#171E60" />
            <rect x="-62" y="-43" width="124" height="86" rx="18" fill="#fff" />
            <g clipPath="url(#ipLap)">
              <rect x="-57" y="-38" width="114" height="76" fill="url(#ipBlue)" />
              <path d="M-13 -60 L16 -60 L-26 60 L-55 60 Z" fill="#fff" opacity=".42" />
              <path d="M22 -60 L31 -60 L-11 60 L-20 60 Z" fill="#fff" opacity=".26" />
            </g>
            <rect x="-88" y="51" width="176" height="21" rx="10.5" fill="#171E60" />
            <rect x="-78" y="54" width="156" height="10" rx="5" fill="#3FC4DF" />
          </g>

          {/* ПЛАНШЕТ */}
          <g className={'ip-dev' + (step >= 4 ? ' show' : '')} style={{ transform: netTf(tab) }}>
            <ellipse cx="0" cy="72" rx="62" ry="10" fill="#5B6BA8" opacity=".18" />
            <rect x="-70" y="-58" width="140" height="116" rx="30" fill="#171E60" />
            <rect x="-62" y="-50" width="124" height="100" rx="23" fill="#fff" />
            <g clipPath="url(#ipTab)">
              <rect x="-57" y="-45" width="114" height="90" fill="url(#ipPurp)" />
              <path d="M-13 -60 L16 -60 L-26 60 L-55 60 Z" fill="#fff" opacity=".40" />
              <path d="M22 -60 L31 -60 L-11 60 L-20 60 Z" fill="#fff" opacity=".26" />
            </g>
          </g>

          {/* ТЕЛЕФОН */}
          <g className={'ip-dev' + (step >= 5 ? ' show' : '')} style={{ transform: netTf(pho) }}>
            <ellipse cx="0" cy="76" rx="46" ry="9" fill="#5B6BA8" opacity=".18" />
            <rect x="-49" y="-62" width="98" height="124" rx="30" fill="#171E60" />
            <rect x="-41" y="-54" width="82" height="108" rx="23" fill="#fff" />
            <g clipPath="url(#ipPho)">
              <rect x="-36" y="-49" width="72" height="98" fill="url(#ipOr)" />
              <path d="M1 -66 L23 -66 L-23 66 L-45 66 Z" fill="#fff" opacity=".42" />
              <path d="M28 -66 L35 -66 L-11 66 L-18 66 Z" fill="#fff" opacity=".26" />
            </g>
          </g>

          {/* КРУЖКИ-СООБЩЕНИЯ. По два на нить: второй стартует на полпути первого. */}
          <g className={'ip-pkts' + (step >= 7 ? ' go' : '')}>
            {NET_ROUTES.map((r, i) => [0, 1].map((j) => (
              <g className="ip-pkt" key={i + '-' + j}>
                <circle r="13" fill="#fff" opacity=".35" />
                <circle r="7.5" fill="#fff" />
                <circle r="7.5" fill="none" stroke="#1C1F4E" strokeOpacity=".14" strokeWidth="1.5" />
                <animateMotion path={r.path} dur={r.dur + 's'} repeatCount="indefinite" begin="indefinite" />
              </g>
            )))}
          </g>
        </g>
      </g>
    </svg>
  );
}

// Выход устройств отсчитывается от НАЧАЛА реплики, а не от монтирования экрана.
// lead у реплики задаёт первое устройство, дальше шаг DEV_STEP, дорожки — через
// NET_LAG после последнего устройства (иначе линии успевали бы прочертиться
// раньше, чем появится то, что они соединяют).
const STEP_LEAD = 700;  // если у реплики не задан свой lead
const STEP_GAP = 1000;  // «компьютеры, планшеты и телефоны» — примерно секунда на слово

// Диалог: реплики идут по очереди, говорящего показывает шапка Stage
// (Симка слева, Нолик справа — канон). Реплику на экран не печатаем, как и везде.
function ScreenDialog({ onNext, onPrev }) {
  const store = useStore();
  const c = C.dlg;
  const seen = !!store.get('dlgSeen');
  const last = c.beats.length - 1;
  const [i, setI] = useState(seen ? last : 0);
  const [done, setDone] = useState(seen);
  const idx = useRef(seen ? last : 0);

  // Кадр догоняет слова: у реплики есть ЦЕЛЬ (step), а до цели сцена едет по
  // таймерам ВНУТРИ самой реплики — по шагу на слово. Держим и в state (для
  // отрисовки), и в ref (цепочка асинхронная, на замыкание над state нельзя).
  // Повторный заход на экран показывает конечное состояние, а не пустую карточку.
  const [step, setStep] = useState(seen ? c.beats[last].step : c.beats[0].step);
  const stepRef = useRef(seen ? c.beats[last].step : c.beats[0].step);
  const audio = useAudio();
  const paused = !!(audio && audio.paused);

  const nextBeat = useCallback(() => {
    if (idx.current + 1 >= c.beats.length) { setDone(true); store.set('dlgSeen', true); return; }
    idx.current += 1;
    setI(idx.current);
  }, [c.beats.length, store]);

  // Зависимость — индекс реплики, а не её текст: отсчёт обязан начинаться заново
  // с каждой репликой. Если ребёнок ушёл «Назад» и вернулся, экран пересобирается
  // с нуля, а на повторном заходе (seen) обе цели уже достигнуты и цепочка пуста.
  useEffect(() => {
    const target = c.beats[i];
    let dead = false;
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(() => { if (!dead) fn(); }, ms));

    let t = target.lead != null ? target.lead : STEP_LEAD;
    for (let n = stepRef.current + 1; n <= target.step; n++) {
      const v = n;
      at(t, () => { stepRef.current = v; setStep(v); });
      t += STEP_GAP;
    }
    return () => { dead = true; timers.forEach(clearTimeout); };
    // paused в зависимостях НЕ случайно: на паузе эффект чистит свои таймеры,
    // а на снятии — заводит их заново от УЖЕ ДОСТИГНУТОГО шага (stepRef), а не
    // с начала реплики. Поэтому сцена не отматывается назад и не прыгает вперёд.
  }, [i, paused]); // eslint-disable-line react-hooks/exhaustive-deps

  const b = c.beats[i];
  return (
    <Stage eyebrow={c.eyebrow} screen={3} total={TOTAL} heroFixed done={done}
      speaker={{ who: b.who, pose: POSES[b.pose], text: b.say, onSpoken: nextBeat, nonce: i }}
      nav={<><BackBtn onPrev={onPrev} /><NextBtn disabled={!done} onClick={onNext} /></>}>
      <div className="netbox"><NetworkArt step={step} /></div>
      <SceneDots n={c.beats.length} i={i} />
    </Stage>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// «КАК ЛЕТИТ СООБЩЕНИЕ». Самолётик и пакет — два отдельных объекта в одной
// летящей группе: они не морфятся по-настоящему, а перекрёстно гаснут на
// середине пути. Морфинг path'ов ради двух секунд не окупается, а результат
// на глаз тот же. Перезапуск анимации — сменой key у группы: пересоздание
// узла единственный надёжный способ проиграть CSS-анимацию заново.
// ─────────────────────────────────────────────────────────────────────────────
// Экран 5 «Как летит сообщение» — слайд заказчика high_saturation_two_phones_transfer.
// Два телефона, по дорожке бегут три огонька, у получателя гаснет серая пелена (экран
// загорается), корпус слегка подпрыгивает и вылетают искры. Постановка урока сохранена:
// полёт запускает КНОПКА, а не таймер, и повторяется сколько угодно раз.
// Экран 5 «Как летит сообщение» — сцена заказчика send-message.html.
// Самолётик летит с телефона на телефон, на середине превращается в конверт, уходит
// в экран получателя, тот загорается и подпрыгивает, вылетают награды-искры.
// Постановка урока сохранена: полёт запускает КНОПКА и повторяет сколько угодно раз.
// phase — индекс в SEND_PHASES; классы накапливаются, как в исходном файле
// (.fly остаётся, когда добавляется .msg, и так далее), иначе перелёт оборвётся.
const FlightArt = ({ phase }) => (
  <svg className={'art snd ' + SEND_PHASES.slice(1, phase + 1).map((p) => 'is-' + p).join(' ')}
    viewBox="0 0 680 440" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
    <defs>
      {/* id с префиксом sm: в уроке уже живут id слайдов, ni* сети и lbg* фона */}
      <linearGradient id="smOn" x1="0" y1="0" x2=".85" y2="1">
        <stop offset="0" stopColor="#61F1FF" /><stop offset="1" stopColor="#2189F2" /></linearGradient>
      <linearGradient id="smOff" x1="0" y1="0" x2=".85" y2="1">
        <stop offset="0" stopColor="#AEB8D2" /><stop offset="1" stopColor="#71809E" /></linearGradient>
      <linearGradient id="smSms" x1="0" y1="0" x2=".4" y2="1">
        <stop offset="0" stopColor="#FDE08A" /><stop offset="1" stopColor="#F5BE3E" /></linearGradient>
      <radialGradient id="smGlow">
        <stop offset="0" stopColor="#FFC93C" stopOpacity=".45" />
        <stop offset="1" stopColor="#FFC93C" stopOpacity="0" /></radialGradient>
      <clipPath id="smScr"><rect x="-36" y="-63" width="72" height="126" rx="18" /></clipPath>
      <clipPath id="smIn"><rect width="640" height="400" rx="24" /></clipPath>
    </defs>

    <rect width="680" height="440" rx="34" fill="#FFFFFF" />
    <g transform="translate(20,20)">
      <rect width="640" height="400" rx="24" fill="#F1F6FE" />
      <g clipPath="url(#smIn)">
        <ellipse cx="175" cy="120" rx="215" ry="140" fill="#BAEEFD" />
        <ellipse cx="450" cy="80" rx="150" ry="92" fill="#E5C7FD" />
        <ellipse cx="450" cy="300" rx="190" ry="135" fill="#AFFED8" />
      </g>

      {/* пунктирная дорожка — она есть и до отправки: связь готова */}
      <line x1="230" y1="185" x2="410" y2="185" stroke="#7ADCFF" strokeWidth="7"
        strokeLinecap="round" strokeDasharray="17 15" />

      {/* ТЕЛЕФОН РЕБЁНКА — с него отправляют, экран горит всегда */}
      <g transform="translate(140,185) scale(1.6)">
        <ellipse cx="0" cy="92" rx="46" ry="9" fill="#5B6BA8" opacity=".18" />
        <rect x="-49" y="-76" width="98" height="152" rx="30" fill="#171E60" />
        <rect x="-41" y="-68" width="82" height="136" rx="23" fill="#fff" />
        <g clipPath="url(#smScr)">
          <rect x="-36" y="-63" width="72" height="126" fill="url(#smOn)" />
          <path d="M7 -84 L29 -84 L-29 84 L-51 84 Z" fill="#fff" opacity=".42" />
          <path d="M34 -84 L41 -84 L-17 84 L-24 84 Z" fill="#fff" opacity=".26" />
        </g>
      </g>

      {/* ТЕЛЕФОН ДРУГА — экран серый, пока сообщение не дошло */}
      <g transform="translate(500,185) scale(1.6)"><g className="sm-recv">
        <ellipse cx="0" cy="92" rx="46" ry="9" fill="#5B6BA8" opacity=".18" />
        <rect x="-49" y="-76" width="98" height="152" rx="30" fill="#171E60" />
        <rect x="-41" y="-68" width="82" height="136" rx="23" fill="#fff" />
        <g clipPath="url(#smScr)">
          <rect x="-36" y="-63" width="72" height="126" fill="url(#smOff)" />
          <rect className="sm-screen" x="-36" y="-63" width="72" height="126" fill="url(#smOn)" />
          <path d="M7 -84 L29 -84 L-29 84 L-51 84 Z" fill="#fff" opacity=".42" />
          <path d="M34 -84 L41 -84 L-17 84 L-24 84 Z" fill="#fff" opacity=".26" />
        </g>
      </g></g>

      {/* награды — вылетают, когда сообщение дошло */}
      <path className="sm-prize p3" d="M586 33l9 20 20 9-20 9-9 20-9-20-20-9 20-9z" fill="#FFD639" />
      <circle className="sm-prize p1" cx="285" cy="92" r="6.5" fill="#12D69C" />
      <circle className="sm-prize p2" cx="355" cy="122" r="6.5" fill="#E0338A" />

      {/* ЛЕТЯЩИЙ ОБЪЕКТ: самолётик на середине пути становится конвертом */}
      <g className="sm-flier">
        <circle className="sm-glow" r="46" fill="url(#smGlow)" />
        <g>
          <g className="sm-plane">
            <path d="M32 0 L-26 -23 L-13 0 L-26 23 Z" fill="#F1F6FF"
              stroke="#2B48D1" strokeWidth="5.5" strokeLinejoin="round" />
            <path d="M-13 0 L32 0" stroke="#2B48D1" strokeWidth="4.5" strokeLinecap="round" />
          </g>
          <g className="sm-sms">
            <rect x="-23" y="-17" width="46" height="34" rx="11"
              fill="url(#smSms)" stroke="#2B48D1" strokeWidth="5.5" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

// Фазы полёта. Классы НАКАПЛИВАЮТСЯ (см. FlightArt): .is-fly остаётся, когда
// добавляется .is-msg, иначе самолётик на середине пути дёрнется назад.
// Тайминги — из присланного send-message.html, менять их незачем.
const SEND_PHASES = ['idle', 'fly', 'msg', 'gone', 'lit', 'settled'];
const SEND_T = { fly: 0, msg: 800, gone: 1600, lit: 1680, settled: 2200, free: 2400 };

function ScreenSend({ onNext, onPrev }) {
  const pick = usePick();
  const audio = useAudio();
  const store = useStore();
  const c = C.travel;
  const seen = !!store.get('travelSeen');
  // Повторный заход на экран показывает конечное состояние, а не пустую сцену.
  const [phase, setPhase] = useState(seen ? SEND_PHASES.length - 1 : 0);
  const [busy, setBusy] = useState(false);
  const [arrived, setArrived] = useState(seen);
  const [ready, setReady] = useState(seen);   // Симка договорила вступление
  const [bubble, sayIt] = useSpeaker('simka', c.pose, seen ? c.done : c.say);
  const alive = useRef(true);
  const timers = useRef([]);
  useEffect(() => () => { alive.current = false; timers.current.forEach(clearTimeout); }, []);

  const send = useCallback(() => {
    if (busy) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setBusy(true);
    sfx('msg', true);
    // Сброс в idle и старт в СЛЕДУЮЩЕМ кадре: иначе при повторной отправке
    // самолётик поехал бы обратно на глазах. В idle он невидим (.is-gone уже
    // снят вместе с остальными), поэтому возврат в начало не виден.
    setPhase(0);
    const at = (ms, fn) => timers.current.push(setTimeout(() => { if (alive.current) fn(); }, ms));
    requestAnimationFrame(() => { if (alive.current) setPhase(1); });
    at(SEND_T.msg, () => setPhase(2));
    at(SEND_T.gone, () => setPhase(3));
    at(SEND_T.lit, () => {
      setPhase(4);
      setArrived(true);
      store.set('travelSeen', true);
      sfx('ok', true);
      sayIt(c.done, 'S_thumb', null);
    });
    at(SEND_T.settled, () => setPhase(5));
    at(SEND_T.free, () => setBusy(false));
  }, [busy, store, sayIt, c.done]);

  return (
    <Stage eyebrow={c.eyebrow} screen={4} total={TOTAL} done={arrived}
      speaker={toSpeaker({ ...bubble, then: ready ? bubble.then : () => setReady(true) })}
      nav={<><BackBtn onPrev={onPrev} /><NextBtn disabled={!arrived} onClick={onNext} /></>}>
      <div className="netbox"><FlightArt phase={phase} /></div>
      <button type="button" className="bigbtn" onClick={send}
        disabled={!ready || busy || !!(audio && audio.playing)}>
        {pick(arrived ? c.again : c.btn)}
      </button>
    </Stage>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// СЕТЬ ТОЧЕК — вступительная реплика экрана 6 «Интернет и я».
// Перенесена из internet-network.html (заказчик, 2026-08-06): пока Симка говорит
// «Сначала про интернет. Это огромный мир внутри экрана…», по сети от глобуса
// волной разбегается сигнал и зажигает каждый экранчик.
//
// ЧТО ИЗ ДЕМО НЕ ПЕРЕНЕСЕНО: пульт («Показать сначала», «Убрать фон»), стили
// body и бесконечный перезапуск play() в конце волны — реплика звучит один раз,
// и кадр отыгрывается один раз вместе с ней.
//
// ТАЙМЕРОВ ЗДЕСЬ НЕТ. В демо всю волну вёл setTimeout; тут порядок зашит в сами
// элементы: у точки переменная --l (на каком круге волны она загорается), у
// связи --s. Дальше всё делает CSS через animation-delay. Так кадр не зависит
// от ре-рендера и не оставляет за собой таймеров, если ребёнок ушёл со страницы.
// ─────────────────────────────────────────────────────────────────────────────
const NWV_NODES = [
  [80, 155, 32], [155, 72, 32], [170, 245, 32], [108, 332, 32],
  [252, 140, 32], [258, 322, 32], [325, 212, 44], [392, 88, 32],
  [400, 302, 32], [472, 178, 32], [498, 348, 32], [548, 96, 32], [568, 258, 32]
];
const NWV_SRC = 6;                       // глобус в середине — отправитель
const NWV_EDGES = [
  [6, 4], [6, 2], [6, 9],
  [4, 1], [4, 7], [2, 3], [2, 5], [9, 11], [9, 12],
  [1, 0], [5, 8], [12, 10],
  [8, 10], [7, 11], [0, 3]
];
// Круг волны для каждой точки: сколько связей от отправителя. Считаем один раз
// при загрузке модуля — граф постоянный, но пусть цифры не расходятся с ним,
// если связи однажды поправят.
const NWV_LVL = (() => {
  const lvl = NWV_NODES.map(() => Infinity);
  lvl[NWV_SRC] = 0;
  for (let pass = 0; pass < NWV_NODES.length; pass++) {
    NWV_EDGES.forEach(([a, b]) => {
      if (lvl[a] + 1 < lvl[b]) lvl[b] = lvl[a] + 1;
      if (lvl[b] + 1 < lvl[a]) lvl[a] = lvl[b] + 1;
    });
  }
  return lvl;
})();

// Экранчик мини-компьютера. Погашенный лежит снизу, цветной — в .lit поверх него.
const NwvMini = ({ i }) => (
  <>
    <ellipse cx="0" cy="26" rx="27" ry="4" fill="#5B6BA8" opacity=".18" />
    <rect x="-23" y="-22" width="46" height="34" rx="8" fill="#171E60" />
    <rect x="-18.5" y="-17.5" width="37" height="25" rx="5" fill="#fff" />
    <g clipPath="url(#nwvMini)">
      <rect x="-16" y="-15" width="32" height="20" fill="#C9D3E6" />
      <g className="lit"><rect x="-16" y="-15" width="32" height="20" fill={'url(#nwvN' + (i % 4) + ')'} /></g>
      <path d="M-3 -20 L6 -20 L-17 20 L-26 20 Z" fill="#fff" opacity=".38" />
      <path d="M8 -20 L11.5 -20 L-6 20 L-9.5 20 Z" fill="#fff" opacity=".24" />
    </g>
    <rect x="-29" y="12" width="58" height="8" rx="4" fill="#171E60" />
    <rect x="-25" y="13.5" width="50" height="3.5" rx="1.75" fill="#3FC4DF" />
  </>
);

// Глобус: серый, пока сигнал не пошёл, потом «оживает» вместе со всеми.
const NwvGlobe = () => (
  <>
    <circle r="42" fill="#171E60" />
    <circle r="35" fill="#DCE4F2" />
    <g className="lit">
      <circle r="35" fill="url(#nwvSea)" />
      <g clipPath="url(#nwvGlobe)">
        <g className="nwv-land">
          {[0, 70].map((dx) => (
            <g key={dx} transform={'translate(' + dx + ',0)'}>
              {[[-20, -11, 13, 8], [6, 13, 15, 9], [21, -17, 9, 6], [-8, 24, 10, 6]].map(([cx, cy, rx, ry], k) => (
                <ellipse key={k} cx={cx} cy={cy} rx={rx} ry={ry} fill="#63E0A8" />
              ))}
            </g>
          ))}
        </g>
        <path d="M-35 0h70M-30 -17h60M-30 17h60" stroke="#fff" strokeWidth="2" opacity=".26" fill="none" />
        <ellipse rx="17" ry="35" fill="none" stroke="#fff" strokeWidth="2" opacity=".3" />
        <ellipse rx="31" ry="35" fill="none" stroke="#fff" strokeWidth="2" opacity=".2" />
      </g>
      <circle r="35" fill="none" stroke="#fff" strokeWidth="2.5" opacity=".28" />
    </g>
  </>
);

function NetWaveArt() {
  return (
    <svg className="art nwv" viewBox="0 0 680 440" aria-hidden="true" focusable="false"
      preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="nwvN0" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#5CDDFF" /><stop offset="1" stopColor="#1F80EA" /></linearGradient>
        <linearGradient id="nwvN1" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#D28AFF" /><stop offset="1" stopColor="#7A34C4" /></linearGradient>
        <linearGradient id="nwvN2" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#FFC04A" /><stop offset="1" stopColor="#FF7501" /></linearGradient>
        <linearGradient id="nwvN3" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#7BF5C8" /><stop offset="1" stopColor="#17A97C" /></linearGradient>
        <linearGradient id="nwvSea" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stopColor="#6FE0FF" /><stop offset="1" stopColor="#2277D8" /></linearGradient>
        <clipPath id="nwvGlobe"><circle cx="0" cy="0" r="35" /></clipPath>
        <clipPath id="nwvMini"><rect x="-16" y="-15" width="32" height="20" rx="3.5" /></clipPath>
        <clipPath id="nwvIn"><rect width="640" height="400" rx="24" /></clipPath>
      </defs>

      <rect width="680" height="440" rx="34" fill="#FFFFFF" />
      <g transform="translate(20,20)">
        <rect width="640" height="400" rx="24" fill="#F1F6FE" />
        <g clipPath="url(#nwvIn)">
          <ellipse cx="150" cy="105" rx="205" ry="132" fill="#BAEEFD" />
          <ellipse cx="505" cy="88" rx="158" ry="98" fill="#E5C7FD" />
          <ellipse cx="470" cy="315" rx="192" ry="128" fill="#AFFED8" />
        </g>
        <path className="nwv-spark" d="M42 262l7 16 16 7-16 7-7 16-7-16-16-7 16-7z" fill="#FFD639" />
        <path className="nwv-spark" d="M614 44l7 16 16 7-16 7-7 16-7-16-16-7 16-7z" fill="#FFD639" />

        {/* Связи рисуются ПОД точками, поэтому линия выходит из-за корпуса.
            Направление берём от той точки, до которой волна дошла раньше. */}
        <g className="nwv-edges">
          {NWV_EDGES.map(([a, b], k) => {
            const [from, to] = NWV_LVL[a] <= NWV_LVL[b] ? [a, b] : [b, a];
            const [x1, y1] = NWV_NODES[from];
            const [x2, y2] = NWV_NODES[to];
            const step = Math.max(NWV_LVL[from], NWV_LVL[to]);
            return (
              <g className="nwv-edge" key={k} style={{ '--s': step }}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D3DDEE" strokeWidth="4" strokeLinecap="round" />
                <line className="e-lit" x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2ABBF0" strokeWidth="5" strokeLinecap="round" pathLength="1" />
                <line className="e-dash" x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeDasharray="7 9" />
              </g>
            );
          })}
        </g>

        <g className="nwv-nodes">
          {NWV_NODES.map(([x, y, r], i) => (
            <g key={i} transform={'translate(' + x + ',' + y + ')'}>
              <g className="nwv-node" style={{ '--l': NWV_LVL[i], '--i': i }}>
                <circle className="ping" r={r} fill="none" stroke="#2ABBF0" strokeWidth="3" />
                {i === NWV_SRC ? <NwvGlobe /> : <NwvMini i={i} />}
              </g>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ВСТУПИТЕЛЬНЫЕ КАДРЫ КИНОЛЕНТЫ. Показываются, пока Симка произносит первую
// реплику экрана, а потом уступают место карточкам (заказчик, 2026-08-06:
// «первый слайд поставим, не заменим, потом остальные будут выходить»).
// Перенесены из who-can-you-talk-to.html и internet-remembers.html: пульт,
// стили body и автозапуск не переносились, id заскоуплены.
// Таймеров нет — вся хореография демо переложена на animation-delay.
// ─────────────────────────────────────────────────────────────────────────────

// «С КЕМ МОЖНО РАЗГОВАРИВАТЬ» — вступление экрана «Кто рядом».
const TalkArt = () => (
  <svg className="art tk" viewBox="0 0 680 440" aria-hidden="true" focusable="false"
    preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="tkA1" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#D28AFF" /><stop offset="1" stopColor="#7A34C4" /></linearGradient>
      <linearGradient id="tkA2" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#7BF5C8" /><stop offset="1" stopColor="#17A97C" /></linearGradient>
      <linearGradient id="tkAX" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#B6BECE" /><stop offset="1" stopColor="#78849A" /></linearGradient>
      <clipPath id="tkC44"><circle r="44" /></clipPath>
      <clipPath id="tkC52"><circle r="52" /></clipPath>
    </defs>
    <rect width="680" height="440" rx="34" fill="#FFFFFF" />
    <g transform="translate(20,20)">
      <rect width="640" height="400" rx="24" fill="#F7FAFF" />

      <g className="tk-panel tk-pl">
        <rect x="22" y="40" width="292" height="320" rx="24" fill="#E9F9F0" stroke="#17A97C" strokeWidth="3" />
        <text x="168" y="92" textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif"
          fontSize="21" fontWeight="800" fill="#17A97C">КОГО ТЫ ЗНАЕШЬ</text>
      </g>

      <g transform="translate(108,208)">
        <g className="tk-who tk-w0">
          <circle r="44" fill="url(#tkA1)" stroke="#171E60" strokeWidth="5" />
          {/* эталон человека, заказчик 23.09.2026: мама — та же, что в сцене «Семья» */}
          <g clipPath="url(#tkC44)"><g transform="translate(0 153) scale(1.8)">
            <PersonCanon hair="long" hairColor="#7A3E1F" top="#E8368F" pants="#3B2F6B" shadow={false} />
          </g></g>
          {/* сдвиг на отдельной обёртке: анимация tkPop (transform) перебивала атрибут, и галочка ложилась на лицо */}
          <g transform="translate(32,32)"><g className="tk-badge">
            <circle r="16" fill="#17A97C" stroke="#fff" strokeWidth="3.5" />
            <path d="M-7 .5l5 5 9-10" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g></g>
        </g>
        <text className="tk-lb tk-lb0" y="84" textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif"
          fontSize="20" fontWeight="800" fill="#171E60">Мама</text>
      </g>

      <g transform="translate(232,208)">
        <g className="tk-who tk-w1">
          <circle r="44" fill="url(#tkA2)" stroke="#171E60" strokeWidth="5" />
          <g clipPath="url(#tkC44)"><g transform="translate(0 125) scale(2)">
            <PersonCanon kid hair="pony" hairColor="#2B2233" skin="dark" top="#FF6A00" pants="#27305A" shadow={false} />
          </g></g>
          {/* сдвиг на отдельной обёртке: анимация tkPop (transform) перебивала атрибут, и галочка ложилась на лицо */}
          <g transform="translate(32,32)"><g className="tk-badge">
            <circle r="16" fill="#17A97C" stroke="#fff" strokeWidth="3.5" />
            <path d="M-7 .5l5 5 9-10" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g></g>
        </g>
        <text className="tk-lb tk-lb1" y="84" textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif"
          fontSize="20" fontWeight="800" fill="#171E60">Друг</text>
      </g>

      <g className="tk-panel tk-pr">
        <rect x="326" y="40" width="292" height="320" rx="24" fill="#FDEDEB" stroke="#F0442E" strokeWidth="3" />
        <text x="472" y="92" textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif"
          fontSize="21" fontWeight="800" fill="#F0442E">КОГО НЕ ЗНАЕШЬ</text>
      </g>

      <g transform="translate(472,212)">
        <g className="tk-who tk-wx">
          <circle r="52" fill="url(#tkAX)" stroke="#171E60" strokeWidth="5" />
          {/* незнакомец: кепка, приглушённые цвета, лица нет */}
          <g clipPath="url(#tkC52)"><g transform="translate(0 178) scale(2.1)">
            <PersonCanon hair="cap" capColor="#3F4A5E" skin="mid" top="#46526A" pants="#2F3747" face="none" shadow={false} />
          </g></g>
        </g>
        <g className="tk-no">
          <circle r="62" fill="none" stroke="#F0442E" strokeWidth="11" />
          <path d="M-44 44L44 -44" stroke="#F0442E" strokeWidth="11" strokeLinecap="round" />
        </g>
        <text className="tk-lb tk-lb2" y="96" textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif"
          fontSize="20" fontWeight="800" fill="#F0442E">Незнакомец</text>
      </g>
    </g>
  </svg>
);

// «ИНТЕРНЕТ МОЖЕТ ЗАПОМИНАТЬ» — вступление экрана «Интернет помнит».
// Четыре шага демо (фото у тебя → улетело → удалил у себя → а там осталось)
// переложены на один прогон: у каждого элемента свои задержки.
const RememberArt = () => (
  <svg className="art rm" viewBox="0 0 680 440" aria-hidden="true" focusable="false"
    preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="rmPh" x1="0" y1="0" x2=".85" y2="1">
        <stop offset="0" stopColor="#5CDDFF" /><stop offset="1" stopColor="#1F80EA" /></linearGradient>
      <clipPath id="rmScr"><rect x="-36" y="-63" width="72" height="126" rx="18" /></clipPath>
      <clipPath id="rmPhoto"><rect x="-38" y="-27" width="76" height="54" rx="9" /></clipPath>
      <clipPath id="rmIn"><rect width="640" height="400" rx="24" /></clipPath>
      <marker id="rmTip" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
        <path d="M0 0.5L8 4.5L0 8.5z" fill="#171E60" /></marker>
      <g id="rmPhotoArt">
        <rect x="-48" y="-37" width="96" height="74" rx="14" fill="#171E60" />
        <rect x="-42" y="-31" width="84" height="62" rx="9" fill="#fff" />
        <g clipPath="url(#rmPhoto)">
          <rect x="-38" y="-27" width="76" height="54" fill="#BAEEFD" />
          <circle cx="17" cy="-13" r="9" fill="#FFD639" />
          <path d="M-38 27l24-28 16 18 11-12 25 22z" fill="#5FD39B" />
          <path d="M-38 27l14-15 13 15z" fill="#3FBF87" />
        </g>
      </g>
    </defs>
    <rect width="680" height="440" rx="34" fill="#FFFFFF" />
    <g transform="translate(20,20)">
      <rect width="640" height="400" rx="24" fill="#F1F6FE" />
      <g clipPath="url(#rmIn)">
        <ellipse cx="130" cy="110" rx="195" ry="128" fill="#BAEEFD" />
        <ellipse cx="480" cy="90" rx="175" ry="105" fill="#E5C7FD" />
        <ellipse cx="420" cy="340" rx="215" ry="115" fill="#AFFED8" />
      </g>

      <path className="rm-arrow" d="M190 200Q264 150 338 192" stroke="#171E60" strokeWidth="4"
        fill="none" strokeLinecap="round" strokeDasharray="11 10" markerEnd="url(#rmTip)" />

      <g transform="translate(450,206)">
        <g className="rm-cloud">
          <g fill="#171E60">
            <rect x="-104" y="-16" width="208" height="62" rx="31" />
            <circle cx="-54" cy="-12" r="48" /><circle cx="6" cy="-42" r="60" /><circle cx="70" cy="-10" r="46" />
          </g>
          <g fill="#E4F4FF" transform="scale(.93)">
            <rect x="-104" y="-16" width="208" height="62" rx="31" />
            <circle cx="-54" cy="-12" r="48" /><circle cx="6" cy="-42" r="60" /><circle cx="70" cy="-10" r="46" />
          </g>
          <circle className="rm-halo" cx="0" cy="-2" r="52" fill="none" stroke="#F0442E" strokeWidth="5" />
          <g className="rm-kept" transform="translate(0,-2) scale(.72)"><use href="#rmPhotoArt" /></g>
        </g>
        <text y="112" textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif"
          fontSize="20" fontWeight="800" fill="#171E60">Интернет</text>
      </g>

      <g transform="translate(140,236)">
        <g transform="scale(.8)">
          <ellipse cx="0" cy="92" rx="46" ry="9" fill="#5B6BA8" opacity=".18" />
          <rect x="-49" y="-76" width="98" height="152" rx="30" fill="#171E60" />
          <rect x="-41" y="-68" width="82" height="136" rx="23" fill="#fff" />
          <g clipPath="url(#rmScr)">
            <rect x="-36" y="-63" width="72" height="126" fill="url(#rmPh)" />
            <path d="M7 -84 L29 -84 L-29 84 L-51 84 Z" fill="#fff" opacity=".36" />
          </g>
          <g className="rm-mine" transform="scale(.5)"><use href="#rmPhotoArt" /></g>
          <g className="rm-bin" transform="translate(44,-60)">
            <circle r="23" fill="#F0442E" stroke="#fff" strokeWidth="4" />
            <path d="M-10 -7h20M-5 -7v-4h10v4M-7.5 -7l1.5 16h12L7.5 -7M-2.5 -3v9M2.5 -3v9"
              stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <text y="128" textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif"
          fontSize="20" fontWeight="800" fill="#171E60">Твой телефон</text>
      </g>

      <g className="rm-fly"><use href="#rmPhotoArt" /></g>
    </g>
  </svg>
);

// Экран «Интернет и я» переведён на общую киноленту (заказчик, 2026-08-05):
// собственная карточка icard с заголовком и абзацем снята, вместе с ней ушёл и
// компонент NetCard. Экранный текст lead убран — он звучит голосом внутри
// c.praise, там же вопрос и прямое «Выбери ответ».
function ScreenNet({ onNext, onPrev, idx }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.net;
  const s = useScenes(c, 'netCardsSeen');
  const [stored, setStored] = useState(() => store.get('net') || null);
  // Пустая начальная реплика: пока Симка не разобрала ответ, говорит кинолента.
  const [bubble, sayIt] = useSpeaker('simka', c.pose, null);
  const speaker = bubble.text ? toSpeaker(bubble) : s.speaker;
  const cardsDone = s.phase === 'praise';

  return (
    <Stage eyebrow={c.eyebrow} screen={5} total={TOTAL} speaker={speaker} done={!!stored}
      nav={<><BackBtn onPrev={onPrev} /><NextBtn disabled={!stored} onClick={onNext} /></>}>
      {!cardsDone && (
        <>
          <div className="scene-slot">
            {/* Вступительная реплика «Сначала про интернет…» идёт под сетью
                точек (заказчик, 2026-08-06), а кинолента начинается после неё. */}
            {s.phase === 'open'
              ? <div className="netbox netbox-slot"><NetWaveArt /></div>
              : <SceneCard key={s.i} card={c.cards[s.i]} exiting={s.exiting} />}
          </div>
          <SceneDots n={c.cards.length} i={s.phase === 'open' ? -1 : s.i} />
        </>
      )}
      {cardsDone && (
        <>
          {/* Вопрос не печатаем (заказчик, 24.09.2026): он звучит в c.praise. */}
          <Choice options={c.opts} correct={c.correct} stored={stored}
            onSay={(t, right) => sayIt(t, right ? 'S_thumb' : 'S_rule', null)}
            onResolved={(r) => {
              setStored(r); store.set('net', r);
              log({ screenIdx: idx, screenId: 'net', question: pick(c.ask), studentAnswer: pick(c.opts[r.index].text), correct: true, firstTry: r.firstTry });
            }} />
        </>
      )}
    </Stage>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// КИНОЛЕНТА — механизм экранов «кто рядом» и «интернет запоминает».
// (введён 2026-08-05 по правке заказчика; ту же идею уже носил экран «интернет»,
//  но там карточки только сменялись по вертикали и текста было на абзац)
//
// Сцена ровно одна. Симка договорила реплику этой сцены → пауза SCENE_DWELL →
// сцена уезжает ВЛЕВО за SCENE_EXIT → следующая приезжает СПРАВА. Ребёнок ничего
// не нажимает: экран сам ведёт его как мультфильм, «Дальше» просыпается только
// после итоговой похвалы. Все длительности в коридоре 300–500 мс — быстрее
// читается как рывок, медленнее ребёнок 8–10 успевает отвлечься.
//
// Фазы: 'open' (одна Симка, вступление) → 'cards' (сцены) → 'praise' (похвала).
// Индекс сцены держим в ref, а не только в state: шаг делает асинхронная
// цепочка со sleep(), и опираться в ней на замыкание над state нельзя.
// ─────────────────────────────────────────────────────────────────────────────
const SCENE_DWELL = 500;   // сцена стоит после реплики, прежде чем уехать
const SCENE_EXIT = 380;    // 300–500 мс: уезд влево / приезд справа

function SceneCard({ card, exiting }) {
  const pick = usePick();
  return (
    <article className={'scene scene-' + (card.tone || 'ok') + (exiting ? ' is-out' : '')}>
      <div className="scene-art"><SceneArt name={card.art} /></div>
      <h2 className="scene-t">{pick(card.t)}</h2>
      <p className="scene-cap">{pick(card.cap)}</p>
    </article>
  );
}

// Точки-сцены: сколько уже показано и сколько осталось. Без единой буквы —
// ребёнку важно видеть, что лента конечная, но читать об этом нечего.
const SceneDots = ({ n, i }) => (
  <div className="scene-dots" aria-hidden="true">
    {Array.from({ length: n }, (_, k) => (
      <span key={k} className={'scene-dot' + (k === i ? ' is-now' : '') + (k < i ? ' is-done' : '')} />
    ))}
  </div>
);

function useScenes(c, seenKey) {
  const store = useStore();
  const seen = !!store.get(seenKey);
  const [phase, setPhase] = useState(seen ? 'praise' : 'open');
  const [i, setI] = useState(seen ? c.cards.length - 1 : 0);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(seen);
  const idx = useRef(seen ? c.cards.length - 1 : 0);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const afterOpen = useCallback(() => setPhase('cards'), []);
  const afterCard = useCallback(async () => {
    await sleep(SCENE_DWELL);
    if (!alive.current) return;
    if (idx.current + 1 >= c.cards.length) { setPhase('praise'); return; }
    setExiting(true);
    await sleep(SCENE_EXIT);
    if (!alive.current) return;
    idx.current += 1;
    setExiting(false);
    setI(idx.current);
  }, [c.cards.length]);
  const afterPraise = useCallback(() => {
    setDone(true);
    store.set(seenKey, true);
  }, [store, seenKey]);

  // nonce разводит реплики: 0 — вступление, 1..N — сцены, N+1 — похвала.
  // Без него PersonaBubble считает две одинаковые строки одной репликой.
  // praisePose — поза на последней реплике: на разборе это S_thumb, а в финале
  // урока прощание должно идти на S_jump.
  const speaker =
    phase === 'open'
      ? { who: 'simka', pose: POSES[c.pose], text: c.say, onSpoken: afterOpen, nonce: 0 }
      : phase === 'cards'
        ? { who: 'simka', pose: POSES[c.pose], text: c.cards[i].voice, onSpoken: afterCard, nonce: i + 1 }
        : { who: 'simka', pose: POSES[c.praisePose || 'S_thumb'], text: c.praise,
            onSpoken: afterPraise, nonce: c.cards.length + 1 };

  return { phase, i, exiting, done, speaker };
}

// c.bye — необязательная сцена прощания: если она есть, на финальной реплике
// лента показывает её, а не застывший последний слайд. Нужна только финалу
// урока: там реплика прощальная, и держать под ней «В городе есть правила»
// неуместно. На разборных экранах bye нет — последняя сцена остаётся стоять.
// intro — кадр, который стоит, пока звучит ВСТУПИТЕЛЬНАЯ реплика экрана.
// Он не заменяет карточки: договорила Симка — и лента идёт как обычно.
function SceneScreen({ c, seenKey, screen, onNext, onPrev, label, intro }) {
  const s = useScenes(c, seenKey);
  const shown = s.phase === 'praise' && c.bye ? c.bye : c.cards[s.i];
  const shownKey = s.phase === 'praise' && c.bye ? 'bye' : s.i;
  return (
    <Stage eyebrow={c.eyebrow} screen={screen} total={TOTAL} speaker={s.speaker} done={s.done}
      nav={<><BackBtn onPrev={onPrev} /><NextBtn disabled={!s.done} onClick={onNext} label={label} /></>}>
      <div className="scene-slot">
        {/* Кадр стоит уже во вступительной реплике (заказчик, 2026-08-06:
            «чтобы до начала не было пусто»). Если экрану дали свой вступительный
            кадр — показываем его, иначе первую карточку ленты. */}
        {intro && s.phase === 'open'
          ? <div className="netbox netbox-slot">{intro}</div>
          : <SceneCard key={shownKey} card={shown} exiting={s.exiting} />}
      </div>
      <SceneDots n={c.cards.length} i={s.phase === 'open' ? -1 : s.i} />
    </Stage>
  );
}

function ScreenWhoIsNear({ onNext, onPrev }) {
  return <SceneScreen c={C.s4} seenKey="s4seen" screen={6} onNext={onNext} onPrev={onPrev} intro={<TalkArt />} />;
}

function ScreenNetMemory({ onNext, onPrev }) {
  return <SceneScreen c={C.s8} seenKey="s8seen" screen={7} onNext={onNext} onPrev={onPrev} intro={<RememberArt />} />;
}

// Финал урока: та же кинолента, но «Дальше» подписана «Завершить урок» —
// после последней сцены и прощания ребёнок закрывает урок этой же кнопкой.
function ScreenOutro({ onPrev, onFinish }) {
  return <SceneScreen c={C.outro} seenKey="outroSeen" screen={10}
    onNext={onFinish} onPrev={onPrev} label={C.outro.finish} />;
}

function ScreenBadgeMake({ onNext, onPrev }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s9;
  const [color, setColor] = useState(() => store.get('badgeColor') || null);
  const [symbol, setSymbol] = useState(() => store.get('badgeSymbol') || null);
  const ready = !!color && !!symbol;
  const [bubble, sayIt] = useSpeaker('simka', c.pose, c.say);
  const once = useRef(false);
  useEffect(() => {
    // экран-производство: в журнал ответов НЕ пишем — это не ответ на вопрос
    if (ready && !once.current) { once.current = true; sayIt(c.done, 'S_thumb'); }
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Stage eyebrow={c.eyebrow} screen={8} total={TOTAL} speaker={toSpeaker(bubble)} done={ready}
      nav={<><BackBtn onPrev={onPrev} /><NextBtn disabled={!ready} onClick={onNext} /></>}>
      <div className="maker">
        <Badge color={color} symbol={symbol} size="md" />
        <div className="maker-side">
          <div className="maker-lbl">{pick(c.colorLabel)}</div>
          <div className="swatches">
            {BADGE_COLORS.map((col) => (
              /* Квадратик залит ТОЙ ЖЕ парой и тем же блеском, что кольцо: ребёнок
                 должен выбирать ровно то, что увидит на значке. */
              <button key={col.id} type="button" aria-label={pick(col.name)}
                className={'swatch' + (color === col.hex ? ' is-on' : '')}
                style={{ '--bcA': col.lit, '--bcB': col.hex }}
                onClick={() => { sfx('pop', true); setColor(col.hex); store.set('badgeColor', col.hex); }} />
            ))}
          </div>
          <div className="maker-lbl">{pick(c.symbolLabel)}</div>
          <div className="syms">
            {BADGE_SYMBOLS.map((s) => (
              <button key={s} type="button" aria-label={pick(BADGE_SYMBOL_NAME[s])}
                className={'sym' + (symbol === s ? ' is-on' : '')}
                onClick={() => { sfx('pop', true); setSymbol(s); store.set('badgeSymbol', s); }}>
                <Icon name={s} size={23} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
}

function ScreenBadgeDone({ onNext, onPrev }) {
  const store = useStore();
  const c = C.s10;
  useEffect(() => { const t = setTimeout(() => sfx('win', true), 380); return () => clearTimeout(t); }, []);
  return (
    <Stage eyebrow={c.eyebrow} screen={9} total={TOTAL} speaker={persona('simka', c.pose, c.say)} done
      nav={<><BackBtn onPrev={onPrev} /><NextBtn onClick={onNext} /></>}>
      <div className="badge-show">
        <div className="done-hero">
          <AwardArt />
          <Badge color={store.get('badgeColor')} symbol={store.get('badgeSymbol')} size="lg" />
        </div>
      </div>
    </Stage>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// СИЯНИЕ ВОКРУГ ЗНАЧКА — экран «Вот он, твой значок!» и финал урока.
// Перенесено из badge-reward.html (заказчик, 2026-08-07).
//
// СВЕТ ОДИН И ТОТ ЖЕ ДЛЯ ЛЮБОГО ЗНАЧКА — прямое требование заказчика: «какой бы
// значок ученик ни выбрал, сиять должен именно как в примере». Поэтому лучи,
// ореол и искры взяты тёплыми из примера и НЕ подмешивают выбранный цвет.
// Меняется только сам значок в центре, свет вокруг — общий для всех.
//
// Что не перенесено: пульт, стили body, автозапуск и нарисованный в примере
// оранжевый щит — в центре стоит настоящий значок ребёнка (его цвет и знак).
//
// Слой лежит ПОД значком (z-index: -1) и абсолютный, поэтому не добавляет ни
// пикселя высоты — контракт «100dvh без прокрутки» не трогаем.
// ─────────────────────────────────────────────────────────────────────────────
const AW_C = 340;   // центр слоя в его системе координат 680×680

// Лучи считаем один раз при загрузке: геометрия постоянная, а держать
// тригонометрию в разметке незачем. Формула — из примера, дословно.
const awRayPath = (count, halfDeg, len) => {
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = (i * 360 / count) * Math.PI / 180;
    const w = halfDeg * Math.PI / 180;
    const p = (ang, r) => (AW_C + Math.cos(ang) * r).toFixed(1) + ' ' + (AW_C + Math.sin(ang) * r).toFixed(1);
    d += 'M' + p(a, 34) + 'L' + p(a - w, len) + 'L' + p(a + w, len) + 'Z';
  }
  return d;
};
const AW_RAY_A = awRayPath(14, 3.0, 350);
const AW_RAY_B = awRayPath(14, 1.1, 410);
// Искры: смещения от центра и размер. Из примера.
const AW_SPARKS = [[-142, -58, 15], [128, -84, 12], [168, 26, 10], [-158, 52, 11],
  [-70, -138, 9], [64, -140, 12], [104, 116, 10], [-104, 110, 9]];
const awSpark = (s) => 'M0 ' + (-s) + ' l' + (s * 0.32) + ' ' + (s * 0.68) + ' l' + (s * 0.68) + ' ' + (s * 0.32)
  + ' l' + (-s * 0.68) + ' ' + (s * 0.32) + ' l' + (-s * 0.32) + ' ' + (s * 0.68) + ' l' + (-s * 0.32) + ' ' + (-s * 0.68)
  + ' l' + (-s * 0.68) + ' ' + (-s * 0.32) + ' l' + (s * 0.68) + ' ' + (-s * 0.32) + ' Z';

const AwardArt = () => (
  <svg className="award" viewBox="0 0 680 680" aria-hidden="true" focusable="false"
    preserveAspectRatio="xMidYMid meet">
    <defs>
      <radialGradient id="awGlow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#FFB03A" stopOpacity=".5" />
        <stop offset=".55" stopColor="#FFB03A" stopOpacity=".2" />
        <stop offset="1" stopColor="#FFB03A" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="awRayAG" cx={AW_C} cy={AW_C} r="340" gradientUnits="userSpaceOnUse">
        <stop offset=".22" stopColor="#FF9A26" stopOpacity=".26" />
        <stop offset=".55" stopColor="#FF9A26" stopOpacity=".13" />
        <stop offset="1" stopColor="#FF9A26" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="awRayBG" cx={AW_C} cy={AW_C} r="400" gradientUnits="userSpaceOnUse">
        <stop offset=".22" stopColor="#FFCB52" stopOpacity=".42" />
        <stop offset=".6" stopColor="#FFCB52" stopOpacity=".18" />
        <stop offset="1" stopColor="#FFCB52" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Два слоя лучей крутятся НАВСТРЕЧУ друг другу — из-за этого свет «живёт»,
        а не просто вращается. Второй слой сдвинут на полшага (12.8°). */}
    <g className="aw-ray aw-rayA"><path d={AW_RAY_A} fill="url(#awRayAG)" /></g>
    <g className="aw-ray aw-rayB" transform={'rotate(12.8 ' + AW_C + ' ' + AW_C + ')'}>
      <path d={AW_RAY_B} fill="url(#awRayBG)" />
    </g>

    <circle className="aw-glow" cx={AW_C} cy={AW_C} r="165" fill="url(#awGlow)" />
    <circle className="aw-burst" cx={AW_C} cy={AW_C} r="100" fill="none" stroke="#FFA829" strokeWidth="7" />

    <g className="aw-sparks">
      {AW_SPARKS.map(([dx, dy, s], k) => (
        <g key={k} transform={'translate(' + (AW_C + dx) + ',' + (AW_C + dy) + ')'}>
          <g className="aw-spark" style={{ '--k': k }}><path d={awSpark(s)} fill="#FFC93C" /></g>
        </g>
      ))}
    </g>
  </svg>
);

// САЛЮТ. СЕЙЧАС НЕ ИСПОЛЬЗУЕТСЯ (2026-08-07): на финале его заменило сияние из
// badge-reward.html — заказчик просил, чтобы значок сиял «именно как в примере»,
// а салют поверх лучей превращал кадр в кашу. Компонент и его CSS оставлены
// целыми: вернуть — это одна строка <Salute /> рядом с <AwardArt />.
//
// (заказчик, 2026-08-06: «пусть со значком выйдет салют, чтобы правда был
// праздник, что добавился новый член»). Три залпа лент из-за значка.
// Почему разметкой, а не картинкой: лент 30, каждая летит по своему углу и на
// своё расстояние — это дешевле всего задать переменными --a/--d/--t прямо на
// элементе, а всю работу делает CSS. Цвет берётся из значка ребёнка (--bcA/--bcB)
// и из акцентов урока, поэтому салют читается как «твой» праздник, а не чужой.
const SALUTE = Array.from({ length: 30 }, (_, k) => ({
  a: Math.round((k * 360) / 30),
  d: 88 + (k % 5) * 30,
  t: ((k % 6) * 0.11 + (k % 2) * 0.05).toFixed(2),
  c: k % 5
}));

const Salute = () => (
  <div className="salute" aria-hidden="true">
    {SALUTE.map((s, k) => (
      <i key={k} className={'salute-bit sb' + s.c}
        style={{ '--a': s.a + 'deg', '--d': s.d + 'px', '--t': s.t + 's' }} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BOOT — консоль Штаба
// ─────────────────────────────────────────────────────────────────────────────
// welcome-паузы здесь больше нет: экран не уезжает сам, он ждёт касания.
const BOOT_T = { logo: 1300, char: 26, beforeOk: 240, afterOk: 300, beforeWelcome: 460 };

function BootScreen({ state, onDone }) {
  const pick = usePick();
  const lang = useLang();
  const audio = useAudio();
  const c = C.boot;
  const [phase, setPhase] = useState('logo');
  const [row, setRow] = useState(-1);
  const [chars, setChars] = useState(0);
  const [okCount, setOkCount] = useState(0);
  const once = useRef(false);

  useEffect(() => {
    let dead = false;
    (async () => {
      sfx('boot', true);
      await sleep(BOOT_T.logo);
      if (dead) return;
      setPhase('checks');
      for (let k = 0; k < c.lines.length; k++) {
        const q = pick(c.lines[k].q);
        setRow(k); setChars(0);
        for (let n = 1; n <= q.length; n++) {
          if (dead) return;
          setChars(n);
          await sleep(BOOT_T.char);
        }
        await sleep(BOOT_T.beforeOk);
        if (dead) return;
        setOkCount(k + 1); sfx('blip', true);
        await sleep(BOOT_T.afterOk);
        if (dead) return;
      }
      await sleep(BOOT_T.beforeWelcome);
      if (dead) return;
      setPhase('welcome'); sfx('ready', true);
      // Дальше урок НЕ уезжает сам — ждём кнопку. Это единственное касание за
      // урок, и именно оно разрешает браузеру звук: без него первая реплика
      // Симки глушится и ребёнок весь урок читает текст вместо того, чтобы слушать.
    })();
    return () => { dead = true; };
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // Порядок важен: unlock() обязан отработать ВНУТРИ обработчика касания,
  // до любого await и до размонтирования boot-экрана.
  const enter = () => {
    if (once.current) return;
    once.current = true;
    if (audio && audio.unlock) audio.unlock();
    sfx('tap', true);
    onDone();
  };

  return (
    <div className={'boot' + (state === 'out' ? ' is-out' : '')}>
      <div className="boot-inner">
        <div className="boot-badge">
          <svg className="boot-emblem" viewBox="0 0 64 76" aria-hidden="true">
            <path className="boot-shield" d="M32 3 L59 13 V37 C59 55 47 66.5 32 73 C17 66.5 5 55 5 37 V13 Z" />
            <path className="boot-check" d="M20 37.5 l8.5 9 15.5 -18.5" />
          </svg>
          <div className="boot-brand mono">{pick(c.brand)}</div>
        </div>
        {phase !== 'logo' && (
          <div className="boot-console mono" role="status" aria-live="polite">
            {c.lines.slice(0, row + 1).map((l, k) => {
              const q = pick(l.q);
              const shown = k < row ? q : q.slice(0, chars);
              const ok = k < okCount;
              return (
                <div className="boot-row" key={k}>
                  <span className="boot-q">{shown}{k === row && !ok && <i className="boot-caret" />}</span>
                  {ok && <span className={'boot-a' + (l.wait ? ' is-wait' : '')}><Icon name={l.wait ? 'hourglass' : 'check'} size={14} />{pick(l.a)}</span>}
                </div>
              );
            })}
          </div>
        )}
        <div className="boot-track" aria-hidden="true">
          <div className="boot-fill" style={{ width: (okCount / c.lines.length) * 100 + '%' }} />
        </div>
        {phase === 'welcome' && (
          <>
            <div className="boot-welcome">{pick(c.welcome)}</div>
            <button type="button" className="btn-accent boot-start" onClick={enter}>{pick(c.start)}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ФОН «ШТАБ» — комната-база, куда приняли ребёнка.
// Окно с тёплым светом, стол, доска-схема сети на стене (прямая рифма к теме
// «интернет — это сеть»), полка, растение. Всё крупными мягкими силуэтами в
// диапазоне #E1DACA…#FAF8F3: фон обязан оставаться фоном, смотрят на Симку и
// Нолика. Слой .lbg лежит под контентом (z-index:-1), не кликается и высоты не
// добавляет — иначе поехал бы контракт «100dvh без скролла».
// viewBox 1200x900 + slice: на 360px в кадре остаётся центральная колонка —
// окно, подоконник, стол и луч. Доска, полка и растение — бонус широкого экрана.
// ─────────────────────────────────────────────────────────────────────────────
function LessonBg() {
  return (
    <div className="lbg" aria-hidden="true">
      <svg className="lbg-svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lbgWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FAF8F3" />
            <stop offset="1" stopColor="#EFEBDF" />
          </linearGradient>
          <radialGradient id="lbgWarm" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#FFEBD0" stopOpacity="0.5" />
            <stop offset="0.55" stopColor="#FFF1DF" stopOpacity="0.22" />
            <stop offset="1" stopColor="#FFF1DF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lbgSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E7EFF7" />
            <stop offset="0.5" stopColor="#FAF6EC" />
            <stop offset="1" stopColor="#FFF6E6" />
          </linearGradient>
          <linearGradient id="lbgBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE7C4" stopOpacity="0.26" />
            <stop offset="1" stopColor="#FFE7C4" stopOpacity="0" />
          </linearGradient>
          <clipPath id="lbgGlass">
            <rect x="414" y="164" width="372" height="342" rx="16" />
          </clipPath>
        </defs>
        {/* стена и пол */}
        <rect width="1200" height="900" fill="url(#lbgWall)" />
        <rect y="690" width="1200" height="210" fill="#EAE5D8" />
        <rect y="687" width="1200" height="5" fill="#E3DCCB" />
        {/* доска-схема сети */}
        <g className="lbg-board">
          <rect x="110" y="212" width="226" height="164" rx="18" fill="#EEE9DE" />
          <rect x="124" y="226" width="198" height="136" rx="12" fill="#F8F5EF" />
          <path d="M162 322 200 268 254 296 294 252M200 268 218 332 274 336" fill="none" stroke="#8C8578" strokeOpacity="0.3" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="200" cy="268" r="9" fill="#FF4F28" fillOpacity="0.3" />
          <circle cx="162" cy="322" r="7" fill="#2B7FD4" fillOpacity="0.28" />
          <circle cx="254" cy="296" r="7" fill="#2B7FD4" fillOpacity="0.26" />
          <circle cx="294" cy="252" r="6" fill="#FF4F28" fillOpacity="0.24" />
          <circle cx="274" cy="336" r="7" fill="#FF4F28" fillOpacity="0.22" />
        </g>
        {/* экран на стене */}
        <rect x="132" y="412" width="182" height="126" rx="16" fill="#EDE8DD" />
        <rect x="146" y="426" width="154" height="98" rx="10" fill="#F8F5EF" />
        <rect x="162" y="450" width="88" height="11" rx="5" fill="#FF4F28" fillOpacity="0.15" />
        <rect x="162" y="474" width="120" height="9" rx="4" fill="#3A3530" fillOpacity="0.09" />
        {/* полка */}
        <rect x="874" y="386" width="230" height="16" rx="8" fill="#E4DDCE" />
        <rect x="898" y="324" width="26" height="62" rx="6" fill="#E9E3D6" />
        <rect x="930" y="310" width="22" height="76" rx="6" fill="#E1DACA" />
        <rect x="958" y="332" width="30" height="54" rx="6" fill="#EFEAE0" />
        <circle cx="1052" cy="356" r="30" fill="#EEE9DE" />
        <path d="M1022 356H1082M1052 326a17 30 0 0 0 0 60a17 30 0 0 0 0-60" fill="none" stroke="#DCD4C2" strokeWidth="3" />
        {/* тёплый свет ложится на стену и мебель */}
        <ellipse className="lbg-glow" cx="600" cy="370" rx="540" ry="430" fill="url(#lbgWarm)" />
        {/* окно */}
        <rect x="396" y="144" width="408" height="382" rx="24" fill="#E8E1D3" />
        <rect x="414" y="164" width="372" height="342" rx="16" fill="url(#lbgSky)" />
        <g clipPath="url(#lbgGlass)">
          <circle cx="506" cy="242" r="48" fill="#FFF" fillOpacity="0.6" />
          <path d="M414 432C476 390 540 426 606 414 672 402 736 376 786 398V506H414Z" fill="#E4EBDE" />
          <path d="M414 468C486 444 556 472 630 458 704 444 752 432 786 444V506H414Z" fill="#DAE2D1" />
        </g>
        <path d="M600 164V506M414 335H786" fill="none" stroke="#F3EFE6" strokeWidth="14" strokeLinecap="round" />
        <rect x="380" y="516" width="440" height="22" rx="11" fill="#E4DDCE" />
        {/* луч света на пол */}
        <path className="lbg-beam" d="M414 538H786L942 802H258Z" fill="url(#lbgBeam)" />
        {/* растение */}
        <ellipse cx="962" cy="772" rx="74" ry="15" fill="#DED6C4" fillOpacity="0.5" />
        <g className="lbg-leaves">
          <path d="M962 686V596" fill="none" stroke="#D4DBC6" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="962" cy="606" rx="21" ry="54" fill="#DBE2CE" transform="rotate(-16 962 606)" />
          <ellipse cx="992" cy="634" rx="17" ry="44" fill="#E1E7D7" transform="rotate(28 992 634)" />
          <ellipse cx="930" cy="642" rx="16" ry="40" fill="#E5EBDC" transform="rotate(-40 930 642)" />
        </g>
        <path d="M916 684H1008L996 774H928Z" fill="#E5DECF" />
        <rect x="908" y="672" width="108" height="22" rx="9" fill="#EAE4D7" />
        {/* стол штаба: книги, кружка, тумба */}
        <ellipse cx="600" cy="704" rx="205" ry="17" fill="#DED6C4" fillOpacity="0.5" />
        <rect x="452" y="588" width="86" height="12" rx="4" fill="#E3DBC9" />
        <rect x="458" y="576" width="74" height="12" rx="4" fill="#EDE7DA" />
        <rect x="464" y="564" width="62" height="12" rx="4" fill="#E6DFCE" />
        <rect x="690" y="566" width="46" height="34" rx="9" fill="#EDE7DA" />
        <path d="M736 576a12 12 0 0 1 0 16" fill="none" stroke="#E0D8C6" strokeWidth="7" strokeLinecap="round" />
        <rect x="404" y="600" width="392" height="18" rx="9" fill="#E5DECF" />
        <rect x="434" y="618" width="332" height="84" rx="10" fill="#EBE5D8" />
        <rect x="458" y="636" width="284" height="46" rx="8" fill="#E2DBC9" />
        {/* пылинки в луче */}
        <g className="lbg-motes" fill="#FFD2A0">
          <circle className="lbg-mote" cx="504" cy="672" r="5" fillOpacity="0.5" />
          <circle className="lbg-mote" cx="676" cy="716" r="4" fillOpacity="0.44" />
          <circle className="lbg-mote" cx="588" cy="644" r="3.4" fillOpacity="0.4" />
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// КОРЕНЬ
// ─────────────────────────────────────────────────────────────────────────────
function KiberM1L01({ studentName, lang, onFinished, startAt, skipBoot, holdIntro }) {
  const R = useLessonRoot({
    meta: META, total: TOTAL, studentName, lang, onFinished, startAt,
    extraPayload: (store) => ({ badge: { color: store.get('badgeColor') || null, symbol: store.get('badgeSymbol') || null } })
  });
  const [boot, setBoot] = useState(skipBoot ? 'done' : 'run');
  const bootTimer = useRef(null);
  useEffect(() => () => clearTimeout(bootTimer.current), []);
  const bootOut = useCallback(() => {
    setBoot('out');
    bootTimer.current = setTimeout(() => setBoot('done'), 440);
  }, []);

  // «Назад» с экрана тура на знакомство: интро не отыгрывается заново, а
  // коротко мигает и возвращает вперёд — иначе ребёнок слушает всё по кругу.
  const [bounce, setBounce] = useState(false);
  const backToIntro = useCallback(() => { R.store.set('tourBackDone', true); setBounce(true); R.prev(); }, [R]);
  const backFromIntro = useCallback(() => { setBounce(false); R.next(); }, [R]);

  const screens = [
    <ScreenIntro key="intro" onNext={bounce ? backFromIntro : R.next} bounce={bounce} hold={holdIntro} />,
    <ScreenTour1 key="tour1" onNext={R.next} onBackDemo={backToIntro} backDone={!!R.store.get('tourBackDone')} />,
    <ScreenTour2 key="tour2" onNext={R.next} onPrev={R.prev} />,
    <ScreenDialog key="dlg" onNext={R.next} onPrev={R.prev} />,
    <ScreenSend key="travel" onNext={R.next} onPrev={R.prev} />,
    <ScreenNet key="net" idx={5} onNext={R.next} onPrev={R.prev} />,
    <ScreenWhoIsNear key="s4" onNext={R.next} onPrev={R.prev} />,
    <ScreenNetMemory key="s8" onNext={R.next} onPrev={R.prev} />,
    <ScreenBadgeMake key="s9" onNext={R.next} onPrev={R.prev} />,
    <ScreenBadgeDone key="s10" onNext={R.next} onPrev={R.prev} />,
    <ScreenOutro key="outro" onPrev={R.prev} onFinish={R.finish} />
  ];

  return (
    <R.Shell css={LESSON_CSS}>
      <LessonBg />
      {/* R.done — урок закрыт: показываем ТОЛЬКО фон. Никакого своего экрана
          поздравления: платформа в этот момент даёт своё окно «Начать тест». */}
      {boot !== 'run' && !R.done
        && (screens[R.i] && React.cloneElement(screens[R.i], { key: SCREENS[R.i].id + '-' + R.runN }))}
      {boot !== 'done' && <BootScreen state={boot} onDone={bootOut} />}
    </R.Shell>
  );
}

// ============================================================================
// CSS УРОКА (дописывается к CSS_BASE канона)
// ============================================================================
const LESSON_CSS = `
/* ── ФОН «ШТАБ» ───────────────────────────────────────────────────
   .lesson-root получает свой контекст наложения (isolation, БЕЗ z-index —
   overlay'и урока и коуч-марки не трогаем), .lbg живёт на z-index:-1:
   выше заливки корня и ниже всего остального. */
.lesson-root { position: relative; isolation: isolate; }
.lbg { position: absolute; inset: 0; z-index: -1; overflow: hidden;
  pointer-events: none; user-select: none; -webkit-user-select: none; }
.lbg-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
/* размывка к краям и к панелям — считается от вьюпорта, а не от viewBox */
.lbg::before, .lbg::after { content: ''; position: absolute; inset: 0; }
.lbg::before { background: radial-gradient(122% 94% at 50% 44%,
  rgba(246,244,239,0) 32%, rgba(246,244,239,.32) 68%, rgba(246,244,239,.68) 100%); }
.lbg::after { background: linear-gradient(180deg, #F6F4EF 0%,
  rgba(246,244,239,0) 20%, rgba(246,244,239,0) 66%, rgba(246,244,239,.9) 92%, #F6F4EF 100%); }
@media (max-width: 560px) {
  .lbg::before { background: radial-gradient(118% 86% at 50% 46%,
    rgba(246,244,239,0) 24%, rgba(246,244,239,.42) 62%, rgba(246,244,239,.74) 100%); }
}
/* Панели канона залиты сплошным фоном — сквозь них комнаты не видно.
   Снимаем заливку: сверху и снизу её и так подменяет вертикальный градиент
   .lbg::after, поэтому текст шапки и кнопки остаются на ровном фоне,
   а персонаж встаёт прямо в комнату. */
.stage-header, .speaker-wrap, .stage-nav { background: transparent; }
/* Канон рисует у нижней панели box-shadow: 0 -10px 24px -12px — на глухой
   заливке его не было видно, а на открытом фоне он превращается в грязную
   тёмную полосу поперёк комнаты. Разделение и так делает градиент .lbg::after. */
.stage-nav { box-shadow: none; }
@media (max-height: 560px) { .stage-nav { box-shadow: none; } }

/* движение: дыхание света, качание листьев, три пылинки */
.lbg-glow { animation: lbgBreath 17s ease-in-out infinite; }
.lbg-beam { animation: lbgBreath 21s ease-in-out infinite reverse; }
@keyframes lbgBreath { 0%, 100% { opacity: .8; } 50% { opacity: 1; } }
.lbg-leaves { transform-box: fill-box; transform-origin: 50% 96%;
  animation: lbgSway 14s ease-in-out infinite; }
@keyframes lbgSway { 0%, 100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.6deg); } }
.lbg-board circle { animation: lbgNode 11s ease-in-out infinite; }
.lbg-board circle:nth-of-type(2) { animation-delay: -2.2s; }
.lbg-board circle:nth-of-type(3) { animation-delay: -4.4s; }
.lbg-board circle:nth-of-type(4) { animation-delay: -6.6s; }
.lbg-board circle:nth-of-type(5) { animation-delay: -8.8s; }
@keyframes lbgNode { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
.lbg-mote { animation: lbgDrift 26s ease-in-out infinite both; }
.lbg-mote:nth-of-type(2) { animation-duration: 33s; animation-delay: -11s; }
.lbg-mote:nth-of-type(3) { animation-duration: 29s; animation-delay: -19s; }
@keyframes lbgDrift {
  0% { transform: translate(0,0); opacity: 0; }
  15% { opacity: .7; }
  50% { transform: translate(16px,-52px); opacity: 1; }
  85% { opacity: .45; }
  100% { transform: translate(-10px,-104px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .lbg-glow, .lbg-beam, .lbg-leaves, .lbg-board circle, .lbg-mote { animation: none !important; }
  .lbg-glow { opacity: .9; } .lbg-beam { opacity: .85; }
  .lbg-board circle { opacity: .8; } .lbg-mote { opacity: .5; }
}
@media print { .lbg { display: none !important; } }

/* ── РЕЧЬ БЕЗ ТЕКСТА (все экраны, кроме 1-го) ─────────────────────
   Облако с репликой заменено кнопкой «послушать ещё раз»: экран держат
   персонаж и голос. Освободившуюся высоту забирает сам персонаж —
   ребёнок смотрит на него, а не читает за ним.
   Текстовое облако остаётся в разметке и всплывает при audio.failed. */
.lesson-root { --av-say: clamp(92px, min(34vw, 21dvh), 210px); }
.speaker-silent { justify-content: center; gap: clamp(12px, 3.4vw, 30px); }
.speaker-silent .speaker-av { width: var(--av-say); cursor: pointer; }
.speaker-silent .speaker-av:active { transform: scale(.97); }

.speaker-voice { position: relative; flex: 0 0 auto; border: none; padding: 0; cursor: pointer;
  width: clamp(54px, 13vw, 74px); height: clamp(54px, 13vw, 74px); border-radius: 50%;
  background: ${T.paper}; display: grid; place-items: center;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -16px rgba(${T.shadowBase},0.5);
  transition: transform .14s ease-out; }
.speaker-voice:active { transform: scale(.92); }
.speaker-simka .speaker-voice { --sv: ${T.accent}; --svr: rgba(255,79,40,0.34); }
.speaker-nolik .speaker-voice { --sv: ${T.blue}; --svr: rgba(43,127,212,0.34); }

/* дорожка из пяти столбиков: пляшет, пока реально звучит голос */
.sv-bars { display: flex; align-items: center; gap: clamp(2.5px, .7vw, 4px); height: 42%; }
.sv-bars i { display: block; width: clamp(3px, .8vw, 4.5px); height: 26%; border-radius: 99px;
  background: var(--sv); transition: height .22s ease-out; }
.speaker-voice.is-on .sv-bars i { animation: svBar .92s ease-in-out infinite; }
.speaker-voice.is-on .sv-bars i:nth-child(2) { animation-delay: .14s; }
.speaker-voice.is-on .sv-bars i:nth-child(3) { animation-delay: .28s; }
.speaker-voice.is-on .sv-bars i:nth-child(4) { animation-delay: .42s; }
.speaker-voice.is-on .sv-bars i:nth-child(5) { animation-delay: .56s; }
@keyframes svBar { 0%, 100% { height: 26%; } 50% { height: 100%; } }

/* реплика для экранного диктора: с экрана убрана, из доступности — нет */
.sv-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0; }

/* кольцо речи — тот же язык, что на экране 1 */
.speaker-voice.is-on::after { content: ''; position: absolute; inset: 0; border-radius: 50%;
  box-shadow: 0 0 0 2px var(--svr); animation: speakRing 1.9s ease-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .speaker-voice.is-on .sv-bars i { animation: none; height: 62%; }
  .speaker-voice.is-on::after { animation: none; opacity: .5; }
}

/* ── ЭКРАН 1: персонаж вместо текста ──────────────────────────────
   Пузырька нет, поэтому весь кадр отдан персонажу. Пустоту закрывают
   подсветка в его цвете, кольца речи, дуга длины реплики и каст-строка. */
.lesson-root { --av-hero: clamp(150px, min(52vw, 40dvh), 330px); }
.hero-zone { position: relative; display: flex; flex-direction: column; align-items: center;
  gap: clamp(10px, 1.8dvh, 20px); width: 100%;
  animation: fadeUp .3s cubic-bezier(.2,.7,.3,1) both; }
.hero-zone.is-out { animation: heroZoneOut .28s ease-in forwards; }
@keyframes heroZoneOut { to { opacity: 0; transform: scale(.96); } }

.hero-glow { position: absolute; top: -6%; left: 50%; translate: -50% 0;
  width: min(120%, calc(var(--av-hero) * 1.9)); aspect-ratio: 1; border-radius: 50%;
  background: radial-gradient(circle at 50% 45%, var(--glow) 0%, transparent 68%);
  opacity: .85; transition: background .5s; pointer-events: none; }
.hero-simka { --glow: rgba(255,79,40,0.20); }
.hero-nolik { --glow: rgba(43,127,212,0.20); }

/* Высоту фигуре задаёт САМА картинка: кадры поз бывают 2:3 и 1:1, и aspect-ratio
   здесь проигрывает содержимому (проверено: 275x413 вместо 275x275).
   Поэтому дуга и кольца — отдельные квадраты по ширине, центрированные по вертикали:
   так они остаются кругом при любой пропорции кадра. */
.hero-figure { position: relative; width: var(--av-hero); display: block; }
.hero-halo { position: absolute; left: 0; top: 50%; width: 100%; aspect-ratio: 1;
  translate: 0 -50%; pointer-events: none; }
.hero-av { position: relative; z-index: 2; display: block; width: 100%; height: auto;
  filter: drop-shadow(0 18px 26px rgba(${T.shadowBase},0.26));
  animation: heroAvIn .44s cubic-bezier(.34,1.4,.5,1) both, idleFloat 4.6s .5s ease-in-out infinite; }
@keyframes heroAvIn { from { opacity: 0; transform: translateY(16px) scale(.9); } to { opacity: 1; transform: none; } }

/* кольца — идут, только пока реально звучит голос */
/* left/width переопределяем, а top:50% и translate берём из .hero-halo —
   inset:auto здесь ставить нельзя, он сбрасывает top и кольца уезжают вверх. */
.hero-rings { width: 88%; left: 6%; border-radius: 50%; z-index: 1; }
.hero-rings.is-speaking::before, .hero-rings.is-speaking::after {
  content: ''; position: absolute; inset: 0; border-radius: 50%;
  box-shadow: 0 0 0 2px var(--ring); animation: speakRing 1.9s ease-out infinite; }
.hero-rings.is-speaking::after { animation-delay: .95s; }
.hero-simka .hero-rings { --ring: rgba(255,79,40,0.38); }
.hero-nolik .hero-rings { --ring: rgba(43,127,212,0.38); }
@keyframes speakRing { from { transform: scale(.86); opacity: .75; } to { transform: scale(1.28); opacity: 0; } }

/* дуга: показывает, что реплика ещё идёт — снимает вопрос «зависло?» */
.hero-arc { z-index: 1; transform: rotate(-90deg); overflow: visible; }
.hero-arc circle { fill: none; stroke-width: 2.4; stroke-linecap: round; }
.hero-arc-track { stroke: rgba(${T.shadowBase}, 0.08); }
.hero-arc-fill { stroke: var(--ring); stroke-dasharray: 100; stroke-dashoffset: 100;
  animation-name: arcFill; animation-timing-function: linear; animation-fill-mode: forwards; }
@keyframes arcFill { to { stroke-dashoffset: 0; } }

.hero-name { display: flex; align-items: center; gap: 10px; }
.hero-name > span { font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(22px, 5vw, 34px); font-weight: 600; letter-spacing: -0.01em; }
.hero-simka .hero-name > span { color: ${T.accentDk}; }
.hero-nolik .hero-name > span { color: ${T.blueDk}; }
.hero-say { border: none; background: rgba(${T.shadowBase},0.07); color: ${T.ink2};
  width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; cursor: pointer;
  transition: transform .14s ease-out, background .2s; }
.hero-say:active { transform: scale(.92); }

.hero-fallback { max-width: 34em; text-align: center; font-size: clamp(17px, 2.7vw, 17px);
  line-height: 1.45; font-weight: 500; color: ${T.ink2};
  background: ${T.paper}; border-radius: 16px; padding: 12px 16px;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5); }

.hero-cast { display: flex; gap: 10px; align-items: center; }
.hero-dot { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; background: ${T.paper};
  display: grid; place-items: center; opacity: .38; transition: opacity .3s, box-shadow .3s, transform .3s; }
.hero-dot img { width: 132%; height: 132%; object-fit: contain; object-position: center top; }
.hero-dot.is-done { opacity: .7; }
.hero-dot.is-now { opacity: 1; transform: scale(1.12);
  box-shadow: 0 0 0 2.5px ${T.accent}, 0 6px 14px -6px rgba(${T.shadowBase},0.5); }
.hero-nolik .hero-dot.is-now { box-shadow: 0 0 0 2.5px ${T.blue}, 0 6px 14px -6px rgba(${T.shadowBase},0.5); }

/* ── UI-ТУР: список помощников ───────────────────────────────── */
.uid { display: flex; flex-direction: column; gap: 9px; }
.uid-row { display: flex; gap: 12px; align-items: flex-start; background: ${T.paper}; border-radius: 15px;
  padding: 13px 15px; transition: box-shadow .25s, opacity .25s;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5); }
.uid-now { box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5), inset 0 0 0 2.5px ${T.accent}; }
.uid-done { opacity: .62; }
.uid-ico { display: grid; place-items: center; width: 34px; height: 34px; flex-shrink: 0; border-radius: 11px;
  background: ${T.accentSoft}; color: ${T.accentDk}; }
.uid-h { display: flex; align-items: center; gap: 8px; font-size:  17px; font-weight: 800; margin-bottom: 3px; }
.uid-tick { display: grid; place-items: center; color: ${T.success}; }
.uid-p { font-size:  17px; line-height: 1.45; color: ${T.ink2}; }

/* ── ИНФО-СТРОКИ ─────────────────────────────────────────────── */
.road { display: flex; flex-direction: column; gap: 9px; }
.road-item { display: flex; align-items: center; gap: 12px; background: ${T.paper}; border-radius: 15px;
  padding: 13px 15px; font-size:  17px; line-height: 1.4;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.05), 0 12px 26px -18px rgba(${T.shadowBase},0.5); }
.road-num { width: 25px; height: 25px; flex-shrink: 0; border-radius: 50%; background: ${T.accentSoft};
  color: ${T.accentDk}; display: grid; place-items: center; font-size:  17px; font-weight: 800; }

/* контейнеры иконок: держат SVG, а не эмодзи — размер задаёт бокс, не шрифт */
.road-ico { display: grid; place-items: center; width: 26px; height: 26px; flex-shrink: 0; color: ${T.accentDk}; }
.road-t { flex: 1; min-width: 0; font-weight: 600; }

/* ── КИНОЛЕНТА: одна сцена на экране ──────────────────────────
   Экраны «кто рядом» и «интернет запоминает» (переработаны 2026-08-05).
   Слот держит постоянную высоту: сцены разной сложности не должны дёргать
   вёрстку, иначе теряется ощущение, что одна сцена ЗАМЕНЯЕТ другую на том же
   месте, а Симка и «Дальше» прыгают вслед за ней.
   Приезд справа / уезд влево — направление чтения: лента идёт вперёд. */
.scene-slot { position: relative; width: 100%; display: grid; overflow: hidden;
  min-height: clamp(230px, 46dvh, 400px); }
/* Ширина карточки ограничена намеренно. Во всю колонку (936px на ноутбуке)
   карточка растягивается, а рисунок с постоянной пропорцией 240×150 упирается
   в высоту — и занимает треть карточки вместо «большей части»: замерено 29%
   ширины до ограничения и 79% после. */
.scene { grid-area: 1 / 1; justify-self: center; align-self: stretch;
  width: min(100%, 500px); display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: clamp(6px, 1.1dvh, 12px);
  padding: clamp(12px, 2.2vw, 22px) clamp(14px, 2.6vw, 26px) clamp(14px, 2vw, 20px);
  background: ${T.paper}; border-radius: 28px;
  box-shadow: 0 3px 0 rgba(${T.shadowBase},0.05), 0 26px 48px -26px rgba(${T.shadowBase},0.55);
  animation: sceneIn .42s cubic-bezier(.2,.85,.3,1) both; }
.scene.is-out { animation: sceneOut .38s cubic-bezier(.45,0,.75,.4) forwards; }
@keyframes sceneIn  { from { opacity: 0; transform: translateX(46px) scale(.97); }
                      to   { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes sceneOut { from { opacity: 1; transform: translateX(0) scale(1); }
                      to   { opacity: 0; transform: translateX(-46px) scale(.97); } }
/* ── РИСУНКИ: ПОЭЛЕМЕНТНЫЙ ВЫХОД И ЖИВОЕ ДВИЖЕНИЕ ─────────────
   Заказчик, 2026-08-05: «пусть каждый элемент выйдет по очереди или когда об
   этом говорит Симка». Сцена собирается на глазах, пока идёт реплика.
   Базовая opacity — 1, а не 0: при prefers-reduced-motion анимаций нет, и
   рисунок обязан быть виден целиком. Скрытым элемент делает только
   animation-fill-mode: both внутри блока no-preference.
   Классы движения (tw/sw/beat/bob/fl/shine) взяты из присланных референсов и
   namespace'ятся под .art — имена слишком общие, чтобы жить в глобальном CSS. */
.art .rv { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  @keyframes rvIn { from { opacity: 0; transform: translateY(14px) scale(.94); }
                    to   { opacity: 1; transform: none; } }
  .art .rv { transform-box: fill-box; transform-origin: center;
    animation: rvIn .5s cubic-bezier(.2,.85,.3,1) both; }
  .art .rv-1 { animation-delay: .10s; } .art .rv-2 { animation-delay: .55s; }
  .art .rv-3 { animation-delay: 1.00s; } .art .rv-4 { animation-delay: 1.45s; }
  .art .rv-5 { animation-delay: 1.90s; } .art .rv-6 { animation-delay: 2.35s; }
  .art .rv-7 { animation-delay: 2.80s; } .art .rv-8 { animation-delay: 3.25s; }

  @keyframes artBeat { 0%,100% { transform: scale(1); } 18% { transform: scale(1.16); }
                       36% { transform: scale(1); } 54% { transform: scale(1.1); } }
  @keyframes artBlink { 0%,91%,100% { transform: scaleY(1); } 95% { transform: scaleY(.08); } }
  @keyframes artSway { 0%,100% { transform: translateY(0) rotate(0deg); }
                       50% { transform: translateY(-4px) rotate(.7deg); } }
  @keyframes artSway2 { 0%,100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-5px) rotate(-.8deg); } }
  @keyframes artTw { 0%,100% { transform: scale(.6); opacity: .4; }
                     50% { transform: scale(1.1); opacity: 1; } }
  @keyframes artBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
  @keyframes artFlow { to { stroke-dashoffset: -30; } }
  @keyframes artSweep { 0% { transform: translateX(-70px); } 55%,100% { transform: translateX(230px); } }
  .art .beat { transform-box: fill-box; transform-origin: center; animation: artBeat 1.6s ease-in-out infinite; }
  .art .eyes { transform-box: fill-box; transform-origin: center; animation: artBlink 4.2s ease-in-out infinite; }
  .art .eyes.b { animation-duration: 5.1s; animation-delay: .7s; }
  .art .eyes.c { animation-duration: 3.6s; animation-delay: 1.5s; }
  .art .sw  { transform-box: fill-box; transform-origin: bottom center; animation: artSway 4.4s ease-in-out infinite; }
  .art .sw2 { transform-box: fill-box; transform-origin: bottom center; animation: artSway2 3.8s ease-in-out infinite; }
  .art .tw  { transform-box: fill-box; transform-origin: center; animation: artTw 2.5s ease-in-out infinite; }
  .art .t2 { animation-delay: .9s; } .art .t3 { animation-delay: 1.7s; }
  .art .bob { animation: artBob 4s ease-in-out infinite; }
  .art .fl { stroke-dasharray: 9 21; animation: artFlow 1.2s linear infinite; }
  .art .shine { animation: artSweep 4.5s ease-in-out infinite; }
}

/* Иллюстрация — главная часть карточки, ей отдана вся свободная высота. */
.scene-art { flex: 1 1 auto; width: 100%; min-height: 0; display: grid; place-items: center; }
/* Картинка — главное на экране, ей отдаём максимум высоты (заказчик, 2026-08-06:
   «картинки нужно сделать покрупнее»). Потолок поднят с 27dvh/252px: на телефоне
   это +25% к кадру. Ниже, в блоке низких окон, потолок остаётся жёстким — там
   высоту режем именно у картинки, а не у текста. */
.art { width: 100%; height: 100%; max-height: clamp(168px, 34dvh, 330px); display: block; }
.scene-t { flex: 0 0 auto; font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(20px, 4.6vw, 30px); line-height: 1.15; font-weight: 600;
  letter-spacing: -0.01em; color: ${T.ink}; text-align: center;
  animation: fadeUp .3s .18s cubic-bezier(.2,.7,.3,1) both; }
/* Подпись — ярлык сцены в 2–3 слова, а не пересказ реплики. */
.scene-cap { flex: 0 0 auto; border-radius: 99px; padding: 7px 18px;
  font-size: clamp(17px, 2.9vw, 18px); font-weight: 800; letter-spacing: .01em; text-align: center;
  animation: fadeUp .3s .3s cubic-bezier(.2,.7,.3,1) both; }
.scene-ok   .scene-cap { background: ${T.successSoft}; color: ${T.success}; }
.scene-warn .scene-cap { background: ${T.accentSoft}; color: ${T.accentDk}; }
.ask-center { text-align: center; }
/* Точки — единственный второй объект на экране; намеренно мелкие и тихие. */
.scene-dots { display: flex; justify-content: center; gap: 8px; }
.scene-dot { width: 8px; height: 8px; border-radius: 99px; background: rgba(${T.shadowBase}, 0.16);
  transition: width .35s cubic-bezier(.2,.8,.3,1), background .35s ease; }
.scene-dot.is-done { background: rgba(255,79,40,0.38); }
.scene-dot.is-now { width: 24px; background: ${T.accent}; }

/* ── СЕТЬ И ПОЛЁТ СООБЩЕНИЯ (экраны 4 и 5) ────────────────────
   Рисунок живёт в такой же коробке, как сцена киноленты: одна ширина, одна
   высота, один ритм. Вся анимация — CSS: React переключает класс стадии и
   больше ничего не делает, поэтому кадры не зависят от ре-рендера. */
.netbox { width: min(100%, 500px); margin-inline: auto; background: ${T.paper};
  border-radius: 28px; padding: clamp(10px, 2vw, 18px);
  box-shadow: 0 3px 0 rgba(${T.shadowBase},0.05), 0 26px 48px -26px rgba(${T.shadowBase},0.55);
  animation: sceneIn .42s cubic-bezier(.2,.85,.3,1) both; }
.netbox .art { max-height: clamp(176px, 37dvh, 350px); }

/* СЦЕНА «ЧТО ТАКОЕ ИНТЕРНЕТ» — стили из internet-picture.html (2026-08-06).
   Предыдущая сеть из трёх устройств снята целиком: классы .nw-dev/.nw-link/
   .nw-flow/.ni-* и keyframes nwDevIn/nwDraw удалены вместе с ней.

   Шаг сцены задаёт ScreenDialog (поле step у реплики) — здесь только состояния.
   Демо-файл вешал те же классы из своего скрипта по таймерам at(1000)…at(6100);
   таймеры выброшены, потому что шаги обязаны совпадать с репликами, а не идти
   своим ходом.

   prefers-reduced-motion не дублируем: в конце CSS_BASE уже стоит общее правило,
   которое гасит все переходы и анимации урока разом. */

/* Карточка выезжает: сначала растягивается по горизонтали, потом проявляются пятна. */
.ip .ip-card { transform: scaleX(.12) scaleY(.42); opacity: 0; transform-origin: 50% 50%;
  transform-box: view-box;
  transition: transform .8s cubic-bezier(.3,1.35,.45,1), opacity .45s; }
.ip.is-on .ip-card { transform: none; opacity: 1; }
.ip .ip-blobs { opacity: 0; transition: opacity .6s .25s; }
.ip.is-on .ip-blobs { opacity: 1; }

/* Устройства. Положение и масштаб задаёт инлайновый transform из NET_POS,
   переход отсюда — поэтому компьютер «уезжает» влево вниз, а не прыгает. */
.ip .ip-dev { transform-box: view-box; transform-origin: 0 0; opacity: 0;
  transition: transform .95s cubic-bezier(.34,1.32,.5,1), opacity .45s; }
.ip .ip-dev.show { opacity: 1; }

/* Нити вытягиваются по очереди — компьютер → планшет → телефон → компьютер. */
.ip .ip-wire .base { stroke-dasharray: 1; stroke-dashoffset: 1;
  transition: stroke-dashoffset .55s ease-out; }
.ip .ip-wire .dash { opacity: 0; transition: opacity .4s .35s; }
.ip.is-wired .ip-wire .base { stroke-dashoffset: 0; }
.ip.is-wired .ip-wire .dash { opacity: 1; }
.ip.is-wired .w2 .base { transition-delay: .43s; }
.ip.is-wired .w2 .dash { transition-delay: .78s; }
.ip.is-wired .w3 .base { transition-delay: .86s; }
.ip.is-wired .w3 .dash { transition-delay: 1.21s; }

/* Кружки-сообщения. Показывает класс, а бег включает JS через beginElement. */
.ip .ip-pkt { opacity: 0; transition: opacity .3s; }
.ip .ip-pkts.go .ip-pkt { opacity: 1; }

/* Блёстки на фоне — единственное, что живёт своей жизнью, и только когда
   карточка уже на экране. */
.ip .ip-spark { opacity: 0; transition: opacity .5s; }
.ip.is-on .ip-spark { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  @keyframes ipTw { 0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(.72); opacity: .55; } }
  .ip.is-on .ip-spark { transform-box: fill-box; transform-origin: center;
    animation: ipTw 2.6s ease-in-out infinite; }
  .ip.is-on .ip-spark:nth-of-type(2) { animation-delay: 1.1s; }
}

/* ── «С КЕМ МОЖНО РАЗГОВАРИВАТЬ» (вступление экрана 7) ────────
   Порядок демо: зелёная колонка → мама с галочкой → друг с галочкой → красная
   колонка → незнакомец → перечёркнут. Таймеры заменены на animation-delay. */
.tk .tk-panel, .tk .tk-who, .tk .tk-lb, .tk .tk-badge, .tk .tk-no { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .tk .tk-panel, .tk .tk-who, .tk .tk-lb, .tk .tk-badge, .tk .tk-no { opacity: 1; }
}
@media (prefers-reduced-motion: no-preference) {
  @keyframes tkPanel { from { opacity: 0; transform: scale(.9); } to { opacity: 1; transform: none; } }
  @keyframes tkWho { from { opacity: 0; transform: scale(.35); } to { opacity: 1; transform: none; } }
  @keyframes tkPop { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: none; } }
  @keyframes tkFade { to { opacity: 1; } }
  @keyframes tkNo { from { opacity: 0; transform: scale(2.4) rotate(-14deg); } to { opacity: 1; transform: none; } }
  .tk .tk-panel, .tk .tk-who, .tk .tk-badge, .tk .tk-no {
    transform-box: fill-box; transform-origin: center; }
  .tk .tk-pl { animation: tkPanel .55s cubic-bezier(.34,1.5,.5,1) both .6s; }
  .tk .tk-w0 { animation: tkWho .6s cubic-bezier(.34,1.6,.5,1) both 1.05s; }
  .tk .tk-w0 .tk-badge { animation: tkPop .45s cubic-bezier(.34,1.75,.5,1) both 1.5s; }
  .tk .tk-lb0 { animation: tkFade .45s linear both 1.05s; }
  .tk .tk-w1 { animation: tkWho .6s cubic-bezier(.34,1.6,.5,1) both 1.75s; }
  .tk .tk-w1 .tk-badge { animation: tkPop .45s cubic-bezier(.34,1.75,.5,1) both 2.2s; }
  .tk .tk-lb1 { animation: tkFade .45s linear both 1.75s; }
  .tk .tk-pr { animation: tkPanel .55s cubic-bezier(.34,1.5,.5,1) both 2.8s; }
  .tk .tk-wx { animation: tkWho .6s cubic-bezier(.34,1.6,.5,1) both 3.25s; }
  .tk .tk-lb2 { animation: tkFade .45s linear both 3.25s; }
  .tk .tk-no { animation: tkNo .5s cubic-bezier(.3,1.5,.5,1) both 3.8s; }
}

/* ── «ИНТЕРНЕТ МОЖЕТ ЗАПОМИНАТЬ» (вступление экрана 8) ────────
   Один прогон вместо четырёх шагов демо: фото у тебя (0.7с) → улетает (2.2с) →
   облако принимает (3.15с) → удалил у себя (4.6с) → а в интернете осталось (6.4с).
   Ключевое читается без слов: «мой» кадр гаснет, кадр в облаке — нет. */
.rm .rm-mine, .rm .rm-bin, .rm .rm-fly, .rm .rm-kept, .rm .rm-halo, .rm .rm-arrow, .rm .rm-cloud { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .rm .rm-bin, .rm .rm-kept, .rm .rm-arrow, .rm .rm-cloud { opacity: 1; }
}
@media (prefers-reduced-motion: no-preference) {
  @keyframes rmFade { to { opacity: 1; } }
  @keyframes rmPop { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: none; } }
  /* «Моё» фото исчезает — его стёрли. Именно этот кадр гаснет, а не тот, что в облаке. */
  @keyframes rmGone { from { opacity: 1; transform: none; } to { opacity: 0; transform: scale(.35) rotate(-16deg); } }
  @keyframes rmFly {
    0%   { opacity: 0; transform: translate(140px,236px) scale(.36); }
    12%  { opacity: 1; }
    88%  { opacity: 1; }
    100% { opacity: 0; transform: translate(450px,204px) scale(.7); } }
  @keyframes rmThump { 0%,100% { transform: scale(1); } 40% { transform: scale(1.06); } }
  @keyframes rmGlow { 0% { transform: scale(.75); opacity: .7; } 100% { transform: scale(1.5); opacity: 0; } }
  .rm .rm-arrow, .rm .rm-cloud { animation: rmFade .45s linear both .1s; }
  .rm .rm-mine { transform-box: fill-box; transform-origin: center;
    animation: rmPop .5s cubic-bezier(.34,1.7,.5,1) both .7s, rmGone .5s ease-in both 4.6s; }
  .rm .rm-fly { transform-box: view-box; transform-origin: 0 0;
    animation: rmFly .95s cubic-bezier(.4,0,.4,1) both 2.2s; }
  .rm .rm-kept { transform-box: fill-box; transform-origin: center;
    animation: rmPop .35s cubic-bezier(.34,1.7,.5,1) both 3.05s; }
  .rm .rm-cloud { animation: rmFade .45s linear both .1s, rmThump .7s cubic-bezier(.34,1.6,.5,1) 3.15s; }
  .rm .rm-bin { transform-box: fill-box; transform-origin: center;
    animation: rmPop .5s cubic-bezier(.34,1.7,.5,1) both 4.6s; }
  .rm .rm-halo { transform-box: fill-box; transform-origin: center;
    animation: rmGlow 1.6s ease-out 6.4s infinite; }
}

/* ── СЕТЬ ТОЧЕК (вступление экрана 6, internet-network.html) ──
   Вся волна расписана задержками от двух переменных: --l у точки (круг волны, на
   котором она загорается) и --s у связи. Формулы повторяют тайминг демо: точки
   проявляются с 600мс по 55мс друг за другом, отправитель загорается на 1500мс,
   каждый следующий круг волны идёт через 620мс, а связь прочерчивается за 420мс
   до того, как загорится точка на её конце.
   Базовые состояния (погашено, связь не прочерчена) стоят ВНЕ media-блока, а при
   prefers-reduced-motion сеть показывается сразу в конечном виде: без этого
   ребёнок с отключённой анимацией остался бы перед серой россыпью. */
.nwv .nwv-node .lit { opacity: 0; }
.nwv .nwv-edge .e-lit { stroke-dasharray: 1; stroke-dashoffset: 1; }
.nwv .nwv-edge .e-dash { opacity: 0; }
.nwv .ping { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .nwv .nwv-node .lit, .nwv .nwv-edge .e-dash { opacity: 1; }
  .nwv .nwv-edge .e-lit { stroke-dashoffset: 0; }
}
@media (prefers-reduced-motion: no-preference) {
  .nwv .nwv-node { transform-box: fill-box; transform-origin: center;
    animation: nwvIn .55s cubic-bezier(.34,1.6,.5,1) both calc(600ms + var(--i) * 55ms); }
  @keyframes nwvIn { from { opacity: 0; transform: scale(.25); } to { opacity: 1; transform: none; } }
  /* Экран точки загорается, и вокруг неё расходится кольцо. Два движения — на
     двух разных узлах: на одном узле два animation не уживаются. */
  .nwv .nwv-node .lit { animation: nwvLit .4s linear both calc(1500ms + var(--l) * 620ms); }
  @keyframes nwvLit { to { opacity: 1; } }
  .nwv .ping { transform-box: fill-box; transform-origin: center;
    animation: nwvPing .9s ease-out both calc(1500ms + var(--l) * 620ms); }
  @keyframes nwvPing { 0% { transform: scale(.55); opacity: .65; } 100% { transform: scale(2.8); opacity: 0; } }
  .nwv .nwv-edge .e-lit { animation: nwvDraw .42s linear both calc(1080ms + var(--s) * 620ms); }
  @keyframes nwvDraw { to { stroke-dashoffset: 0; } }
  .nwv .nwv-edge .e-dash { animation: nwvLit .3s linear both calc(1380ms + var(--s) * 620ms); }
  /* Суша на глобусе едет по кругу — единственное бесконечное движение кадра. */
  .nwv .nwv-land { animation: nwvSpin 14s linear infinite; }
  @keyframes nwvSpin { to { transform: translateX(-70px); } }
  .nwv .nwv-spark { transform-box: fill-box; transform-origin: center;
    animation: nwvTw 2.6s ease-in-out infinite; }
  .nwv .nwv-spark:nth-of-type(2) { animation-delay: 1.2s; }
  @keyframes nwvTw { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.72); opacity: .55; } }
}

/* ПОЛЁТ СООБЩЕНИЯ — стили сцены заказчика send-message.html (2026-08-06).
   Предыдущий вариант (три бегущих огонька из high_saturation_two_phones_transfer)
   заменён целиком: keyframes flyGo/snBump/snPop/snDash и классы .fly-craft,
   .sn-dot, .sn-pop, .sn-dash, .fly-in, .fly-recv удалены вместе с ним.

   Отличие от исходного файла ровно одно: там классы вешает скрипт демо-страницы,
   здесь их накапливает ScreenSend по фазам SEND_PHASES. Накопление обязательно —
   .is-fly должен остаться, когда добавляется .is-msg, иначе самолётик на середине
   пути поедет обратно к старту.

   Тайминги CSS взяты из файла без изменений и должны сходиться с SEND_T:
   перелёт 1.55 с против шага gone на 1.6 с — самолётик успевает долететь до того,
   как его гасят. */
.snd .sm-recv { transform-box: fill-box; transform-origin: center;
  transition: transform .5s cubic-bezier(.34,1.6,.5,1); }
.snd .sm-screen { opacity: 0; transition: opacity .5s ease-out; }
.snd.is-lit .sm-screen { opacity: 1; }
.snd.is-lit .sm-recv { transform: scale(1.06); }
.snd.is-settled .sm-recv { transform: none; }

/* Награды: вылетают, когда сообщение дошло. */
.snd .sm-prize { opacity: 0; transform-box: view-box; transform-origin: center;
  transform: scale(.3); transition: opacity .4s, transform .5s cubic-bezier(.34,1.7,.5,1); }
.snd.is-lit .sm-prize { opacity: 1; transform: none; }
.snd.is-lit .sm-prize.p2 { transition-delay: .09s; }
.snd.is-lit .sm-prize.p3 { transition-delay: .18s; }

/* Летящий объект. Стартовая точка и дистанция — из файла: 234 → 406 по x. */
.snd .sm-flier { transform-box: view-box; transform-origin: 0 0;
  transform: translate(234px, 185px); opacity: 0;
  transition: transform 1.55s cubic-bezier(.42,0,.55,1), opacity .28s; }
.snd.is-fly .sm-flier { transform: translate(406px, 185px); opacity: 1; }
.snd.is-gone .sm-flier { opacity: 0; }
.snd .sm-plane, .snd .sm-sms, .snd .sm-glow { transition: opacity .34s ease; }
.snd .sm-sms { opacity: 0; }
.snd.is-msg .sm-plane { opacity: 0; }
.snd.is-msg .sm-sms { opacity: 1; }
.snd .sm-glow { opacity: 0; }
.snd.is-fly .sm-glow { opacity: 1; }

/* ── ЗНАЧОК ──────────────────────────────────────────────────── */
/* ЗНАЧОК СТОИТ В ЦЕНТРЕ, НАД ВЫБОРОМ (заказчик, 2026-08-06: «то, что выбирает
   ребёнок, поставим в центр и сделаем немного побольше, чтобы фокус ребёнка был
   в центре»). Раньше это была строка: кольцо 112px слева у самого края и два
   ряда кнопок справа — взгляд уходил вправо, к кнопкам, а результат выбора
   оставался на периферии. Теперь колонка: сверху крупное кольцо по центру, под
   ним выбор — тоже по центру. Сами кнопки НЕ увеличены: крупнее должен стать
   результат, а не органы управления, иначе экран снова перетянет внимание на
   палитру. Ширина блока выбора ограничена 288px, чтобы четыре цвета и пять
   знаков ложились ровными рядами под кольцом, а не растягивались по всей карточке. */
.maker { display: flex; flex-direction: column; align-items: center;
  gap: clamp(12px, 2.2dvh, 20px); }
.maker-side { width: min(100%, 288px); display: flex; flex-direction: column;
  gap: 7px; align-items: center; }
.maker-lbl { font-size:  17px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em;
  color: ${T.ink2}; text-align: center; }
.swatches, .syms { display: flex; gap: 9px; flex-wrap: wrap; justify-content: center; }
/* Квадратики выбора тоже переведены на язык нового стиля: у каждого свой
   тёмно-синий контур. На белой карточке это разом поднимает контраст —
   раньше светлый цвет на светлом фоне «растворялся» по краям. */
/* Заливка — та же пара и тот же глянец, что у кольца, только полоса-блик короче:
   на 44px длинная диагональ читалась бы как царапина, а не как стекло. */
.swatch { width: 44px; height: 44px; border: none; border-radius: 13px; cursor: pointer;
  background: var(--bcB);
  background:
    linear-gradient(118deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.5) 38%,
      rgba(255,255,255,0) 46%),
    linear-gradient(158deg, var(--bcA) 0%, var(--bcB) 62%, var(--bcB) 100%);
  box-shadow: 0 0 0 2.5px ${P.ink}, 0 3px 0 rgba(58,30,92,0.16);
  transition: transform .14s ease-out, box-shadow .2s; }
.swatch.is-on { box-shadow: 0 0 0 2.5px ${P.ink}, 0 0 0 5.5px ${T.paper},
  0 0 0 8px ${P.ink}, 0 6px 14px -6px rgba(58,30,92,0.5); transform: scale(1.06); }
.swatch:active, .sym:active { transform: scale(.93); }
.sym { width: 44px; height: 44px; border: none; border-radius: 13px; background: ${T.paper}; cursor: pointer;
  color: ${T.ink2}; display: grid; place-items: center;
  box-shadow: 0 2px 0 rgba(${T.shadowBase},0.06), 0 8px 18px -12px rgba(${T.shadowBase},0.5);
  transition: transform .14s ease-out, box-shadow .2s; }
.sym.is-on { color: ${T.accentDk}; box-shadow: 0 0 0 2.5px ${T.accent}, 0 8px 18px -10px rgba(${T.shadowBase},0.5); transform: scale(1.06); }

.badge { display: flex; flex-direction: column; align-items: center; gap: 8px; }
/* Кольцо значка. Раньше низ кольца замешивался на 38% ЧЁРНОГО — из-за этого
   значок читался тёмным, какой бы яркий цвет ребёнок ни выбрал. Чёрного здесь
   больше нет вообще: объём даёт светлый глянец сверху и ТЁПЛЫЙ отражённый свет
   снизу вместо тени.
   (Обратных кавычек в этом блоке быть не может — он внутри JS-шаблона.)
   Про color-mix и одиночную переменную --bc здесь больше не читать: третий заход
   ниже перевёл кольцо на готовую пару --bcA/--bcB, color-mix из кода ушёл.
   Геометрия бликов не случайна: знак занимает 46% кольца, то есть по вертикали
   с 27% до 73%. Верхний блик гаснет к 25%, нижний подсвет начинается с 88% —
   ни один не заходит под белую иконку, где сжирал бы её контраст. */
/* Второй заход по контрасту (заказчик: «нужно ещё контрастность»). Убрав
   чёрное, кольцо стало ярким, но плоским: светлый градиент + белый знак —
   это два светлых пятна друг на друге. Контраст возвращаем не затемнением, а
   ЯЗЫКОМ НОВОГО СТИЛЯ: толстый контур #3A1E5C вокруг кольца и такой же
   тёмно-фиолетовый кант у самого знака. Низ кольца подмешивает 12% контурного #3A1E5C —
   это углубляет цвет, оставаясь в синей гамме, а не сереет, как с чёрным. */
/* ТРЕТИЙ ЗАХОД (заказчик, 2026-08-06: «ярче и глянцевой как на картинке»).
   Цвет больше не считается через color-mix из одного hex — берётся ГОТОВАЯ
   насыщенная пара слайдов (--bcA светлый / --bcB тёмный), поэтому кольцо звучит
   ровно как экраны устройств на кадрах урока. Глянец собран тем же приёмом, что
   на слайдах: узкая белая диагональная полоса-блик поверх купола света.
   Слои сверху вниз:
     1) полоса-блик под 115deg — то самое «стекло»;
     2) купол света в левом верхнем углу;
     3) притемнение низа синим #172363 (цвет корпусов на слайдах), а не чёрным —
        чёрный уже один раз сделал кольцо грязным, см. историю выше;
     4) сам цвет: светлый конец гаснет к 52%, ниже лежит только тёмный —
        под знаком обязан быть тёмный конец, иначе белый знак плывёт.
   Фолбэк background: var(--bcB) идёт ПЕРВЫМ: движок, не понявший слоёв,
   отбросит следующее объявление целиком и кольцо станет прозрачным. */
.badge-ring { display: grid; place-items: center; border-radius: 50%;
  background: var(--bcB);
  background:
    linear-gradient(115deg, rgba(255,255,255,0) 24%, rgba(255,255,255,0.58) 33%,
      rgba(255,255,255,0.14) 41%, rgba(255,255,255,0) 49%),
    radial-gradient(58% 38% at 32% 10%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0) 72%),
    radial-gradient(84% 56% at 50% 108%, rgba(23,35,99,0.34) 0%, rgba(23,35,99,0) 62%),
    linear-gradient(158deg, var(--bcA) 0%, var(--bcB) 52%, var(--bcB) 100%);
  box-shadow: 0 0 0 5px ${P.ink}, 0 0 0 9px ${T.paper},
    0 16px 30px -12px rgba(58,30,92,0.42); }
/* md — кольцо на экране-конструкторе (было 112px, поднято 2026-08-06 вместе с
   переносом значка в центр). lg — экраны «вот он, твой значок» и финал; его тоже
   пришлось поднять: на телефоне lg считался как 34vw ≈ 127px и после укрупнения
   md значок на экране-показе оказался бы МЕНЬШЕ, чем на экране выбора, то есть
   главный кадр урока выглядел бы шагом назад. Разница между md и lg держится
   около 1,15 — этого хватает, чтобы показ читался как торжественный. */
/* УКРУПНЕНО ВТОРОЙ РАЗ (заказчик, 2026-08-06: «значок слишком маленький, ребёнок
   может и не обращать внимания»). Размер теперь считается и от высоты окна тоже:
   на невысоком экране кольцо иначе вылезло бы за рабочую область, а min() держит
   его в рамках без отдельного правила в media-блоке. */
.badge-md .badge-ring { width: clamp(150px, min(46vw, 26dvh), 210px); height: clamp(150px, min(46vw, 26dvh), 210px); }
.badge-lg .badge-ring { width: clamp(186px, min(58vw, 34dvh), 268px); height: clamp(186px, min(58vw, 34dvh), 268px); }
/* Кант знака. Icon канона не умеет обводку у сплошных иконок (и трогать инфру
   нельзя), поэтому кант собран из двух одинаковых drop-shadow с нулевым
   смещением — они складываются в плотную тёмно-синюю кромку вокруг белого
   знака. Это и даёт контраст на любом, даже самом светлом кольце. */
.badge-sym { display: grid; place-items: center; width: 46%; height: 46%; color: #fff;
  filter: drop-shadow(0 0 1.6px ${P.ink}) drop-shadow(0 0 1.6px ${P.ink})
    drop-shadow(0 2px 4px rgba(58,30,92,.5)); }
.badge-show { display: flex; justify-content: center; animation: heroPop .55s cubic-bezier(.34,1.6,.5,1) both; }

/* ── BOOT ────────────────────────────────────────────────────── */
.boot { position: absolute; inset: 0; z-index: 90; background: ${T.bg};
  display: grid; place-items: center; padding: var(--pad); }
.boot.is-out { animation: bootOut .44s ease-in forwards; }
@keyframes bootOut { to { opacity: 0; transform: scale(1.03); } }
.boot-inner { width: 100%; max-width: 420px; display: flex; flex-direction: column;
  align-items: center; gap: clamp(14px, 2.6dvh, 24px); }
.boot-badge { display: flex; flex-direction: column; align-items: center; gap: 10px;
  animation: fadeUp .5s cubic-bezier(.2,.7,.3,1) both; }
.boot-emblem { width: clamp(56px, 14vw, 76px); height: auto; }
.boot-shield { fill: ${T.accentSoft}; stroke: ${T.accent}; stroke-width: 4; }
.boot-check { fill: none; stroke: ${T.accent}; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 44; stroke-dashoffset: 44; animation: bootCheck .7s .5s ease-out forwards; }
@keyframes bootCheck { to { stroke-dashoffset: 0; } }
.boot-brand { font-size:  17px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: ${T.ink2}; }
.boot-console { width: 100%; display: flex; flex-direction: column; gap: 7px; min-height: 116px; }
.boot-row { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; font-size:  17px; }
.boot-q { color: ${T.ink2}; }
.boot-caret { display: inline-block; width: 7px; height: 13px; margin-left: 2px; background: ${T.accent};
  vertical-align: -2px; animation: caret 1s steps(1) infinite; }
@keyframes caret { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
.boot-a { display: flex; align-items: center; gap: 5px; margin-left: auto; font-weight: 700; color: ${T.success}; }
.boot-a.is-wait { color: ${T.hint}; }
.boot-track { width: 100%; height: 5px; border-radius: 99px; background: rgba(${T.shadowBase},0.10); overflow: hidden; }
.boot-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accent}, #FF7A45);
  transition: width .4s cubic-bezier(.4,0,.2,1); }
.boot-welcome { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(18px, 4.4vw, 25px);
  font-weight: 600; text-align: center; color: ${T.accentDk};
  animation: heroPop .6s cubic-bezier(.34,1.6,.5,1) both; }
/* Кнопка входа. Появляется чуть позже приветствия, чтобы ребёнок сначала прочитал
   (или услышал от взрослого) строку, а потом увидел, куда нажать. Пульсирующее
   кольцо — тот же приём, что у «Дальше» в каноне: показывает, что ход за ребёнком. */
.boot-start { align-self: center; margin-top: clamp(4px, 1.2dvh, 12px);
  animation: heroPop .5s .35s cubic-bezier(.34,1.6,.5,1) both; }

@media (max-height: 560px) {
  .lesson-root { --av-hero: clamp(120px, min(38vw, 34dvh), 210px); }
  .hero-dot { width: 28px; height: 28px; }
  /* Значок на низком окне. md остаётся 88px, но экран-конструктор теперь колонка
     (значок сверху по центру), и колонка на 202px рабочей высоты не влезала —
     замерено на 740×420: прокрутка 47px. Высоту снимаем не со значка, а с
     подписей: .maker-side превращается в сетку «подпись — ряд кнопок», и две
     строки по 14px уходят. Стало 88+8+44+6+44 = 190 из 202.
     lg (экраны показа значка и финала) считался как 41vw и на ландшафтном
     телефоне доходил до 196px — здесь он фиксируется, иначе кольцо съедает
     реплику Симки и подпись. */
  .badge-md .badge-ring { width: 88px; height: 88px; }
  .badge-lg .badge-ring { width: 116px; height: 116px; }
  .maker { gap: 8px; }
  .maker-side { width: auto; display: grid; grid-template-columns: auto 1fr;
    align-items: center; column-gap: 10px; row-gap: 6px; }
  .maker-lbl { text-align: right; }
  .boot-console { min-height: 92px; }
  /* кинолента, сеть и полёт: та же логика — режем высоту картинки, не текст.
     Проверено на 740×420: без этих правил карточка + точки не влезали в
     202px рабочей высоты и урок начинал прокручиваться. */
  .scene-slot { min-height: 146px; }
  .scene { border-radius: 18px; padding: 8px 12px 10px; gap: 4px; }
  /* На низком окне картинка почти не растёт, и это не забывчивость: рабочей
     высоты здесь ~202px, запаса было 3px. Замерено на 740×420 — при 104px экран
     прокручивался на 19px, при 86px — на 1px. 84px — потолок, при котором подпись
     ещё влезает без остатка. */
  .art { max-height: 84px; }
  .scene-t { font-size: 18px; }
  .scene-cap { font-size:  17px; padding: 4px 13px; }
  .scene-dots { gap: 6px; }
  .scene-dot { width: 6px; height: 6px; }
  .scene-dot.is-now { width: 17px; }
  .netbox { border-radius: 18px; padding: 8px; }
  .netbox .art { max-height: 96px; }
  .bigbtn { padding: 10px 16px; font-size:  17px; border-radius: 14px; }
}
/* ===== BEGIN АНИМАЦИИ ИЛЛЮСТРАЦИЙ (сгенерировано) ===== */
/* ── АНИМАЦИИ ИЛЛЮСТРАЦИЙ ─────────────────────────────────────
   Снято со слайдов заказчика (urok_internet_bezopasnost.html, 2026-08-06) и
   перенесено без правок логики. Как это работает:
     · базовый класс прячет элемент (opacity: 0);
     · показывает его АНИМАЦИЯ с animation-fill-mode: forwards;
     · включает анимацию класс-ворота на предке (.wiGo, .ctGo, .dvRun …).
   В уроке ворота висят на <g> внутри svg сцены, поэтому анимация играет на
   монтировании: каждая сцена киноленты монтируется заново, когда её карточка
   выезжает, и рисунок каждый раз собирается на глазах у ребёнка.
   У каждого слайда свой двухбуквенный префикс у ВСЕХ классов, keyframes и id —
   именно поэтому двенадцать наборов правил не задевают друг друга.
   Правила ниже не редактировать вручную: блок генерируется скриптом. */

/* Что такое Интернет → сцена globe */
.wiSt{opacity:0}
@keyframes wiPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes wiGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes wiFade{to{opacity:1}}
@keyframes wiSoft{to{opacity:.9}}
@keyframes wiHalo{to{opacity:.1}}
@keyframes wiDash{to{stroke-dashoffset:-58}}
@keyframes wiFloat{0%,100%{transform:translateY(-6px)}50%{transform:translateY(6px)}}
@keyframes wiSpin{0%{transform:scaleX(1)}25%{transform:scaleX(.25)}50%{transform:scaleX(1)}75%{transform:scaleX(.25)}100%{transform:scaleX(1)}}
@keyframes wiTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes wiBurst{0%{opacity:.8;transform:scale(.92)}100%{opacity:0;transform:scale(1.28)}}
@keyframes wiNode{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.35);opacity:.7}}
@keyframes wiTrav1{0%{opacity:0;transform:translate(0,0)}12%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(-84px,-34px)}}
@keyframes wiTrav2{0%{opacity:0;transform:translate(0,0)}12%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(84px,-34px)}}
@keyframes wiTrav3{0%{opacity:0;transform:translate(0,0)}12%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(-86px,38px)}}
@keyframes wiTrav4{0%{opacity:0;transform:translate(0,0)}12%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(86px,38px)}}
.wiGo .wiShad{transform-box:fill-box;transform-origin:center;animation:wiGrow .45s ease-out .1s forwards}
.wiGo .wiHalo{animation:wiHalo .8s ease-out .3s forwards}
.wiGo .wiGlobe{transform-box:fill-box;transform-origin:center;animation:wiPop .7s cubic-bezier(.3,1.5,.5,1) .25s forwards}
.wiGo .wiFloat{transform-box:fill-box;transform-origin:center;animation:wiFloat 4.6s ease-in-out 1s infinite}
.wiGo .wiMer{transform-box:fill-box;transform-origin:center;animation:wiSpin 9s ease-in-out 1.4s infinite}
.wiGo .wiRing{transform-box:fill-box;transform-origin:center;animation:wiBurst .55s ease-out .75s forwards}
.wiGo .wiDev{transform-box:fill-box;transform-origin:center;animation:wiPop .55s cubic-bezier(.3,1.5,.5,1) forwards,wiSoft .3s ease-out forwards}
.wiGo .wiD1{animation-delay:.8s}
.wiGo .wiD2{animation-delay:.95s}
.wiGo .wiD3{animation-delay:1.1s}
.wiGo .wiD4{animation-delay:1.25s}
.wiGo .wiLine{stroke-dasharray:16 13}
.wiGo .wiK1{animation:wiFade .3s ease-out 1.05s forwards,wiDash 1.5s linear 1.05s infinite}
.wiGo .wiK2{animation:wiFade .3s ease-out 1.2s forwards,wiDash 1.5s linear 1.2s infinite}
.wiGo .wiK3{animation:wiFade .3s ease-out 1.35s forwards,wiDash 1.5s linear 1.35s infinite}
.wiGo .wiK4{animation:wiFade .3s ease-out 1.5s forwards,wiDash 1.5s linear 1.5s infinite}
.wiGo .wiNode{transform-box:fill-box;transform-origin:center;animation:wiPop .4s cubic-bezier(.3,1.6,.5,1) forwards}
.wiGo .wiO1{animation-delay:1.5s}
.wiGo .wiO2{animation-delay:1.65s}
.wiGo .wiO3{animation-delay:1.8s}
.wiGo .wiO4{animation-delay:1.95s}
.wiGo .wiPulse{transform-box:fill-box;transform-origin:center;animation:wiNode 1.8s ease-in-out 2.25s infinite}
.wiGo .wiDot{transform-box:fill-box;transform-origin:center}
.wiGo .wiT1{animation:wiTrav1 1.9s ease-in-out 2s infinite}
.wiGo .wiT2{animation:wiTrav2 1.9s ease-in-out 2.15s infinite}
.wiGo .wiT3{animation:wiTrav3 1.9s ease-in-out 2.3s infinite}
.wiGo .wiT4{animation:wiTrav4 1.9s ease-in-out 2.45s infinite}
.wiGo .wiSpk{transform-box:fill-box;transform-origin:center;animation:wiTw .55s ease-out forwards}
.wiGo .wiS1{animation-delay:2.25s}
.wiGo .wiS2{animation-delay:2.4s}
.wiGo .wiS3{animation-delay:2.55s}
@media (prefers-reduced-motion: reduce){.wiGo .wiSt{animation:none;opacity:1}.wiGo .wiDev{animation:none;opacity:.9}.wiGo .wiHalo{animation:none;opacity:.1}.wiGo .wiFloat,.wiGo .wiMer,.wiGo .wiPulse{animation:none}.wiGo .wiK1,.wiGo .wiK2,.wiGo .wiK3,.wiGo .wiK4{animation:none;opacity:1}.wiGo .wiDot{animation:none;opacity:0}.wiGo .wiRing{animation:none;opacity:0}}

/* Интернет — как город → сцена city */
.ctSt{opacity:0}
@keyframes ctPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes ctGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes ctUp{0%{opacity:0;transform:scaleY(.12)}70%{opacity:1;transform:scaleY(1.06)}100%{opacity:1;transform:scaleY(1)}}
@keyframes ctFin{to{opacity:1}}
@keyframes ctTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes ctBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
.ctGo .ctGround{transform-box:fill-box;transform-origin:center;animation:ctGrow .5s ease-out .1s forwards}
.ctGo .ctBld{transform-box:fill-box;transform-origin:bottom center;animation:ctUp .55s cubic-bezier(.3,1.5,.5,1) forwards}
.ctGo .ctB1{animation-delay:.45s}
.ctGo .ctB2{animation-delay:.75s}
.ctGo .ctB3{animation-delay:1.05s}
.ctGo .ctB4{animation-delay:1.35s}
.ctGo .ctRoof{transform-box:fill-box;transform-origin:bottom center;animation:ctPop .5s cubic-bezier(.3,1.5,.5,1) 1.05s forwards}
.ctGo .ctWin{animation:ctFin .35s ease-out forwards}
.ctGo .ctW1{animation-delay:1.25s}
.ctGo .ctW2{animation-delay:1.4s}
.ctGo .ctW3{animation-delay:1.55s}
.ctGo .ctW4{animation-delay:1.6s}
.ctGo .ctPlay{transform-box:fill-box;transform-origin:center;animation:ctPop .5s cubic-bezier(.3,1.6,.5,1) .95s forwards}
.ctGo .ctBeat{transform-box:fill-box;transform-origin:center;animation:ctBeat 2.2s ease-in-out 2s infinite}
.ctGo .ctAwn{transform-box:fill-box;transform-origin:center;animation:ctPop .5s cubic-bezier(.3,1.5,.5,1) 1.7s forwards}
.ctGo .ctSpk{transform-box:fill-box;transform-origin:center;animation:ctTw .55s ease-out forwards}
.ctGo .ctS1{animation-delay:2s}
.ctGo .ctS2{animation-delay:2.15s}
.ctGo .ctS3{animation-delay:2.3s}
.ctGo .ctS4{animation-delay:2.45s}
@media (prefers-reduced-motion: reduce){.ctGo .ctSt{animation:none;opacity:1}.ctGo .ctBeat{animation:none}}

/* В городе есть правила → сцена rules */
.ruSt{opacity:0}
@keyframes ruPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes ruGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes ruRise{0%{opacity:0;transform:scaleY(.15)}70%{opacity:1;transform:scaleY(1.05)}100%{opacity:1;transform:scaleY(1)}}
@keyframes ruUp{0%{opacity:0;transform:scale(.4) translateY(28px)}60%{opacity:1;transform:scale(1.1) translateY(0)}80%{transform:scale(.98)}100%{opacity:1;transform:scale(1)}}
@keyframes ruFin{to{opacity:1}}
@keyframes ruTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes ruStep{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes ruRedC{0%,30%{opacity:1;transform:scale(1.06)}36%,94%{opacity:.2;transform:scale(1)}100%{opacity:1;transform:scale(1.06)}}
@keyframes ruYelC{0%,30%{opacity:.2;transform:scale(1)}36%,58%{opacity:1;transform:scale(1.06)}64%,100%{opacity:.2;transform:scale(1)}}
@keyframes ruGrnC{0%,58%{opacity:.2;transform:scale(1)}64%,90%{opacity:1;transform:scale(1.06)}96%,100%{opacity:.2;transform:scale(1)}}
.ruGo .ruGround{transform-box:fill-box;transform-origin:center;animation:ruGrow .5s ease-out .1s forwards}
.ruGo .ruPost{transform-box:fill-box;transform-origin:bottom center;animation:ruRise .45s ease-out .45s forwards}
.ruGo .ruBox{transform-box:fill-box;transform-origin:bottom center;animation:ruUp .6s cubic-bezier(.3,1.5,.5,1) .7s forwards}
.ruGo .ruLamp{transform-box:fill-box;transform-origin:center;animation:ruPop .45s cubic-bezier(.3,1.6,.5,1) forwards}
.ruGo .ruR{animation-delay:1.15s}
.ruGo .ruY{animation-delay:1.35s}
.ruGo .ruG{animation-delay:1.55s}
.ruGo .ruCyc{transform-box:fill-box;transform-origin:center}
.ruGo .ruCr{animation:ruRedC 5.4s ease-in-out 2s infinite}
.ruGo .ruCy{animation:ruYelC 5.4s ease-in-out 2s infinite}
.ruGo .ruCg{animation:ruGrnC 5.4s ease-in-out 2s infinite}
.ruGo .ruSignPost{transform-box:fill-box;transform-origin:bottom center;animation:ruRise .45s ease-out 1.5s forwards}
.ruGo .ruSign{transform-box:fill-box;transform-origin:center;animation:ruPop .55s cubic-bezier(.3,1.5,.5,1) 1.75s forwards}
.ruGo .ruWalk{transform-box:fill-box;transform-origin:center;animation:ruPop .45s cubic-bezier(.3,1.5,.5,1) 2.05s forwards}
.ruGo .ruStep{transform-box:fill-box;transform-origin:bottom center;animation:ruStep 1.6s ease-in-out 2.7s infinite}
.ruGo .ruZ{animation:ruFin .25s ease-out forwards}
.ruGo .ruZ1{animation-delay:2.2s}
.ruGo .ruZ2{animation-delay:2.3s}
.ruGo .ruZ3{animation-delay:2.4s}
.ruGo .ruZ4{animation-delay:2.5s}
.ruGo .ruKid{transform-box:fill-box;transform-origin:bottom center;animation:ruUp .55s cubic-bezier(.3,1.5,.5,1) 2.5s forwards}
.ruGo .ruSpk{transform-box:fill-box;transform-origin:center;animation:ruTw .55s ease-out forwards}
.ruGo .ruS1{animation-delay:2.8s}
.ruGo .ruS2{animation-delay:2.95s}
.ruGo .ruS3{animation-delay:3.1s}
@media (prefers-reduced-motion: reduce){.ruGo .ruSt{animation:none;opacity:1}.ruGo .ruStep{animation:none}.ruGo .ruCr{animation:none;opacity:.2}.ruGo .ruCy{animation:none;opacity:.2}.ruGo .ruCg{animation:none;opacity:1}}

/* Семья и друзья → сцена family */
.fmSt{opacity:0}
@keyframes fmDraw{to{stroke-dashoffset:0}}
@keyframes fmRise{0%{opacity:0;transform:scale(.35) translateY(30px)}60%{opacity:1;transform:scale(1.12) translateY(0)}80%{transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
@keyframes fmGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes fmPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes fmTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes fmBeat{0%,100%{transform:scale(1)}18%{transform:scale(1.17)}36%{transform:scale(1)}54%{transform:scale(1.09)}}
@keyframes fmBurst{0%{opacity:.8;transform:scale(.85)}100%{opacity:0;transform:scale(1.5)}}
.fmGo .fmRoof{stroke-dasharray:400;stroke-dashoffset:400;animation:fmDraw .9s ease-out .1s forwards}
.fmGo .fmShad{transform-box:fill-box;transform-origin:center;animation:fmGrow .45s ease-out 1.2s forwards}
.fmGo .fmHeart{transform-box:fill-box;transform-origin:center;animation:fmPop .55s cubic-bezier(.3,1.5,.5,1) .95s forwards}
.fmGo .fmBeat{transform-box:fill-box;transform-origin:center;animation:fmBeat 1.7s ease-in-out 1.6s infinite}
.fmGo .fmRing{transform-box:fill-box;transform-origin:center;animation:fmBurst .55s ease-out 1.15s forwards}
.fmGo .fmFig{transform-box:fill-box;transform-origin:bottom center;animation:fmRise .6s cubic-bezier(.3,1.5,.5,1) forwards}
.fmGo .fmG1{animation-delay:1.35s}
.fmGo .fmG2{animation-delay:1.75s}
.fmGo .fmG3{animation-delay:1.55s}
.fmGo .fmSpk{transform-box:fill-box;transform-origin:center;animation:fmTw .55s ease-out forwards}
.fmGo .fmS1{animation-delay:2.05s}
.fmGo .fmS2{animation-delay:2.2s}
.fmGo .fmS3{animation-delay:2.35s}
.fmGo .fmS4{animation-delay:2.5s}
@media (prefers-reduced-motion: reduce){.fmGo .fmSt{animation:none;opacity:1}.fmGo .fmRoof{stroke-dashoffset:0;animation:none}.fmGo .fmBeat{animation:none}.fmGo .fmRing{animation:none;opacity:0}}

/* Учителя и взрослые → сцена teacher */
.tcSt{opacity:0}
@keyframes tcGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes tcFin{to{opacity:1}}
@keyframes tcRise{0%{opacity:0;transform:scale(.35) translateY(30px)}60%{opacity:1;transform:scale(1.12) translateY(0)}80%{transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
@keyframes tcPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes tcTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes tcBurst{0%{opacity:.8;transform:scale(.88)}100%{opacity:0;transform:scale(1.4)}}
@keyframes tcArm{0%{opacity:0;transform:rotate(52deg)}60%{opacity:1;transform:rotate(-7deg)}100%{opacity:1;transform:rotate(0deg)}}
.tcGo .tcShad{transform-box:fill-box;transform-origin:center;animation:tcGrow .45s ease-out .1s forwards}
.tcGo .tcLegs{animation:tcFin .3s ease-out .5s forwards}
.tcGo .tcBoard{transform-box:fill-box;transform-origin:bottom center;animation:tcPop .6s cubic-bezier(.3,1.5,.5,1) .6s forwards}
.tcGo .tcRing{transform-box:fill-box;transform-origin:center;animation:tcBurst .55s ease-out .95s forwards}
.tcGo .tcLn{transform-box:fill-box;transform-origin:left center;animation:tcGrow .45s ease-out forwards}
.tcGo .tcL1{animation-delay:1.15s}
.tcGo .tcL2{animation-delay:1.4s}
.tcGo .tcFig{transform-box:fill-box;transform-origin:bottom center;animation:tcRise .6s cubic-bezier(.3,1.5,.5,1) forwards}
.tcGo .tcF1{animation-delay:1.65s}
.tcGo .tcF2{animation-delay:2.35s}
.tcGo .tcArm{transform-origin:412px 172px;animation:tcArm .6s cubic-bezier(.3,1.4,.5,1) 2.05s forwards}
.tcGo .tcSpk{transform-box:fill-box;transform-origin:center;animation:tcTw .55s ease-out forwards}
.tcGo .tcS1{animation-delay:2.65s}
.tcGo .tcS2{animation-delay:2.8s}
.tcGo .tcS3{animation-delay:2.95s}
.tcGo .tcS4{animation-delay:3.1s}
@media (prefers-reduced-motion: reduce){.tcGo .tcSt{animation:none;opacity:1}.tcGo .tcRing{animation:none;opacity:0}}

/* Незнакомые → сцена stranger */
.unSt{opacity:0}
@keyframes unPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes unGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes unFin{to{opacity:1}}
@keyframes unFly{0%{opacity:0;transform:translate(-190px,44px) scale(.2)}25%{opacity:1}70%{transform:translate(0,0) scale(1.05)}100%{opacity:1;transform:translate(0,0) scale(1)}}
@keyframes unRing{0%{opacity:0;transform:scale(.3) rotate(-30deg)}55%{opacity:1;transform:scale(1.25) rotate(8deg)}75%{transform:scale(.95)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes unBeat{0%,100%{transform:scale(1)}45%{transform:scale(1.12)}70%{transform:scale(1)}}
@keyframes unWob{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
@keyframes unTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
.unGo .unShad{transform-box:fill-box;transform-origin:center;animation:unGrow .45s ease-out .1s forwards}
.unGo .unAv{transform-origin:220px 206px;animation:unPop .65s cubic-bezier(.3,1.5,.5,1) .3s forwards}
.unGo .unSil{animation:unFin .4s ease-out .8s forwards}
.unGo .unQ{transform-box:fill-box;transform-origin:center;animation:unPop .5s cubic-bezier(.3,1.5,.5,1) 1.1s forwards}
.unGo .unWob{transform-box:fill-box;transform-origin:center;animation:unWob 2.8s ease-in-out 1.8s infinite}
.unGo .unBub{transform-box:fill-box;transform-origin:left bottom;animation:unFly .85s cubic-bezier(.3,1.3,.5,1) 1.7s forwards}
.unGo .unLn{animation:unFin .3s ease-out forwards}
.unGo .unL1{animation-delay:2.25s}
.unGo .unL2{animation-delay:2.4s}
.unGo .unL3{animation-delay:2.55s}
.unGo .unCnt{transform-box:fill-box;transform-origin:center;animation:unRing .6s cubic-bezier(.3,1.5,.5,1) 2.7s forwards}
.unGo .unBeat{transform-box:fill-box;transform-origin:center;animation:unBeat 2.4s ease-in-out 3.4s infinite}
.unGo .unSpk{transform-box:fill-box;transform-origin:center;animation:unTw .55s ease-out forwards}
.unGo .unS1{animation-delay:2.95s}
.unGo .unS2{animation-delay:3.1s}
.unGo .unS3{animation-delay:3.25s}
@media (prefers-reduced-motion: reduce){.unGo .unSt{animation:none;opacity:1}.unGo .unBub{animation:none;opacity:1;transform:none}.unGo .unWob,.unGo .unBeat{animation:none}}

/* Роботы и программы → сцена robot */
.rbSt{opacity:0}
@keyframes rbPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes rbGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes rbRise{0%{opacity:0;transform:scale(.45) translateY(26px)}60%{opacity:1;transform:scale(1.09) translateY(0)}80%{transform:scale(.98)}100%{opacity:1;transform:scale(1)}}
@keyframes rbStretch{0%{opacity:0;transform:scaleY(0)}100%{opacity:1;transform:scaleY(1)}}
@keyframes rbFin{to{opacity:1}}
@keyframes rbOff{0%{transform:translate(0,0) rotate(0) scale(1)}55%{transform:translate(126px,-26px) rotate(10deg) scale(.92)}100%{transform:translate(225px,-6px) rotate(16deg) scale(.8)}}
@keyframes rbStreak{0%{opacity:0;transform:translateX(-14px)}35%{opacity:.9}100%{opacity:0;transform:translateX(26px)}}
@keyframes rbSway{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-3deg)}}
@keyframes rbBlink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes rbLed{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.25);opacity:.72}}
@keyframes rbTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
.rbGo .rbShad{transform-box:fill-box;transform-origin:center;animation:rbGrow .45s ease-out .1s forwards}
.rbGo .rbHead{transform-box:fill-box;transform-origin:bottom center;animation:rbRise .65s cubic-bezier(.3,1.5,.5,1) .3s forwards}
.rbGo .rbEar{transform-box:fill-box;transform-origin:center;animation:rbPop .45s cubic-bezier(.3,1.5,.5,1) .85s forwards}
.rbGo .rbAnt{transform-box:fill-box;transform-origin:bottom center;animation:rbStretch .35s ease-out .9s forwards}
.rbGo .rbBall{transform-box:fill-box;transform-origin:center;animation:rbPop .4s cubic-bezier(.3,1.6,.5,1) 1.1s forwards}
.rbGo .rbLed{transform-box:fill-box;transform-origin:center;animation:rbLed 1.3s ease-in-out 2.8s infinite}
.rbGo .rbBlink{transform-box:fill-box;transform-origin:center;animation:rbBlink 4.2s ease-in-out 3s infinite}
.rbGo .rbMaskOn{transform-box:fill-box;transform-origin:center;animation:rbRise .6s cubic-bezier(.3,1.5,.5,1) .45s forwards,rbOff 1s cubic-bezier(.5,0,.3,1) 1.9s forwards}
.rbGo .rbSway{transform-box:fill-box;transform-origin:top center;animation:rbSway 3.4s ease-in-out 3.2s infinite}
.rbGo .rbStreak{animation:rbStreak .7s ease-out forwards}
.rbGo .rbT1{animation-delay:2.05s}
.rbGo .rbT2{animation-delay:2.15s}
.rbGo .rbT3{animation-delay:2.25s}
.rbGo .rbSpk{transform-box:fill-box;transform-origin:center;animation:rbTw .55s ease-out forwards}
.rbGo .rbS1{animation-delay:3s}
.rbGo .rbS2{animation-delay:3.15s}
.rbGo .rbS3{animation-delay:3.3s}
@media (prefers-reduced-motion: reduce){.rbGo .rbSt{animation:none;opacity:1}.rbGo .rbMaskOn{animation:none;opacity:1;transform:translate(225px,-6px) rotate(16deg) scale(.8)}.rbGo .rbStreak{animation:none;opacity:0}.rbGo .rbLed,.rbGo .rbBlink,.rbGo .rbSway{animation:none}}

/* Фото → сцена photo */
.phSt{opacity:0}
@keyframes phPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes phRise{0%{opacity:0;transform:scale(.4) translateY(26px)}60%{opacity:1;transform:scale(1.12) translateY(0)}80%{transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
@keyframes phTilt1{0%{opacity:0;transform:rotate(0deg) scale(.7)}100%{opacity:1;transform:rotate(-9deg) scale(1)}}
@keyframes phTilt2{0%{opacity:0;transform:rotate(0deg) scale(.7)}100%{opacity:1;transform:rotate(8deg) scale(1)}}
@keyframes phBurst{0%{opacity:.85;transform:scale(.88)}100%{opacity:0;transform:scale(1.4)}}
@keyframes phTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes phGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
.phGo .phShad{transform-box:fill-box;transform-origin:center;animation:phGrow .45s ease-out .1s forwards}
.phGo .phBack1{transform-box:fill-box;transform-origin:center;animation:phTilt1 .5s cubic-bezier(.3,1.4,.5,1) .25s forwards}
.phGo .phBack2{transform-box:fill-box;transform-origin:center;animation:phTilt2 .5s cubic-bezier(.3,1.4,.5,1) .45s forwards}
.phGo .phCard{transform-box:fill-box;transform-origin:center;animation:phRise .6s cubic-bezier(.3,1.5,.5,1) .7s forwards}
.phGo .phRing{transform-box:fill-box;transform-origin:center;animation:phBurst .55s ease-out 1.1s forwards}
.phGo .phBust{transform-box:fill-box;transform-origin:bottom center;animation:phRise .55s cubic-bezier(.3,1.5,.5,1) forwards}
.phGo .phU1{animation-delay:1.3s}
.phGo .phU2{animation-delay:1.45s}
.phGo .phU3{animation-delay:1.6s}
.phGo .phU4{animation-delay:1.75s}
.phGo .phSpk{transform-box:fill-box;transform-origin:center;animation:phTw .55s ease-out forwards}
.phGo .phS1{animation-delay:2s}
.phGo .phS2{animation-delay:2.15s}
.phGo .phS3{animation-delay:2.3s}
.phGo .phS4{animation-delay:2.45s}
@media (prefers-reduced-motion: reduce){.phGo .phSt{animation:none;opacity:1}.phGo .phRing{animation:none;opacity:0}.phGo .phBack1{animation:none;opacity:1;transform:rotate(-9deg)}.phGo .phBack2{animation:none;opacity:1;transform:rotate(8deg)}}

/* Сообщение → сцена msg */
.msSt{opacity:0}
@keyframes msPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes msRise{0%{opacity:0;transform:scale(.45) translateY(24px)}60%{opacity:1;transform:scale(1.08) translateY(0)}80%{transform:scale(.98)}100%{opacity:1;transform:scale(1)}}
@keyframes msIn{0%{opacity:0;transform:scale(.6) translateX(-14px)}70%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes msOut{0%{opacity:0;transform:scale(.6) translateX(14px)}70%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes msFin{to{opacity:1}}
@keyframes msSlide{0%{opacity:0;transform:translateX(-18px)}100%{opacity:1;transform:translateX(0)}}
@keyframes msDash{to{stroke-dashoffset:-60}}
@keyframes msTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes msGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes msBurst{0%{opacity:.85;transform:scale(.9)}100%{opacity:0;transform:scale(1.3)}}
.msGo .msShad{transform-box:fill-box;transform-origin:center;animation:msGrow .45s ease-out .1s forwards}
.msGo .msDev{transform-box:fill-box;transform-origin:bottom center;animation:msRise .6s cubic-bezier(.3,1.5,.5,1) .3s forwards}
.msGo .msUi{animation:msFin .3s ease-out .75s forwards}
.msGo .msBIn{transform-box:fill-box;transform-origin:left bottom;animation:msIn .45s cubic-bezier(.3,1.5,.5,1) forwards}
.msGo .msBOut{transform-box:fill-box;transform-origin:right bottom;animation:msOut .45s cubic-bezier(.3,1.5,.5,1) forwards}
.msGo .msB1{animation-delay:.85s}
.msGo .msB2{animation-delay:1.05s}
.msGo .msB3{animation-delay:1.25s}
.msGo .msRing{transform-box:fill-box;transform-origin:center;animation:msBurst .55s ease-out 1.3s forwards}
.msGo .msArr{animation:msSlide .45s ease-out forwards}
.msGo .msA1{animation-delay:1.5s}
.msGo .msA2{animation-delay:1.7s}
.msGo .msFlow{animation:msDash 2.2s linear 2.1s infinite}
.msGo .msCopy{transform-box:fill-box;transform-origin:left center;animation:msPop .55s cubic-bezier(.3,1.5,.5,1) forwards}
.msGo .msC1{animation-delay:1.95s}
.msGo .msC2{animation-delay:2.15s}
.msGo .msLn{animation:msFin .3s ease-out forwards}
.msGo .msL1{animation-delay:2.2s}
.msGo .msL2{animation-delay:2.4s}
.msGo .msSpk{transform-box:fill-box;transform-origin:center;animation:msTw .55s ease-out forwards}
.msGo .msS1{animation-delay:2.55s}
.msGo .msS2{animation-delay:2.7s}
.msGo .msS3{animation-delay:2.85s}
@media (prefers-reduced-motion: reduce){.msGo .msSt{animation:none;opacity:1}.msGo .msFlow{animation:none}.msGo .msRing{animation:none;opacity:0}}

/* Даже удалённое → сцена kept */
.dlSt{opacity:0}
@keyframes dlPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes dlGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes dlRise{0%{opacity:0;transform:scale(.45) translateY(24px)}60%{opacity:1;transform:scale(1.08) translateY(0)}80%{transform:scale(.98)}100%{opacity:1;transform:scale(1)}}
@keyframes dlFin{to{opacity:1}}
@keyframes dlFly{0%{opacity:0;transform:translate(0,0) scale(1)}12%{opacity:1}50%{transform:translate(158px,-40px) scale(.7)}88%{opacity:1;transform:translate(316px,0) scale(1)}100%{opacity:0;transform:translate(316px,0) scale(1)}}
@keyframes dlVanish{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.5)}}
@keyframes dlSlide{0%{opacity:0;transform:translateX(-12px)}100%{opacity:1;transform:translateX(0)}}
@keyframes dlEye{0%{opacity:0;transform:scaleY(.05)}60%{opacity:1;transform:scaleY(1.15)}100%{opacity:1;transform:scaleY(1)}}
@keyframes dlTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
.dlGo .dlShad{transform-box:fill-box;transform-origin:center;animation:dlGrow .45s ease-out .1s forwards}
.dlGo .dlDev{transform-box:fill-box;transform-origin:bottom center;animation:dlRise .55s cubic-bezier(.3,1.5,.5,1) .3s forwards}
.dlGo .dlNote{transform-box:fill-box;transform-origin:center;animation:dlPop .45s cubic-bezier(.3,1.5,.5,1) .75s forwards}
.dlGo .dlFly{transform-box:fill-box;transform-origin:center;animation:dlFly 1.1s ease-in-out 1.1s forwards}
.dlGo .dlD1{animation:dlSlide .3s ease-out 1.25s forwards}
.dlGo .dlD2{animation:dlSlide .3s ease-out 1.4s forwards}
.dlGo .dlD3{animation:dlSlide .3s ease-out 1.55s forwards}
.dlGo .dlDh{animation:dlSlide .3s ease-out 1.65s forwards}
.dlGo .dlCopy{transform-box:fill-box;transform-origin:center;animation:dlPop .5s cubic-bezier(.3,1.5,.5,1) 2.05s forwards}
.dlGo .dlOrig{opacity:1;transform-box:fill-box;transform-origin:center;animation:dlVanish .5s ease-in 2.6s forwards}
.dlGo .dlDash{animation:dlFin .4s ease-out 3.05s forwards}
.dlGo .dlTrash{transform-box:fill-box;transform-origin:center;animation:dlPop .45s cubic-bezier(.3,1.5,.5,1) 2.95s forwards}
.dlGo .dlEye{transform-box:fill-box;transform-origin:center;animation:dlEye .5s ease-out 3.5s forwards}
.dlGo .dlSpk{transform-box:fill-box;transform-origin:center;animation:dlTw .55s ease-out forwards}
.dlGo .dlS1{animation-delay:3.7s}
.dlGo .dlS2{animation-delay:3.85s}
.dlGo .dlS3{animation-delay:4s}
@media (prefers-reduced-motion: reduce){.dlGo .dlSt{animation:none;opacity:1}.dlGo .dlOrig,.dlGo .dlFly{animation:none;opacity:0}}

/* сцена bye */
/* До встречи! → сцена bye */
.hwSt{opacity:0}
.hwArc{stroke-dasharray:200;stroke-dashoffset:200}
@keyframes hwGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes hwHalo{to{opacity:.16}}
@keyframes hwUp{0%{opacity:0;transform:scale(.4) translateY(36px)}60%{opacity:1;transform:scale(1.1) translateY(0)}80%{transform:scale(.98)}100%{opacity:1;transform:scale(1)}}
@keyframes hwRise{0%{opacity:0;transform:rotate(40deg)}60%{opacity:1;transform:rotate(-6deg)}100%{opacity:1;transform:rotate(0deg)}}
@keyframes hwBurst{0%{opacity:.85;transform:scale(.9)}100%{opacity:0;transform:scale(1.34)}}
@keyframes hwSwing{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
@keyframes hwDraw{to{stroke-dashoffset:0}}
@keyframes hwPuls{0%,100%{opacity:.95}50%{opacity:.34}}
@keyframes hwPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.16)}100%{opacity:1;transform:scale(1)}}
@keyframes hwFloat{0%,100%{transform:translateY(-6px)}50%{transform:translateY(6px)}}
@keyframes hwTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
.hwGo .hwShad{transform-box:fill-box;transform-origin:center;animation:hwGrow .45s ease-out .1s forwards}
.hwGo .hwHalo{animation:hwHalo .8s ease-out .3s forwards}
.hwGo .hwFig{transform-box:fill-box;transform-origin:bottom center;animation:hwUp .7s cubic-bezier(.3,1.5,.5,1) .25s forwards}
.hwGo .hwArm{transform-origin:367px 202px;animation:hwRise .6s cubic-bezier(.3,1.4,.5,1) .85s forwards}
.hwGo .hwWv{transform-origin:367px 202px;animation:hwSwing 1.9s ease-in-out 1.3s infinite}
.hwGo .hwRing{transform-box:fill-box;transform-origin:center;animation:hwBurst .55s ease-out 1.15s forwards}
.hwGo .hwArc{animation:hwDraw .5s ease-out forwards}
.hwGo .hwA1{animation-delay:1.35s}
.hwGo .hwA2{animation-delay:1.55s}
.hwGo .hwA3{animation-delay:1.75s}
.hwGo .hwPu{animation:hwPuls 2.4s ease-in-out infinite}
.hwGo .hwU1{animation-delay:1.9s}
.hwGo .hwU2{animation-delay:2.2s}
.hwGo .hwU3{animation-delay:2.5s}
.hwGo .hwHt{transform-box:fill-box;transform-origin:center;animation:hwPop .55s cubic-bezier(.3,1.5,.5,1) forwards}
.hwGo .hwH1{animation-delay:1.9s}
.hwGo .hwH2{animation-delay:2.1s}
.hwGo .hwH3{animation-delay:2.3s}
.hwGo .hwH4{animation-delay:2.5s}
.hwGo .hwFl{transform-box:fill-box;transform-origin:center;animation:hwFloat 3.4s ease-in-out infinite}
.hwGo .hwF1{animation-delay:2.5s}
.hwGo .hwF2{animation-delay:2.9s}
.hwGo .hwF3{animation-delay:2.7s}
.hwGo .hwF4{animation-delay:3.1s}
.hwGo .hwSpk{transform-box:fill-box;transform-origin:center;animation:hwTw .55s ease-out forwards}
.hwGo .hwS1{animation-delay:2.6s}
.hwGo .hwS2{animation-delay:2.75s}
.hwGo .hwS3{animation-delay:2.9s}
.hwGo .hwS4{animation-delay:3.05s}
.hwGo .hwS5{animation-delay:3.2s}
@media (prefers-reduced-motion: reduce){.hwGo .hwSt{animation:none;opacity:1}.hwGo .hwHalo{animation:none;opacity:.16}.hwGo .hwArc{animation:none;stroke-dashoffset:0}.hwGo .hwWv,.hwGo .hwPu,.hwGo .hwFl{animation:none}.hwGo .hwRing{animation:none;opacity:0}}

/* сцена play */
/* Играешь в игры -> сцена play */
.pgSt{opacity:0}
@keyframes pgPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes pgRise{0%{opacity:0;transform:scale(.4) translateY(30px)}60%{opacity:1;transform:scale(1.12) translateY(0)}80%{transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
@keyframes pgGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes pgFade{to{opacity:1}}
@keyframes pgBurst{0%{opacity:.85;transform:scale(.9)}100%{opacity:0;transform:scale(1.3)}}
@keyframes pgTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes pgFloat{0%,100%{transform:translateY(-5px)}50%{transform:translateY(5px)}}
@keyframes pgBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes pgBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
@keyframes pgDash{to{stroke-dashoffset:-58}}
@keyframes pgTrvL{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(66px,-32px)}}
@keyframes pgTrvR{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(-66px,-32px)}}
.pgGo .pgShad{transform-box:fill-box;transform-origin:center;animation:pgGrow .45s ease-out .1s forwards}
.pgGo .pgPad{transform-box:fill-box;transform-origin:center;animation:pgPop .7s cubic-bezier(.3,1.5,.5,1) .25s forwards}
.pgGo .pgFloat{transform-box:fill-box;transform-origin:center;animation:pgFloat 4.6s ease-in-out 1.1s infinite}
.pgGo .pgRing{transform-box:fill-box;transform-origin:center;animation:pgBurst .55s ease-out .75s forwards}
.pgGo .pgBtn{transform-box:fill-box;transform-origin:center;animation:pgBeat 1.8s ease-in-out 2.4s infinite}
.pgGo .pgB2{animation-delay:2.7s}
.pgGo .pgFig{transform-box:fill-box;transform-origin:bottom center;animation:pgRise .6s cubic-bezier(.3,1.5,.5,1) forwards}
.pgGo .pgF1{animation-delay:.95s}
.pgGo .pgF2{animation-delay:1.2s}
.pgGo .pgBob{transform-box:fill-box;transform-origin:center;animation:pgBob 2.6s ease-in-out 2s infinite}
.pgGo .pgW2{animation-delay:2.35s}
.pgGo .pgLine{stroke-dasharray:16 13}
.pgGo .pgK1{animation:pgFade .3s ease-out 1.5s forwards,pgDash 1.5s linear 1.5s infinite}
.pgGo .pgK2{animation:pgFade .3s ease-out 1.65s forwards,pgDash 1.5s linear 1.65s infinite}
.pgGo .pgNode{transform-box:fill-box;transform-origin:center;animation:pgPop .4s cubic-bezier(.3,1.6,.5,1) forwards}
.pgGo .pgO1{animation-delay:1.8s}
.pgGo .pgO2{animation-delay:1.95s}
.pgGo .pgDot{transform-box:fill-box;transform-origin:center}
.pgGo .pgT1{animation:pgTrvL 1.9s ease-in-out 2.1s infinite}
.pgGo .pgT2{animation:pgTrvR 1.9s ease-in-out 2.25s infinite}
.pgGo .pgSpk{transform-box:fill-box;transform-origin:center;animation:pgTw .55s ease-out forwards}
.pgGo .pgS1{animation-delay:2.2s}
.pgGo .pgS2{animation-delay:2.35s}
.pgGo .pgS3{animation-delay:2.5s}
.pgGo .pgS4{animation-delay:2.65s}
.pgGo .pgS5{animation-delay:2.8s}
@media (prefers-reduced-motion: reduce){.pgGo .pgSt{animation:none;opacity:1}.pgGo .pgFloat,.pgGo .pgBob,.pgGo .pgBtn{animation:none}.pgGo .pgK1,.pgGo .pgK2{animation:none;opacity:1}.pgGo .pgDot{animation:none;opacity:0}.pgGo .pgRing{animation:none;opacity:0}}

/* сцена watch */
/* Смотришь мультики -> сцена watch */
.cnSt{opacity:0}
@keyframes cnPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes cnRise{0%{opacity:0;transform:scale(.42) translateY(34px)}55%{opacity:1;transform:scale(1.12) translateY(0)}75%{transform:scale(.98)}100%{opacity:1;transform:scale(1)}}
@keyframes cnGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes cnBurst{0%{opacity:.85;transform:scale(.9)}100%{opacity:0;transform:scale(1.34)}}
@keyframes cnTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes cnBeat{0%,100%{transform:scale(1)}45%{transform:scale(1.11)}70%{transform:scale(1)}}
@keyframes cnSweep{0%{opacity:0;transform:translateX(-30px)}18%{opacity:.9}78%{opacity:.9}100%{opacity:0;transform:translateX(396px)}}
.cnGo .cnShad{transform-box:fill-box;transform-origin:center;animation:cnGrow .45s ease-out .1s forwards}
.cnGo .cnTv{transform-box:fill-box;transform-origin:bottom center;animation:cnRise .8s cubic-bezier(.3,1.5,.5,1) .2s forwards}
.cnGo .cnRing{transform-box:fill-box;transform-origin:center;animation:cnBurst .55s ease-out .85s forwards}
.cnGo .cnPlay{transform-box:fill-box;transform-origin:center;animation:cnPop .6s cubic-bezier(.3,1.5,.5,1) 1s forwards}
.cnGo .cnRing2{transform-box:fill-box;transform-origin:center;animation:cnBurst .55s ease-out 1.4s forwards}
.cnGo .cnPulse{transform-box:fill-box;transform-origin:center;animation:cnBeat 2.2s ease-in-out 2s infinite}
.cnGo .cnSweep{animation:cnSweep 4.2s ease-in-out 2.4s infinite}
.cnGo .cnFig{transform-box:fill-box;transform-origin:bottom center;animation:cnRise .65s cubic-bezier(.3,1.5,.5,1) 1.5s forwards}
.cnGo .cnBuck{transform-box:fill-box;transform-origin:bottom center;animation:cnRise .6s cubic-bezier(.3,1.5,.5,1) 1.8s forwards}
.cnGo .cnKern{transform-box:fill-box;transform-origin:center;animation:cnPop .45s cubic-bezier(.3,1.6,.5,1) forwards}
.cnGo .cnN1{animation-delay:2.05s}
.cnGo .cnN2{animation-delay:2.15s}
.cnGo .cnN3{animation-delay:2.25s}
.cnGo .cnN4{animation-delay:2.35s}
.cnGo .cnN5{animation-delay:2.45s}
.cnGo .cnSpk{transform-box:fill-box;transform-origin:center;animation:cnTw .55s ease-out forwards}
.cnGo .cnS1{animation-delay:2.55s}
.cnGo .cnS2{animation-delay:2.7s}
.cnGo .cnS3{animation-delay:2.85s}
.cnGo .cnS4{animation-delay:3s}
.cnGo .cnS5{animation-delay:3.15s}
@media (prefers-reduced-motion: reduce){.cnGo .cnSt{animation:none;opacity:1}.cnGo .cnPulse{animation:none}.cnGo .cnSweep{animation:none;opacity:0}.cnGo .cnRing,.cnGo .cnRing2{animation:none;opacity:0}}

/* сцена write */
/* Пишешь друзьям -> сцена write */
.wfSt{opacity:0}
@keyframes wfPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes wfRise{0%{opacity:0;transform:scale(.4) translateY(28px)}60%{opacity:1;transform:scale(1.12) translateY(0)}80%{transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
@keyframes wfGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes wfFade{to{opacity:1}}
@keyframes wfBurst{0%{opacity:.85;transform:scale(.9)}100%{opacity:0;transform:scale(1.34)}}
@keyframes wfTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes wfDash{to{stroke-dashoffset:-60}}
@keyframes wfFly1{0%{opacity:0;transform:translate(0,0) scale(.55)}14%{opacity:1;transform:translate(24px,-26px) scale(1)}50%{opacity:1;transform:translate(98px,-46px) scale(1)}86%{opacity:1;transform:translate(172px,-26px) scale(1)}100%{opacity:0;transform:translate(196px,0) scale(.6)}}
@keyframes wfFly2{0%{opacity:0;transform:translate(0,0) scale(.55)}14%{opacity:1;transform:translate(-22px,14px) scale(1)}50%{opacity:1;transform:translate(-96px,20px) scale(1)}86%{opacity:1;transform:translate(-170px,14px) scale(1)}100%{opacity:0;transform:translate(-196px,0) scale(.6)}}
@keyframes wfFlash{0%,80%{opacity:0}88%{opacity:.85}96%{opacity:0}100%{opacity:0}}
@keyframes wfBump{0%,80%{transform:scale(1)}90%{transform:scale(1.07)}100%{transform:scale(1)}}
@keyframes wfPing{0%,80%{opacity:0;transform:scale(.2) rotate(-40deg)}90%{opacity:1;transform:scale(1.3) rotate(8deg)}97%{opacity:1;transform:scale(1) rotate(0)}100%{opacity:0;transform:scale(.9)}}
.wfGo .wfShad{transform-box:fill-box;transform-origin:center;animation:wfGrow .45s ease-out .1s forwards}
.wfGo .wfFig{transform-box:fill-box;transform-origin:bottom center;animation:wfRise .6s cubic-bezier(.3,1.5,.5,1) forwards}
.wfGo .wfG1{animation-delay:.3s}
.wfGo .wfG2{animation-delay:.55s}
.wfGo .wfArm{animation:wfFade .3s ease-out forwards}
.wfGo .wfM1{animation-delay:.85s}
.wfGo .wfM2{animation-delay:1.1s}
.wfGo .wfDev{transform-box:fill-box;transform-origin:bottom center;animation:wfRise .55s cubic-bezier(.3,1.5,.5,1) forwards}
.wfGo .wfD1{animation-delay:.95s}
.wfGo .wfD2{animation-delay:1.2s}
.wfGo .wfRing{transform-box:fill-box;transform-origin:center;animation:wfBurst .55s ease-out 1.5s forwards}
.wfGo .wfArc{stroke-dasharray:16 14}
.wfGo .wfK1{animation:wfFade .3s ease-out 1.6s forwards,wfDash 1.6s linear 1.6s infinite}
.wfGo .wfK2{animation:wfFade .3s ease-out 3s forwards,wfDash 1.6s linear 3s infinite}
.wfGo .wfBub{transform-box:fill-box;transform-origin:center}
.wfGo .wfB1{animation:wfFly1 3.6s ease-in-out 1.9s infinite}
.wfGo .wfB2{animation:wfFly2 3.6s ease-in-out 3.3s infinite}
.wfGo .wfFlash{animation:wfFlash 3.6s ease-in-out 1.9s infinite}
.wfGo .wfBump{transform-box:fill-box;transform-origin:center;animation:wfBump 3.6s ease-in-out 1.9s infinite}
.wfGo .wfPing{transform-box:fill-box;transform-origin:center;animation:wfPing 3.6s ease-in-out 1.9s infinite}
.wfGo .wfSpk{transform-box:fill-box;transform-origin:center;animation:wfTw .55s ease-out forwards}
.wfGo .wfS1{animation-delay:2s}
.wfGo .wfS2{animation-delay:2.15s}
.wfGo .wfS3{animation-delay:2.3s}
.wfGo .wfS4{animation-delay:2.45s}
.wfGo .wfS5{animation-delay:2.6s}
@media (prefers-reduced-motion: reduce){.wfGo .wfSt{animation:none;opacity:1}.wfGo .wfB1{animation:none;opacity:1;transform:translate(98px,-46px)}.wfGo .wfB2{animation:none;opacity:1;transform:translate(-96px,20px)}.wfGo .wfFlash{animation:none;opacity:0}.wfGo .wfBump{animation:none}.wfGo .wfPing{animation:none;opacity:0}.wfGo .wfK1,.wfGo .wfK2{animation:none;opacity:1}.wfGo .wfRing{animation:none;opacity:0}}

/* сцена search */
/* Ищешь ответы -> сцена search */
.mgSt{opacity:0}
@keyframes mgPop{0%{opacity:0;transform:scale(.5)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}
@keyframes mgRise{0%{opacity:0;transform:scale(.4) translateY(30px)}60%{opacity:1;transform:scale(1.12) translateY(0)}80%{transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
@keyframes mgGrow{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
@keyframes mgBurst{0%{opacity:.85;transform:scale(.9)}100%{opacity:0;transform:scale(1.28)}}
@keyframes mgTw{0%{opacity:0;transform:scale(.2) rotate(-60deg)}70%{opacity:1;transform:scale(1.3) rotate(10deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes mgArm{0%{opacity:0;transform:rotate(-44deg)}60%{opacity:1;transform:rotate(6deg)}100%{opacity:1;transform:rotate(0)}}
@keyframes mgGlow{0%,100%{opacity:1}50%{opacity:.58}}
.mgGo .mgShad{transform-box:fill-box;transform-origin:center;animation:mgGrow .45s ease-out .1s forwards}
.mgGo .mgFig{transform-box:fill-box;transform-origin:bottom center;animation:mgRise .65s cubic-bezier(.3,1.5,.5,1) .3s forwards}
.mgGo .mgArm{transform-origin:170px 288px;animation:mgArm .6s cubic-bezier(.3,1.4,.5,1) .9s forwards}
.mgGo .mgLens{transform-box:fill-box;transform-origin:center;animation:mgPop .7s cubic-bezier(.3,1.5,.5,1) 1.15s forwards}
.mgGo .mgRing{transform-box:fill-box;transform-origin:center;animation:mgBurst .55s ease-out 1.65s forwards}
.mgGo .mgBulb{transform-box:fill-box;transform-origin:center;animation:mgPop .6s cubic-bezier(.3,1.5,.5,1) 1.9s forwards}
.mgGo .mgRays{transform-box:fill-box;transform-origin:center;animation:mgPop .5s cubic-bezier(.3,1.5,.5,1) 2.2s forwards}
.mgGo .mgGlow{animation:mgGlow 1.8s ease-in-out 2.8s infinite}
.mgGo .mgSpk{transform-box:fill-box;transform-origin:center;animation:mgTw .55s ease-out forwards}
.mgGo .mgS1{animation-delay:2.45s}
.mgGo .mgS2{animation-delay:2.6s}
.mgGo .mgS3{animation-delay:2.75s}
.mgGo .mgS4{animation-delay:2.9s}
.mgGo .mgS5{animation-delay:3.05s}
@media (prefers-reduced-motion: reduce){.mgGo .mgSt{animation:none;opacity:1}.mgGo .mgArm{animation:none;opacity:1;transform:none}.mgGo .mgGlow{animation:none}.mgGo .mgRing{animation:none;opacity:0}}

/* globe */
/* СЦЕНА «ЗЕМНОЙ ШАР» (what-is-internet.html, заказчик 2026-08-06).
   Кадр живёт внутри киноленты и выходит вместе с ней, поэтому вместо таймлайна
   из демо здесь обычные задержки: шар, четыре устройства по кругу, дорожки.
   Позиции устройств из объекта POS демо-файла посчитаны в готовые transform —
   в наборе сцен нет JS, только разметка и CSS. */
.gl-globe { transform-box: view-box; transform-origin: 340px 220px;
  animation: glGlobeIn .8s cubic-bezier(.34,1.5,.5,1) both; }
@keyframes glGlobeIn { from { transform: scale(.2); opacity: 0; } to { transform: none; opacity: 1; } }

.gl-dev { transform-box: view-box; transform-origin: 0 0;
  animation: glDevIn .8s cubic-bezier(.34,1.4,.5,1) both; }
.gl-d1 { transform: translate(108px,96px) scale(.6); animation-delay: .55s; }
.gl-d2 { transform: translate(532px,96px) scale(.6); animation-delay: .78s; }
.gl-d3 { transform: translate(532px,306px) scale(.6); animation-delay: 1.01s; }
.gl-d4 { transform: translate(108px,306px) scale(.6); animation-delay: 1.24s; }
@keyframes glDevIn { from { opacity: 0; } to { opacity: 1; } }

.gl-wire .base { stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: glWire .6s ease-out both 1.6s; }
.gl-wire .dash { animation: glDash .4s ease both 2s; }
.gl-wire.w2 .base { animation-delay: 1.82s; } .gl-wire.w2 .dash { animation-delay: 2.22s; }
.gl-wire.w3 .base { animation-delay: 2.04s; } .gl-wire.w3 .dash { animation-delay: 2.44s; }
.gl-wire.w4 .base { animation-delay: 2.26s; } .gl-wire.w4 .dash { animation-delay: 2.66s; }
@keyframes glWire { to { stroke-dashoffset: 0; } }
@keyframes glDash { from { opacity: 0; } to { opacity: 1; } }

@media (prefers-reduced-motion: no-preference) {
  /* Суша едет по кругу — единственное бесконечное движение кадра. */
  .gl-land { animation: glSpin 16s linear infinite; }
  @keyframes glSpin { to { transform: translateX(-140px); } }
  .gl-spark { animation: glTw 2.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  .gl-spark:nth-of-type(2) { animation-delay: 1.2s; }
  @keyframes glTw { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.72); opacity: .55; } }
}

/* search */
/* «КАК ИСКАТЬ» — тайминг демо how-to-search.html. Вопрос из 20 знаков набирается
   по 72мс, поэтому набор кончается на 1150+20*72 = 2590мс, и от этой точки
   отсчитано всё остальное: нажатие 3040, запрос 3340, ответы 4190, лупа 4940,
   подсветка нужного 5640. */
.hs-bar, .hs-res, .hs-dots, .hs-lens, .hs-pick, .hs-caret { opacity: 0; }
.hs-typebox { width: 0; }
@media (prefers-reduced-motion: reduce) {
  .hs-bar, .hs-res, .hs-lens, .hs-pick { opacity: 1; }
  .hs-typebox { width: 268px; }
}
@media (prefers-reduced-motion: no-preference) {
  @keyframes hsFade { to { opacity: 1; } }
  @keyframes hsBar { from { opacity: 0; transform: translateY(16px) scale(.94); } to { opacity: 1; transform: none; } }
  /* Набор текста: окно обрезки расширяется рывками — по знаку за шаг. */
  @keyframes hsType { from { width: 0; } to { width: 268px; } }
  @keyframes hsBlink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
  @keyframes hsPress { 0%,100% { transform: scale(1); } 45% { transform: scale(.86); } }
  @keyframes hsRip { 0% { transform: scale(.5); opacity: .6; } 100% { transform: scale(2.6); opacity: 0; } }
  @keyframes hsHop { 0%,100% { transform: translateY(0); opacity: .45; } 50% { transform: translateY(-9px); opacity: 1; } }
  @keyframes hsRes { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
  @keyframes hsLens { from { opacity: 0; transform: translate(560px,80px) rotate(-12deg); }
                      to { opacity: 1; transform: translate(468px,190px) rotate(-12deg); } }
  .hs-bar { transform-box: fill-box; transform-origin: center;
    animation: hsBar .6s cubic-bezier(.34,1.5,.5,1) both .5s; }
  .hs-typebox { animation: hsType 1.44s steps(20) both 1.15s; }
  .hs-caret { animation: hsFade .01s linear both 1s, hsBlink .9s steps(1) 1s 2, hsFade .2s linear reverse both 2.8s; }
  .hs-btn { transform-box: fill-box; transform-origin: center;
    animation: hsPress .5s ease-out both 3.04s; }
  .hs-ripple { transform-box: fill-box; transform-origin: center;
    animation: hsRip .9s ease-out both 3.04s; }
  .hs-dots { animation: hsFade .3s linear both 3.34s, hsFade .3s linear reverse both 4.14s; }
  .hs-dots circle { animation: hsHop .9s ease-in-out infinite; }
  .hs-dots circle:nth-child(2) { animation-delay: .15s; }
  .hs-dots circle:nth-child(3) { animation-delay: .3s; }
  .hs-res { transform-box: fill-box; transform-origin: center; }
  .hs-r0 { animation: hsRes .55s cubic-bezier(.34,1.45,.5,1) both 4.19s; }
  .hs-r1 { animation: hsRes .55s cubic-bezier(.34,1.45,.5,1) both 4.36s; }
  .hs-r2 { animation: hsRes .55s cubic-bezier(.34,1.45,.5,1) both 4.53s; }
  .hs-lens { transform-box: view-box; transform-origin: 0 0;
    animation: hsLens 1s cubic-bezier(.4,0,.3,1) both 4.94s; }
  .hs-pick { animation: hsFade .35s linear both 5.64s; }
}

/* Фоновый слой дышит (заказчик, 2026-08-07, how-to-search v2): пятна еле заметно
   плывут и меняют масштаб на 1.5-1.8%. Амплитуда намеренно крошечная — фон не
   должен спорить с тем, что происходит в строке поиска. Периоды разные (13/17/11с)
   и не кратные друг другу, поэтому рисунок движения не зацикливается на глаз. */
.hs-blob { transform-box: fill-box; transform-origin: center; will-change: transform; }
@media (prefers-reduced-motion: no-preference) {
  .hs-blob:nth-of-type(1) { animation: hsDrift1 13s ease-in-out infinite; }
  .hs-blob:nth-of-type(2) { animation: hsDrift2 17s ease-in-out infinite; }
  .hs-blob:nth-of-type(3) { animation: hsDrift3 11s ease-in-out infinite; }
  @keyframes hsDrift1 { 0%,100% { transform: translate(0,0) scale(1); }
                        50% { transform: translate(7px,-5px) scale(1.015); } }
  @keyframes hsDrift2 { 0%,100% { transform: translate(0,0) scale(1.012); }
                        50% { transform: translate(-6px,6px) scale(1); } }
  @keyframes hsDrift3 { 0%,100% { transform: translate(0,0) scale(1); }
                        50% { transform: translate(5px,7px) scale(1.018); } }
}

/* ===== END АНИМАЦИИ ИЛЛЮСТРАЦИЙ ===== */

/* Кадр — то самое эластичное звено, о котором говорит .stack в CSS_BASE.
   Только этим трём обёрткам разрешено сжиматься, когда высоты не хватает.
   min-height обязателен и не может быть нулём: SVG внутри задан как
   height:100%, и при нулевом минимуме flex сжимал обёртку до 0 — кадр
   пропадал целиком (проверено на 1024x768 и 1280x800, а на 1440x900 при тех
   же правилах он был живой, 356px: без пола поведение зависит от случайного
   запаса высоты). Пол = примерно телефонный размер кадра.
   ЧИСТКА 27.08.2026: этот блок лежал в файле СЕМЬЮ копиями подряд — следы
   шести правок, каждая дописывала его целиком. Работала последняя. */
.stack > .scene-art, .stack > .netbox, .stack > .scene-slot {
  flex-shrink: 1; min-height: clamp(100px, 15dvh, 180px); }

/* ── КРУПНЫЙ ЯРУС УРОКА: планшет и компьютер ───────────────────
   Продолжение канонного яруса из CSS_BASE — здесь блоки самого урока.
   Кадр упирался в max-height 34dvh, и на 1280×800 рисунок выходил 462×272
   внутри колонки 936px: SVG вписывается по меньшей стороне, поэтому широкая
   колонка сама по себе ничего не даёт — растить надо именно высоту кадра.
   Кадру это безопасно: он лежит в flex-контейнере и при нехватке места
   поджимается сам, max-height только снимает потолок.

   Порог, vw-множители и запрет на рост высоты строк — как в каноне. Персонаж
   в «тихом» режиме (--av-say) считается от 22dvh, а не от 27dvh: он самый
   дорогой по вертикали, и на 1024×768 именно он уносил экраны за край. */
@media (min-width: 760px) and (min-height: 700px) {
  .lesson-root { --av-say: clamp(150px, min(34vw, 22dvh), 320px);
                 --av-hero: clamp(240px, min(52vw, 40dvh), 500px); }
  .art { max-height: clamp(240px, 46dvh, 560px); }
  .netbox { width: min(100%, 760px); }
  .netbox .art { max-height: clamp(250px, 48dvh, 580px); }
  .speaker-voice { width: clamp(74px, 7vw, 96px); height: clamp(74px, 7vw, 96px); }
  /* Экран «говорящий во весь кадр»: имя, кнопка повтора и ряд каста стоят
     ПОД персонажем, поэтому каждый лишний пиксель здесь идёт в общую высоту.
     С потолками 50/56/50 экран уезжал за край на 12px при 1280×800,
     с 44/48/44 — ещё на 6px при 1440×900. Это чистая обвязка, не контент. */
  .hero-name > span { font-size: clamp(34px, 4.6vw, 42px); }
  .hero-say { width: clamp(56px, 5vw, 56px); height: clamp(56px, 5vw, 56px); }
  .hero-dot { width: clamp(34px, 4.4vw, 42px); height: clamp(34px, 4.4vw, 42px); }
  .hero-fallback { font-size: clamp(17px, 2.5vw, 23px); border-radius: 20px;
    padding: clamp(14px, 1.9vw, 20px) clamp(16px, 2.4vw, 26px); }
  .scene-dot { width: 10px; height: 10px; }
  .scene-dot.is-now { width: 30px; }
  /* Значок: dvh-множители БАЗОВЫЕ, поднят только потолок. На ноутбуке значок
     и так упирается в высоту, и любая прибавка уносила экраны сборки и выдачи
     значка за нижний край; на высоком планшете потолок 210/268 был тесен. */
  .badge-md .badge-ring { width: clamp(150px, min(46vw, 26dvh), 260px);
    height: clamp(150px, min(46vw, 26dvh), 260px); }
  .badge-lg .badge-ring { width: clamp(186px, min(58vw, 34dvh), 340px);
    height: clamp(186px, min(58vw, 34dvh), 340px); }
  /* UI-тур и инфо-строки */
  .uid-row { padding: clamp(13px, 2vw, 20px) clamp(15px, 2.2vw, 24px); border-radius: 20px; }
  .uid-ico { width: clamp(34px, 4.4vw, 48px); height: clamp(34px, 4.4vw, 48px); border-radius: 14px; }
  .uid-h { font-size: clamp(17px, 2.2vw, 21px); }
  .uid-p { font-size: clamp(17px, 2.1vw, 19px); }
  .road-item { font-size: clamp(17px, 2.2vw, 21px); border-radius: 20px;
    padding: clamp(13px, 2vw, 20px) clamp(15px, 2.2vw, 24px); }
  /* Экраны значка — самые тесные в уроке: значок, персонаж и подпись стоят
     друг под другом, и экран выдачи уже до всякого яруса уходил за нижний
     край на 35px (1280×800). Здесь ярус для персонажа и подписи выключен
     обратно на базовые значения: иначе правка «крупнее» делала бы этот
     экран заметно хуже, чем он был. Сам экран просит переверстки — это
     отдельная работа, не P8. */
  /* --av-say СМЕНИЛ СМЫСЛ (27.08.2026): теперь это РОСТ ФИГУРЫ, а не ширина
     кадра позы. Правило адресное и сильнее корня (0,2,0 против 0,1,0), поэтому
     число пересчитано здесь же, иначе экраны значка остались бы на старой
     ширине. Экраны сборки и выдачи значка — самые тесные в уроке (замер «до»:
     перебор 37-44px на всех настольных окнах), поэтому фигура здесь ниже
     базовой лестницы. */
  .stage:has(.maker), .stage:has(.badge-show) { --av-say: clamp(76px, 16dvh, 150px); }
  .stage-content:has(.badge-show) .lead { font-size: clamp(17px, 2.5vw, 17px); }
  /* boot-консоль: это первый экран урока, он не должен быть мелкой полоской */
  .boot-inner { max-width: clamp(420px, 56vw, 640px); }
  .boot-emblem { width: clamp(76px, 9vw, 108px); }
  .boot-brand { font-size: clamp(17px, 1.9vw, 17px); }
  .boot-row { font-size: clamp(17px, 1.9vw, 18px); }
  .boot-console { min-height: clamp(116px, 17dvh, 190px); }
  .boot-track { height: clamp(5px, .8dvh, 9px); }
  .boot-welcome { font-size: clamp(25px, 3.6vw, 38px); }
}
/* ══════════════════════════════════════════════════════════════════════════
   LAYOUT CONSTITUTION — КАРКАС ЭТАЛОНА (перенос с урока 1.5, 27.08.2026).
   Урок 1 остался без каркаса: правки 15.08 с него откатили 20.08, и раскатка
   Конституции его не задела. Здесь он ставится целиком, числа — из документа и
   из замеров эталона, а не подобраны на глаз.
   ────────────────────────────────────────────────────────────────────────── */
.lesson-root {
  --vw-safe-x: clamp(24px, 4vw, 64px);
  /* §2 · КОНТЕНТ-КОНТЕЙНЕР 880px. Замер «до» на 1920x949: 1040px (у урока свой
     --limit 936/1040), и одна и та же карточка выходила то 332px на телефоне,
     то 1040 на мониторе — два разных продукта. Выше 880 не масштабируем:
     растянутая на 1920 викторина не становится лучше, становится пустой. */
  --stage-max: 880px;

  --h-progress: 6px;
  /* ЗОНЫ ХРОМА ТЕКУЧИЕ (починка каркаса 24.08.2026). Максимум clamp равен числу
     Конституции и достигается при высоте окна 820px, поэтому на 1080/900/768
     вид ровно тот, что утверждён; ниже зона отдаёт высоту содержимому вместо
     того, чтобы выпихивать его за край.
     Замер «до» у этого урока: шапка 86px и подвал 88px на 1920x949 против
     56 и 72 по регламенту. */
  --h-header: clamp(48px, 6.6dvh, 56px);
  --h-footer: clamp(64px, 9dvh, 72px);

  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;
  --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px;
  --r-sm: 12px; --r-md: 20px; --r-lg: 32px; --r-pill: 999px;

  /* §6 · КНОПКА 52px — не 44: детская моторика (iOS HIG 44pt / Android 48dp /
     дети 6-9 лет 52-56px). Замер «до»: 62px при кегле 22 — кнопка «Дальше»
     была самым крупным элементом экрана, хотя это служебное действие. */
  --btn-h: clamp(56px, 7dvh, 56px);
  --tap-min: clamp(56px, 6.8dvh, 56px);

  /* Персонаж: ровно два амплуа, считаются от высоты зоны Stage (§4).
     В ЭТОМ УРОКЕ, как и в эталоне, настоящий источник роста — --av-say ниже;
     токены амплуа оставлены для сходства с остальным курсом. */
  --lc-stage-h: calc(100dvh - var(--h-progress) - var(--h-header)
                     - var(--h-footer));
  --char-narrator: min(calc(var(--lc-stage-h) * 0.46), 40vw, 110px);
  --char-helper:   min(calc(var(--lc-stage-h) * 0.26), 32vw, 110px);
  --nolik-ratio: 0.78;
  --char-gap: var(--s-6);

  /* §9 · ДИАМЕТР АУДИО-КНОПКИ 56px. НАСТОЯЩИЙ ИСТОЧНИК РАЗМЕРА — ЭТОТ ТОКЕН:
     правило ниже ставит от него width с !important, поэтому правки самих
     .speaker-voice не действуют. Замер «до»: 74px на телефоне и 92-96px на
     мониторе — кнопка была крупнее лица персонажа. */
  --voice-d: clamp(56px, 6dvh, 56px);
  --voice-gap: var(--s-5);
}
/* Подвал на телефоне: при кнопке 48px оставалось 40px чистого воздуха. */
@media (max-width: 759px) { .lesson-root { --h-footer: clamp(64px, 11dvh, 72px); --voice-d: clamp(56px, 8dvh, 56px); } }
/* Шапка на узком экране: кегль надписей поднят до 17px (ниже), и «ИНТЕРНЕТ И Я»
   со счётчиком и кнопкой паузы в одну строку 320px не помещаются. */
@media (max-width: 390px) { .lesson-root { --h-header: 64px; } }

/* СЛАЙД — ЗОНЫ, ВЫСОТЫ ФИКСИРОВАНЫ (§2). У этого урока зон четыре: строки
   вопроса на экране нет, поэтому пятая (обратная связь) не заведена.
   minmax(0, 1fr) вместо 1fr: без нижней границы 0 строка не сжимается ниже
   собственного содержимого, и перебор уходит НАРУЖУ вместо того, чтобы
   распределиться внутри. Это ключевая строка всей починки.
   grid-template-columns объявлен явно: неявный трек auto считается по
   содержимому и не ограничен шириной контейнера — на телефоне это распирало
   весь слайд (замер урока 11: шапка 539px в окне 375px). */
.lc-slide {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  height: 100dvh;
  overflow: hidden;
}
.lc-slide > .lc-progress, .lc-slide > .stage-header,
.lc-slide > .lc-stage, .lc-slide > .stage-nav { grid-column: 1 / -1; }

.lc-progress { grid-row: 1; height: var(--h-progress); width: 100%;
  background: rgba(58, 53, 48, 0.10); overflow: hidden; }
/* Дорожка внутри зоны — цель подсветки UI-тура. Своей высоты и фона у неё
   больше нет: и то, и другое задаёт зона. */
.lc-progress .progress-track { height: 100%; border-radius: 0; background: none; }
.lc-progress .progress-bar { height: 100%; border-radius: 0; }
/* §7 · ПРОГРЕСС СЕГМЕНТАМИ. Непрерывная полоса не отвечает на вопрос «сколько
   осталось». Насечки рисуются той же полосой, повторяющимся градиентом, поэтому
   новой разметки не нужно. Экранов в уроке 11 — отсюда 11 сегментов. */
.lc-progress {
  background:
    repeating-linear-gradient(90deg,
      transparent 0, transparent calc(100% / 11 - 3px),
      #F5F3EF calc(100% / 11 - 3px), #F5F3EF calc(100% / 11));
  background-color: rgba(58, 53, 48, 0.10);
}

.lc-slide .stage-header { grid-row: 2; min-height: var(--h-header);
  display: flex; align-items: center; padding-inline: var(--vw-safe-x);
  padding-block: 0; }
.lc-slide .chrome { margin-top: 0; align-items: center; }

/* ЗОНА STAGE. Инсет задаётся ЗДЕСЬ и только здесь: у .speaker-wrap и
   .stage-content есть свой padding-inline: var(--pad), и вместе с инсетом зоны
   он даёт двойное поле — на 880px контейнер выходил бы 752. */
.lc-stage { grid-row: 3; min-height: 0; display: flex; flex-direction: column;
  padding-inline: var(--vw-safe-x); }
.lc-slide .speaker-wrap, .lc-slide .stage-content { padding-inline: 0; }

.lc-slide .stage-nav { grid-row: 4; min-height: var(--h-footer);
  display: flex; align-items: center; padding-inline: var(--vw-safe-x);
  padding-block: 0; }

/* Контейнер контента — одна ширина на весь проект (§1, запрет §18) */
.lc-slide .limit { width: min(var(--stage-max), 100%); max-width: none; margin-inline: auto; }

/* ══ ПУСТОТА: РАСПОРКИ КАНОНА ПОГАШЕНЫ ════════════════════════════════════
   В каноне .stage-content::before и ::after забирают свободную высоту (flex 1
   и 3), то есть три четверти остатка уходит в воздух ПОД содержимым. Замер
   «до» на 1920x949: экран 02 держал 442px пустоты (47% высоты окна), экран 03
   — 335px (35%), экран 10 — 211px (22%) при переборе 37px на том же экране.
   Теперь остаток делится центрированием стопки — то есть поровну сверху и
   снизу — и его забирает кадр, единственный, кому рост на пользу. */
.lc-slide .stage-content::before, .lc-slide .stage-content::after { flex: 0 0 0; max-height: 0; }
.lc-slide .stage-content { flex: 1 1 auto; min-height: 0; }
.lc-slide .stage-content > .stack { flex: 1 1 auto; min-height: 0; justify-content: center; }
/* flex-grow: 0 оставлен (карточка не тянется до низа — требование §2), но без
   min-height: 0 блок не может и СЖАТЬСЯ: при нехватке места ряд не уменьшался,
   а просто выезжал за край. Разрешаем усадку, запрет на рост цел. */
.lc-slide .stage-content > .stack > * { flex-grow: 0; min-height: 0; min-width: 0; max-height: none; }
/* Разрешение сжиматься доходит до внуков: у ребёнка флекса min-height по
   умолчанию auto, и один такой узел на любой глубине держит всю цепочку. */
.lc-slide .stage-content > .stack > * > * { min-height: 0; min-width: 0; }
.lc-slide .stage-content > .stack > * > * > * { min-height: 0; min-width: 0; }
/* ЦЕЛЬ КАСАНИЯ КРУПНОЙ КНОПКИ. Правило выше обнуляет min-height ВСЕМ прямым
   детям .stack (специфичность 0,3,0), и поэтому ни .bigbtn канона, ни уже
   стоявшее .lc-slide .bigbtn { min-height: 44px } не работали: на телефоне
   лёжа «Отправить» ужималась до 39px, кнопка финала — до 43px при норме 44.
   Перебиваем на той же глубине селектора, каркас при этом не трогаем. */
.lesson-root .lc-slide .stage-content > .stack > .bigbtn,
.lesson-root .stage-content .donebox .bigbtn { min-height: 44px; }

/* ══ КАДР: ПОТОЛОК НА КОНТЕЙНЕРЕ, А НЕ НА КАРТИНКЕ ════════════════════════
   ГЛАВНЫЙ ИНВАРИАНТ ЭТАЛОНА. У этого урока потолок стоял на самой картинке
   (.art { max-height: clamp(...) }), а контейнер продолжал тянуться — замер
   «до» дал ровно 36px чистой дыры внутри кадра на 1920x949, 1366x768,
   1280x800 и 1024x768 и 20px на телефоне.
   Теперь потолок на контейнере, а картинка тянется на всю его высоту, то есть
   кадр РАВЕН картинке и дыры внутри не остаётся. Потолок долевой: RULES §2
   отводит картинке 40-60 процентов кадра. */
.lc-slide .stage-content > .stack > .scene-art,
.lc-slide .stage-content > .stack > .netbox,
.lc-slide .stage-content > .stack > .scene-slot {
  flex: 1 1 auto; max-height: min(56dvh, 620px);
}
/* ЭКРАН 01 И ЭКРАН ЗНАЧКА — БЕЗ ДОЛЕВОГО ПОТОЛКА.
   .hero-zone — это не кадр, а вся композиция первого экрана: фигура в полный
   рост, имя, кольца речи и каст-строка. Потолок 56dvh срезал её на 296px
   (замер 1920x949: 827 -> 531) и оставил под ней 356px пустоты.
   .badge-show — кадр экрана «вот он, твой значок», и ему потолок не нужен по
   другой причине: внутри лежит абсолютный слой сияния 816x816 (86dvh), который
   ВХОДИТ в scrollable overflow .stage-content и давал перебор 65px. Блок растёт
   на всю свободную высоту и обрезает сияние по себе — лучи по-прежнему уходят
   за край кадра, но прокрутки не создают. */
.lc-slide .stage-content > .stack > .hero-zone {
  flex: 1 1 auto; max-height: none; }
.lc-slide .stage-content > .stack > .badge-show {
  flex: 1 1 auto; max-height: none; min-height: 0;
  align-items: center; overflow: hidden; }
.lc-slide .scene-art .art, .lc-slide .netbox .art, .lc-slide .scene-slot .art {
  max-height: none; height: 100%; }

/* Остаток высоты забирает КАДР, а не ряд карточек: ряд берёт ровно то, что
   нужно содержимому. Порядок жертв: сжимается иллюстрация, а не то, что
   ребёнок должен нажать. */
.lc-slide .stage-content > .stack > .opts,
.lc-slide .stage-content > .stack > .cards {
  flex: 0 0 auto; min-height: 0; max-height: none; align-content: start; }

/* ЧЕТЫРЕ ВАРИАНТА — РОВНО 2x2. :has(> :nth-child(4):last-child) — это «ровно
   четыре ребёнка»: четвёртый и он же последний. Правило адресное, на три и
   пять карточек не влияет (в этом уроке вариантов три, но правило держим
   общим для всего курса). */
.lc-slide .opts:has(> :nth-child(4):last-child),
.lc-slide .cards:has(> :nth-child(4):last-child) {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
}

/* ══ ПЕРСОНАЖ: РОСТ ФИГУРЫ ВМЕСТО ШИРИНЫ КАДРА ════════════════════════════
   Замер «до» (1920x949): полоса фигуры 190px на позах 2:3 и 285px на позах
   1:1 — 20% против 30% высоты окна, и это подряд, с экрана на экран. Причина:
   размер задавался ПО ШИРИНЕ (--av-say), а кадры поз разной пропорции.
   Теперь --av-say — это РОСТ ФИГУРЫ, а пропорции кадра каждой позы
   пересчитывают его в высоту картинки; пустое поле под ногами съедает
   отрицательный margin-bottom.
   1.16 — запас под самое высокое пустое поле НАД фигурой (S_point, 0.120 роста);
   меньше — картинка вылезет в шапку. */
.lesson-root { --av-say: clamp(84px, 21dvh, 200px); }
.lc-slide .speaker { align-items: flex-end; min-height: calc(var(--av-say) * 1.16); }
.lc-slide.stage-hero-fixed .speaker { min-height: calc(var(--av-say) * 1.16); }
.lc-slide .speaker-silent .speaker-av,
.lc-slide .speaker .speaker-av { align-self: flex-end; width: auto;
  /* Прозрачный хвост кадра свисает ниже строки (у позы «показывает» это 39%
     высоты кадра) и накрыл бы верх сцены: сам он невидим, но перехватывал бы
     касания по картинке. Повтор реплики живёт на кнопке звука — она рядом и
     крупная. */
  pointer-events: none; }

/* ТАБЛИЦА ПОЗ. Тринадцать ростовых — числами эталона l1b (подобраны на живом
   экране). Девять портретных есть только в уроке 1, их числа сняты замером
   альфа-канала 27.08.2026 с теми же множителями manual, что в каноне:
   Нолик 0.88 (он младше Симки), новая партия поз ещё 0.95 — у них голова
   нарисована крупнее. Контроль метода: S_open дал ровно канонные 1.161/0.147. */
.lc-slide .speaker .speaker-av[src*="d8ec7fefbec9864f0453074a21fc2067"] { /* S_open    */ height: calc(var(--av-say) * 1.161); margin-bottom: calc(var(--av-say) * 0.147 * -1); }
.lc-slide .speaker .speaker-av[src*="9cb4d40fce0492278209290ee3e4ae31"] { /* S_side    */ height: calc(var(--av-say) * 1.124); margin-bottom: calc(var(--av-say) * 0.103 * -1); }
.lc-slide .speaker .speaker-av[src*="2d280461b029134123f1f1a356e176b1"] { /* S_wave    */ height: calc(var(--av-say) * 1.509); margin-bottom: calc(var(--av-say) * 0.407 * -1); }
.lc-slide .speaker .speaker-av[src*="8b89afaf8e00e0a46ea4d76ac473b1a2"] { /* S_point   */ height: calc(var(--av-say) * 1.512); margin-bottom: calc(var(--av-say) * 0.392 * -1); }
.lc-slide .speaker .speaker-av[src*="d9d838896ca0a5e16e7efa2439943fbd"] { /* S_thumb   */ height: calc(var(--av-say) * 1.311); margin-bottom: calc(var(--av-say) * 0.245 * -1); }
.lc-slide .speaker .speaker-av[src*="b57532bada44706da665a55d2ce2011e"] { /* S_tablet  */ height: calc(var(--av-say) * 1.089); margin-bottom: calc(var(--av-say) * 0.138 * -1); }
.lc-slide .speaker .speaker-av[src*="2f093e72fa038b855c80131ec3fba75c"] { /* S_jump    */ height: calc(var(--av-say) * 1.079); margin-bottom: calc(var(--av-say) * 0.160 * -1); }
.lc-slide .speaker .speaker-av[src*="c5fe17b7a8d023ade2bbb05e574eef78"] { /* S_face    */ height: calc(var(--av-say) * 1.047); margin-bottom: calc(var(--av-say) * 0.026 * -1); }
.lc-slide .speaker .speaker-av[src*="4346ad94c2790cac390e684155a2ecba"] { /* S_sad     */ height: calc(var(--av-say) * 1.092); margin-bottom: calc(var(--av-say) * 0.061 * -1); }
.lc-slide .speaker .speaker-av[src*="9f3d342d38e036a9137ef3e270d9d79c"] { /* S_angry   */ height: calc(var(--av-say) * 1.129); margin-bottom: calc(var(--av-say) * 0.080 * -1); }
.lc-slide .speaker .speaker-av[src*="8ab84c57bf234ea2e3bf8330b47c2db1"] { /* S_rule    */ height: calc(var(--av-say) * 1.193); margin-bottom: calc(var(--av-say) * 0.163 * -1); }
.lc-slide .speaker .speaker-av[src*="29a83a8a9641bb860a679d7e5ba52d26"] { /* S_shh     */ height: calc(var(--av-say) * 1.235); margin-bottom: calc(var(--av-say) * 0.200 * -1); }
.lc-slide .speaker .speaker-av[src*="a3dfec8b6a89762b454f0b5e660c2e78"] { /* N_open    */ height: calc(var(--av-say) * 1.138); margin-bottom: calc(var(--av-say) * 0.200 * -1); }
.lc-slide .speaker .speaker-av[src*="9dbffba2a03b29811719318b20070b4a"] { /* N_wave    */ height: calc(var(--av-say) * 1.236); margin-bottom: calc(var(--av-say) * 0.279 * -1); }
.lc-slide .speaker .speaker-av[src*="804a73df74595024fef5c7082428a668"] { /* N_tablet  */ height: calc(var(--av-say) * 1.189); margin-bottom: calc(var(--av-say) * 0.241 * -1); }
.lc-slide .speaker .speaker-av[src*="d185c5ed37536ac0063f735f7a15dd24"] { /* N_thumb   */ height: calc(var(--av-say) * 1.184); margin-bottom: calc(var(--av-say) * 0.213 * -1); }
.lc-slide .speaker .speaker-av[src*="2677c94cc946bd788a3828099d6bcd49"] { /* N_declare */ height: calc(var(--av-say) * 0.941); margin-bottom: calc(var(--av-say) * 0.105 * -1); }
.lc-slide .speaker .speaker-av[src*="6d0893ce02e4926539d6f7e0601c6161"] { /* N_jump    */ height: calc(var(--av-say) * 1.140); margin-bottom: calc(var(--av-say) * 0.283 * -1); }
.lc-slide .speaker .speaker-av[src*="55f04ea8d0761b7aff9d21f23ebcbfef"] { /* N_face    */ height: calc(var(--av-say) * 1.417); margin-bottom: calc(var(--av-say) * 0.363 * -1); }
.lc-slide .speaker .speaker-av[src*="093c72c52ca8a8488fa54146997aa39d"] { /* N_sulk    */ height: calc(var(--av-say) * 1.280); margin-bottom: calc(var(--av-say) * 0.288 * -1); }
.lc-slide .speaker .speaker-av[src*="37bd8b4bb1cea47935613348ad16c660"] { /* N_idea    */ height: calc(var(--av-say) * 1.292); margin-bottom: calc(var(--av-say) * 0.299 * -1); }
.lc-slide .speaker .speaker-av[src*="76c0df0665c83c5944ae67cae2739f7e"] { /* N_think   */ height: calc(var(--av-say) * 1.296); margin-bottom: calc(var(--av-say) * 0.302 * -1); }

/* ПОЛОСА ПЕРСОНАЖА НЕ СЖИМАЕТСЯ — УСТУПАЕТ КАРТИНКА (инвариант эталона).
   Иначе полосу сжимает, а сама фигура не уменьшается, и она вылезает на кадр
   (замер эталона 1920x949: 18px поверх картинки). */
.lesson-root .lc-slide .speaker-wrap { flex: 0 0 auto !important; }
/* §3 · ПЕРСОНАЖ СТОИТ НА КРОМКЕ КАДРА, А НЕ ТОНЕТ В НЁМ. Зазор даём полосе, а
   не самой позе: посадка позы задана таблицей выше, и трогать её нельзя. */
.lc-slide .speaker-wrap { padding-bottom: clamp(6px, 1.2dvh, 12px); }

/* ══ ЗВУКОВАЯ ВОЛНА ПО СЕРЕДИНЕ РОСТА ФИГУРЫ ══════════════════════════════
   align-self: center сам по себе даёт центр СТРОКИ, а не фигуры: строка одна
   на все позы, а рост у поз разный, поэтому отклонение гуляет.
   Чтобы считать точно, пропорции позы поднимаем с картинки на СТРОКУ — тогда
   их видит и волна (сестра картинки, а не её потомок):
     --ph  — высота кадра позы в долях --av-say
     --pmb — прозрачный хвост под ногами, в тех же долях
   рост фигуры = --av-say * (--ph - --pmb), волна встаёт на его половину от
   низа строки. Замер «до» на этом уроке: диаметр 92px, центр на 10px выше
   середины кадра позы. */
.speaker:has(.speaker-av[src*="d8ec7fefbec9864f0453074a21fc2067"]) { /* S_open    */ --ph: 1.161; --pmb: 0.147; }
.speaker:has(.speaker-av[src*="9cb4d40fce0492278209290ee3e4ae31"]) { /* S_side    */ --ph: 1.124; --pmb: 0.103; }
.speaker:has(.speaker-av[src*="2d280461b029134123f1f1a356e176b1"]) { /* S_wave    */ --ph: 1.509; --pmb: 0.407; }
.speaker:has(.speaker-av[src*="8b89afaf8e00e0a46ea4d76ac473b1a2"]) { /* S_point   */ --ph: 1.512; --pmb: 0.392; }
.speaker:has(.speaker-av[src*="d9d838896ca0a5e16e7efa2439943fbd"]) { /* S_thumb   */ --ph: 1.311; --pmb: 0.245; }
.speaker:has(.speaker-av[src*="b57532bada44706da665a55d2ce2011e"]) { /* S_tablet  */ --ph: 1.089; --pmb: 0.138; }
.speaker:has(.speaker-av[src*="2f093e72fa038b855c80131ec3fba75c"]) { /* S_jump    */ --ph: 1.079; --pmb: 0.160; }
.speaker:has(.speaker-av[src*="c5fe17b7a8d023ade2bbb05e574eef78"]) { /* S_face    */ --ph: 1.047; --pmb: 0.026; }
.speaker:has(.speaker-av[src*="4346ad94c2790cac390e684155a2ecba"]) { /* S_sad     */ --ph: 1.092; --pmb: 0.061; }
.speaker:has(.speaker-av[src*="9f3d342d38e036a9137ef3e270d9d79c"]) { /* S_angry   */ --ph: 1.129; --pmb: 0.080; }
.speaker:has(.speaker-av[src*="8ab84c57bf234ea2e3bf8330b47c2db1"]) { /* S_rule    */ --ph: 1.193; --pmb: 0.163; }
.speaker:has(.speaker-av[src*="29a83a8a9641bb860a679d7e5ba52d26"]) { /* S_shh     */ --ph: 1.235; --pmb: 0.200; }
.speaker:has(.speaker-av[src*="a3dfec8b6a89762b454f0b5e660c2e78"]) { /* N_open    */ --ph: 1.138; --pmb: 0.200; }
.speaker:has(.speaker-av[src*="9dbffba2a03b29811719318b20070b4a"]) { /* N_wave    */ --ph: 1.236; --pmb: 0.279; }
.speaker:has(.speaker-av[src*="804a73df74595024fef5c7082428a668"]) { /* N_tablet  */ --ph: 1.189; --pmb: 0.241; }
.speaker:has(.speaker-av[src*="d185c5ed37536ac0063f735f7a15dd24"]) { /* N_thumb   */ --ph: 1.184; --pmb: 0.213; }
.speaker:has(.speaker-av[src*="2677c94cc946bd788a3828099d6bcd49"]) { /* N_declare */ --ph: 0.941; --pmb: 0.105; }
.speaker:has(.speaker-av[src*="6d0893ce02e4926539d6f7e0601c6161"]) { /* N_jump    */ --ph: 1.140; --pmb: 0.283; }
.speaker:has(.speaker-av[src*="55f04ea8d0761b7aff9d21f23ebcbfef"]) { /* N_face    */ --ph: 1.417; --pmb: 0.363; }
.speaker:has(.speaker-av[src*="093c72c52ca8a8488fa54146997aa39d"]) { /* N_sulk    */ --ph: 1.280; --pmb: 0.288; }
.speaker:has(.speaker-av[src*="37bd8b4bb1cea47935613348ad16c660"]) { /* N_idea    */ --ph: 1.292; --pmb: 0.299; }
.speaker:has(.speaker-av[src*="76c0df0665c83c5944ae67cae2739f7e"]) { /* N_think   */ --ph: 1.296; --pmb: 0.302; }

.lc-slide .speaker-voice {
  width: var(--voice-d) !important; height: var(--voice-d) !important;
  min-width: var(--voice-d) !important; min-height: var(--voice-d) !important;
  flex: 0 0 var(--voice-d); box-sizing: border-box;
  margin-inline: var(--voice-gap); margin-top: 0; }
.lc-slide .speaker .speaker-voice {
  align-self: flex-end !important;
  margin-bottom: calc(var(--av-say) * (var(--ph, 1) - var(--pmb, 0)) / 2 - var(--voice-d) / 2) !important; }

/* ══ ТАЧ-ЦЕЛИ И КНОПКИ ════════════════════════════════════════════════════
   44px для детей 8-10 мало, минимум 48 (§4). Квадратики выбора цвета и знака
   в сборке значка остаются 44px намеренно: экран самый тесный в уроке, а 44 —
   действующий порог касания. */
.lc-slide button, .lc-slide [role="button"] { min-height: var(--tap-min); min-width: var(--tap-min); }
.lc-slide .swatch, .lc-slide .sym { min-height: 44px; min-width: 44px; }
.lc-slide .pause-btn { width: var(--tap-min); height: var(--tap-min); }
.lc-slide .btn-accent, .lc-slide .btn-ghost { min-height: var(--btn-h); min-width: min(200px, 100%);
  padding-inline: var(--s-6); border-radius: var(--r-pill);
  font-size: clamp(17px, 0.2vw + 14px, 17px); font-weight: 700; }
@media (max-width: 759px) {
  .lc-slide .btn-accent, .lc-slide .btn-ghost { min-width: 0; padding-inline: var(--s-5); }
  /* Одинаковая ширина «Назад» и «Дальше»: замер 20.09.2026 дал 115 против
     130 на 375x812 — требование Ника «одинаковый размер у всех». */
  .lc-slide .navrow > .btn-accent, .lc-slide .navrow > .btn-ghost { flex: 1 1 0; }
}
/* Высота варианта текучая: жёсткие 58px три варианта дают 174 + щели, и на
   коротком окне ряд их не вмещает. 52px палец ребёнка берёт уверенно. */
.lc-slide .opt, .lc-slide .card { height: auto;
  min-height: clamp(52px, 7dvh, 58px) !important; padding-block: 8px; }
.lc-slide .opts { gap: 8px; }

/* ══ КЕГЛИ ════════════════════════════════════════════════════════════════
   Мельче 17px в детском интерфейсе запрещено полностью (§4). FitLine умеет
   только уменьшать и ставит размер инлайном БЕЗ !important — поэтому здесь
   !important не ставим ни в одном правиле кегля, иначе усадка перестанет
   работать и длинная узбекская строка молча обрежется. */
.lc-slide .counter, .lc-slide .eyebrow { font-size: 17px; }
/* СЧЁТЧИК В ОДНУ СТРОКУ (заказчик, 25.09). Длинная шапка на телефоне сжимала правую
   часть, и «03 / 14» ломался в столбик. Счётчик и пауза не сжимаются,
   переносится только название шапки. */
.lc-slide .chrome-side { flex: 0 0 auto; }
.lc-slide .counter { white-space: nowrap; }
.lc-slide .eyebrow { min-width: 0; }
.lc-slide { --lc-fit-max: clamp(17px, min(0.4vw + 14px, 2.6dvh), 19px); }
/* white-space: normal вместо nowrap: в этом уроке .fit-line была однострочной с
   обрезкой по ellipsis, то есть длинный узбекский вариант ответа терял хвост.
   break-word, а не anywhere: anywhere рвёт даже короткое слово по буквам, и
   тогда FitLine перестаёт работать — она мерит ШИРИНУ, а при переносе в любом
   месте переполнения по ширине не возникает никогда. */
.lc-slide .fit-line { font-size: var(--lc-fit-max);
  white-space: normal; text-overflow: clip;
  line-height: 1.25; overflow-wrap: break-word; }

/* ══ КОРОТКОЕ ОКНО · ОДНА СТУПЕНЬ ПЛОТНОСТИ ═══════════════════════════════
   Снимается только воздух — отступы зон и щели между блоками — и понижается
   потолок роста фигуры. Читаемость текста и размер кнопки не трогаются: у них
   свои полы в clamp. */
.lesson-root { --gap-stack: clamp(8px, 1.7dvh, 22px); }
@media (max-height: 760px) {
  .lc-slide { --char-gap: var(--s-4); }
  .lc-slide .stage-content { padding-bottom: 2px; }
  .lc-slide .speaker-wrap { padding-top: 0; }
  .lesson-root { --gap-stack: clamp(6px, 1.2dvh, 12px); --av-say: clamp(84px, 17dvh, 180px); }
}
@media (max-height: 660px) {
  .lesson-root { --av-say: clamp(76px, 15dvh, 160px); }
}

/* ══ ТЕЛЕФОН В ЛАНДШАФТЕ (844x390 и подобные) ═════════════════════════════
   Главная ловушка матрицы: ширины полно, высоты 390, вертикальный стек не
   помещается физически. Замер «до»: перебор на экранах 01, 03, 09 и 10 и
   тач-цель 42px на ВСЕХ ОДИННАДЦАТИ экранах — её ставил собственный блок
   урока @media (max-height: 560px), где кнопке задано min-height: 42px.
   Порядок жертв: сжимается иллюстрация, потом исчезает; варианты и кнопки —
   никогда. */
@media (orientation: landscape) and (max-height: 560px) {
  .lesson-root { --av-say: 52px; --voice-d: 44px; }
  .lc-slide { --h-header: 44px; --h-footer: 56px; --btn-h: 44px; --tap-min: 44px; }
  .lesson-root .lc-slide .btn-accent, .lesson-root .lc-slide .btn-ghost { min-height: 44px; padding-block: 6px; }
  .lesson-root .lc-slide .opt, .lesson-root .lc-slide .card { min-height: 44px !important; }
  .lc-slide .stage-content > .stack { gap: 6px; }
  .lc-slide .speaker-wrap { padding-bottom: 2px; }
  .lc-slide .bigbtn { min-height: 44px; padding-block: 8px; }
}
/* Очень низкий экран: уходит иллюстрация, а за ней и фигура персонажа.
   АУДИО-КНОПКА ОСТАЁТСЯ — она и есть главная кнопка экрана для ребёнка,
   который читает по слогам. */
@media (max-height: 420px) {
  /* КАРТИНКУ НЕ ГАСИМ. В эталоне здесь display: none на кадре и на фигуре, но
     у урока 1 есть свои замеренные правила для низкого окна (блок
     max-height: 560px: картинка 84px, кадр сцены 146px, поля карточки 8px —
     замерено на 740x420). Гасить кадр значит выбросить эту работу и оставить
     ребёнка в ландшафте вообще без иллюстрации. Ограничиваем долей высоты, а
     фигура остаётся — в ландшафтной ступени она 52px и места почти не просит. */
  .lc-slide .stage-content > .stack > .scene-art,
  .lc-slide .stage-content > .stack > .netbox,
  .lc-slide .stage-content > .stack > .scene-slot { max-height: min(34dvh, 140px); }
  .lc-slide .speaker-wrap { padding-block: 0; }
}

/* ══ ЗАПАС ПОД НИЖНИМ РЯДОМ ═══════════════════════════════════════════════
   Формально перебора может не быть, но при дробном масштабе (зум браузера,
   нецелый devicePixelRatio) последние 1-2px съедаются и ряд выглядит
   подрезанным. Даём честный отступ; забирает его картинка — она единственная,
   кому разрешено уступать. */
.lc-slide .stage-content { padding-bottom: clamp(10px, 1.6dvh, 16px); }

/* ══ МАРКЕР ВАРИАНТА 22px (числа эталона) ═════════════════════════════════
   Было 26px базово и clamp(28..40) на крупном ярусе: буква-метка спорила
   размером с текстом варианта, хотя это служебный значок. Кегль буквы 17px —
   ниже в детском интерфейсе нельзя. */
.lc-slide .opt-mark, .lc-slide .card-box { width: 22px; height: 22px;
  border-radius: 6px; font-size: 17px; }
.lc-slide .opt-dead .opt-mark, .lc-slide .opt-ok .opt-mark { border-radius: 50%; }

/* ══ КОРОТКОЕ ОКНО · ВТОРАЯ СТУПЕНЬ (568px и телефон в ландшафте) ══════════
   Замер: экран 03 (три инфо-строки тура) не добирал 14px на 844x390 и 9px на
   320x568 — при том, что на каждой строке лежит по 26px чистых полей;
   экран 09 (сборка значка) не добирал 14px на 320x568.
   Ужимаются ТОЛЬКО поля, щели и полоса персонажа. Кегли и цели касания не
   трогаются: у них свои полы (17px и 44px). */
@media (max-height: 620px) {
  .lc-slide .uid { gap: 6px; }
  .lc-slide .uid-row { padding-block: 8px; }
  /* ФОЛБЭК-ПУЗЫРЬ РЕПЛИКИ. Текст на экране появляется только при отказе
     озвучки, и на 320x568 в узбекском он занимал 154px из 280 — ряды выбора
     значка уезжали на 14px. Потолок ничего не теряет: у пузыря своя внутренняя
     прокрутка. Это же снимает ложный дефект харнесса — он открывает урок с
     ?tts=off, то есть всегда в фолбэке (контрольный замер с живой озвучкой:
     полоса 86px вместо 154, перебора нет). */
  .lc-slide .speaker-bubble { max-height: min(20dvh, 116px); }
  /* Уступает ПЕРСОНАЖ, а не значок: значок заказчик дважды просила увеличить,
     а ряды цвета и знака ребёнок нажимает. */
  .lc-slide.stage:has(.maker), .lc-slide.stage:has(.badge-show) { --av-say: clamp(60px, 12dvh, 110px); }
}
/* САМАЯ УЗКАЯ СТУПЕНЬ — ПОСЛЕДНЕЙ. Блок 420px лежит выше и на окне 360px
   проигрывал блоку 620px при равной специфичности (замер: те же 9px перебора
   на экране 03 после «правки»). Здесь он идёт ниже и действует. */
@media (max-height: 420px) {
  .lc-slide .uid { gap: 4px; }
  .lc-slide .uid-row { padding-block: 5px; }
}

/* ══ СОСТОЯНИЯ ════════════════════════════════════════════════════════════
   :hover только внутри @media (hover: hover) and (pointer: fine) — на
   тач-экране подсветка залипает после тапа. */
@media (hover: hover) and (pointer: fine) {
  .lc-slide .opt:hover:not(:disabled) { transform: none; }
}



/* ══ ЗАМОК НА ВРЕМЯ РЕПЛИКИ (заказчик, 22.09.2026, п.2) ═══════════════════
   Пока персонаж говорит, зона содержимого не принимает касания. Дети жмут, не
   дослушав, и потом не понимают, что от них хотят, — это ровно та жалоба.
   Запирается ТОЛЬКО .stage-content: шапка с паузой, кнопка «послушать ещё раз»
   у персонажа и «Назад» остаются живыми, иначе ребёнку нечем остановить речь.
   Притушены сами нажимаемые элементы, а не весь экран: картинка и подписи
   должны читаться, пока их объясняют, — гаснет только то, что ждёт пальца. */
.lc-slide.is-speaking .stage-content { pointer-events: none; }
.lc-slide.is-speaking .stage-content button,
.lc-slide.is-speaking .stage-content [role="button"] {
  opacity: .55; filter: saturate(.7); transition: opacity .18s ease, filter .18s ease; }
.lc-slide .stage-content button,
.lc-slide .stage-content [role="button"] { transition: opacity .18s ease, filter .18s ease; }
/* Уже погашенный (разобранный) вариант не «оживает» на общем фоне. */
.lc-slide.is-speaking .stage-content .opt-dead { opacity: .35; }
@media (prefers-reduced-motion: reduce) {
  .lc-slide.is-speaking .stage-content button,
  .lc-slide.is-speaking .stage-content [role="button"] { transition: none; }
}


/* ══ РОСТ ПЕРСОНАЖА · ДВА РАЗМЕРА НА ВЕСЬ КУРС (заказчик, 22.09.2026, п.3) ══
   Блок стоит в самом конце файла намеренно: у каждого урока свой расчёт
   персонажа (--av, --av-say, --fig, --fig-h, --ch), и перебить их все можно
   только последним словом и !important.

   ДВА РАЗМЕРА И НИ ОДНОГО БОЛЬШЕ:
     --ch-say   на экране только персонаж — он и объясняет;
     --ch-work  на экране есть картинка или задание.
   Нолик в обоих ровно 0.78 от Симки: она его старшая сестра, и разницу должно
   быть видно, но она не должна плавать от экрана к экрану.

   РОСТ СЧИТАЕТСЯ ОТ ФИГУРЫ, А НЕ ОТ КАДРА. Кадры поз разные, персонаж занимает
   в них от 55 до 100 процентов высоты; при одинаковой ширине кадра рост гулял
   вдвое. Поэтому у каждой позы две доли: --ph (высота кадра в долях роста) и
   --pmb (прозрачный хвост под ногами). Хвост уходит в отрицательный нижний
   отступ, поэтому ноги всех поз стоят на одной линии. */
.lesson-root {
  /* РОСТ — ЧИСТЫЙ ПРОЦЕНТ ВЫСОТЫ СЦЕНЫ, без пределов по ширине и без потолка
     в пикселях (заказчик, п.3). Пределы и были причиной разнобоя: на телефоне
     побеждала ширина, на ноутбуке потолок, и доля экрана выходила от 16 до 30
     процентов на одном и том же токене. Процент считается от того же, от чего
     считается сам экран, поэтому доля одинакова на любом гаджете. */
  --ch-say:  calc(var(--lc-stage-h) * 0.46);
  --ch-work: calc(var(--lc-stage-h) * 0.28);
  --nolik-ratio: 0.78;
}
/* КОРОТКОЕ ОКНО · СТУПЕНЬ РОСТА. Телефон лёжа (844x390) — самый тесный кадр
   матрицы: на Stage остаётся 272px, и доля 0.28 даёт персонажа 76px против 71
   в прежнем расчёте урока 9. Пять пикселей — мелочь, пока на экране не стоит
   форма входа: замер урока 9, экран 10, 844x390 — .pc-form уходила за нижнюю
   границу на 36px, то есть кнопки «Войти» на экране просто не было.
   На телефоне стоя эта ступень не меняет ничего: там рост режет не доля
   высоты, а предел по ширине 30vw. */
@media (max-height: 480px) {
  .lesson-root {
    --ch-say:  calc(var(--lc-stage-h) * 0.40);
    --ch-work: calc(var(--lc-stage-h) * 0.26);
  }
}
.lc-slide.lc-narrator, .lc-slide.lc-narrator .speaker,
.lc-slide.lc-narrator .speaker-silent { --ch: var(--ch-say) !important; }
.lc-slide.lc-helper, .lc-slide.lc-helper .speaker,
.lc-slide.lc-helper .speaker-silent { --ch: var(--ch-work) !important; }
.lc-slide.lc-narrator .speaker-nolik { --ch: calc(var(--ch-say) * var(--nolik-ratio)) !important; }
.lc-slide.lc-helper .speaker-nolik { --ch: calc(var(--ch-work) * var(--nolik-ratio)) !important; }

/* Строка персонажа: ноги на нижней кромке, высота строки фиксирована по самому
   высокому пустому полю над фигурой (S_point, 0.12 роста) — иначе картинка
   вылезала бы в шапку при смене позы. */
.lc-slide .speaker { align-items: flex-end !important;
  min-height: calc(var(--ch) * 1.16) !important; }
.lc-slide .speaker-bubble { align-self: center; }
.lc-slide .speaker .speaker-av {
  height: calc(var(--ch) * var(--ph, 1)) !important;
  width: auto !important; max-width: none !important; max-height: none !important;
  scale: none !important; object-fit: fill !important;
  align-self: flex-end !important;
  margin-bottom: calc(var(--ch) * var(--pmb, 0) * -1) !important;
  /* Прозрачный хвост кадра свисает ниже строки и накрыл бы верх содержимого:
     сам невидим, но перехватывал бы касания. Повтор реплики — на кнопке звука. */
  pointer-events: none; }
/* Волна встаёт ровно на середину РОСТА ФИГУРЫ, а не строки: строка одна на все
   позы, а рост у поз разный. Доли позы для этого и подняты на строку. */
.lc-slide .speaker .speaker-voice {
  align-self: flex-end !important;
  margin-bottom: calc(var(--ch) * (var(--ph, 1) - var(--pmb, 0)) / 2 - var(--voice-d) / 2) !important; }

/* ТАБЛИЦА ПОЗ. Доли сняты с самих PNG (альфа-канал) и выправлены по контактному
   листу; на глаз не править — рассинхрон роста возвращается мгновенно.
   Доли стоят и на строке (её читает волна), и на картинке (её читает высота). */
.lc-slide .speaker:has(.speaker-av[src*="d8ec7fefbec9864f0453074a21fc2067"]),
.lc-slide .speaker .speaker-av[src*="d8ec7fefbec9864f0453074a21fc2067"],
.lc-slide .hero-av[src*="d8ec7fefbec9864f0453074a21fc2067"] { /* S_open    */ --ph: 1.161 !important; --pmb: 0.147 !important; }
.lc-slide .speaker:has(.speaker-av[src*="9cb4d40fce0492278209290ee3e4ae31"]),
.lc-slide .speaker .speaker-av[src*="9cb4d40fce0492278209290ee3e4ae31"],
.lc-slide .hero-av[src*="9cb4d40fce0492278209290ee3e4ae31"] { /* S_side    */ --ph: 1.124 !important; --pmb: 0.103 !important; }
.lc-slide .speaker:has(.speaker-av[src*="2d280461b029134123f1f1a356e176b1"]),
.lc-slide .speaker .speaker-av[src*="2d280461b029134123f1f1a356e176b1"],
.lc-slide .hero-av[src*="2d280461b029134123f1f1a356e176b1"] { /* S_wave    */ --ph: 1.509 !important; --pmb: 0.407 !important; }
.lc-slide .speaker:has(.speaker-av[src*="8b89afaf8e00e0a46ea4d76ac473b1a2"]),
.lc-slide .speaker .speaker-av[src*="8b89afaf8e00e0a46ea4d76ac473b1a2"],
.lc-slide .hero-av[src*="8b89afaf8e00e0a46ea4d76ac473b1a2"] { /* S_point   */ --ph: 1.512 !important; --pmb: 0.392 !important; }
.lc-slide .speaker:has(.speaker-av[src*="d9d838896ca0a5e16e7efa2439943fbd"]),
.lc-slide .speaker .speaker-av[src*="d9d838896ca0a5e16e7efa2439943fbd"],
.lc-slide .hero-av[src*="d9d838896ca0a5e16e7efa2439943fbd"] { /* S_thumb   */ --ph: 1.311 !important; --pmb: 0.245 !important; }
.lc-slide .speaker:has(.speaker-av[src*="b57532bada44706da665a55d2ce2011e"]),
.lc-slide .speaker .speaker-av[src*="b57532bada44706da665a55d2ce2011e"],
.lc-slide .hero-av[src*="b57532bada44706da665a55d2ce2011e"] { /* S_tablet  */ --ph: 1.089 !important; --pmb: 0.138 !important; }
.lc-slide .speaker:has(.speaker-av[src*="2f093e72fa038b855c80131ec3fba75c"]),
.lc-slide .speaker .speaker-av[src*="2f093e72fa038b855c80131ec3fba75c"],
.lc-slide .hero-av[src*="2f093e72fa038b855c80131ec3fba75c"] { /* S_jump    */ --ph: 1.079 !important; --pmb: 0.16 !important; }
.lc-slide .speaker:has(.speaker-av[src*="5beb66e0254ebe2034311db439939e76"]),
.lc-slide .speaker .speaker-av[src*="5beb66e0254ebe2034311db439939e76"],
.lc-slide .hero-av[src*="5beb66e0254ebe2034311db439939e76"] { /* S_hello   */ --ph: 0.963 !important; --pmb: 0.022 !important; }
.lc-slide .speaker:has(.speaker-av[src*="a3dfec8b6a89762b454f0b5e660c2e78"]),
.lc-slide .speaker .speaker-av[src*="a3dfec8b6a89762b454f0b5e660c2e78"],
.lc-slide .hero-av[src*="a3dfec8b6a89762b454f0b5e660c2e78"] { /* N_open    */ --ph: 1.138 !important; --pmb: 0.2 !important; }
.lc-slide .speaker:has(.speaker-av[src*="9dbffba2a03b29811719318b20070b4a"]),
.lc-slide .speaker .speaker-av[src*="9dbffba2a03b29811719318b20070b4a"],
.lc-slide .hero-av[src*="9dbffba2a03b29811719318b20070b4a"] { /* N_wave    */ --ph: 1.236 !important; --pmb: 0.279 !important; }
.lc-slide .speaker:has(.speaker-av[src*="804a73df74595024fef5c7082428a668"]),
.lc-slide .speaker .speaker-av[src*="804a73df74595024fef5c7082428a668"],
.lc-slide .hero-av[src*="804a73df74595024fef5c7082428a668"] { /* N_tablet  */ --ph: 1.189 !important; --pmb: 0.241 !important; }
.lc-slide .speaker:has(.speaker-av[src*="d185c5ed37536ac0063f735f7a15dd24"]),
.lc-slide .speaker .speaker-av[src*="d185c5ed37536ac0063f735f7a15dd24"],
.lc-slide .hero-av[src*="d185c5ed37536ac0063f735f7a15dd24"] { /* N_thumb   */ --ph: 1.184 !important; --pmb: 0.213 !important; }
.lc-slide .speaker:has(.speaker-av[src*="2677c94cc946bd788a3828099d6bcd49"]),
.lc-slide .speaker .speaker-av[src*="2677c94cc946bd788a3828099d6bcd49"],
.lc-slide .hero-av[src*="2677c94cc946bd788a3828099d6bcd49"] { /* N_declare */ --ph: 0.941 !important; --pmb: 0.105 !important; }
.lc-slide .speaker:has(.speaker-av[src*="6d0893ce02e4926539d6f7e0601c6161"]),
.lc-slide .speaker .speaker-av[src*="6d0893ce02e4926539d6f7e0601c6161"],
.lc-slide .hero-av[src*="6d0893ce02e4926539d6f7e0601c6161"] { /* N_jump    */ --ph: 1.14 !important; --pmb: 0.283 !important; }
.lc-slide .speaker:has(.speaker-av[src*="2f27e0f4118efff145aeecd8367fbb37"]),
.lc-slide .speaker .speaker-av[src*="2f27e0f4118efff145aeecd8367fbb37"],
.lc-slide .hero-av[src*="2f27e0f4118efff145aeecd8367fbb37"] { /* N_think   */ --ph: 0.864 !important; --pmb: 0.019 !important; }
.lc-slide .speaker:has(.speaker-av[src*="feae21bb32b7b4aa690fab151b60b598"]),
.lc-slide .speaker .speaker-av[src*="feae21bb32b7b4aa690fab151b60b598"],
.lc-slide .hero-av[src*="feae21bb32b7b4aa690fab151b60b598"] { /* N_sulk    */ --ph: 0.861 !important; --pmb: 0.018 !important; }
.lc-slide .speaker:has(.speaker-av[src*="aa8cb12cf9bdaf4c309614e7a427b480"]),
.lc-slide .speaker .speaker-av[src*="aa8cb12cf9bdaf4c309614e7a427b480"],
.lc-slide .hero-av[src*="aa8cb12cf9bdaf4c309614e7a427b480"] { /* N_hello   */ --ph: 0.854 !important; --pmb: 0.029 !important; }
.lc-slide .speaker:has(.speaker-av[src*="c5fe17b7a8d023ade2bbb05e574eef78"]),
.lc-slide .speaker .speaker-av[src*="c5fe17b7a8d023ade2bbb05e574eef78"],
.lc-slide .hero-av[src*="c5fe17b7a8d023ade2bbb05e574eef78"] { /* S_face    */ --ph: 1.047 !important; --pmb: 0.026 !important; }
.lc-slide .speaker:has(.speaker-av[src*="4346ad94c2790cac390e684155a2ecba"]),
.lc-slide .speaker .speaker-av[src*="4346ad94c2790cac390e684155a2ecba"],
.lc-slide .hero-av[src*="4346ad94c2790cac390e684155a2ecba"] { /* S_sad     */ --ph: 1.092 !important; --pmb: 0.061 !important; }
.lc-slide .speaker:has(.speaker-av[src*="9f3d342d38e036a9137ef3e270d9d79c"]),
.lc-slide .speaker .speaker-av[src*="9f3d342d38e036a9137ef3e270d9d79c"],
.lc-slide .hero-av[src*="9f3d342d38e036a9137ef3e270d9d79c"] { /* S_angry   */ --ph: 1.129 !important; --pmb: 0.08 !important; }
.lc-slide .speaker:has(.speaker-av[src*="8ab84c57bf234ea2e3bf8330b47c2db1"]),
.lc-slide .speaker .speaker-av[src*="8ab84c57bf234ea2e3bf8330b47c2db1"],
.lc-slide .hero-av[src*="8ab84c57bf234ea2e3bf8330b47c2db1"] { /* S_rule    */ --ph: 1.193 !important; --pmb: 0.163 !important; }
.lc-slide .speaker:has(.speaker-av[src*="29a83a8a9641bb860a679d7e5ba52d26"]),
.lc-slide .speaker .speaker-av[src*="29a83a8a9641bb860a679d7e5ba52d26"],
.lc-slide .hero-av[src*="29a83a8a9641bb860a679d7e5ba52d26"] { /* S_shh     */ --ph: 1.235 !important; --pmb: 0.2 !important; }
.lc-slide .speaker:has(.speaker-av[src*="55f04ea8d0761b7aff9d21f23ebcbfef"]),
.lc-slide .speaker .speaker-av[src*="55f04ea8d0761b7aff9d21f23ebcbfef"],
.lc-slide .hero-av[src*="55f04ea8d0761b7aff9d21f23ebcbfef"] { /* N_face    */ --ph: 1.417 !important; --pmb: 0.363 !important; }
.lc-slide .speaker:has(.speaker-av[src*="093c72c52ca8a8488fa54146997aa39d"]),
.lc-slide .speaker .speaker-av[src*="093c72c52ca8a8488fa54146997aa39d"],
.lc-slide .hero-av[src*="093c72c52ca8a8488fa54146997aa39d"] { /* N_sulk0   */ --ph: 1.28 !important; --pmb: 0.288 !important; }
.lc-slide .speaker:has(.speaker-av[src*="37bd8b4bb1cea47935613348ad16c660"]),
.lc-slide .speaker .speaker-av[src*="37bd8b4bb1cea47935613348ad16c660"],
.lc-slide .hero-av[src*="37bd8b4bb1cea47935613348ad16c660"] { /* N_idea    */ --ph: 1.292 !important; --pmb: 0.299 !important; }
.lc-slide .speaker:has(.speaker-av[src*="76c0df0665c83c5944ae67cae2739f7e"]),
.lc-slide .speaker .speaker-av[src*="76c0df0665c83c5944ae67cae2739f7e"],
.lc-slide .hero-av[src*="76c0df0665c83c5944ae67cae2739f7e"] { /* N_think0  */ --ph: 1.296 !important; --pmb: 0.302 !important; }


/* ══ КРУПНЫЙ ГЕРОЙ ЭКРАНА «РАЗБИРАЕМСЯ» — ТОТ ЖЕ РОСТ ОБЪЯСНЕНИЯ ══════════
   Заказчик, 24.09.2026: «рост персонажей играет. Сделай два размера — один
   для объяснений, когда он выходит на весь экран, и один, когда показывает, —
   в процентах, чтобы подошло и к другим урокам». Экран hero считал фигуру
   своим --av-hero по ШИРИНЕ кадра — clamp(150px, min(52vw, 40dvh), 330px) и
   ещё ступени по высоте окна: в уроке 4 это давало 32 % высоты сцены на
   телефоне и 54 % на планшете при 28/22 % на всех остальных экранах.
   Теперь герой стоит на --ch-say, как любой экран, где персонаж объясняет:
   рост ФИГУРЫ (не кадра) — 46 % высоты сцены, Нолик 0.78 от Симки. Доли позы
   (--ph, --pmb) — из той же таблицы, что у .speaker-av (селекторы hero-av
   дописаны в неё). Кольца и дуга остаются кругом по ширине кадра:
   .hero-figure обнимает картинку, а не задаёт ей ширину.
   Когда голоса нет и под героем печатается реплика, рост рабочий (--ch-work). */
.lc-slide .hero-zone { --ch-hero: var(--ch-say); --av-hero: var(--ch-hero); }
.lc-slide .hero-zone.hero-nolik { --ch-hero: calc(var(--ch-say) * var(--nolik-ratio)); }
.lc-slide .hero-zone:has(.hero-fallback) { --ch-hero: var(--ch-work); }
.lc-slide .hero-zone.hero-nolik:has(.hero-fallback) { --ch-hero: calc(var(--ch-work) * var(--nolik-ratio)); }
.lc-slide .hero-figure { width: max-content !important; }
.lc-slide .hero-av {
  width: auto !important; height: calc(var(--ch-hero) * var(--ph, 1)) !important;
  max-width: none !important; max-height: none !important; scale: none !important;
  margin-bottom: calc(var(--ch-hero) * var(--pmb, 0) * -1) !important; }


/* ══ ТЕЛЕФОН · ВАРИАНТЫ В ДВЕ КОЛОНКИ (заказчик, 25.09.2026) ═════════════════════
   На телефоне ряд из 4 и 6 вариантов стоит сеткой 2x2 / 3x2, и ячейка там
   узкая: на 375×667 это 145px, из них маркер (22 + зазор 14) и поля (18 + 18)
   забирали 76px. Тексту оставалось 69px при кегле 19 — узбекские слова рвались
   посередине («almasht|irib»), а три-четыре строки не влезали в кнопку.
   Здесь: пустой маркер-кружок убран (верный вариант и так зелёный с рамкой,
   погасший — серый), поля 8px, зазор колонок 8px, ряд шире на 6px с каждой
   стороны (в полях .stage-content), кегль 17 — минимум детского интерфейса,
   слово переносится только целиком, кнопка растёт по тексту. Самое длинное
   слово урока 8 «Almashtiraman,» при 17px занимает 121px: на 360px тексту
   остаётся 128, на 375 — 136. На 320px (старые телефоны) — 108, там длинное
   слово всё же перенесётся внутри себя.
   Вес и !important нужны: в разных уроках у .opt и .fit-line жёсткие высоты,
   line-clamp и инлайновый кегль FitLine. */
@media (max-width: 560px) {
  .lesson-root .lc-slide .opts:has(> :nth-child(4):last-child) > .opt,
  .lesson-root .lc-slide .opts:has(> :nth-child(6):last-child) > .opt {
    height: auto !important; max-height: none !important; min-height: 56px !important;
    padding: 8px 8px !important; gap: 0 !important; font-size: 17px !important; }
  .lesson-root .lc-slide .opts:has(> :nth-child(4):last-child),
  .lesson-root .lc-slide .opts:has(> :nth-child(6):last-child) {
    column-gap: 8px !important; margin-inline: -6px !important; }
  .lesson-root .lc-slide .opts:has(> :nth-child(4):last-child) > .opt > .opt-mark,
  .lesson-root .lc-slide .opts:has(> :nth-child(6):last-child) > .opt > .opt-mark {
    display: none !important; }
  .lesson-root .lc-slide .opts:has(> :nth-child(4):last-child) > .opt > .fit-line,
  .lesson-root .lc-slide .opts:has(> :nth-child(6):last-child) > .opt > .fit-line {
    font-size: 17px !important; line-height: 1.25 !important;
    height: auto !important; max-height: none !important;
    display: block !important; -webkit-line-clamp: unset !important; overflow: visible !important;
    white-space: normal !important; text-overflow: clip !important;
    overflow-wrap: break-word !important; word-break: normal !important; }
}

/* ══ СЕТКА ОТВЕТОВ · 2x2 И 3x2 (заказчик, 22.09.2026, п.5) ════════════════
   Ряд ответов из ЧЕТЫРЁХ встаёт в две колонки, из ШЕСТИ — в три на широком
   окне и в две на телефоне. Селектор считает детей: «четвёртый ребёнок, он же
   последний» значит ровно четыре, ни больше ни меньше.
   Блок стоит в конце файла: каркас объявляет .opts флексом в одну колонку с
   !important, и перебить это можно только позже и с той же силой. */
.lc-slide .opts:has(> :nth-child(4):last-child),
.lc-slide .tiles:has(> :nth-child(4):last-child),
.lc-slide .rules:has(> :nth-child(4):last-child),
.lc-slide .trio:has(> :nth-child(4):last-child),
.lc-slide .cards:has(> :nth-child(4):last-child),
.lc-slide .marks:has(> :nth-child(4):last-child),
.lc-slide .hide:has(> :nth-child(4):last-child),
.lc-slide .shields:has(> :nth-child(4):last-child),
.lc-slide .dv-acts:has(> :nth-child(4):last-child),
.lc-slide .pw-row:has(> :nth-child(4):last-child),
.lc-slide .tray:has(> :nth-child(4):last-child),
.lc-slide .doors:has(> :nth-child(4):last-child),
.lc-slide .menu:has(> :nth-child(4):last-child),
.lc-slide .tab-body:has(> :nth-child(4):last-child),
.lc-slide .tk-opts:has(> :nth-child(4):last-child),
.lc-slide .checks:has(> :nth-child(4):last-child),
.lc-slide .apps:has(> :nth-child(4):last-child),
.lc-slide .devs:has(> :nth-child(4):last-child),
.lc-slide .keyline:has(> :nth-child(4):last-child),
.lc-slide .dos:has(> :nth-child(4):last-child) {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  align-items: stretch;
}
.lc-slide .opts:has(> :nth-child(6):last-child),
.lc-slide .tiles:has(> :nth-child(6):last-child),
.lc-slide .rules:has(> :nth-child(6):last-child),
.lc-slide .trio:has(> :nth-child(6):last-child),
.lc-slide .cards:has(> :nth-child(6):last-child),
.lc-slide .marks:has(> :nth-child(6):last-child),
.lc-slide .hide:has(> :nth-child(6):last-child),
.lc-slide .shields:has(> :nth-child(6):last-child),
.lc-slide .dv-acts:has(> :nth-child(6):last-child),
.lc-slide .pw-row:has(> :nth-child(6):last-child),
.lc-slide .tray:has(> :nth-child(6):last-child),
.lc-slide .doors:has(> :nth-child(6):last-child),
.lc-slide .menu:has(> :nth-child(6):last-child),
.lc-slide .tab-body:has(> :nth-child(6):last-child),
.lc-slide .tk-opts:has(> :nth-child(6):last-child),
.lc-slide .checks:has(> :nth-child(6):last-child),
.lc-slide .apps:has(> :nth-child(6):last-child),
.lc-slide .devs:has(> :nth-child(6):last-child),
.lc-slide .keyline:has(> :nth-child(6):last-child),
.lc-slide .dos:has(> :nth-child(6):last-child) {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  align-items: stretch;
}
@media (min-width: 760px) {
.lc-slide .opts:has(> :nth-child(6):last-child),
.lc-slide .tiles:has(> :nth-child(6):last-child),
.lc-slide .rules:has(> :nth-child(6):last-child),
.lc-slide .trio:has(> :nth-child(6):last-child),
.lc-slide .cards:has(> :nth-child(6):last-child),
.lc-slide .marks:has(> :nth-child(6):last-child),
.lc-slide .hide:has(> :nth-child(6):last-child),
.lc-slide .shields:has(> :nth-child(6):last-child),
.lc-slide .dv-acts:has(> :nth-child(6):last-child),
.lc-slide .pw-row:has(> :nth-child(6):last-child),
.lc-slide .tray:has(> :nth-child(6):last-child),
.lc-slide .doors:has(> :nth-child(6):last-child),
.lc-slide .menu:has(> :nth-child(6):last-child),
.lc-slide .tab-body:has(> :nth-child(6):last-child),
.lc-slide .tk-opts:has(> :nth-child(6):last-child),
.lc-slide .checks:has(> :nth-child(6):last-child),
.lc-slide .apps:has(> :nth-child(6):last-child),
.lc-slide .devs:has(> :nth-child(6):last-child),
.lc-slide .keyline:has(> :nth-child(6):last-child),
.lc-slide .dos:has(> :nth-child(6):last-child) {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }
}
/* Внутри сетки вариант занимает свою ячейку целиком: каркас разрешал ему
   растягиваться на всю строку (grid-column: auto + width 100%), и в двух
   колонках это давало пустую вторую половину. */
.lc-slide .opts:has(> :nth-child(4):last-child) > *,
.lc-slide .opts:has(> :nth-child(6):last-child) > *,
.lc-slide .tiles:has(> :nth-child(4):last-child) > *,
.lc-slide .tiles:has(> :nth-child(6):last-child) > *,
.lc-slide .rules:has(> :nth-child(4):last-child) > *,
.lc-slide .rules:has(> :nth-child(6):last-child) > *,
.lc-slide .trio:has(> :nth-child(4):last-child) > *,
.lc-slide .trio:has(> :nth-child(6):last-child) > *,
.lc-slide .cards:has(> :nth-child(4):last-child) > *,
.lc-slide .cards:has(> :nth-child(6):last-child) > *,
.lc-slide .marks:has(> :nth-child(4):last-child) > *,
.lc-slide .marks:has(> :nth-child(6):last-child) > *,
.lc-slide .hide:has(> :nth-child(4):last-child) > *,
.lc-slide .hide:has(> :nth-child(6):last-child) > *,
.lc-slide .shields:has(> :nth-child(4):last-child) > *,
.lc-slide .shields:has(> :nth-child(6):last-child) > *,
.lc-slide .dv-acts:has(> :nth-child(4):last-child) > *,
.lc-slide .dv-acts:has(> :nth-child(6):last-child) > *,
.lc-slide .pw-row:has(> :nth-child(4):last-child) > *,
.lc-slide .pw-row:has(> :nth-child(6):last-child) > *,
.lc-slide .tray:has(> :nth-child(4):last-child) > *,
.lc-slide .tray:has(> :nth-child(6):last-child) > *,
.lc-slide .doors:has(> :nth-child(4):last-child) > *,
.lc-slide .doors:has(> :nth-child(6):last-child) > *,
.lc-slide .menu:has(> :nth-child(4):last-child) > *,
.lc-slide .menu:has(> :nth-child(6):last-child) > *,
.lc-slide .tab-body:has(> :nth-child(4):last-child) > *,
.lc-slide .tab-body:has(> :nth-child(6):last-child) > *,
.lc-slide .tk-opts:has(> :nth-child(4):last-child) > *,
.lc-slide .tk-opts:has(> :nth-child(6):last-child) > *,
.lc-slide .checks:has(> :nth-child(4):last-child) > *,
.lc-slide .checks:has(> :nth-child(6):last-child) > *,
.lc-slide .apps:has(> :nth-child(4):last-child) > *,
.lc-slide .apps:has(> :nth-child(6):last-child) > *,
.lc-slide .devs:has(> :nth-child(4):last-child) > *,
.lc-slide .devs:has(> :nth-child(6):last-child) > *,
.lc-slide .keyline:has(> :nth-child(4):last-child) > *,
.lc-slide .keyline:has(> :nth-child(6):last-child) > *,
.lc-slide .dos:has(> :nth-child(4):last-child) > *,
.lc-slide .dos:has(> :nth-child(6):last-child) > * {
  grid-column: auto !important;
  width: 100% !important;
  min-width: 0;
  margin: 0;
}


/* ══ ЖЁЛТАЯ ПЛАШКА СНЯТА (заказчик, 22.09.2026, п.4) ══════════════════════
   .note-hint был единственным жёлтым блоком с текстом в уроках: в нём стоят
   чужие сообщения, которые ребёнок разбирает («ЧЕРНОВИК», «НЕЗНАКОМЕЦ»).
   Жёлтый в модуле значит «стоп, подумай», и сообщение, которое ребёнок ещё
   только собирается оценить, оказывалось помечено раньше, чем он ответил.
   Стала обычная карточка: фон бумаги, тонкая рамка, серый ярлык. */
.lc-slide .note-hint {
  background: ${T.paper} !important;
  box-shadow: inset 3px 0 0 rgba(${T.shadowBase},0.18),
              0 2px 0 rgba(${T.shadowBase},0.05),
              0 10px 22px -16px rgba(${T.shadowBase},0.45) !important;
}
.lc-slide .note-hint .note-lbl { color: ${T.ink3} !important; }

/* ВЛЁТ ПЕРСОНАЖА НЕ ДОЛЖЕН ОСТАВАТЬСЯ НА ЭКРАНЕ (заказчик, 22.09.2026, п.3).
   У .speaker-av стоит animation: avIn ... both, а avIn начинается с
   transform: scale(.9). Замер урока 1 на 1024x768: спустя пять секунд после
   загрузки страницы анимация так и висела на currentTime = 0, то есть фигура
   держалась в стартовом кадре и была РОВНО НА 10 ПРОЦЕНТОВ НИЖЕ расчётной —
   при том, что --ch у неё тот же, что у остальных уроков. Ровно так рост и
   «уезжал» между уроками: урок 2 это правило у себя уже снял, остальные нет.
   Влёт убираем, тихое покачивание оставляем: оно двигает translate, а не
   transform, и на рост не влияет. */
.lc-slide .speaker .speaker-av {
  transform: none !important;
  animation-name: idleFloat !important;
  animation-duration: 4.2s !important;
  animation-delay: .5s !important;
  animation-iteration-count: infinite !important;
  animation-fill-mode: none !important;
  opacity: 1 !important; }

/* СТРОКА ПЕРСОНАЖА ТОЖЕ НЕ ДОЛЖНА ЗАСТРЕВАТЬ ВО ВЛЁТЕ. У .speaker стоит
   animation: sayIn ... both, и sayIn начинается с transform: scale(.96).
   Замер урока 1: через пять секунд после загрузки анимация висела на
   currentTime = 0, и вся строка вместе с фигурой оставалась на 4 процента
   меньше — поверх тех же 10 процентов, что забирал влёт самой картинки.
   Вместе это давало урок 1 с персонажем 88 против 91 и 112 против 117 у всех
   остальных. Влёт снят, рост стал считаться ровно по --ch. */
.lc-slide .speaker { transform: none !important; animation-name: none !important;
  opacity: 1 !important; }

/* ══ СТРОКА ЗАДАНИЯ (перенос канона, партия 5) ════════════════════════════
   Урок 1 был единственным, чей Stage не принимал строку задания. Теперь
   принимает — и правила для неё те же, что в остальных девяти. */
.lc-feedback-top { flex: 0 0 auto; padding: 0 var(--pad) 6px; }
.lc-feedback-in { text-align: center; margin-inline: auto; max-width: 60ch;
  font: 700 clamp(17px, 1.6vw, 22px)/1.35 Manrope, sans-serif; }
/* Межстрочье на узком экране: блок обязан стоять НИЖЕ самого правила —
   специфичность та же, а медиазапрос её не повышает. */
@media (max-width: 759px) {
  .lc-feedback-in { line-height: 1.2; }
}
/* ══ КРУПНАЯ КНОПКА ДЕЙСТВИЯ — КОМПАКТНАЯ (заказчик, 24.09.2026) ══════════
   Было 235x66, шрифт 25px, до 480px в ширину. Стало 46px, 17–19px, до 360px:
   высоту забирает кадр, он в .stack единственное эластичное звено. Кнопка не
   сжимается (844x390: «Ещё раз» ужималась до 26px, меньше пальца). */
.lc-slide .bigbtn { min-height: 46px; padding: 9px 18px; border-radius: 14px;
  font-size: clamp(17px, 1.3vw, 19px); max-width: 360px; flex-shrink: 0; }
`;

export default KiberM1L01;
