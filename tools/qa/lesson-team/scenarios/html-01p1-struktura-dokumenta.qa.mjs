// Сценарий проверки практики к уроку 1, ЧАСТЬ 1 lessons/html/01p1-struktura-dokumenta.jsx («Пять вкладок Коди»:
// тег, head и title; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: сбой (четыре вкладки
// гаснут), четыре страницы (слово в title, строка title, head вокруг готового title, найти и исправить опечатку «titel»),
// вывод; onFinished один раз, артефакт — починенная страница «Поездки». Ветки: причина в панели, подсказка после
// второй неудачи подряд, лампочка до образца и дополнительная задача (у т2, т3 и т4), title без head, не та строка,
// опечатка не исправлена, «Назад» сохраняет код и карту. Шаги — в странице.

const STEPS = [
  { name: 's1: сбой — вкладки гаснут', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a1-tab.is-ok').length === 3, 'до сбоя три боковые вкладки горят (всего четыре)');
    await qa.click('.a1-refresh', 'Обновить');
    await qa.waitFor(() => qa.qa('.a1-tab.is-off').length === 3, 5000, 'вкладки погасли');
    qa.expect(!qa.q('.a1-page'), 'окно пустое');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: название в title', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const w1 = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    qa.type('.kz-gap textarea', w1, 'название');
    await qa.sleep(200);
    qa.expect(qa.text('.a1-tab.is-cur').indexOf(w1) >= 0, 'вкладка меняется сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: строка title', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a1-tab.is-ok').length === 1, 'первая вкладка горит');
    const w2 = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    qa.type('.a1-ta', '    <title>' + w2 + '</title>', 'строка');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.a1-tab.is-cur').trim() === w2, 'на вкладке название');
  } },
  { name: 't3: head вокруг title', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a1-tab.is-ok').length === 2, 'две вкладки горят');
    qa.expect(qa.qa('.a1-tree-r').length === 3 && qa.qa('.a1-tree-r.is-ok').length === 2, 'схема: html и title есть, head ещё нет');
    const v = qa.q('.a1-ta').value;
    const line = v.split('\n').filter((s) => /<title>/.test(s))[0];
    qa.expect(!!line && !/head/.test(v), 'в поле готовая строка title, head нет');
    qa.type('.a1-ta', '<head>\n' + line + '\n</head>', 'head вокруг title');
    await qa.sleep(200);
    qa.expect(qa.qa('.a1-tree-r.is-ok').length === 3, 'схема отмечает head сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't4: найти и исправить опечатку', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a1-tab.is-ok').length === 3, 'три вкладки горят');
    const name = 'Поездки';
    qa.expect(/index\.html/.test(qa.text('.a1-tab.is-cur')) && qa.text('.a1-page').indexOf(name) >= 0, 'честно: на вкладке index.html, название попало в окно');
    await qa.clickNth('.a1-tap', 3, 'строка с title');
    await qa.waitFor(() => qa.q('.a1-ta'), 3000, 'строка стала полем');
    const bad = qa.q('.a1-ta').value;
    qa.expect(/<titel>/.test(bad), 'в поле строка с опечаткой «titel»', { bad });
    qa.type('.a1-ta', bad.replace('<titel>', '<title>'), 'исправление');
    await qa.sleep(200);
    qa.expect(qa.text('.a1-tab.is-cur').trim() === name && qa.text('.a1-page').indexOf(name) < 0, 'название ушло с окна на вкладку сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'e1: вывод части 1', shot: 'e1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.a1-tab.is-ok').length === 3 && !qa.q('.a1-fav.is-off'), 'все четыре вкладки горят');
    qa.expect(qa.qa('.a1-roles .kz-role').length === 4, 'четыре плашки: тег, head, title, точное имя');
  } },
  { name: 'e1: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.title === 'Поездки' && a.text === 'Летний отдых' && /<title>/.test(a.html), 'артефакт — починенная страница «Поездки»', { a });
  } }
];
export default {
  title: 'Практика 1, часть 1, курса HTML «Пять вкладок Коди: тег, head и title» (облик «Редактор»)',
  file: 'html/01p1-struktura-dokumenta',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 6,
  inputScreens: [1, 2, 3, 4],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 't1: другое слово → причина, вторая неудача → подсказка', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'Кино', 'Кино'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.type('.kz-gap textarea', '<b>', '<b>'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/скоб/.test(two) && two.length > one.length - 20 && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });} }] },
    { name: 't2: лампочка до образца → дополнительная задача', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a1-ta', '    <title>Игры<title>', 'без косой черты'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /кос/.test(qa.text('.b-sheet p')), 3000, 'причина: нет косой черты');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a1-sample'), 3000, 'образец третьей ступени');
      qa.type('.a1-ta', '    <title>Игры</title>', 'строка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.a1-ta', '    <title>Книги</title>', 'Книги'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: title без head → причина; head не закрыт; лампочка → образец → дополнительная задача', start: 3, langs: ['ru'], steps: [{ name: 't3: ветки', run: async (qa) => {
      await qa.platform.ready();
      const line = qa.q('.a1-ta').value.split('\n').filter((s) => /<title>/.test(s))[0];
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      qa.expect(/title живёт внутри head/.test(qa.text('.b-sheet p')), 'строка title без head: title живёт внутри head');
      qa.type('.a1-ta', '<head>\n' + line, 'head не закрыт'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/head не закрыта|Часть head не закрыта/i.test(qa.text('.b-sheet p')), 'head без закрывающего: часть не закрыта', { p: qa.text('.b-sheet p') });
      qa.type('.a1-ta', '</head>\n' + line + '\n<head>', 'теги местами'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Здесь сначала нужен открывающий тег head/.test(qa.text('.b-sheet p')), 'закрывающий head раньше открывающего', { p: qa.text('.b-sheet p') });
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a1-sample'), 3000, 'образец третьей ступени');
      qa.type('.a1-ta', '<head>\n' + line + '\n</head>', 'head вокруг title'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      const line2 = qa.q('.a1-ta').value.split('\n').filter((s) => /<title>/.test(s))[0];
      qa.expect(/Книги/.test(line2), 'в дополнительной задаче — страница «Книги»', { line2 });
      qa.type('.a1-ta', '<head>\n' + line2 + '\n</head>', 'head вокруг Книги'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't4: не та строка → причина; опечатка не исправлена; дополнительная задача', start: 4, langs: ['ru'], steps: [{ name: 't4: ветки', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a1-tap', 6, 'строка текста'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a1-ta') && /другой строке|окна/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — название в другой строке');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a1-sample'), 3000, 'образец третьей ступени');
      await qa.clickNth('.a1-tap', 3, 'строка с title'); await qa.waitFor(() => qa.q('.a1-ta'), 3000, 'строка стала полем');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      qa.expect(/Такого тега нет/.test(qa.text('.b-sheet p')) && /<title>/.test(qa.text('.b-sheet p')), 'опечатка «titel» не исправлена: «Такого тега нет… Может быть, title?»', { p: qa.text('.b-sheet p') });
      const bad = qa.q('.a1-ta').value;
      qa.type('.a1-ta', bad.replace('<titel>', '<title>').replace('</title>', ''), 'без закрывающего'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/title не закрыт/.test(qa.text('.b-sheet p')), 'не закрыт title: честная причина', { p: qa.text('.b-sheet p') });
      qa.type('.a1-ta', bad.replace('<titel>', '<title>'), 'исправление'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled() && /index\.html/.test(qa.text('.a1-tab.is-cur')), 'в дополнительной задаче снова опечатка: на вкладке index.html');
      await qa.clickNth('.a1-tap', 3, 'строка с title'); await qa.waitFor(() => qa.q('.a1-ta'), 3000, 'строка стала полем');
      const bad2 = qa.q('.a1-ta').value;
      qa.expect(/<tilte>/.test(bad2), 'в дополнительной задаче другая опечатка «tilte»', { bad2 });
      qa.type('.a1-ta', bad2.replace('<tilte>', '<title>'), 'исправление'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1], 'название'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a1-ta', '    <title>Иг', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<title>Иг/.test(qa.q('.a1-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a1-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
