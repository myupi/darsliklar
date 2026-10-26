// Сценарий проверки практики к уроку 4 курса HTML lessons/html/04p-ssylki-i-atributy.jsx («Острова», 7 слайдов).
// Основной путь: хук (касание «Шторм!»), пять заданий действиями ученика (снимок каждого экрана — в решённом виде),
// честные переходы по ссылкам в бумажном браузере, вывод, onFinished один раз, артефакт — своё меню из t5.
// Ветки: href без кавычек, вторая неудача → подсказка; не тот файл → «Файл не найден» по нажатию; поменяна одна
// ссылка из двух; подсказка 2 в «после шторма» указывает строку; три лампочки → образец → дополнительная задача.
// Функции шагов выполняются в странице: только аргумент qa (помощники — прямо в шаге).

const STEPS = [
  { name: 'хук: шторм порвал мосты', shot: 'intro', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-street .pp-house').length === 5, 'на карте пять островов');
    qa.expect(qa.qa('.pp-street .pp-house.is-lit').length === 4, 'до шторма четыре острова с мостами');
    await qa.waitFor(() => { const b = qa.q('.pp-wind'); return b && !b.disabled; }, 30000, 'кнопка «Шторм!» включилась');
    await qa.click('.pp-wind', 'Шторм');
    await qa.sleep(600);
    qa.expect(qa.qa('.pp-street .pp-house.is-wait').length === 4, 'после шторма острова погасли');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'задача рассказана');
  } },
  { name: 't1: дописать href', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.pg-doc .pg-a'), 'без адреса слова чёрные');
    qa.type('.ed-ta', qa.data.t1, 'ссылка с адресом');
    await qa.sleep(200);
    qa.expect(!!qa.q('.pg-doc .pg-a'), 'с href слова синеют сразу');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    await qa.click('.pg-doc button.pg-a', 'нажать ссылку');
    await qa.waitFor(() => qa.text('.kz-br-url-t') === 'parrots.html' && !!qa.q('.pg-site'), 4000, 'открылась страница острова');
  } },
  { name: 't2: поменять адреса', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.pg-doc .pg-a').length === 2, 'две ссылки');
    qa.type('.ed-ta', qa.data.t2, 'адреса на месте');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: ссылка целиком', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.ed-ta', qa.data.t3, 'новая ссылка');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.pg-doc .pg-a').length === 2, 'на странице две ссылки');
  } },
  { name: 't4: починить две ссылки', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/2/.test(qa.text('.pp-left')), 'счётчик: осталось 2', { left: qa.text('.pp-left') });
    qa.expect(!!qa.q('.pg-doc .pg-p .pg-a'), 'честно: без </a> пожелание стало ссылкой');
    qa.type('.ed-ta', qa.data.t4, 'починенные ссылки');
    await qa.sleep(200);
    qa.expect(!!qa.q('.pp-left.is-ok'), 'счётчик: всё исправлено');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.q('.pg-doc .pg-p .pg-a') && qa.qa('.pg-doc .pg-a').length === 2, 'две ссылки, пожелание — обычный текст');
  } },
  { name: 't5: своё меню', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-check-i').length === 5 && !qa.q('.pp-check-i.is-ok'), 'список условий пуст');
    qa.type('.ed-ta', qa.data.t5, 'своё меню');
    await qa.sleep(200);
    qa.expect(qa.qa('.pp-check-i.is-ok').length === 5, 'все пять условий загорелись');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.pg-doc .pg-h1') === qa.data.title, 'в окне своё название');
  } },
  { name: 'вывод: острова горят, своё меню', shot: 'fin', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, '«Завершить»');
    qa.expect(qa.qa('.pp-street .pp-house.is-lit').length === 5, 'все пять островов горят');
    qa.expect(qa.text('.pp-fin .pg-h1') === qa.data.title, 'в выводе — своё меню');
  } },
  { name: 'завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<h1>' + qa.data.title + '</h1>') >= 0 && html.indexOf('href="cave.html"') >= 0 && pl.artifact.items.length === 3, 'артефакт — своё меню', { html });
  } }
];

const L = (h, t) => '<a href="' + h + '">' + t + '</a>';
const menu = (title, a, b, c) => '<h1>' + title + '</h1>\n<ul>\n  <li>' + L('cave.html', a) + '</li>\n  <li>' + L('volcano.html', b) + '</li>\n  <li>' + L('parrots.html', c) + '</li>\n</ul>';

export default {
  title: 'Практика к уроку 4 курса HTML «Острова» (7 слайдов)',
  file: 'html/04p-ssylki-i-atributy',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 7,
  inputScreens: [2, 3, 4, 5, 6],
  expectFinish: true,
  data: {
    ru: { t1: L('parrots.html', 'Остров попугаев'), t2: L('cave.html', 'Пещера') + '\n' + L('lighthouse.html', 'Маяк'), t3: L('volcano.html', 'К вулкану'),
      t4: L('lighthouse.html', 'Маяк') + '\n' + L('volcano.html', 'Вулкан') + '\n<p>Счастливого пути!</p>',
      title: 'Мои острова', t5: menu('Мои острова', 'Пещера', 'Вулкан', 'Попугаи') },
    uz: { t1: L('parrots.html', 'To‘tiqushlar oroli'), t2: L('cave.html', 'G‘or') + '\n' + L('lighthouse.html', 'Mayoq'), t3: L('volcano.html', 'Vulqonga'),
      t4: L('lighthouse.html', 'Mayoq') + '\n' + L('volcano.html', 'Vulqon') + '\n<p>Yaxshi sayohat!</p>',
      title: 'Orollarim', t5: menu('Orollarim', 'G‘or', 'Vulqon', 'To‘tiqushlar') },
    en: { t1: L('parrots.html', 'Parrot Island'), t2: L('cave.html', 'Cave') + '\n' + L('lighthouse.html', 'Lighthouse'), t3: L('volcano.html', 'To the volcano'),
      t4: L('lighthouse.html', 'Lighthouse') + '\n' + L('volcano.html', 'Volcano') + '\n<p>Have a good trip!</p>',
      title: 'My islands', t5: menu('My islands', 'Cave', 'Volcano', 'Parrots') }
  },
  steps: STEPS,
  flows: [
    { name: 't1: href без кавычек, вторая неудача → подсказка', start: 1, langs: ['ru'], steps: [{ name: 'без кавычек дважды', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', '<a href=parrots.html>Остров попугаев</a>', 'без кавычек');
      await qa.sleep(200);
      qa.expect(!!qa.q('.pg-doc .pg-a'), 'честно: браузер понял и без кавычек');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(!!qa.q('.pp-note.is-fb') && /кавычк/.test(qa.text('.pp-note')), 'причина: кавычки', { note: qa.text('.pp-note') });
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(!!qa.q('.pp-note.is-hint'), 'со второй неудачи — ступень подсказки');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 't1: не тот файл → «Файл не найден»', start: 1, langs: ['ru'], steps: [{ name: 'parrot.html', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', '<a href="parrot.html">Остров попугаев</a>', 'без буквы s');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(/parrots\.html/.test(qa.text('.pp-note')), 'причина: нужен parrots.html', { note: qa.text('.pp-note') });
      await qa.click('.pg-doc button.pg-a', 'нажать ссылку');
      await qa.waitFor(() => qa.q('.pg-nf'), 4000, 'честно: «Файл не найден»');
    } }] },
    { name: 't2: поменяна одна ссылка', start: 2, langs: ['ru'], steps: [{ name: 'только «Пещера»', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', qa.q('.ed-ta').value.replace('href="lighthouse.html">Пещера', 'href="cave.html">Пещера'), 'одна ссылка');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(/Маяк/.test(qa.text('.pp-note')) && /lighthouse/.test(qa.text('.pp-note')), 'причина: «Маяк» ведёт не туда', { note: qa.text('.pp-note') });
    } }] },
    { name: 't4: подсказка 2 указывает строку', start: 4, langs: ['ru'], steps: [{ name: 'две лампочки', run: async (qa) => {
      await qa.platform.ready();
      for (let k = 0; k < 2; k += 1) { qa.platform.hint(); await qa.sleep(500); }
      qa.expect(/строку 8/.test(qa.text('.pp-note')) && !!qa.q('.ed-line.is-mark'), 'строка 8 названа и подсвечена', { note: qa.text('.pp-note') });
    } }] },
    { name: 't5: три лампочки → образец → дополнительная задача', start: 5, langs: ['ru'], steps: [{ name: 'подсказки до образца, решение, ещё одна', run: async (qa) => {
      await qa.platform.ready();
      for (let k = 0; k < 3; k += 1) { qa.platform.hint(); await qa.sleep(500); }
      qa.expect(/3\/3/.test(qa.text('.pp-note')) && !!qa.q('.pp-note .sample'), 'третья ступень с образцом', { note: qa.text('.pp-note') });
      qa.type('.ed-ta', qa.data.t5, 'своё меню');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      await qa.waitFor(() => qa.q('.pp-drill-tag'), 4000, 'дополнительная задача');
      qa.platform.hint(); await qa.sleep(500);
      qa.expect(!!qa.q('.pp-note.is-hint'), 'в дополнительной задаче лампочка даёт правило (2-я ступень)', { note: qa.text('.pp-note') });
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.ed-ta', '<p><a href="index.html">Домой</a></p>', 'ссылка на главную');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] }
  ]
};
