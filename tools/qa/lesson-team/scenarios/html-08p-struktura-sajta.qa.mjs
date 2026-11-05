// Сценарий проверки практики к уроку 8 курса HTML lessons/html/08p-struktura-sajta.jsx («Сайт школы Коди»,
// облик «Редактор», 04.11.2026, на основе 07p).
// Основной путь: 7 слайдов действиями ученика — сохранение (у main стёрлось имя тега — рамка главной части пропала),
// пять страниц (имя тега main, строка nav со ссылкой, section с h2 и абзацем, найти head вместо header, свой сайт:
// header, main, footer), вывод; onFinished один раз, артефакт — свой сайт.
// Ветки: причина в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача
// (опечатка foter), ссылка без nav, nav без href, h2 и p без section, не та строка, части не по порядку,
// «Назад» хранит код и карту. Шаги — в странице.

const STEPS = [
  { name: 's1: сохранение — рамка main пропала', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const tags = () => qa.qa('.a8-doc .a8-reg-tag').map((e) => e.textContent).join(',');
    qa.expect(qa.qa('.a8-tab.is-ok').length === 4 && tags() === 'header,main,section,footer', 'до сохранения вкладки горят, Инспектор показывает все части', { t: tags() });
    await qa.click('.a8-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a8-tab.is-off').length === 4, 5000, 'вкладки погасли');
    qa.expect(tags() === 'header,section,footer', 'честно: без имени тега рамки main нет', { t: tags() });
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: имя тега main', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const tags = () => qa.qa('.a8-doc .a8-reg-tag').map((e) => e.textContent).join(',');
    qa.type('.kz-gap textarea', 'main', 'имя тега');
    await qa.sleep(200);
    qa.expect(tags() === 'header,main,section,footer', 'рамка main появилась сразу при наборе', { t: tags() });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: строка nav со ссылкой', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a8-tab.is-ok').length === 1, 'первая вкладка горит');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a8-ta', '    <nav><a href="' + ws[1] + '">' + ws[0] + '</a></nav>', 'меню');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a8-doc .a8-reg-nav') && qa.text('.a8-doc .a8-a') === ws[0], 'рамка nav и ссылка на странице сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: section с h2 и абзацем', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a8-ta', '    <section>\n      <h2>' + ws[0] + '</h2>\n      <p>Собираем роботов.</p>\n    </section>', 'раздел');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a8-doc .a8-reg-section'), 'рамка section на странице');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: head вместо header', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.a8-doc .a8-reg-header') && !!qa.q('.a8-doc .a8-h1'), 'честно: заголовок виден, а рамки верха нет');
    await qa.clickNth('.a8-tap', 1, 'строка верха');
    await qa.waitFor(() => qa.q('.a8-ta'), 3000, 'строка стала полем');
    qa.type('.a8-ta', qa.q('.a8-ta').value.replace(/head>/g, 'header>'), 'header вместо head');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.a8-doc .a8-reg-header'), 'рамка верха появилась');
  } },
  { name: 't5: свой сайт', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const H = '<header>\n<h1>Мой класс & друзья</h1>\n<nav><a href="index.html">Главная</a></nav>\n</header>\n';
    const M = '<main>\n<section>\n<h2>Уроки</h2>\n<p>Их пять.</p>\n</section>\n</main>\n';
    qa.type('.a8-ta', H + M, 'без footer');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина: нет низа сайта');
    qa.expect(/footer/.test(qa.text('.b-sheet p')), 'в причине — footer');
    qa.type('.a8-ta', H + M + '<footer>© 2026 Мой класс</footer>', 'сайт');
    await qa.sleep(200);
    qa.expect(qa.qa('.a8-tree-r.is-ok').length === 5, 'схема отмечает body, header, main, section и footer');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.a8-tab.is-ok').length === 4 && !qa.q('.a8-fav.is-off'), 'все пять вкладок горят');
    qa.expect(/Мой класс & друзья/.test(qa.text('.a8-doc .a8-h1')) && !!qa.q('.a8-doc .a8-reg-footer'), 'на открытой вкладке — свой сайт с рамками частей');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Мой класс & друзья' && Array.isArray(a.sections) && a.sections[0] === 'Уроки'
      && /<h1>Мой класс &amp; друзья<\/h1>/.test(a.html) && /<nav><a href="index.html">Главная<\/a><\/nav>/.test(a.html) && /<footer>© 2026 Мой класс<\/footer>/.test(a.html),
      'артефакт — свой сайт, текст экранирован', { a });
  } }
];
export default {
  title: 'Практика 8 курса HTML «Сайт школы Коди» (облик «Редактор»)',
  file: 'html/08p-struktura-sajta',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 7,
  inputScreens: [2, 3, 4, 6],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 't1: section → причина, вторая неудача → подсказка; опечатка', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'section', 'section'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.type('.kz-gap textarea', 'mian', 'опечатка'); await qa.sleep(200);
      qa.expect(!qa.q('.a8-doc .a8-reg-main'), 'браузер честно: незнакомый тег — рамки нет');
      await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/main/.test(one) && /mian/.test(two) && /закрывающий/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });} }] },
    { name: 't2: ссылка без nav, a без href; лампочка до образца → дополнительная задача', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a8-ta', '    <a href="index.html">Главная</a>', 'без nav'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не в меню/.test(qa.text('.b-sheet p')), 3000, 'причина: ссылка не в меню');
      qa.type('.a8-ta', '    <nav><a>Главная</a></nav>', 'без href'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /нет href/.test(qa.text('.b-sheet p')), 3000, 'причина: нет href');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a8-sample'), 3000, 'образец третьей ступени');
      qa.type('.a8-ta', '    <nav><a href="index.html">Главная</a></nav>', 'меню'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.a8-ta', '    <nav><a href="aloqa.html">Контакты</a></nav>', 'контакты'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: h2 и p без section, main вместо section', start: 3, langs: ['ru'], steps: [{ name: 't3: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a8-ta', '<h2>Робототехника</h2>\n<p>Собираем роботов.</p>', 'без section'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не в разделе/.test(qa.text('.b-sheet p')), 3000, 'нужен section');
      qa.type('.a8-ta', '<main>\n<h2>Робототехника</h2>\n</main>', 'main'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /main на странице один/.test(qa.text('.b-sheet p')), 3000, 'main один');} }] },
    { name: 't4: не та строка; лампочка → дополнительная задача: foter', start: 4, langs: ['ru'], steps: [{ name: 't4: foter', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a8-tap', 2, 'главная часть'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a8-ta') && /выше/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — выше');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.clickNth('.a8-tap', 1, 'строка верха');
      await qa.waitFor(() => qa.q('.a8-ta'), 3000, 'строка стала полем');
      qa.type('.a8-ta', qa.q('.a8-ta').value.replace(/head>/g, 'header>'), 'header'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.q('.a8-doc .a8-reg-footer'), 'честно: с опечаткой рамки низа нет');
      await qa.clickNth('.a8-tap', 3, 'строка низа');
      await qa.waitFor(() => qa.q('.a8-ta'), 3000, 'строка стала полем');
      qa.type('.a8-ta', qa.q('.a8-ta').value.replace(/foter>/g, 'footer>'), 'footer'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't5: части не по порядку → причина', start: 5, langs: ['ru'], steps: [{ name: 't5: порядок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a8-ta', '<footer>Низ</footer>\n<header>\n<h1>Мой</h1>\n<nav><a href="index.html">Главная</a></nav>\n</header>\n<main>\n<section>\n<h2>Уроки</h2>\n<p>Их пять.</p>\n</section>\n</main>', 'низ наверху'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Порядок частей/.test(qa.text('.b-sheet p')), 3000, 'порядок header, main, footer');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'main', 'имя тега'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a8-ta', '    <nav><a hr', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<nav><a hr/.test(qa.q('.a8-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a8-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
