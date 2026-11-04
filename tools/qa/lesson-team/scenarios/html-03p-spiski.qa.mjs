// Сценарий проверки практики к уроку 3 курса HTML lessons/html/03p-spiski.jsx («Праздник Коди», облик «Редактор»,
// 04.11.2026, на основе 02p).
// Основной путь: 7 слайдов действиями ученика — сохранение (теги пропали, пункты слиплись), пять страниц праздника
// (слово в пустом li, строка li, список ol из трёх li, найти пункт с номером, вписанным руками, своя страница: h1 и
// список), вывод; onFinished один раз, артефакт — свой список. Ветки: причина в панели, подсказка после второй
// неудачи подряд, лампочка до образца и дополнительная задача, текст без li, ul вместо ol, номера руками, мало
// пунктов, не та строка, страница без заголовка, «Назад» сохраняет код и карту. Шаги — в странице.

const STEPS = [
  { name: 's1: сохранение — теги пропали', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a3-tab.is-ok').length === 4 && !!qa.q('.a3-ul'), 'до сохранения вкладки горят, на странице список');
    await qa.click('.a3-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a3-tab.is-off').length === 4, 5000, 'вкладки погасли');
    qa.expect(!qa.q('.a3-list') && qa.qa('.a3-blk').length === 1, 'честно: пункты слиплись в одну строку');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: слово в пустом li', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const w1 = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    qa.expect(qa.qa('.a3-ul > li').length === 2, 'в меню два пункта');
    qa.type('.kz-gap textarea', w1, 'пункт');
    await qa.sleep(200);
    qa.expect(qa.qa('.a3-ul > li').length === 3 && qa.text('.a3-ul').indexOf(w1) >= 0, 'пункт с точкой на странице сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: строка li', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a3-tab.is-ok').length === 1, 'первая вкладка горит');
    const w2 = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    qa.type('.a3-ta', '    <li>' + w2 + '</li>', 'строка');
    await qa.sleep(200);
    qa.expect(qa.qa('.a3-ul > li').length === 3, 'три пункта с точками');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: список ol', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.a3-list'), 'списка пока нет');
    qa.type('.a3-ta', '  <ol>\n    <li>Смешай муку</li>\n    <li>Добавь яйца</li>\n    <li>Испеки</li>\n  </ol>', 'список');
    await qa.sleep(200);
    qa.expect(qa.qa('.a3-ol > li').length === 3, 'три пункта с номерами сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: номер, вписанный руками', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/^\s*2\./.test(qa.qa('.a3-ol > li')[1].textContent), 'честно: во втором пункте свой номер «2.» — на странице «2. 2.»');
    await qa.clickNth('.a3-tap', 4, 'строка с номером');
    await qa.waitFor(() => qa.q('.a3-ta'), 3000, 'строка стала полем');
    const v = qa.q('.a3-ta').value;
    qa.type('.a3-ta', v.replace(/<li>\s*\d+\.\s*/, '<li>'), 'убрать номер');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.qa('.a3-ol > li').some((li) => /^\s*\d/.test(li.textContent)), 'у каждого шага один номер');
  } },
  { name: 't5: свой список', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a3-ta', '<h1>Игры & подарки</h1>\n<ul>\n  <li>Футбол</li>\n  <li>Шахматы</li>\n</ul>', 'два пункта');
    await qa.sleep(200);
    qa.expect(qa.qa('.a3-tree-r.is-ok').length === 3, 'схема отмечает body, h1 и список');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet'), 3000, 'ответ');
    qa.expect(!qa.q('.b-sheet.is-ok') && /2/.test(qa.text('.b-sheet p')), 'два пункта — мало (в причине — число пунктов)');
    qa.type('.a3-ta', '<h1>Игры & подарки</h1>\n<ul>\n  <li>Футбол</li>\n  <li>Шахматы</li>\n  <li>Прятки</li>\n</ul>', 'список');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(/Игры & подарки/.test(qa.text('.a3-h1')), 'свой заголовок, & — как текст');
  } },
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить практику»');
    qa.expect(qa.qa('.a3-tab.is-ok').length === 4 && !qa.q('.a3-fav.is-off'), 'все пять вкладок горят');
    qa.expect(qa.qa('.a3-ul > li').length === 3, 'на открытой вкладке — свой список');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Игры & подарки' && /<h1>Игры &amp; подарки<\/h1>/.test(a.html) && /<li>Прятки<\/li>/.test(a.html) && a.items.length === 3,
      'артефакт — свой список, текст экранирован', { a });
  } }
];
export default {
  title: 'Практика 3 курса HTML «Праздник Коди» (облик «Редактор»)',
  file: 'html/03p-spiski',
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
      qa.type('.kz-gap textarea', 'Чай', 'Чай'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.type('.kz-gap textarea', '<b>', '<b>'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/Чай/.test(one) && /скоб/.test(two) && /li/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });} }] },
    { name: 't2: лампочка до образца → дополнительная задача; текст без li', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a3-ta', '    Шарики', 'без li'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не внутри li/.test(qa.text('.b-sheet p')), 3000, 'причина: текст без li');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a3-sample'), 3000, 'образец третьей ступени');
      qa.type('.a3-ta', '    <li>Шарики</li>', 'строка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.a3-ta', '    <li>Конфетти</li>', 'Конфетти'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: ul вместо ol, номера руками, два пункта', start: 3, langs: ['ru'], steps: [{ name: 't3: правила списка', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a3-ta', '<ul><li>Мука</li><li>Яйца</li><li>Печь</li></ul>', 'ul'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /нужен ol/.test(qa.text('.b-sheet p')), 3000, 'шаги — ol');
      qa.type('.a3-ta', '<ol><li>1. Мука</li><li>2. Яйца</li><li>3. Печь</li></ol>', 'номера руками'); await qa.sleep(200);
      qa.expect(/^\s*1\./.test(qa.qa('.a3-ol > li')[0].textContent), 'браузер честно показывает второй номер');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /номер руками/.test(qa.text('.b-sheet p')), 3000, 'номера ставит ol');
      qa.type('.a3-ta', '<ol><li>Мука</li><li>Яйца</li></ol>', 'два пункта'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /трёх/.test(qa.text('.b-sheet p')), 3000, 'не меньше трёх');} }] },
    { name: 't4: не та строка → причина', start: 4, langs: ['ru'], steps: [{ name: 't4: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a3-tap', 3, 'первый шаг'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a3-ta') && /два номера/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — где два номера');} }] },
    { name: 't5: список без заголовка → h1', start: 5, langs: ['ru'], steps: [{ name: 't5: порядок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a3-ta', '<ul><li>Футбол</li><li>Шахматы</li><li>Прятки</li></ul>', 'без h1'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /начинается с заголовка/.test(qa.text('.b-sheet p')), 3000, 'причина: сначала h1');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1], 'пункт'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a3-ta', '    <li>Ша', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<li>Ша/.test(qa.q('.a3-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a3-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
