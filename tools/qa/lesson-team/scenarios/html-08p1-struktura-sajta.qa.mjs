// Сценарий проверки практики к уроку 8, ЧАСТЬ 1 lessons/html/08p1-struktura-sajta.jsx («Сайт школы Коди»: header, main,
// footer и nav; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: сохранение (у main стёрлось
// имя тега — рамка главной части пропала), четыре страницы (имя тега main, footer целиком, строка nav со ссылкой, найти
// head вместо header), вывод части 1; onFinished один раз, артефакт — починенная страница «Контакты». Ветки: причина
// в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача, footer: надпись без
// тега / не тот тег / опечатка foter, ссылка без nav, nav без href, не та строка, «Назад» сохраняет код и карту.
// Шаги — в странице.

const STEPS = [
  { name: 's1: сохранение — рамка main пропала', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const tags = () => qa.qa('.a8-doc .a8-reg-tag').map((e) => e.textContent).join(',');
    qa.expect(qa.qa('.a8-tab.is-ok').length === 3 && tags() === 'header,main,footer', 'четыре вкладки горят (три боковых), Инспектор показывает header, main, footer — без section', { t: tags() });
    await qa.click('.a8-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a8-tab.is-off').length === 3, 5000, 'вкладки погасли');
    qa.expect(tags() === 'header,footer', 'честно: без имени тега рамки main нет', { t: tags() });
    qa.expect(!/пят/i.test(qa.text('.kz-ask')), 'в строке задания нет «пяти страниц»');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: имя тега main', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const tags = () => qa.qa('.a8-doc .a8-reg-tag').map((e) => e.textContent).join(',');
    qa.expect(!qa.qa('.a8-ty code').some((e) => e.textContent === 'section') && qa.qa('.a8-ty code').length === 4, 'части сайта рядом с заданием — четыре, без section');
    qa.type('.kz-gap textarea', 'main', 'имя тега');
    await qa.sleep(200);
    qa.expect(tags() === 'header,main,footer', 'рамка main появилась сразу при наборе', { t: tags() });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: footer целиком', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a8-tab.is-ok').length === 1, 'первая вкладка горит');
    qa.expect(!!qa.q('.a8-doc .a8-reg-header') && !!qa.q('.a8-doc .a8-reg-main') && !qa.q('.a8-doc .a8-reg-footer'), 'честно: верх и главная часть в рамках, низа нет');
    const w = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    qa.type('.a8-ta', '    <footer>' + w + '</footer>', 'footer');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a8-doc .a8-reg-footer'), 'рамка footer появилась сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: строка nav со ссылкой', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a8-tab.is-ok').length === 2, 'две вкладки горят');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a8-ta', '    <nav><a href="' + ws[1] + '">' + ws[0] + '</a></nav>', 'меню');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a8-doc .a8-reg-nav') && qa.text('.a8-doc .a8-a') === ws[0], 'рамка nav и ссылка на странице сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: head вместо header', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a8-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
    qa.expect(!qa.q('.a8-doc .a8-reg-header') && !!qa.q('.a8-doc .a8-h1'), 'честно: заголовок виден, а рамки верха нет');
    await qa.clickNth('.a8-tap', 1, 'строка верха');
    await qa.waitFor(() => qa.q('.a8-ta'), 3000, 'строка стала полем');
    qa.type('.a8-ta', qa.q('.a8-ta').value.replace(/head>/g, 'header>'), 'header вместо head');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.a8-doc .a8-reg-header'), 'рамка верха появилась');
  } },
  { name: 'e1: вывод части 1', shot: 'e1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.a8-tab.is-ok').length === 3 && !qa.q('.a8-fav.is-off'), 'все четыре вкладки горят');
    const tags = qa.qa('.a8-doc .a8-reg-tag').map((e) => e.textContent).join(',');
    qa.expect(tags === 'header,nav,main,footer' && qa.qa('.kz-role').length === 4, 'на странице рамки header, nav, main, footer; четыре плашки', { tags });
    qa.expect(/section/.test(qa.text('.kz-next')), 'дальше — часть 2 (section)');
  } },
  { name: 'e1: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Контакты' && Array.isArray(a.sections) && a.sections.length === 0
      && /<header>/.test(a.html) && /<h1>Контакты<\/h1>/.test(a.html) && /<footer>© 2026 Школа Коди<\/footer>/.test(a.html) && !/<head>\s*<h1>/.test(a.html),
      'артефакт — починенная страница «Контакты»', { a });
  } }
];
export default {
  title: 'Практика 8, часть 1, курса HTML «Сайт школы Коди: header, main, footer и nav» (облик «Редактор»)',
  file: 'html/08p1-struktura-sajta',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 6,
  inputScreens: [2, 3, 4],
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
      qa.expect(/main/.test(one) && /mian/.test(two) && /закрывающий/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });
      qa.expect(!/section/.test(one) && !/section/.test(two), 'в причинах и подсказках части 1 слова section нет', { one, two });} }] },
    { name: 't2: надпись без тега, header вместо footer, опечатка; лампочка → дополнительная задача', start: 2, langs: ['ru'], steps: [{ name: 't2: ветки', run: async (qa) => {
      await qa.platform.ready();
      const w = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
      qa.type('.a8-ta', '    ' + w, 'надпись без тега'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не в части сайта/.test(qa.text('.b-sheet p')), 3000, 'причина: надпись не в части сайта');
      qa.type('.a8-ta', '    <header>' + w + '</header>', 'header вместо footer'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Здесь нужен footer/.test(qa.text('.b-sheet p')), 3000, 'причина: нужен footer');
      qa.type('.a8-ta', '    <foter>' + w + '</foter>', 'опечатка'); await qa.sleep(200);
      qa.expect(!qa.q('.a8-doc .a8-reg-footer'), 'честно: с опечаткой рамки низа нет');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /foter/.test(qa.text('.b-sheet p')) && /footer/.test(qa.text('.b-sheet p')), 3000, 'причина: опечатка и «Может быть footer»');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a8-sample'), 3000, 'образец третьей ступени');
      qa.type('.a8-ta', '    <footer>Другое</footer>', 'другой текст'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Пусть текст внутри останется прежним/.test(qa.text('.b-sheet p')), 3000, 'текст менять нельзя');
      qa.type('.a8-ta', '    <footer>' + w + '</footer>', 'footer'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      const w2 = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
      qa.type('.a8-ta', '    <footer>' + w2 + '</footer>', 'галерея'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: ссылка без nav, a без href; лампочка до образца → дополнительная задача', start: 3, langs: ['ru'], steps: [{ name: 't3: образец и ещё разок', run: async (qa) => {
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
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'main', 'имя тега'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a8-ta', '    <footer>Шко', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<footer>Шко/.test(qa.q('.a8-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a8-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
