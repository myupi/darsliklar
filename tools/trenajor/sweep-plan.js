// План полного замера тренажёра (19.11.2026): телефоны, планшеты, ноутбуки, масштаб браузера, клавиатура, вводный экран и итог.
//   const s = await (await fetch('/tools/trenajor/sweep-plan.js')).text(); eval(s); __fullSweep('css');   // продолжает с места после перезагрузки
//   __matrixReport('mx-full-css') — сводка.
// Масштаб: окно браузера 1366×657 (ноутбук 1366×768 минус панели браузера) при 67–200% и 1920×969 при 150–200%; 1280×720 при 200%.
window.__fullSweep = async (t = 'css') => {
  const s = await (await fetch('/tools/trenajor/sweep-matrix.js')).text(); eval(s);
  const L3 = ['uz', 'ru', 'en']; const L2 = ['uz', 'ru'];
  const phones = [[360, 640], [375, 740], [390, 844], [412, 915]];
  const tabletsP = [[768, 1024], [820, 1180]]; const tabletsL = [[1024, 768], [1180, 820]];
  const big = [[1280, 720], [1366, 657], [1440, 900], [1536, 864], [1920, 1080], [2039, 981], [1708, 821], [1518, 730]];
  const zoomLow = [[1242, 597], [1093, 525], [911, 438], [781, 375], [683, 328], [1280, 646], [960, 484], [640, 360]];
  const kbd = [[360, 640, 330], [375, 740, 400], [390, 844, 460], [412, 915, 520], [768, 1024, 700], [820, 1180, 800], [1024, 768, 400], [1180, 820, 470]];
  const all = [...phones, ...tabletsP, ...tabletsL, ...big, ...zoomLow];
  return window.__matrix({ t, key: 'mx-full-' + t, par: 6, plan: [
    { name: 'phone', sizes: phones, langs: L3, states: ['none', 'wrong', 'right'] },
    { name: 'tabP', sizes: tabletsP, langs: L3, states: ['none', 'wrong'] },
    { name: 'tabL', sizes: tabletsL, langs: L2, states: ['none', 'wrong'] },
    { name: 'big', sizes: big, langs: L2, states: ['none', 'wrong'] },
    { name: 'zoom', sizes: zoomLow, langs: L3, states: ['none', 'wrong'] },
    { name: 'kbd', sizes: kbd, langs: L3, states: ['none'], only: 'text_input' },
    { name: 'scr', sizes: all, langs: L3, screens: true },
  ] });
};
