// ─── LMS CoddyCamp: урок 1 под CRM (14.11.2026, пакет IT «dars-mashina-2026-11-11», валидатор jsx-tekshir) ───
// Только урок 1 курса HTML (вставка в tools/redaktor28/build.mjs); общий набор naborRedaktor не меняется.
// · Шрифт Inter — не base64 в CSS (R06; код в gzip был 462 КБ при пределе IT 400 КБ), а ресурсы WOFF2
//   по ключу: useResources().loadFont(ключ, 'Inter', дескрипторы). Файлы — lessons/html/assets/01-struktura-dokumenta/
//   (в CRM — блок WOFF2, ключ = имя файла без расширения). Пока шрифт грузится, текст — системным шрифтом (swap).
// · markFirstScreenReady — один раз за открытие, когда первый учебный экран показан (Y01 / B03).
// · Не на каждой платформе runtime новый (go.junior-it.uz, 14.11.2026: «useLessonPerf is not a function» —
//   урок не открылся): хуки берутся из модуля целиком и зовутся, только если они есть. Нет loadFont — шрифт
//   из useAssets().resolveUrl(ключ) своим FontFace; нет и файла — системный шрифт. Урок открывается в любом случае.
import * as R28_RT from '@lesson/runtime';

const R28_LAT = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const R28_CYR = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';
const R28_FONTS = [
  ['inter_latin_400', '300 500', R28_LAT], ['inter_latin_600', '600 900', R28_LAT],
  ['inter_cyrillic_400', '300 500', R28_CYR], ['inter_cyrillic_600', '600 900', R28_CYR]
];
// Есть ли хук в runtime платформы — решается один раз при загрузке модуля: порядок хуков между рендерами не меняется.
const R28_HAS = (name) => { try { return typeof R28_RT[name] === 'function'; } catch (e) { return false; } };
const R28_PERF = R28_HAS('useLessonPerf');
const R28_RES = R28_HAS('useResources');
const R28_ASSETS = R28_HAS('useAssets');
const r28None = () => null;

function useR28Lms() {
  const perf = (R28_PERF ? R28_RT.useLessonPerf : r28None)();
  const res = (R28_RES ? R28_RT.useResources : r28None)();
  const assets = (R28_ASSETS ? R28_RT.useAssets : r28None)();
  const marked = useRef(false);   // в useRef, не в модуле: при повторном открытии во вкладке — заново
  useEffect(() => {
    R28_FONTS.forEach(([key, weight, unicodeRange]) => {
      try {
        if (res && typeof res.loadFont === 'function') {
          Promise.resolve(res.loadFont(key, 'Inter', { weight, unicodeRange })).catch(() => {});
        } else if (assets && typeof assets.resolveUrl === 'function' && typeof FontFace === 'function') {
          const url = assets.resolveUrl(key);
          if (!url) return;
          const face = new FontFace('Inter', 'url(' + url + ')', { weight, unicodeRange, display: 'swap' });
          face.load().then((f) => document.fonts.add(f)).catch(() => {});
        }
      } catch (e) { /* нет ресурса — системный шрифт */ }
    });
    // Первый экран урока — учебный (крючок с заданием), картинок для него не грузится: отмечаем после показа.
    const t = requestAnimationFrame(() => {
      if (marked.current || !perf || typeof perf.markFirstScreenReady !== 'function') return;
      marked.current = true;
      try { perf.markFirstScreenReady(); } catch (e) { /* старый runtime */ }
    });
    return () => cancelAnimationFrame(t);
  }, []);
}
