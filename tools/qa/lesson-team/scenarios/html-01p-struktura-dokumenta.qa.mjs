// Сценарий проверки практики к уроку 1 курса HTML lessons/html/01p-struktura-dokumenta.jsx («Пять вкладок Коди»,
// облик «Редактор», 04.11.2026).
// Основной путь: 7 слайдов действиями ученика — сбой, пять вкладок (название в title, строка title, блок body,
// найти и починить незакрытый title, своя страница), вывод; onFinished один раз, артефакт — своя страница.
// Ветки: причина в панели на каждом задании, подсказка после второй неудачи подряд, лампочка до образца и
// дополнительная задача, «Назад» сохраняет код и карту (кнопки «Повторить» в шапке облика нет). Шаги — в странице.

const STEPS = [
  { name: 's1: сбой — вкладки гаснут', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a1-tab.is-ok').length === 4, 'до сбоя вкладки горят');
    await qa.click('.a1-refresh', 'Обновить');
    await qa.waitFor(() => qa.qa('.a1-tab.is-off').length === 4, 5000, 'вкладки погасли');
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
  { name: 't3: блок body', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.a1-page'), 'честно: окно пустое');
    qa.type('.a1-ta', '  <body>\n    Bugun quyoshli\n  </body>', 'блок');
    await qa.sleep(200);
    qa.expect(/quyoshli/.test(qa.text('.a1-page')), 'текст в окне сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: найти и починить незакрытый title', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/body/.test(qa.text('.a1-tab.is-cur')) && !qa.q('.a1-page'), 'честно: текст на вкладке, окно пустое');
    await qa.clickNth('.a1-tap', 3, 'строка title');
    await qa.waitFor(() => qa.q('.a1-ta'), 3000, 'строка стала полем');
    const w4 = qa.q('.a1-ta').value.replace('<title>', '');
    qa.type('.a1-ta', '<title>' + w4 + '</title>', 'исправление');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.a1-tab.is-cur').trim() === w4 && !!qa.q('.a1-page'), 'вкладка и окно на местах');
  } },
  { name: 't5: своя страница', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a1-ta', '  <head>\n    <title>Моя <комната> & я</title>\n  </head>\n  <body>\n    Привет, мир!\n  </body>', 'страница');
    await qa.sleep(200);
    qa.expect(qa.qa('.a1-tree-r.is-ok').length === 4, 'схема отмечает все части');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet'), 3000, 'ответ');
    qa.expect(!qa.q('.b-sheet.is-ok'), 'чужой тег <комната> в названии не принят');
    qa.type('.a1-ta', '  <head>\n    <title>Моя комната & я</title>\n  </head>\n  <body>\n    Привет, мир!\n  </body>', 'страница');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(/Моя комната & я/.test(qa.text('.a1-tab.is-cur')), 'своё название на вкладке, & — как текст');
  } },
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить практику»');
    qa.expect(qa.qa('.a1-tab.is-ok').length === 4 && !qa.q('.a1-fav.is-off'), 'все пять вкладок горят');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.title === 'Моя комната & я' && /&amp;/.test(a.html) && a.text === 'Привет, мир!', 'артефакт — своя страница, текст экранирован', { a });
  } }
];
export default {
  title: 'Практика 1 курса HTML «Пять вкладок Коди» (облик «Редактор»)',
  file: 'html/01p-struktura-dokumenta',
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
    { name: 't3: текст без body → правило', start: 3, langs: ['ru'], steps: [{ name: 't3: текст без body', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a1-ta', '  Сегодня солнечно', 'текст'); await qa.sleep(200);
      qa.expect(/солнечно/.test(qa.text('.a1-page')), 'браузер честно показывает текст');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /внутри body/.test(qa.text('.b-sheet p')), 3000, 'правило нашей страницы');} }] },
    { name: 't4: верная строка → «в порядке»', start: 4, langs: ['ru'], steps: [{ name: 't4: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a1-tap', 6, 'строка текста'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a1-ta') && /выше/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — выше');} }] },
    { name: 't5: body до head → порядок', start: 5, langs: ['ru'], steps: [{ name: 't5: порядок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a1-ta', '<body>Привет</body>', 'body'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Сначала идёт head/.test(qa.text('.b-sheet p')), 3000, 'причина: порядок');} }] },
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
