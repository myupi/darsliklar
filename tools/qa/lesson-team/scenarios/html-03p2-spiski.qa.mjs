// Сценарий проверки практики к уроку 3, ЧАСТЬ 2 lessons/html/03p2-spiski.jsx («Праздник Коди»: ul или ol и свой
// список; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: «Перемешать» (у гостей смысл
// тот же, у программы сломался), четыре страницы (поменять ul на ol в программе, обернуть пункты гостей списком, найти
// пункт без li, свой список: h1 и ul или ol), вывод; onFinished один раз, артефакт — свой список. Ветки: причина в
// панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача, ul вместо ol, ol вместо
// ul, ol…/ul, пункты без списка, не та строка, страница без заголовка, «Назад» сохраняет код и карту. Шаги — в странице.

const STEPS = [
  { name: 'h2: «Перемешать»', shot: 'h2-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a3-tab.is-ok').length === 3 && qa.qa('.a3-ul > li').length === 2 && qa.qa('.a3-ol > li').length === 2, 'четыре вкладки горят, на странице два списка');
    const g0 = qa.qa('.a3-ul > li')[0].textContent, p0 = qa.qa('.a3-ol > li')[0].textContent;
    await qa.click('.a3-publish', 'Перемешать');
    await qa.waitFor(() => qa.qa('.a3-ol > li')[0].textContent !== p0, 5000, 'пункты поменялись местами');
    qa.expect(qa.qa('.a3-ul > li')[1].textContent === g0 && qa.qa('.a3-ol > li')[1].textContent === p0, 'оба списка перемешаны: первый пункт стал вторым');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');
  } },
  { name: 't1: поменять ul на ol', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a3-ul > li').length === 3 && !qa.q('.a3-ol'), 'в программе список с точками');
    const words = qa.qa('.a3-ul > li').map((li) => li.textContent);
    qa.expect(!!qa.q('.a3-rule'), 'правило «если поменять местами…» видно сразу');
    qa.type('.a3-ta', '  <ol>\n' + words.map((w) => '    <li>' + w + '</li>').join('\n') + '\n  </ol>', 'ol');
    await qa.sleep(200);
    qa.expect(qa.qa('.a3-ol > li').length === 3, 'номера на странице сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: обернуть пункты списком', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a3-tab.is-ok').length === 1, 'первая вкладка горит');
    qa.expect(qa.qa('.a3-loose > li').length === 3 && !qa.q('.a3-ul'), 'честно: пункты без списка (li сам по себе)');
    const words = qa.qa('.a3-loose > li').map((li) => li.textContent);
    qa.type('.a3-ta', '  <ul>\n' + words.map((w) => '    <li>' + w + '</li>').join('\n') + '\n  </ul>', 'ul');
    await qa.sleep(200);
    qa.expect(qa.qa('.a3-ul > li').length === 3 && !qa.q('.a3-loose'), 'настоящий список с точками');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: пункт без li', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a3-tab.is-ok').length === 2, 'две вкладки горят');
    qa.expect(qa.qa('.a3-ul > li').length === 2 && qa.qa('.a3-bare').length === 1, 'честно: у одного пункта нет li — он без точки');
    const word = qa.text('.a3-bare');
    await qa.clickNth('.a3-tap', 4, 'строка пункта без точки');
    await qa.waitFor(() => qa.q('.a3-ta'), 3000, 'строка стала полем');
    qa.type('.a3-ta', '    <li>' + word + '</li>', 'li вокруг слова');
    await qa.sleep(200);
    qa.expect(qa.qa('.a3-ul > li').length === 3 && !qa.q('.a3-bare'), 'у всех подарков точки сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: свой список', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a3-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
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
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.a3-tab.is-ok').length === 3 && !qa.q('.a3-fav.is-off'), 'все четыре вкладки горят');
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
  title: 'Практика 3, часть 2, курса HTML «Праздник Коди: ul или ol и свой список» (облик «Редактор»)',
  file: 'html/03p2-spiski',
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
    { name: 't1: ul остался → порядок; ol…/ul → закрывается тем же; слова; подсказка после второй неудачи', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.expect(/порядок/.test(one) && !qa.platform.nextEnabled(), 'ul остался: здесь важен порядок', { one });
      const v = qa.q('.a3-ta').value;
      qa.type('.a3-ta', v.replace('<ul>', '<ol>'), 'ol…/ul'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/открыт тегом ol/.test(two) && /ol/.test(two), 'вторая неудача: причина про закрывающий тег и ступень подсказки', { two });
      qa.type('.a3-ta', '  <ol>\n    <li>Один</li>\n    <li>Два</li>\n    <li>Три</li>\n  </ol>', 'другие слова'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Слова пусть остаются/.test(qa.text('.b-sheet p')), 'слова менять нельзя');} }] },
    { name: 't1: лампочка до образца → дополнительная задача', start: 1, langs: ['ru'], steps: [{ name: 't1: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a3-sample'), 3000, 'образец третьей ступени');
      const words = qa.qa('.a3-ul > li').map((li) => li.textContent);
      qa.type('.a3-ta', '  <ol>\n' + words.map((w) => '    <li>' + w + '</li>').join('\n') + '\n  </ol>', 'ol'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      const w2 = qa.qa('.a3-ul > li').map((li) => li.textContent);
      qa.expect(w2.length === 3 && /Свеч|свеч|Поставь торт/.test(w2.join(' ')), 'в дополнительной задаче — список со свечами');
      qa.type('.a3-ta', '  <ol>\n' + w2.map((w) => '    <li>' + w + '</li>').join('\n') + '\n  </ol>', 'ol'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't2: ol вместо ul → про гостей; без списка → li живёт в списке; другие слова', start: 2, langs: ['ru'], steps: [{ name: 't2: ветки', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      qa.expect(/li живёт внутри списка/.test(qa.text('.b-sheet p')), 'пункты без списка: li живёт внутри списка');
      const words = qa.qa('.a3-loose > li').map((li) => li.textContent);
      qa.type('.a3-ta', '  <ol>\n' + words.map((w) => '    <li>' + w + '</li>').join('\n') + '\n  </ol>', 'ol'); await qa.sleep(200);
      qa.expect(qa.qa('.a3-ol > li').length === 3, 'на странице гости с номерами — видно, что странно');
      await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Друзей и соседей/.test(qa.text('.b-sheet p')) && /ul/.test(qa.text('.b-sheet p')), 'ol вместо ul: порядок гостей не важен');
      qa.type('.a3-ta', '  <ul>\n    <li>Один</li>\n    <li>Два</li>\n    <li>Три</li>\n  </ul>', 'другие слова'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Слова пусть остаются/.test(qa.text('.b-sheet p')), 'слова менять нельзя');
      qa.type('.a3-ta', '  <ul>\n' + words.map((w) => '    <li>' + w + '</li>').join('\n'), 'ul не закрыт'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/ul не закрыт/.test(qa.text('.b-sheet p')), 'не закрыт ul');} }] },
    { name: 't2: дополнительная — шаги упаковки → ol', start: 2, langs: ['ru'], steps: [{ name: 't2: ещё разок', run: async (qa) => {
      await qa.platform.ready();
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a3-sample'), 3000, 'образец третьей ступени');
      const w1 = qa.qa('.a3-loose > li').map((li) => li.textContent);
      qa.type('.a3-ta', '  <ul>\n' + w1.map((w) => '    <li>' + w + '</li>').join('\n') + '\n  </ul>', 'ul'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      const w2 = qa.qa('.a3-loose > li').map((li) => li.textContent);
      qa.type('.a3-ta', '  <ul>\n' + w2.map((w) => '    <li>' + w + '</li>').join('\n') + '\n  </ul>', 'ul вместо ol'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /нужен ol/.test(qa.text('.b-sheet p')), 3000, 'у шагов важен порядок: нужен ol');
      qa.type('.a3-ta', '  <ol>\n' + w2.map((w) => '    <li>' + w + '</li>').join('\n') + '\n  </ol>', 'ol'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: не та строка → причина; дополнительная задача', start: 3, langs: ['ru'], steps: [{ name: 't3: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a3-tap', 3, 'первый подарок'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a3-ta') && /точка/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — у какого подарка нет точки');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a3-sample'), 3000, 'образец третьей ступени');
      const word = qa.text('.a3-bare');
      await qa.clickNth('.a3-tap', 4, 'строка пункта без точки'); await qa.waitFor(() => qa.q('.a3-ta'), 3000, 'строка стала полем');
      qa.type('.a3-ta', '    ' + word, 'слово без li'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не внутри li/.test(qa.text('.b-sheet p')), 3000, 'причина: слово без li');
      qa.type('.a3-ta', '    <li>Другое</li>', 'другое слово'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Слово пусть остаётся/.test(qa.text('.b-sheet p')), 3000, 'слово менять нельзя');
      qa.type('.a3-ta', '    <li>' + word + '</li>', 'li вокруг слова'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(qa.qa('.a3-ol > li').length === 2 && qa.qa('.a3-bare').length === 1, 'в дополнительной задаче — список ol, у одного шага нет li и номера');
      const w2 = qa.text('.a3-bare');
      await qa.clickNth('.a3-tap', 4, 'строка шага без номера'); await qa.waitFor(() => qa.q('.a3-ta'), 3000, 'строка стала полем');
      qa.type('.a3-ta', '    <li>' + w2 + '</li>', 'li'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't4: список без заголовка → h1', start: 4, langs: ['ru'], steps: [{ name: 't4: порядок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a3-ta', '<ul><li>Футбол</li><li>Шахматы</li><li>Прятки</li></ul>', 'без h1'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /начинается с заголовка/.test(qa.text('.b-sheet p')), 3000, 'причина: сначала h1');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      const words = qa.qa('.a3-ul > li').map((li) => li.textContent);
      qa.type('.a3-ta', '  <ol>\n' + words.map((w) => '    <li>' + w + '</li>').join('\n') + '\n  </ol>', 'ol'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a3-ta', '  <ul>\n    <li>Дру', 'начало списка'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<li>Дру/.test(qa.q('.a3-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a3-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
