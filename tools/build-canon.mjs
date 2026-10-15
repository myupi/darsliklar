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
// с подсказкой, — кружок с полосками, как в практике. На ноутбуке места
// хватает — Коди стоит как обычно, кружка нет.
function swapVoiceTop() {
  swap(`const Stage = ({ children, eyebrow, screen, total, nav, speaker, overlay, heroFixed, done, hideSpeaker, hint }) => {`,
    `const Stage = ({ children, eyebrow, screen, total, nav, speaker, overlay, heroFixed, done, hideSpeaker, hint, voiceTop }) => {`);
  swap(`(hideSpeaker ? ' stage-bare' : '')`, `(hideSpeaker ? ' stage-bare' : '') + (voiceTop ? ' stage-voicetop' : '')`);
  swap(`              <ExitBtn />
`, `              <ExitBtn />
              {voiceTop ? <VoiceDot /> : null}
`);
  swap(`const PauseBtn = ({ done }) => {`, `// КУРС HTML: кружок голоса в шапке (Stage voiceTop) — на экранах, где герою
// не хватает места. Оживает, пока звучит голос.
const VoiceDot = () => {
  const audio = useAudio();
  return (
    <span className={'speaker-voice ctl-voice' + (audio && audio.playing ? ' is-on' : '')} aria-hidden="true">
      <span className="sv-bars"><i /><i /><i /><i /><i /></span>
    </span>
  );
};

const PauseBtn = ({ done }) => {`);
  swap(`/* UI-09: служебные кнопки`, `/* КУРС HTML: голос в шапке вместо героя (Stage voiceTop) — только на телефоне:
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

/* UI-09: служебные кнопки`);
}
