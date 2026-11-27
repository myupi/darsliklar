// Сценарий проверки практики к уроку 1, ЧАСТЬ 2 lessons/html/01p2-struktura-dokumenta.jsx («Пять вкладок Коди»:
// body и порядок документа; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: «Добавить
// текст» (название на вкладке, текст в окне), четыре страницы (блок body, название и текст перепутаны — поменять местами,
// найти и починить незакрытый title, своя страница: head, title и body), вывод; onFinished один раз, артефакт — своя
// страница. Ветки: причина в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная
// задача, текст без body, всё на старых местах, слово не на месте, не та строка, body до head, «Назад» сохраняет код и
// карту. Шаги — в странице.

const STEPS = [
  { name: 'h2: «Добавить текст»', shot: 'h2-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a1-tab.is-off').length === 3 && !qa.q('.a1-page'), 'три вкладки ждут, у открытой окно пустое');
    await qa.click('.a1-addtext', 'Добавить текст');
    await qa.waitFor(() => /Привет/.test(qa.text('.a1-page') || ''), 5000, 'текст появился в окне');
    qa.expect(/Моя страница/.test(qa.text('.a1-tab.is-cur')), 'название осталось на вкладке');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');
  } },
  { name: 't1: блок body', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a1-tab.is-ok').length === 0 && !qa.q('.a1-page'), 'честно: вкладки ждут, окно пустое');
    qa.type('.a1-ta', '  <body>\n    Сегодня солнечно\n  </body>', 'блок');
    await qa.sleep(200);
    qa.expect(/солнечно/.test(qa.text('.a1-page')), 'текст в окне сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: название и текст — на свои места', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a1-tab.is-ok').length === 1, 'первая вкладка горит');
    const f = qa.qa('.kz-gap textarea');
    qa.expect(f.length === 2 && f[0].value === 'Кот спит' && f[1].value === 'Животные', 'два поля заполнены наоборот', { v: f.map((x) => x.value) });
    qa.expect(/Кот спит/.test(qa.text('.a1-tab.is-cur')) && qa.text('.a1-page') === 'Животные', 'честно: на вкладке «Кот спит», в окне «Животные»');
    qa.expect(!!qa.q('.a1-where'), 'помощь «title → на вкладке, body → в окне» видна сразу');
    qa.type(f[0], 'Животные', 'название в title');
    qa.type(qa.qa('.kz-gap textarea')[1], 'Кот спит', 'текст в body');
    await qa.sleep(200);
    qa.expect(qa.text('.a1-tab.is-cur').trim() === 'Животные' && qa.text('.a1-page') === 'Кот спит', 'вкладка и окно меняются сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't3: найти и починить незакрытый title', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a1-tab.is-ok').length === 2, 'две вкладки горят');
    qa.expect(/body/.test(qa.text('.a1-tab.is-cur')) && !qa.q('.a1-page'), 'честно: текст на вкладке, окно пустое');
    await qa.clickNth('.a1-tap', 3, 'строка title');
    await qa.waitFor(() => qa.q('.a1-ta'), 3000, 'строка стала полем');
    const w4 = qa.q('.a1-ta').value.replace('<title>', '');
    qa.type('.a1-ta', '<title>' + w4 + '</title>', 'исправление');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.a1-tab.is-cur').trim() === w4 && !!qa.q('.a1-page'), 'вкладка и окно на местах');
  } },
  { name: 't4: своя страница', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a1-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
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
    qa.expect(qa.qa('.a1-tab.is-ok').length === 3 && !qa.q('.a1-fav.is-off'), 'все четыре вкладки горят');
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
  title: 'Практика 1, часть 2, курса HTML «Пять вкладок Коди: body и порядок документа» (облик «Редактор»)',
  file: 'html/01p2-struktura-dokumenta',
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
    { name: 't1: текст без body → правило', start: 1, langs: ['ru'], steps: [{ name: 't1: текст без body', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a1-ta', '  Сегодня солнечно', 'текст'); await qa.sleep(200);
      qa.expect(/солнечно/.test(qa.text('.a1-page')), 'браузер честно показывает текст');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /внутри body/.test(qa.text('.b-sheet p')), 3000, 'правило нашей страницы');} }] },
    { name: 't2: всё на старых местах → причина; слово не на месте; теги в поле; лампочка → образец → дополнительная задача', start: 2, langs: ['ru'], steps: [{ name: 't2: ветки', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      qa.expect(/поменялись|Пока всё на старых местах/.test(qa.text('.b-sheet p')) && !qa.platform.nextEnabled(), 'ничего не менял: название и текст поменялись');
      qa.type(qa.qa('.kz-gap textarea')[0], 'Животные', 'название в title'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/В окне вышел другой текст/.test(qa.text('.b-sheet p')) && /Кот спит/.test(qa.text('.b-sheet p')), 'поменял только вкладку: в окне другой текст, нужно «Кот спит»', { p: qa.text('.b-sheet p') });
      qa.type(qa.qa('.kz-gap textarea')[1], '<b>', 'теги'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/скоб/.test(qa.text('.b-sheet p')), 'угловые скобки в поле не нужны');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a1-sample'), 3000, 'образец третьей ступени');
      qa.type(qa.qa('.kz-gap textarea')[1], 'Кот спит', 'текст в body'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      const f = qa.qa('.kz-gap textarea');
      qa.expect(f[0].value === 'Сегодня футбол' && f[1].value === 'Спорт', 'в дополнительной задаче — другая пара, снова наоборот', { v: f.map((x) => x.value) });
      qa.type(f[0], 'Спорт', 'название'); qa.type(qa.qa('.kz-gap textarea')[1], 'Сегодня футбол', 'текст'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: не та строка → причина; дополнительная задача', start: 3, langs: ['ru'], steps: [{ name: 't3: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a1-tap', 6, 'строка текста'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a1-ta') && /выше/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — выше');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a1-sample'), 3000, 'образец третьей ступени');
      await qa.clickNth('.a1-tap', 3, 'строка title'); await qa.waitFor(() => qa.q('.a1-ta'), 3000, 'строка стала полем');
      const w = qa.q('.a1-ta').value.replace('<title>', '');
      qa.type('.a1-ta', '<title>' + w + '</title>', 'исправление'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      await qa.clickNth('.a1-tap', 3, 'строка title'); await qa.waitFor(() => qa.q('.a1-ta'), 3000, 'строка стала полем');
      const w2 = qa.q('.a1-ta').value.replace('<title>', '');
      qa.type('.a1-ta', '<title>' + w2 + '</title>', 'исправление'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't4: body до head → порядок', start: 4, langs: ['ru'], steps: [{ name: 't4: порядок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a1-ta', '<body>Привет</body>', 'body'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /сначала идёт head/i.test(qa.text('.b-sheet p')), 3000, 'причина: порядок');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a1-ta', '  <body>\n    Сегодня солнечно\n  </body>', 'блок'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type(qa.qa('.kz-gap textarea')[0], 'Живот', 'начало названия'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(qa.qa('.kz-gap textarea')[0].value === 'Живот', 'поле на месте после «Назад»');
      qa.expect(qa.qa('.a1-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
