// Сценарий проверки практики к уроку 2 курса HTML lessons/html/02p-zagolovki-i-tekst.jsx («Стенгазета», 7 слайдов).
// Основной путь: хук (касание «Печать»), пять заданий действиями ученика (снимок каждого экрана — в решённом виде),
// вывод, onFinished один раз, артефакт — страница со своей статьёй из t5.
// Ветки: несовпадающая пара h1/h4, вторая неудача → подсказка; граница абзацев не там; b и i перепутаны;
// подсказка 2 в погоде указывает строку; три лампочки → образец → дополнительная задача.
// Функции шагов выполняются в странице: только аргумент qa (помощники — прямо в шаге).

const STEPS = [
  { name: 'хук: принтер напутал теги', shot: 'intro', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-street .pp-house').length === 5, 'в газете пять вырезок');
    qa.expect(qa.qa('.pp-street .pp-house.is-lit').length === 4, 'до печати четыре вырезки целые');
    await qa.waitFor(() => { const b = qa.q('.pp-wind'); return b && !b.disabled; }, 30000, 'кнопка «Печать» включилась');
    await qa.click('.pp-wind', 'Печать');
    await qa.sleep(600);
    qa.expect(qa.qa('.pp-street .pp-house.is-wait').length === 4, 'после печати вырезки выцвели');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'задача рассказана');
  } },
  { name: 't1: h4 → h1', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.pg-doc .pg-h4'), 'название газеты мелкое — h4');
    qa.type('.ed-ta', qa.data.t1, 'заголовок h1');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.pg-doc .pg-h1') === qa.data.mast, 'в окне крупный заголовок');
  } },
  { name: 't2: один абзац → два', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.pg-doc .pg-p').length === 1, 'сначала один абзац');
    qa.type('.ed-ta', qa.data.t2, 'два абзаца');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.pg-doc .pg-p').length === 2, 'в окне два абзаца');
  } },
  { name: 't3: как на вырезке — b и i', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.pp-target b') && !!qa.q('.pp-target i'), 'вырезка-образец рядом с браузером');
    qa.type('.ed-ta', qa.data.t3, 'b и i');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.pg-doc b') === qa.text('.pp-target b') && qa.text('.pg-doc i') === qa.text('.pp-target i'), 'в окне как на вырезке');
  } },
  { name: 't4: два испорченных тега', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/2/.test(qa.text('.pp-left')), 'счётчик: осталось 2', { left: qa.text('.pp-left') });
    qa.expect(!!qa.q('.pg-doc .pg-in-h2'), 'абзацы внутри незакрытого h2 — шрифтом заголовка');
    qa.type('.ed-ta', qa.data.t4, 'починенный код');
    await qa.sleep(200);
    qa.expect(!!qa.q('.pp-left.is-ok'), 'счётчик: всё исправлено');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.q('.pg-doc .pg-in-h2') && qa.qa('.pg-doc b').length === 1, 'абзацы обычные, жирное — одно слово');
  } },
  { name: 't5: своя статья', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-check-i').length === 4 && !qa.q('.pp-check-i.is-ok'), 'список условий пуст');
    qa.type('.ed-ta', qa.data.t5, 'статья');
    await qa.sleep(200);
    qa.expect(qa.qa('.pp-check-i.is-ok').length === 4, 'все четыре условия загорелись');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.pg-doc .pg-h2') === qa.data.title, 'в окне своя статья');
  } },
  { name: 'вывод: газета горит, своя статья', shot: 'fin', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, '«Завершить»');
    qa.expect(qa.qa('.pp-street .pp-house.is-lit').length === 5, 'все пять вырезок горят');
    qa.expect(qa.text('.pp-fin .pg-h2') === qa.data.title, 'в выводе — своя статья');
  } },
  { name: 'завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<h2>' + qa.data.title + '</h2>') >= 0 && pl.artifact.title === qa.data.title, 'артефакт — страница со своей статьёй', { html });
  } }
];

export default {
  title: 'Практика к уроку 2 курса HTML «Стенгазета» (7 слайдов)',
  file: 'html/02p-zagolovki-i-tekst',
  adapter: 'canon-html',
  langs: ['ru'],
  size: '1280x720',
  voice: 'fast',
  screens: 7,
  inputScreens: [2, 3, 4, 5, 6],
  expectFinish: true,
  data: {
    ru: { mast: 'Наш класс', t1: '<h1>Наш класс</h1>',
      t2: '<p>Завтра у нас экскурсия.</p>\n<p>Автобус уходит утром.</p>',
      t3: '<p>Наша команда <i>снова</i> <b>победила</b>!</p>',
      t4: '<h2>Погода</h2>\n<p>Завтра <b>солнечно</b></p>\n<p>Ветра нет.</p>',
      title: 'Мой кот', t5: '<h2>Мой кот</h2>\n<p>Он любит <b>спать</b>.</p>' },
    uz: { mast: 'Bizning sinf', t1: '<h1>Bizning sinf</h1>',
      t2: '<p>Ertaga ekskursiya bo‘ladi.</p>\n<p>Avtobus ertalab jo‘naydi.</p>',
      t3: '<p>Jamoamiz <i>yana</i> <b>yutdi</b>!</p>',
      t4: '<h2>Ob-havo</h2>\n<p>Ertaga <b>quyoshli</b></p>\n<p>Shamol yo‘q.</p>',
      title: 'Mushugim', t5: '<h2>Mushugim</h2>\n<p>U <b>uxlashni</b> yaxshi ko‘radi.</p>' },
    en: { mast: 'Our Class', t1: '<h1>Our Class</h1>',
      t2: '<p>Tomorrow we have a trip.</p>\n<p>The bus leaves in the morning.</p>',
      t3: '<p>Our team <b>won</b> <i>again</i>!</p>',
      t4: '<h2>Weather</h2>\n<p>Tomorrow is <b>sunny</b></p>\n<p>No wind.</p>',
      title: 'My Cat', t5: '<h2>My Cat</h2>\n<p>She loves to <b>sleep</b>.</p>' }
  },
  steps: STEPS,
  flows: [
    { name: 't1: пара h1/h4 не совпадает, вторая неудача → подсказка', start: 1, langs: ['ru'], steps: [{ name: '<h1>…</h4> дважды', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', '<h1>Наш класс</h4>', 'несовпадающая пара');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(!!qa.q('.pp-note.is-fb') && /совпадать/.test(qa.text('.pp-note')), 'причина: пара должна совпадать', { note: qa.text('.pp-note') });
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(!!qa.q('.pp-note.is-hint'), 'со второй неудачи — ступень подсказки');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 't2: граница абзацев не там', start: 2, langs: ['ru'], steps: [{ name: 'разрез посреди предложения', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', '<p>Завтра у нас</p><p>экскурсия. Автобус уходит утром.</p>', 'не та граница');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(/граница/.test(qa.text('.pp-note')), 'причина: граница не там', { note: qa.text('.pp-note') });
    } }] },
    { name: 't3: b и i перепутаны', start: 3, langs: ['ru'], steps: [{ name: 'жирное и наклонное наоборот', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', '<p>Наша команда <b>снова</b> <i>победила</i>!</p>', 'наоборот');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(/перепутаны/.test(qa.text('.pp-note')), 'причина: слова перепутаны', { note: qa.text('.pp-note') });
    } }] },
    { name: 't4: подсказка 2 указывает строку', start: 4, langs: ['ru'], steps: [{ name: 'две лампочки', run: async (qa) => {
      await qa.platform.ready();
      for (let k = 0; k < 2; k += 1) { qa.platform.hint(); await qa.sleep(500); }
      qa.expect(/строку 7/.test(qa.text('.pp-note')) && !!qa.q('.ed-line.is-mark'), 'строка 7 названа и подсвечена', { note: qa.text('.pp-note') });
    } }] },
    { name: 't5: три лампочки → образец → дополнительная задача', start: 5, langs: ['ru'], steps: [{ name: 'подсказки до образца, решение, ещё одна', run: async (qa) => {
      await qa.platform.ready();
      for (let k = 0; k < 3; k += 1) { qa.platform.hint(); await qa.sleep(500); }
      qa.expect(/3\/3/.test(qa.text('.pp-note')) && !!qa.q('.pp-note .sample'), 'третья ступень с образцом', { note: qa.text('.pp-note') });
      qa.type('.ed-ta', '<h2>Мой кот</h2>\n<p>Он любит <b>спать</b>.</p>', 'статья');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      await qa.waitFor(() => qa.q('.pp-drill-tag'), 4000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.ed-ta', '<p>Мы <i>чиним</i> всё.</p>', 'абзац мастерской');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] }
  ]
};
