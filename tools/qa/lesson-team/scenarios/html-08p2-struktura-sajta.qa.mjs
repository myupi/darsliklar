// Сценарий проверки практики к уроку 8, ЧАСТЬ 2 lessons/html/08p2-struktura-sajta.jsx («Сайт школы Коди»: section и свой
// сайт; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: «Новая тема» (вторая тема попадает
// в ту же рамку main), четыре страницы (разложить две темы по section, section с h2 и абзацем, найти незакрытый section,
// свой сайт: header, main, footer), вывод; onFinished один раз, артефакт — свой сайт. Ветки: причина в панели, подсказка
// после второй неудачи подряд, лампочка до образца и дополнительная задача, обе темы в одном section, тема вне section,
// h2 и p без section, main вместо section, не та строка, section закрыт раньше абзаца, части не по порядку, «Назад»
// сохраняет код и карту. Шаги — в странице.

// Код задания 1: четыре пустые строки (0, 3, 4, 7) — под открывающий и закрывающий section каждой темы.
const STEPS = [
  { name: 'h2: «Новая тема»', shot: 'h2-done', run: async (qa) => {
    await qa.platform.ready();
    const tags = () => qa.qa('.a8-doc .a8-reg-tag').map((e) => e.textContent).join(',');
    qa.expect(qa.qa('.a8-tab.is-ok').length === 3 && qa.qa('.a8-doc .a8-h2').length === 1, 'четыре вкладки горят, на странице одна тема');
    await qa.click('.a8-publish', 'Новая тема');
    await qa.waitFor(() => qa.qa('.a8-doc .a8-h2').length === 2, 5000, 'вторая тема появилась');
    qa.expect(tags() === 'header,main,footer' && !qa.q('.a8-doc .a8-reg-section'), 'честно: обе темы в одной рамке main, разделов нет', { t: tags() });
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');
  } },
  { name: 't1: две темы по section', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.a8-doc .a8-reg-section') && qa.qa('.a8-doc .a8-h2').length === 2, 'честно: две темы лежат в main без разделов');
    const v = qa.q('.a8-ta').value.split('\n');
    qa.expect(v.length === 8 && !v[0].trim() && !v[3].trim() && !v[4].trim() && !v[7].trim(), 'в редакторе четыре пустые строки под section');
    v[0] = '    <section>'; v[3] = '    </section>'; v[4] = '    <section>'; v[7] = '    </section>';
    qa.type('.a8-ta', v.join('\n'), 'два section');
    await qa.sleep(200);
    qa.expect(qa.qa('.a8-doc .a8-reg-section').length === 2, 'две рамки section на странице сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: section с h2 и абзацем', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a8-tab.is-ok').length === 1, 'первая вкладка горит');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a8-ta', '    <section>\n      <h2>' + ws[0] + '</h2>\n      <p>Собираем роботов.</p>\n    </section>', 'раздел');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a8-doc .a8-reg-section'), 'рамка section на странице');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: незакрытый section', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a8-tab.is-ok').length === 2, 'две вкладки горят');
    qa.expect(qa.qa('.a8-doc .a8-reg-section').length === 2 && qa.qa('.a8-doc .a8-reg-section .a8-reg-section').length === 1, 'честно: рамка второго раздела внутри первой');
    await qa.clickNth('.a8-tap', 2, 'строка первого раздела');
    await qa.waitFor(() => qa.q('.a8-ta'), 3000, 'строка стала полем');
    qa.type('.a8-ta', qa.q('.a8-ta').value + '</section>', 'закрывающий section');
    await qa.sleep(200);
    qa.expect(qa.qa('.a8-doc .a8-reg-section').length === 2 && !qa.q('.a8-doc .a8-reg-section .a8-reg-section'), 'разделы встали рядом сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: свой сайт', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a8-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
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
    qa.expect(qa.qa('.a8-tab.is-ok').length === 3 && !qa.q('.a8-fav.is-off'), 'все четыре вкладки горят');
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
  title: 'Практика 8, часть 2, курса HTML «Сайт школы Коди: section и свой сайт» (облик «Редактор»)',
  file: 'html/08p2-struktura-sajta',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 6,
  inputScreens: [2, 3, 5],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 't1: обе темы в одном section, тема вне section, main вместо section; подсказка после второй неудачи', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      const v = qa.q('.a8-ta').value.split('\n');
      v[0] = '    <section>'; v[7] = '    </section>';
      qa.type('.a8-ta', v.join('\n'), 'всё в одном section'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /В одном разделе одна тема/.test(qa.text('.b-sheet p')), 3000, 'причина: одна тема — один раздел');
      qa.expect(qa.qa('.a8-doc .a8-reg-section').length === 1, 'на странице один раздел с двумя темами');
      const w = qa.q('.a8-ta').value.split('\n');
      w[0] = '    <section>'; w[3] = '    </section>'; w[4] = ''; w[7] = '';
      qa.type('.a8-ta', w.join('\n'), 'вторая тема вне section'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/не в разделе/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача: тема вне раздела и ступень подсказки', { two });
      qa.type('.a8-ta', '    <main>\n    <h2>Тема</h2>\n    <p>Текст</p>\n    </main>', 'main вместо section'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /main на странице один/.test(qa.text('.b-sheet p')), 3000, 'main один');} }] },
    { name: 't1: лампочка до образца → дополнительная задача (sport)', start: 1, langs: ['ru'], steps: [{ name: 't1: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a8-sample'), 3000, 'образец третьей ступени');
      const v = qa.q('.a8-ta').value.split('\n');
      v[0] = '    <section>'; v[3] = '    </section>'; v[4] = '    <section>'; v[7] = '    </section>';
      qa.type('.a8-ta', v.join('\n'), 'два section'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      const u = qa.q('.a8-ta').value.split('\n');
      qa.expect(u.length === 8 && qa.qa('.a8-doc .a8-h2').length === 2, 'в дополнительной задаче — две новые темы без разделов');
      u[0] = '    <section>'; u[3] = '    </section>'; u[4] = '    <section>'; u[7] = '    </section>';
      qa.type('.a8-ta', u.join('\n'), 'два section'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't2: h2 и p без section, main вместо section', start: 2, langs: ['ru'], steps: [{ name: 't2: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a8-ta', '<h2>Робототехника</h2>\n<p>Собираем роботов.</p>', 'без section'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не в разделе/.test(qa.text('.b-sheet p')), 3000, 'нужен section');
      qa.type('.a8-ta', '<main>\n<h2>Робототехника</h2>\n</main>', 'main'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /main на странице один/.test(qa.text('.b-sheet p')), 3000, 'main один');} }] },
    { name: 't3: не та строка; section закрыт раньше абзаца; лампочка → дополнительная задача (galereya)', start: 3, langs: ['ru'], steps: [{ name: 't3: ветки', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a8-tap', 3, 'второй раздел'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a8-ta') && /закрыт как надо/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — раздел выше');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a8-sample'), 3000, 'образец третьей ступени');
      await qa.clickNth('.a8-tap', 2, 'строка первого раздела');
      await qa.waitFor(() => qa.q('.a8-ta'), 3000, 'строка стала полем');
      const line = qa.q('.a8-ta').value;
      qa.type('.a8-ta', line.replace('</h2><p>', '</h2></section><p>'), 'закрыт раньше абзаца'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /самом конце строки/.test(qa.text('.b-sheet p')), 3000, 'причина: закрывающий тег в конце');
      qa.type('.a8-ta', line, 'без изменений'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не закрыт/.test(qa.text('.b-sheet p')), 3000, 'причина: раздел не закрыт');
      qa.type('.a8-ta', line + '</section>', 'закрывающий section'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(qa.qa('.a8-doc .a8-reg-section .a8-reg-section').length === 1, 'в дополнительной задаче рамка второго раздела снова внутри первой');
      await qa.clickNth('.a8-tap', 2, 'строка первого раздела'); await qa.waitFor(() => qa.q('.a8-ta'), 3000, 'строка стала полем');
      qa.type('.a8-ta', qa.q('.a8-ta').value + '</section>', 'закрывающий section'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't4: части не по порядку → причина', start: 4, langs: ['ru'], steps: [{ name: 't4: порядок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a8-ta', '<footer>Низ</footer>\n<header>\n<h1>Мой</h1>\n<nav><a href="index.html">Главная</a></nav>\n</header>\n<main>\n<section>\n<h2>Уроки</h2>\n<p>Их пять.</p>\n</section>\n</main>', 'низ наверху'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Порядок частей/.test(qa.text('.b-sheet p')), 3000, 'порядок header, main, footer');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      const v = qa.q('.a8-ta').value.split('\n');
      v[0] = '    <section>'; v[3] = '    </section>'; v[4] = '    <section>'; v[7] = '    </section>';
      qa.type('.a8-ta', v.join('\n'), 'два section'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a8-ta', '    <section>\n      <h2>Ро', 'начало раздела'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<h2>Ро/.test(qa.q('.a8-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a8-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
