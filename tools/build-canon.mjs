// Сборка канона курса «HTML» v1 из эталонных уроков.
//
//   node tools/build-canon.mjs
//
// Канон собирается строками из эталона Курса 0 (lessons/_reference) плюс части
// из canon/html/*.part.jsx. Ни одна строка эталона не перепечатывается руками:
// так канон гарантированно совпадает с источником. Результат —
// canon/html/canon-v1.jsx; его дословно копирует каждый урок курса.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(root + p, 'utf8').split('\n');

const K0 = read('lessons/_reference/02-kurs0-urok-01.jsx');            // Курс 0, урок 1
const part = (name) => readFileSync(root + 'canon/html/' + name, 'utf8').replace(/\n+$/, '\n').split('\n');

// Строки a..b включительно (нумерация с 1, как в редакторе).
const take = (src, a, b) => src.slice(a - 1, b);

// Контрольные строки: если эталон поменяли, границы разделов уехали —
// сборка останавливается, а не собирает канон из обрывков.
const expect = (src, n, start, label) => {
  const line = src[n - 1] || '';
  if (!line.startsWith(start)) {
    throw new Error(`Граница «${label}» уехала: строка ${n} = ${JSON.stringify(line.slice(0, 60))}`);
  }
};
expect(K0, 40, '// 1. ДИЗАЙН-ТОКЕНЫ', 'К0 токены');
expect(K0, 76, '};', 'К0 конец T');
expect(K0, 111, '// СИСТЕМА ДВИЖЕНИЯ', 'К0 система движения');
expect(K0, 300, '};', 'К0 конец POSES');
expect(K0, 302, '// Голос один', 'К0 голос');
expect(K0, 307, 'const VOICE = ', 'К0 конец голоса');
expect(K0, 489, '// 3. ЯЗЫК', 'К0 язык');
expect(K0, 522, '// 4. ВРЕМЯ И ТЕКСТ ДЛЯ ОЗВУЧКИ', 'К0 текст для озвучки');
expect(K0, 678, 'function useAudioEngine(ttsApiBase, lang) {', 'К0 озвучка');
expect(K0, 1152, '}', 'К0 конец spokenOf');
expect(K0, 1155, '// 6. SFX', 'К0 звуки');
expect(K0, 1210, '// 7. ЖУРНАЛ', 'К0 журнал');
expect(K0, 1240, 'const safeStorage = (() => {', 'К0 хранилище');
expect(K0, 1248, '})();', 'К0 конец хранилища');
expect(K0, 1339, '// 8. РЕЧЬ ПЕРСОНАЖА', 'К0 речь');
expect(K0, 3313, '}', 'К0 конец корня');
expect(K0, 3342, '// ========================  К А Н О Н  ·  М Е Х А Н И К И', 'К0 механики');
expect(K0, 5117, '}', 'К0 конец библиотеки');
expect(K0, 5818, '// ===============  К А Н О Н  ·  П Р А В К И', 'К0 правки вёрстки');
expect(K0, 5920, '`;', 'К0 конец CANON_UI_CSS');
expect(K0, 7361, '// Оформление экранов, которые есть в КАЖДОМ уроке', 'К0 CSS экранов');
expect(K0, 8115, 'const CANON_SCREEN_CSS =', 'К0 конец CSS экранов');

const sections8to17 = take(K0, 1338, 3313);
if (sections8to17.indexOf('  const audio = useAudioEngine(ttsApiBase, lang);') < 0) {
  throw new Error('Не найден вызов useAudioEngine(ttsApiBase, lang) в корне Курса 0');
}

const out = [
  ...part('header.part.jsx'),
  "import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext, useLayoutEffect } from 'react';",
  '',
  ...take(K0, 39, 76),            // 1. токены
  '',
  ...part('hero-head.part.jsx'),  // 2. герой: шапка раздела и цвета
  ...take(K0, 110, 300),          //    система движения Курса 0 — дословно
  '',
  ...take(K0, 302, 307),          //    голос героя (Курс 0)
  ...part('hero-tail.part.jsx'),  //    имя и рисунок Коди
  ...take(K0, 488, 520),          // 3. язык
  ...take(K0, 521, 1153),         // 4–5. текст для озвучки и движок озвучки
                                  //      с ttsApiBase (Курс 0) — дословно
  ...take(K0, 1154, 1207),        // 6. звуки (Курс 0)
  '',
  ...take(K0, 1209, 1239),        // 7. журнал и стор …
  '// СКЛЕЙКА: прогресс живёт в памяти до конца урока (бриф, «Контракт с',
  '// платформой»): localStorage уроку не нужен. Без хранилища все операции',
  '// useProgress становятся пустыми — так же, как в приватном режиме браузера.',
  'const safeStorage = null;',
  ...take(K0, 1249, 1336),        //    … остаток раздела 7
  ...sections8to17,               // 8–17: речь, рассказ, гейты, похвала, каркас, иконки,
                                  //       подсказки, лесенка, выбор, коуч-марк, CSS_BASE, корень
  '',
  ...take(K0, 3341, 5117),        // механики и библиотека заданий (обе части)
  '',
  ...take(K0, 5817, 5920),        // правки вёрстки — CANON_UI_CSS
  '',
  ...take(K0, 7361, 8115),        // оформление типовых экранов — CANON_SCREEN_CSS
  ''
];

// ЦВЕТ КУРСА (заказчик, 12.10.2026): интерфейс — #FF4F28 вместо голубого
// Курса 0. Меняются только токены ui / blue и голубые rgba в стилях канона.
let text = out.join('\n');
const swap = (from, to) => {
  if (text.indexOf(from) < 0) throw new Error('Не найдено для замены цвета: ' + from);
  text = text.split(from).join(to);
};

// ОЗВУЧКА ПО ПРАВИЛАМ СЕРВИСА (заказчик, 14.10.2026; TTS quality rules).
// 1) Маркер узбекского языка — ровно «[O'zbekcha tallaffuz]», как в правилах
//    сервиса и в эталоне 1-класса: по этой строке сервис выбирает язык.
// 2) В каждый запрос — lesson_id и lesson_name (на языке ученика): сервер
//    держит кэш озвучки и аналитику по урокам. student_uuid не шлём — LMS не
//    передаёт его уроку. Данные урока берутся из META урока.
swapTts();
swapAutoplay();
swapTtsDiag();
swapIdleCoach();
swapVoiceTop();
swapCelebrate();
swapKodiHead();
swapEmotion();

swap("  ui: '#1E88E5',", "  // КУРС HTML: интерфейс — #FF4F28 (заказчик, 12.10.2026), а не голубой.\n  ui: '#FF4F28',");
swap("  uiSoft: '#E3F2FD',", "  uiSoft: '#FFE8E1',");
swap("  uiDk: '#1565C0',", "  uiDk: '#B94127',");
swap("  blue: '#2B7FD4',", "  blue: '#EF6A4A',");
swap("  blueSoft: '#E4F0FB',", "  blueSoft: '#FFEDE6',");
swap("  blueDk: '#1F63A8',", "  blueDk: '#B94127',");
// Свечения: голубые тени Курса 0 рассчитаны на холодный цвет. Тот же
// оранжевый при той же прозрачности светится вдвое ярче — поэтому прозрачность
// всех свечений интерфейса умножена на 0.65 (нормализация 12.10.2026).
if (!/rgba\(30,136,229,/.test(text)) throw new Error('Не найдены голубые свечения');
text = text.replace(/rgba\(30,136,229,\s*([0-9.]+)\)/g,
  (m, a) => 'rgba(255,79,40,' + String(+(parseFloat(a) * 0.65).toFixed(2)).replace(/^0\./, '.') + ')');
// Нормализация (12.10.2026): цвета текста выровнены по светлоте OKLCH (L≈0.52)
// и насыщенности — ни один не кричит и не проваливается в чёрный; контраст
// каждого на белом — от 5.2:1. Подсказка остаётся жёлтым каналом,
// но её подписи на светло-жёлтом фоне у Курса 0 читались с контрастом 2.8.
swap("  hint: '#C08A12',", "  hint: '#8D5E00',");
swap('#64B5F6', '#FF8A65');

// РУБАШКА ЗАКРЫТОЙ КАРТОЧКИ (дизайн-ревью 12.10.2026). У Курса 0 рубашка —
// полосы «цвет интерфейса + голубой #42A5F5»: на оранжевом курсе это шумная
// сине-оранжевая карамель. Новая рубашка — тихая: тёплая бумага в точку, белый
// значок «?» и метка </> в углу. Нейтральная намеренно: оранжевым светится
// только карточка, о которой герой говорит сейчас, — так видна иерархия
// «закрыта / читается / открыта».
swap(`.tour-back { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 16px;
  background: repeating-linear-gradient(135deg, \${T.ui} 0 14px, #42A5F5 14px 28px); }
.tour-back i { display: grid; place-items: center; width: clamp(34px, 7dvh, 48px); aspect-ratio: 1;
  border-radius: 50%; background: rgba(255,255,255,.92); color: \${T.uiDk};
  font-size: clamp(20px, 4dvh, 28px); font-weight: 900; line-height: 1; font-style: normal; }`,
`/* Рубашка курса HTML: тёплая бумага в точку (как пиксели экрана Коди), белый
   значок «?» и метка </> в углу. Оранжевый здесь только в знаке вопроса: цветом
   светится карточка, которую читают сейчас. Значок дышит — карточка ждёт, а не
   выключена; у соседних карточек дыхание идёт со сдвигом. */
.tour-back { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 16px; overflow: hidden;
  background:
    radial-gradient(rgba(\${T.shadowBase},.13) 1.3px, transparent 1.9px) 0 0 / 14px 14px,
    linear-gradient(160deg, #FDFCFA 0%, #F1EEE8 100%);
  box-shadow: inset 0 0 0 1.5px rgba(\${T.shadowBase},.08); }
.tour-back::after { content: '</>'; position: absolute; right: 10px; bottom: 8px;
  font: 800 12px/1 'JetBrains Mono', ui-monospace, monospace; color: \${T.ink3}; }
.tour-back i { display: grid; place-items: center; width: clamp(38px, 7.5dvh, 52px); aspect-ratio: 1;
  border-radius: 50%; background: \${T.paper}; color: \${T.uiDk};
  font-size: clamp(20px, 4dvh, 28px); font-weight: 900; line-height: 1; font-style: normal;
  box-shadow: 0 2px 0 rgba(\${T.shadowBase},0.06), 0 8px 18px -10px rgba(\${T.shadowBase},.45),
    inset 0 0 0 2px rgba(255,79,40,.14);
  animation: backBreath 2.8s ease-in-out infinite; }
.tour-card:nth-child(2) .tour-back i { animation-delay: .45s; }
.tour-card:nth-child(3) .tour-back i { animation-delay: .9s; }
.tour-card:nth-child(4) .tour-back i { animation-delay: 1.35s; }
@keyframes backBreath { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
@media (prefers-reduced-motion: reduce) { .tour-back i { animation: none; } }`);

writeFileSync(root + 'canon/html/canon-v1.jsx', text);
console.log('canon/html/canon-v1.jsx —', out.length, 'строк');

function swapTts() {
  swap(`  uz: "[O'zbekcha talaffuz] ",`, `  uz: "[O'zbekcha tallaffuz] ",   // КУРС HTML: так, как требует сервис озвучки`);
  // АДРЕС ЗАПРОСА — КАК У ЭТАЛОНА МАТЕМАТИКИ (Dars01), который озвучивается в LMS.
  // URLSearchParams кодировал пробелы знаком «+»: сервис, раскодирующий текст
  // как эталон, получал «[Русское+произношение]+Привет!» — маркер не узнавался.
  // Теперь пробел — %20, квадратные скобки маркера — как есть, затем g, затем
  // lesson_id и lesson_name (META урока, название на языке ученика).
  // Пол голоса: если LMS передала voiceGender, он главнее голоса реплики.
  swap(`const buildTtsUrl = (base, text, gender) => {
  if (!base) return '';
  const p = new URLSearchParams({ text: String(text).slice(0, 1000), g: gender === 'm' ? 'm' : 'f' });
  return base.replace(/\\/+$/, '') + '/api/tts?' + p.toString();
};`, `// КУРС HTML: голос от LMS (пропс voiceGender, как у эталона математики).
let LMS_VOICE = null;
const setLmsVoice = (g) => { LMS_VOICE = g === 'm' || g === 'f' ? g : null; };
// КУРС HTML: адрес — ровно как у эталона математики (пробел — %20, скобки
// маркера — как есть) + lesson_id и lesson_name из META урока.
const ttsEnc = (s) => encodeURIComponent(String(s)).replace(/%5B/g, '[').replace(/%5D/g, ']');
const buildTtsUrl = (base, text, gender, lang) => {
  if (!base) return '';
  const g = (LMS_VOICE || gender) === 'm' ? 'm' : 'f';
  let url = base.replace(/\\/+$/, '') + '/api/tts?text=' + ttsEnc(String(text).slice(0, 1000)) + '&g=' + g;
  const meta = typeof META !== 'undefined' && META ? META : null;
  if (meta && meta.lessonId) {
    url += '&lesson_id=' + encodeURIComponent(meta.lessonId);
    const t = meta.lessonTitle || {};
    const name = t[lang] || t.ru || '';
    if (name) url += '&lesson_name=' + encodeURIComponent(name);
  }
  return url;
};`);
  swap(`buildTtsUrl(ttsApiBase, markLang(clean, lang), gender || 'f')`, `buildTtsUrl(ttsApiBase, markLang(clean, lang), gender || 'f', lang)`);
  swap(`buildTtsUrl(ttsApiBase, markLang(clean, lang), 'f')`, `buildTtsUrl(ttsApiBase, markLang(clean, lang), 'f', lang)`);
  // Аудиоэлемент — как у эталона: crossOrigin = 'anonymous'.
  swap(`    if (!elRef.current) { const a = new Audio(); a.preload = 'auto'; elRef.current = a; }`,
    `    if (!elRef.current) { const a = new Audio(); a.preload = 'auto'; a.crossOrigin = 'anonymous'; elRef.current = a; }`);
  // ПРОВЕРКА «ТИШИНЫ» НЕ ГЛУШИТ МЕДЛЕННЫЙ СЕРВИС. Раньше через 0,9 с после
  // старта звук, который сервис ещё не успел прислать, обрывался и заменялся
  // голосом браузера. Эталон математики так не делает. Теперь замена — только
  // при настоящей ошибке загрузки; от вечного ожидания страхует таймер ниже.
  swap(`                  const silent = !a.duration || Number.isNaN(a.duration) || a.currentTime < 0.05;`,
    `                  const silent = !!a.error || a.networkState === 3;   // КУРС HTML: только настоящая ошибка`);
}

// КАК ЭТАЛОН МАТЕМАТИКИ (Dars01): звук пробуется СРАЗУ, без ожидания касания.
// Урок открывают нажатием в LMS, iframe получает allow="autoplay", и браузер
// обычно разрешает звук с первой фразы. Канон Курса 0 до первого касания звук
// даже не пробовал — первые реплики шли текстом, и урок «молчал» на старте.
// Теперь: тихая проба на общей дорожке; разрешил — говорим сразу и считаем,
// что касание было; не разрешил — прежний путь (текст, касание, фраза заново).
function swapAutoplay() {
  swap(`      if (!gesturedRef.current) {
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
      play();`, `      const waitGesture = () => {
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
      play();`);
  // Голос не помечается «недоступным» заранее: с сервисом озвучки урок сначала
  // пробует звук и только при отказе показывает реплику текстом. Иначе первая
  // фраза печаталась в облаке, даже когда уже звучала.
  swap(`  const [failed, setFailed] = useState(true);   // до первого касания голоса нет`,
    `  const [failed, setFailed] = useState(!ttsApiBase);   // КУРС HTML: с сервисом — сначала проба звука`);
  swap(`  useEffect(() => { if (!gestured) setFailed(true); }, [ttsApiBase, gestured]);`,
    `  useEffect(() => { if (!gestured && !ttsApiBase) setFailed(true); }, [ttsApiBase, gestured]);`);
}

// ДИАГНОСТИКА ОЗВУЧКИ В КОНСОЛИ (14.10.2026). По внешнему виду урока не понять,
// почему звучит голос браузера: LMS не передала ttsApiBase или сервис не
// ответил звуком. Три строки в консоли с префиксом [TTS] отвечают на это сразу.
function swapTtsDiag() {
  swap(`  const warmed = useRef(new Set());   // адреса фраз, уже заказанных сервису (см. warm)
`, `  const warmed = useRef(new Set());   // адреса фраз, уже заказанных сервису (см. warm)
  // КУРС HTML: диагностика — пришёл ли адрес сервиса озвучки.
  useEffect(() => {
    try { console.info('[TTS] ttsApiBase: ' + (ttsApiBase ? ttsApiBase : '(не передан — урок говорит голосом браузера)')); } catch (e) { /* no-op */ }
  }, [ttsApiBase]);
`);
  swap(`          if (tryLocal()) return;
          setFailed(true);
          waitThen(est);
        };
        const tryPlay = () => {`, `          // КУРС HTML: диагностика — сервис не отдал звук, переходим на резерв.
          try {
            console.warn('[TTS] сервис не отдал звук (ошибка ' + (a.error ? a.error.code : '—') + '): ' + a.src
              + ' — ' + (localVoiceOk() ? 'включаю голос браузера' : 'показываю текст'));
          } catch (e) { /* no-op */ }
          if (tryLocal()) return;
          setFailed(true);
          waitThen(est);
        };
        const tryPlay = () => {`);
  swap(`            a.src = url + (attempt > 1 ? '&r=' + attempt : '');`, `            a.src = url + (attempt > 1 ? '&r=' + attempt : '');
            // КУРС HTML: диагностика — первый запрос к сервису виден в консоли.
            if (!_ttsFirstLogged) { _ttsFirstLogged = true; try { console.info('[TTS] запрос к сервису: ' + a.src); } catch (e) { /* no-op */ } }`);
  swap(`let LMS_VOICE = null;`, `let LMS_VOICE = null;
let _ttsFirstLogged = false;   // диагностика: первый запрос к сервису — в консоль`);
}

// ПОДСКАЗКА ПРИ БЕЗДЕЙСТВИИ (заказчик, 15.10.2026): «ученик не должен сидеть
// и не понимать, что делать». Каркас экрана сам замечает, что ребёнок ничего
// не делает, пока герой молчит, и показывает, куда нажать, — без голоса.
//   8 с  — если «Дальше» открыта, она подпрыгивает; иначе качается лампочка
//          подсказки в шапке и сразу загораются светодиоды на месте действия
//          (там, где экран их ставит, — useIdleLed);
//   20 с — к той же кнопке приходит рука-указатель.
// Любое касание, клавиша или ввод сбрасывают отсчёт; пока герой говорит,
// отсчёт стоит. Работает на каждом экране с навигацией — во всех уроках курса.
function swapIdleCoach() {
  swap(`const Led = ({ on }) => (on ? <span className="led" aria-hidden="true"><i /></span> : null);
`, `const Led = ({ on }) => (on ? <span className="led" aria-hidden="true"><i /></span> : null);

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
`);
  swap(`  useEffect(() => { _hintText = hint || null; return () => { _hintText = null; }; }, [hint]);
  return (
    <div className={'stage' + (heroFixed ? ' stage-hero-fixed' : '') + (hideSpeaker ? ' stage-bare' : '')
      + (speaking ? ' is-speaking' : '')}>`, `  useEffect(() => { _hintText = hint || null; return () => { _hintText = null; }; }, [hint]);
  // КУРС HTML: подсказка при бездействии — см. useIdleCoach.
  const idle = useIdleCoach(!!nav, speaking);
  return (
    <div className={'stage' + (heroFixed ? ' stage-hero-fixed' : '') + (hideSpeaker ? ' stage-bare' : '')
      + (speaking ? ' is-speaking' : '') + (idle ? ' is-idle is-idle-' + idle : '')}>`);
  swap(`const CANON_UI_CSS = \`
`, `const CANON_UI_CSS = \`
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
  0%, 100% { transform: none; box-shadow: 0 3px 0 \${T.uiDk}, 0 0 0 0 rgba(255,79,40,.45); }
  30% { transform: translateY(-6px); }
  55% { transform: none; box-shadow: 0 3px 0 \${T.uiDk}, 0 0 0 12px rgba(255,79,40,0); } }
/* Рука-указатель (уровень 2): под лампочкой пальцем вверх, над «Дальше» —
   пальцем вниз. Рисунок — иконка pointer (Lucide, ISC). */
.stage.is-idle-2:not(:has(.stage-nav .btn-ready)) .ctl-hint::after,
.stage.is-idle-2 .stage-nav .btn-ready::before {
  content: ''; position: absolute; z-index: 30; width: 38px; height: 38px; pointer-events: none;
  background: no-repeat center / contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff' stroke='%23292524' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15V4a2 2 0 0 1 4 0v5.5V9a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0z'/%3E%3Cpath d='M11 9.5V13M15 10v3M19 11v2'/%3E%3C/svg%3E");
  filter: drop-shadow(0 4px 6px rgba(\${T.shadowBase},.35)); }
.stage.is-idle-2:not(:has(.stage-nav .btn-ready)) .ctl-hint::after {
  top: calc(100% + 2px); left: 50%; margin-left: -12px; animation: idleHandUp .9s ease-in-out infinite; }
.stage.is-idle-2 .stage-nav .btn-ready::before {
  bottom: calc(100% + 4px); left: 50%; margin-left: -14px; animation: idleHandDown .9s ease-in-out infinite; }
@keyframes idleHandUp { 0%, 100% { transform: translateY(6px); } 50% { transform: translateY(0); } }
@keyframes idleHandDown { 0%, 100% { transform: rotate(180deg) translateY(6px); } 50% { transform: rotate(180deg) translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  .stage.is-idle .ctl-hint, .stage.is-idle .stage-nav .btn-ready,
  .stage.is-idle-2 .ctl-hint::after, .stage.is-idle-2 .stage-nav .btn-ready::before { animation: none; } }

`);
}

// ГОЛОС В ШАПКЕ ВМЕСТО ГЕРОЯ (заказчик, 15.10.2026): на экранах, где Коди
// отнимает место и контент не помещается, урок ставит Stage проп voiceTop.
// ТОЛЬКО НА ТЕЛЕФОНЕ (уточнение заказчика): на узком экране и на телефоне лёжа
// герой скрыт (как stage-bare: пузырь жив и ведёт озвучку), а в шапке, рядом
// с подсказкой, — кружок с головой Коди и волнами голоса (с v4, 17.10.2026;
// раньше — кружок с полосками, как в практике). На ноутбуке места хватает —
// строка героя на месте, в шапке Коди нет.
function swapVoiceTop() {
  swap(`const Stage = ({ children, eyebrow, screen, total, nav, speaker, overlay, heroFixed, done, hideSpeaker, hint }) => {`,
    `const Stage = ({ children, eyebrow, screen, total, nav, speaker, overlay, heroFixed, done, hideSpeaker, hint, voiceTop }) => {`);
  swap(`(hideSpeaker ? ' stage-bare' : '')`, `(hideSpeaker ? ' stage-bare' : '') + (voiceTop ? ' stage-voicetop' : '')`);
  swap(`              <ExitBtn />
`, `              <ExitBtn />
              {speaker && !hideSpeaker ? <VoiceDot pose={speaker.pose} /> : null}
`);
  // Коди v4 (17.10.2026): в шапке — тот же кружок с головой Коди и волнами
  // голоса, только размером со служебную кнопку.
  swap(`const PauseBtn = ({ done }) => {`, `// КУРС HTML: Коди в шапке, рядом с подсказкой. На телефоне он живёт здесь
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

const PauseBtn = ({ done }) => {`);
  swap(`/* UI-09: служебные кнопки`, `/* КУРС HTML: Коди в шапке вместо строки героя (Stage voiceTop) — только на
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

/* UI-09: служебные кнопки`);
}

// ПРАЗДНИК ПОХВАЛЫ (заказчик, 16.10.2026): «вау, классно получилось» вместо
// сухого «ты сам сделал», и к похвале — хлопушки с конфетти и аплодисменты.
// 1) Похвала из общего набора — живая и неформальная, без форм рода на RU.
// 2) sfx('cheer') — аплодисменты: короткие всплески шума через полосовой
//    фильтр вразнобой, как у зала, и светлый аккорд поверх. Без файлов.
// 3) celebrate() — конфетти из нижних углов и аплодисменты. Сам срабатывает,
//    когда герой хвалит (sayNow с позой cheer или celebrate), не чаще раза
//    в 2,5 с. Слой рисуется в Shell, касаний не ловит; при «меньше движения»
//    конфетти нет, звук остаётся.
function swapCelebrate() {
  swap(`const PRAISE = {
  uz: ['To‘g‘ri!', 'Barakalla!', 'Ajoyib!', 'Ofarin!'],
  ru: ['Правильно!', 'Молодец!', 'Отлично!', 'Точно!'],
  en: ['Correct!', 'Well done!', 'Nice!', 'Exactly!']
};`, `const PRAISE = {
  uz: ['Voy, zo‘r!', 'Ana! Chiqdi!', 'Super!', 'Qoyil!', 'Ura!', 'Zo‘r-ku!'],
  ru: ['Вау, классно!', 'Есть! Получилось!', 'Супер!', 'Огонь!', 'Ура!', 'Вот это да!'],
  en: ['Wow, awesome!', 'Yes! You did it!', 'Super!', 'Brilliant!', 'Hooray!', 'Amazing!']
};`);
  swap(`function sfx(kind, enabled) {`, `let _clapBuf = null;
function sfx(kind, enabled) {`);
  swap(`    else if (kind === 'boot') { beep(330, 0.10, 0, 'sine', 0.05); beep(440, 0.12, 0.09, 'sine', 0.05); beep(587, 0.22, 0.19, 'sine', 0.05); }`,
`    else if (kind === 'boot') { beep(330, 0.10, 0, 'sine', 0.05); beep(440, 0.12, 0.09, 'sine', 0.05); beep(587, 0.22, 0.19, 'sine', 0.05); }
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
    }`);
  swap(`// 7. ЖУРНАЛ ОТВЕТОВ, ПАМЯТЬ ЭКРАНОВ И СОХРАНЁННЫЙ ПРОГРЕСС`, `// КУРС HTML: ПРАЗДНИК ПОХВАЛЫ — хлопушки и аплодисменты (см. build-canon.mjs).
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
const CELEB_CSS = \`
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
\`;
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
// 7. ЖУРНАЛ ОТВЕТОВ, ПАМЯТЬ ЭКРАНОВ И СОХРАНЁННЫЙ ПРОГРЕСС`);
  swap(`    const item = { text, pose: pose || 'point', who: who || 'bot' };`, `    const item = { text, pose: pose || 'point', who: who || 'bot' };
    // КУРС HTML: похвала героя — с хлопушками и аплодисментами.
    if (pose === 'cheer' || pose === 'celebrate') celebrate();`);
  swap(`                  {children}
                </div>
              </PageProvider>`, `                  {children}
                  <CelebrateLayer />
                </div>
              </PageProvider>`);
}

// КОДИ v4 — ТОЛЬКО ГОЛОВА В КРУГЕ (заказчик, 17.10.2026): «пусть остаётся только
// голова, эмоции — лицом; голову — внутрь кружка, а вокруг кружка — волны, как
// у Алисы и Siri; больше места — контенту, а не роботу». Рисунок и волны — в
// canon/html/hero-tail.part.jsx. Здесь — строка героя:
// 1) пока звучит голос, рядом с героем больше нет кружка с полосками: кружок с
//    головой сам показывает речь волнами;
// 2) --av — теперь диаметр кружка, а не ширина рамки робота с телом: строка
//    героя стала ниже вдвое (телефон ~58 px вместо ~110 px);
// 3) постоянная высота строки героя (heroFixed) — по кружку.
function swapKodiHead() {
  swap(`          {/* Полоски — только индикатор «робот говорит». Кнопкой повтора они
              больше не являются: управление озвучкой одно, в шапке. */}
          <span className={'speaker-voice' + (speaking ? ' is-on' : '')} aria-hidden="true">
            <span className="sv-bars"><i /><i /><i /><i /><i /></span>
          </span>
`, `          {/* КУРС HTML: речь показывают волны вокруг кружка с головой Коди —
              отдельного кружка с полосками больше нет. */}
`);
  swap(`.stage-hero-fixed .speaker { min-height: calc(var(--av) * 1.368); }`,
    `.stage-hero-fixed .speaker { min-height: var(--av); }`);
  swap(`  --av: clamp(66px, min(22vw, 13dvh), 138px);`,
    `  /* КУРС HTML: Коди v4 — диаметр кружка с головой (волны выходят за него). */
  --av: clamp(54px, min(16vw, 9dvh), 70px);`);
  swap(`  .lesson-root { --gap-stack: clamp(7px, 1.3dvh, 12px); --av: clamp(74px, min(23.4vw, 14.5dvh), 126px); }`,
    `  .lesson-root { --gap-stack: clamp(7px, 1.3dvh, 12px); --av: clamp(48px, min(15vw, 9dvh), 60px); }`);
  swap(`    /* Те же 1.165 к рамке: сам робот прежнего размера, поле вокруг больше. */
    --av: clamp(124px, min(29vw, 19.9dvh), 275px);`,
    `    /* КУРС HTML: кружок Коди v4 на крупном ярусе. */
    --av: clamp(72px, min(9vw, 10.5dvh), 108px);`);
  swap(`  .lesson-root { --av: clamp(46px, 13dvh, 62px); --gap-stack: 8px; --bar-y: 5px; }`,
    `  .lesson-root { --av: clamp(40px, 11dvh, 52px); --gap-stack: 8px; --bar-y: 5px; }`);
  // 4) МЕСТО КОДИ (заказчик, 17.10.2026): «на компе голова Коди — справа снизу
  //    экрана, чуть крупнее (и на планшете); на телефоне — сверху, а кнопки
  //    сверху и сам Коди — с правой стороны».
  //    · Телефон (до 759 px): кнопки шапки прижаты вправо, Коди — в шапке
  //      рядом с подсказкой (заказчик: «на телефоне — возле кнопки
  //      подсказки»). Строки героя под шапкой нет; без звука там остаётся
  //      только облако реплики, хвостиком вверх-вправо — к Коди.
  //    · Планшет и компьютер (от 760 px, кроме телефона лёжа): строки героя
  //      сверху нет — кружок стоит в правом нижнем углу, чуть выше нижней
  //      панели и у самого правого края экрана (заказчик: «чуть выше нижней
  //      панели и ближе к правой части»). Облако реплики (без звука) —
  //      строкой над кнопками, слева от Коди: оно не ложится поверх задания.
  //      Со звуком строка пустая; на экране уже 1200 px у содержания снизу
  //      запас на высоту кружка, на широком Коди стоит в поле справа.
  swap(`/* UI-09: служебные кнопки`, `/* КУРС HTML: МЕСТО КОДИ (заказчик, 17.10.2026) — телефон: в шапке у подсказки;
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

/* UI-09: служебные кнопки`);
}

// ЭМОЦИИ ГОЛОСА (заказчик, 17.10.2026): «все реплики — эмоциональными, ярко и
// живо, чтобы приятно было слушать». Сервис озвучки работает на ElevenLabs:
// модели v3 и v4 понимают теги подачи в квадратных скобках ([excited],
// [laughs], [reassuring] …). Тег ставит сам движок перед отправкой — по смыслу
// реплики, — в той же функции, что ставит маркер языка. Поэтому:
//   · тексты уроков не меняются, на экране тегов нет;
//   · прогрев и сама реплика уходят одной и той же строкой (кэш сервиса);
//   · голос браузера (запасной) тегов не получает.
// Выключатель — TTS_EMOTION (модели v2 и Flash тегов не знают и прочли бы их).
function swapEmotion() {
  swap(`const markLang = (text, lang) => {
  const s = String(text || '');
  if (!s) return s;
  return (LANG_MARK[lang] || LANG_MARK.ru) + s;
};`, `// КУРС HTML: ЭМОЦИИ ГОЛОСА — тег подачи ElevenLabs (v3/v4) по смыслу реплики.
// Решение детерминированное: одна и та же реплика всегда получает один и тот
// же тег — прогрев и озвучка совпадают. Правила — по началу фразы:
//   ошибся сам Коди → [embarrassed]; большая победа → [very excited] [laughs];
//   «ого» → [gasps] [amazed]; похвала → [excited] (+ [laughs] или [chuckles]
//   у двух похвал из трёх); «почти», подсказка → [reassuring]; привет →
//   [cheerful]; прощание → [warmly]; вопрос → [curious]; с «!» → [upbeat];
//   остальное (рассказ, объяснение) → [friendly].
const TTS_EMOTION = true;
const EMO_W = (words) => new RegExp('^(?:' + words.join('|') + ')(?=[\\\\s!,.?…:;]|$)', 'i');
const EMO = {
  oops: { ru: /^(?:ой|упс)(?=[\\s!,.]|$)|кажется, я /i, uz: /o‘xshayman|adashdim|chalkashtirdim/i, en: /^(?:oops|uh-oh)(?=[\\s!,.]|$)|i think i (?:put|mixed|made)/i },
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
  if (/\\?$/.test(s)) return '[curious] ';
  if (/!$/.test(s)) return '[upbeat] ';
  return '[friendly] ';
};
const markLang = (text, lang) => {
  const s = String(text || '');
  if (!s) return s;
  return (LANG_MARK[lang] || LANG_MARK.ru) + (TTS_EMOTION ? emoTag(s, lang) : '') + s;
};`);
}

