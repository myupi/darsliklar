// Сценарий проверки урока 1 модуля Bootstrap lessons/bootstrap/01-vvedenie.jsx («Введение в Bootstrap», облик «Редактор»;
// 11 слайдов по решению заказчика 19.11.2026). Основной путь: все 11 экранов действиями ученика. Честная страница —
// настоящий CSS Bootstrap в iframe (вид e'lon — по вычисленному стилю .alert внутри страницы). Показы «как на видео»
// (g1, s9, sc) — ждём их конца и проверяем итог. Задания: опыт с переключателями (x1), подключи сам (t1), возьми Alert (t2),
// своё e'lon (w1), почему не работает (t4); onFinished один раз, артефакт с CDN.
// Ветки: опыт — один переключатель (причина); t1 — вставка без копии, перенос без выбора; t2 — не та страница;
// w1 — выдуманный цвет; t4 — не та причина.

// Строка выполняется через eval внутри шага: qa — в области видимости (документ урока — не document страницы-обвязки).
const frameAlert = `(() => { for (const f of qa.qa('.kz-scene .kz-col > .b1-br:not(.b1-docs) iframe')) { const d = f.contentDocument; const a = d && d.querySelector('[role=alert]'); if (a) return a; } return null; })()`;
const STEPS = [
  { name: 's1: «Bootstrap bilan» → e\'lon одет', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const bg = () => { const a = eval(qa.data.frameAlert); return a ? a.ownerDocument.defaultView.getComputedStyle(a).backgroundColor : ''; };
    await qa.waitFor(() => !!eval(qa.data.frameAlert), 10000, 'страница в окне загрузилась');
    qa.expect(/rgba\(0, 0, 0, 0\)|transparent/.test(bg()), 'сначала e\'lon без фона (голая страница)');
    await qa.click('.kz-btn.is-coral', 'Bootstrap bilan');
    await qa.waitFor(() => !/rgba\(0, 0, 0, 0\)|transparent/.test(bg()), 5000, 'честно: e\'lon получил фон Bootstrap');
    await qa.waitFor(() => qa.platform.nextEnabled(), 70000, 'рассказано');
  } },
  { name: 's2: что такое Bootstrap (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next(); await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
  } },
  { name: 'x1: опыт link и class', shot: 'x1-done', run: async (qa) => {
    await qa.platform.next(); await qa.platform.ready();
    await qa.waitFor(() => qa.q('.b1-sw[data-sw="lk"]:not(:disabled)'), 30000, 'переключатели');
    await qa.click('.b1-sw[data-sw="lk"]', 'link');
    await qa.sleep(400);
    const a1 = eval(qa.data.frameAlert);
    qa.expect(a1 && /rgba\(0, 0, 0, 0\)|transparent/.test(a1.ownerDocument.defaultView.getComputedStyle(a1).backgroundColor), 'только link — e\'lon не одет');
    await qa.waitFor(() => qa.q('.b1-sw[data-sw="cl"]:not(:disabled)'), 30000, 'второй переключатель');
    await qa.click('.b1-sw[data-sw="cl"]', 'class');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'засчитано');
    const a2 = eval(qa.data.frameAlert);
    qa.expect(a2 && !/rgba\(0, 0, 0, 0\)|transparent/.test(a2.ownerDocument.defaultView.getComputedStyle(a2).backgroundColor), 'оба — e\'lon одет');
    qa.expect(!!qa.q('.b1-rule.is-hit'), 'правило .alert в файле загорелось');
  } },
  { name: 'g1: путь через Google (показ)', shot: 'g1-done', run: async (qa) => {
    await qa.platform.next(); await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 150000, 'показ закончен');
    qa.expect(/Install Bootstrap/.test(qa.text('.bd-main')), 'документация, Install');
  } },
  { name: 's9: подключение CDN (показ)', shot: 's9-done', run: async (qa) => {
    await qa.platform.next(); await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 180000, 'показ закончен');
    const code = qa.text('.kz-code');
    qa.expect(code.indexOf('<link') < code.indexOf('</head>') && code.indexOf('<script') > code.indexOf('<body>'), 'link в head, script в body');
    qa.expect(!eval(qa.data.frameAlert), 'e\'lon закрыт крестиком');
  } },
  { name: 'sc: готовая деталь (показ)', shot: 'sc-done', run: async (qa) => {
    await qa.platform.next(); await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 220000, 'показ закончен');
    qa.expect(/theme-warning/.test(qa.text('.kz-code')), 'в class — theme-warning');
  } },
  { name: 't1: подключи сам', shot: 't1-done', run: async (qa) => {
    await qa.platform.next(); await qa.platform.ready();
    await qa.waitFor(() => qa.q('.bd-copy[data-copy="cdn"]:not(:disabled)'), 30000, 'значок копирования');
    await qa.click('.bd-copy[data-copy="cdn"]', 'копировать');
    await qa.click('.kz-line.b1-slot', 'вставить в head');
    await qa.waitFor(() => qa.q('.kz-line.b1-hline:not(:disabled)'), 30000, 'строку script можно нажать');
    await qa.click('.kz-line.b1-hline', 'script');
    await qa.click('.kz-line.b1-slot', 'перед </body>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
    const code = qa.text('.kz-code');
    qa.expect(code.indexOf('<script') > code.indexOf('</div>'), 'script в конце body');
  } },
  { name: 't2: возьми Alert', shot: 't2-done', run: async (qa) => {
    await qa.platform.next(); await qa.platform.ready();
    if (!qa.q('.bd-grp-h[data-g="comp"]')) await qa.click('[data-x="burger"]', 'меню');
    await qa.waitFor(() => qa.q('.bd-grp-h[data-g="comp"]:not(:disabled)'), 30000, 'раздел');
    await qa.click('.bd-grp-h[data-g="comp"]', 'Components');
    await qa.click('.bd-item[data-item="Alert"]', 'Alert');
    await qa.waitFor(() => qa.q('.bd-copy[data-copy="alert"]:not(:disabled)'), 10000, 'значок копирования на Alert');
    await qa.click('.bd-copy[data-copy="alert"]', 'копировать');
    await qa.click('.kz-line.b1-slot', 'вставить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: своё e\'lon', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next(); await qa.platform.ready();
    const f = qa.qa('.b1-slotin textarea');
    qa.type(f[0], 'theme-danger', 'цвет'); qa.type(f[1], qa.data.myText2, 'текст');
    await qa.click('.kz-ready', 'Tayyor');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: почему не работает', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of ['noLink', 'typo', 'oldClass']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.b1-opt2[data-v="' + k + '"]:not(:disabled)'), 30000, 'кнопки');
      await qa.click('.b1-opt2[data-v="' + k + '"]', k);
      await qa.waitFor(() => qa.q('.b1-opt2.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's16: вывод', shot: 's16-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить урок»');
  } },
  { name: 's16: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('alert theme-danger') >= 0 && html.indexOf('bootstrap@6.0.0-alpha.1') >= 0 && html.indexOf('<script type="module"') >= 0, 'артефакт — своя страница с CDN и своим e\'lon', { html });
  } }
];

const hintFlow = (name, start, body) => ({ name, start, langs: ['ru'], steps: [{ name, run: new Function('qa', 'return (async () => {' + body + '})()') }] });
export default {
  title: 'Урок 1 модуля Bootstrap «Введение в Bootstrap» (облик «Редактор», 11 слайдов)',
  file: 'bootstrap/01-vvedenie',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 11,
  inputScreens: [9],
  expectFinish: true,
  data: {
    ru: { frameAlert, myText2: 'Завтра соревнования!' },
    uz: { frameAlert, myText2: 'Ertaga musobaqa bor!' },
    en: { frameAlert, myText2: 'Contest tomorrow!' }
  },
  steps: STEPS,
  flows: [
    hintFlow('x1: только class → причина', 2, `await qa.platform.ready(); await qa.waitFor(() => qa.q('.b1-sw[data-sw="cl"]:not(:disabled)'), 30000, 'переключатели'); await qa.click('.b1-sw[data-sw="cl"]', 'class'); await qa.sleep(400); qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта'); qa.expect(!qa.q('.b1-rule.is-hit'), 'правило не горит');`),
    hintFlow('t1: вставка без копии → причина', 6, `await qa.platform.ready(); await qa.waitFor(() => qa.q('.kz-line.b1-slot:not(:disabled)'), 30000, 'место'); await qa.click('.kz-line.b1-slot', 'вставить'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');`),
    hintFlow('t1: перенос без выбора → причина', 6, `await qa.platform.ready(); await qa.waitFor(() => qa.q('.bd-copy[data-copy="cdn"]:not(:disabled)'), 30000, 'Copy'); await qa.click('.bd-copy[data-copy="cdn"]', 'копировать'); await qa.click('.kz-line.b1-slot', 'вставить'); await qa.waitFor(() => qa.q('.kz-line.b1-slot:not(:disabled)'), 30000, 'место внизу'); await qa.click('.kz-line.b1-slot', 'вниз без выбора'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели'); qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');`),
    hintFlow('t2: не та страница → причина', 7, `await qa.platform.ready(); if (!qa.q('.bd-item[data-item="AI"]')) await qa.click('[data-x="burger"]', 'меню'); await qa.waitFor(() => qa.q('.bd-item[data-item="AI"]:not(:disabled)'), 30000, 'меню'); await qa.click('.bd-item[data-item="AI"]', 'AI'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели'); qa.expect(/AI/.test(qa.text('.bd-main')), 'честно: открылась страница AI');`),
    hintFlow('w1: выдуманный цвет → причина', 8, `await qa.platform.ready(); const f = qa.qa('.b1-slotin textarea'); qa.type(f[0], 'theme-pink', 'pink'); qa.type(f[1], 'Привет всем', 'текст'); await qa.click('.kz-ready', 'Tayyor'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');`),
    hintFlow('t4: не та причина → подсказка', 9, `await qa.platform.ready(30000); await qa.waitFor(() => qa.q('.b1-opt2[data-v="typo"]:not(:disabled)'), 30000, 'кнопки'); await qa.click('.b1-opt2[data-v="typo"]', 'не та'); await qa.waitFor(() => qa.q('.b1-opt2.is-off'), 3000, 'ответ отмечен'); qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');`)
  ]
};
