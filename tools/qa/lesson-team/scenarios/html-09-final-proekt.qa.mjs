// Сценарий проверки урока 9 курса HTML lessons/html/09-final-proekt.jsx («Финальный HTML-проект» — повторение курса,
// облик «Редактор», 03.11.2026).
// Основной путь: все 13 экранов действиями ученика — 8 станций (каркас, h1, ol, href, src, password, части анкеты,
// header), смешанное задание (картинка-ссылка, нажатие открывает галерею), «босс» из пяти поломок, быстрый раунд,
// onFinished один раз, итог для платформы — темы, починенные с первой попытки.
// Ветки: на каждой станции и в «боссе» — неверный ответ даёт причину в панели. Функции шагов выполняются в странице.

const STEPS = [
  { name: 's1: сайт сломан → карта станций', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br-page .z9-h6') && !!qa.q('.kz-br-page .z9-an'), 'честно: сайт сломан');
    await qa.click('.kz-btn.is-coral', 'Починить');
    await qa.waitFor(() => qa.qa('.z9-map-wrap .z9-st.is-shown').length === 8, 5000, 'восемь станций на карте');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: станция 1 — каркас', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['head', 'title', 'headc', 'body']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z9-h1') && !!qa.q('.z9-st.is-done'), 'страница появилась, станция горит');
  } },
  { name: 's3: станция 2 — h1', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br-page .z9-h6'), 'честно: заголовок h6');
    qa.type('.z9-slot textarea', 'h1', 'h1');
    await qa.sleep(300);
    qa.expect(!!qa.q('.kz-br-page .z9-h1'), 'заголовок большой сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: станция 3 — ol', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.click('.z9-tagbtn[data-o="ol"]', '<ol>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z9-list.is-ol'), 'шаги пронумерованы');
  } },
  { name: 's5: станция 4 — ссылка без href', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br-page .z9-an'), 'честно: без href — простой текст');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'строка без href');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.q('.kz-br-page .z9-an'), 'все слова меню — ссылки');
  } },
  { name: 's6: станция 5 — src', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z9-pic') && !!qa.q('.kz-br-page .z9-alt'), 'честно: без src — только alt');
    await qa.click('.kz-scrap[data-o="src"]', 'src');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z9-pic'), 'картинка на месте');
  } },
  { name: 's7: станция 6 — password', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z9-in.is-pass'), 'честно: пароль виден');
    qa.type('.z9-slot textarea', 'password', 'password');
    await qa.sleep(300);
    qa.expect(!!qa.q('.kz-br-page .z9-in.is-pass'), 'точки сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's8: станция 7 — части анкеты', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const t of ['select', 'option', 'textarea', 'button']) {
      await qa.waitFor(() => qa.q('.z9-mtag[data-t="' + t + '"]:not(:disabled)'), 20000, 'тег нажимается');
      await qa.click('.z9-mtag[data-t="' + t + '"]', t); await qa.click('.z9-mcard[data-card="' + t + '"]', 'вещь ' + t); await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.z9-mcard.is-ok').length === 4, 'четыре пары');
  } },
  { name: 's9: станция 8 — header', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z9-reg-header'), 'честно: с head рамки верха нет');
    await qa.click('.z9-tagbtn[data-o="header"]', '<header>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z9-reg-header') && qa.qa('.z9-st.is-done').length === 8, 'рамка верха, все восемь станций горят');
  } },
  { name: 's10: смешанное — картинка-ссылка', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['aopen', 'img', 'aclose']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    await qa.click('.z9-imglink', 'картинка-ссылка');
    await qa.waitFor(() => /galereya\.html/.test(qa.text('.kz-br-url')), 3000, 'открылась галерея');
  } },
  { name: 's11: босс — пять поломок', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const [j, n] of [[8, 1], [0, 2], [5, 3], [2, 4], [7, 5]]) {
      await qa.waitFor(() => qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'строки нажимаются');
      await qa.clickNth('.kz-code .kz-line.kz-tap', j, 'строка ' + (j + 1));
      await qa.waitFor(() => new RegExp(n + '/5').test(qa.text('.kz-ask-n')), 5000, 'найдено ' + n);
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z9-h1') && !!qa.q('.kz-br-page .z9-pic') && !qa.q('.kz-br-page .z9-bare') && !qa.q('.kz-br-page .z9-an') && !!qa.q('.kz-br-page .z9-in.is-pass'), 'страница починена');
  } },
  { name: 'q1: быстрый раунд', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [1, 0, 1, 0, 0]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z9-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z9-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.z9-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's12: вывод', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить курс»');
    qa.expect(qa.qa('.z9-st.is-done').length === 8 && !!qa.q('.z9-cert'), 'карта горит, карточка курса');
  } },
  { name: 's12: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const a = pl && pl.artifact;
    qa.expect(!!a && a.type === 'course-review' && a.topics.length === 8 && a.topics.every((t) => t.firstTry === true), 'итог — восемь тем с первой попытки', { a });
  } }
];

export default {
  title: 'Урок 9 курса HTML «Финальный HTML-проект» — повторение (облик «Редактор»)',
  file: 'html/09-final-proekt',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 13,
  inputScreens: [3, 7],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 's2: лишний header → причина', start: 1, langs: ['ru'], steps: [{ name: 's2: лишний header → причина', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="header"]', '<header>'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 5 && !qa.platform.nextEnabled(), 'кусок остался в лотке');} }] },
    { name: 's3: h2 → причина', start: 2, langs: ['ru'], steps: [{ name: 's3: h2 → причина', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z9-slot textarea', 'h2', 'h2'); await qa.click('.key-go', 'Проверить'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');} }] },
    { name: 's4: ul → причина', start: 3, langs: ['ru'], steps: [{ name: 's4: ul → причина', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.z9-tagbtn[data-o="ul"]', '<ul>'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z9-list.is-ol') && !qa.platform.nextEnabled(), 'номеров нет, «Дальше» закрыта');} }] },
    { name: 's5: верная ссылка → причина', start: 4, langs: ['ru'], steps: [{ name: 's5: верная ссылка → причина', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');} }] },
    { name: 's6: href → причина', start: 5, langs: ['ru'], steps: [{ name: 's6: href → причина', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-o="href"]', 'href'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z9-pic') && !qa.platform.nextEnabled(), 'картинки нет');} }] },
    { name: 's7: text → причина', start: 6, langs: ['ru'], steps: [{ name: 's7: text → причина', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z9-slot textarea', 'text', 'text'); await qa.click('.key-go', 'Проверить'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z9-in.is-pass') && !qa.platform.nextEnabled(), 'пароль виден');} }] },
    { name: 's8: не та пара → причина', start: 7, langs: ['ru'], steps: [{ name: 's8: не та пара → причина', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z9-mtag[data-t="select"]:not(:disabled)'), 20000, 'тег нажимается');
      await qa.click('.z9-mtag[data-t="select"]', 'select'); await qa.click('.z9-mcard[data-card="textarea"]', 'большое поле'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.z9-mcard.is-ok'), 'пара не закрепилась');} }] },
    { name: 's9: head → причина', start: 8, langs: ['ru'], steps: [{ name: 's9: head → причина', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.z9-tagbtn[data-o="head"]', '<head>'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z9-reg-header') && !qa.platform.nextEnabled(), 'рамки верха нет');} }] },
    { name: 's10: </img> → причина', start: 9, langs: ['ru'], steps: [{ name: 's10: </img> → причина', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="imgc"]', '</img>'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 4 && !qa.platform.nextEnabled(), 'кусок остался в лотке');} }] },
    { name: 's11: верная строка → «в порядке»', start: 10, langs: ['ru'], steps: [{ name: 's11: верная строка → «в порядке»', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'верная строка'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(/0\/5/.test(qa.text('.kz-ask-n')) && !qa.platform.nextEnabled(), 'ничего не засчитано');} }] },
    { name: 'q1: неверный ответ → объяснение', start: 11, langs: ['ru'], steps: [{ name: 'q1: неверный ответ → объяснение', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z9-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z9-tf', 0, 'Верно'); await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.z9-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');} }] }
  ]
};
