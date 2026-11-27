// Сценарий проверки практики к уроку 7, ЧАСТЬ 1 lessons/html/07p1-formy-vybor.jsx («Лагерь Коди»: select, option и
// textarea; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: «Сохранить» (у июля стёрлось
// имя тега — пункт пропал из списка), четыре страницы (имя тега option, input → textarea, select с тремя option,
// найти слово в select без option), вывод; onFinished один раз, артефакт — страница «Sport» с select из трёх option.
// Ветки: причина в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача,
// li вместо option, слово без option, input оставлен, textarea не закрыт, type у textarea, чужой placeholder,
// не та строка, «Назад» сохраняет код и карту. Шаги — в странице.

const STEPS = [
  { name: 's1: сохранение — пункт пропал', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-tab.is-ok').length === 3 && qa.qa('.a7-opt').length === 3, 'до сохранения вкладки горят, в списке три месяца');
    await qa.click('.a7-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a7-tab.is-off').length === 3, 5000, 'вкладки погасли');
    qa.expect(qa.qa('.a7-opt').length === 2, 'честно: без имени тега пункт не попал в список');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: имя тега option', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-opt').length === 2, 'пока имени тега нет — в списке два пункта');
    qa.type('.kz-gap textarea', 'option', 'имя тега');
    await qa.sleep(200);
    qa.expect(qa.qa('.a7-opt').length === 3, 'пункт вернулся сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: input → textarea', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-tab.is-ok').length === 1, 'первая вкладка горит');
    qa.expect(qa.qa('.a7-in').length === 1 && !qa.q('.a7-tx'), 'честно: на странице поле в одну строку');
    const ph = /placeholder="([^"]*)"/.exec(qa.q('.a7-ta').value)[1];
    qa.type('.a7-ta', '    <textarea placeholder="' + ph + '"></textarea>', 'textarea');
    await qa.sleep(200);
    qa.expect(qa.qa('.a7-tx').length === 1 && !qa.q('.a7-doc .a7-in'), 'на странице большое поле сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: select с тремя option', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a7-ta', '    <select>\n' + ws.map((w) => '      <option>' + w + '</option>').join('\n') + '\n    </select>', 'список');
    await qa.sleep(200);
    qa.expect(qa.qa('.a7-opt').length === 3, 'в раскрытом списке три пункта');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: слово без option', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-opt').length === 1, 'честно: слово без option в список не попало');
    await qa.clickNth('.a7-tap', 5, 'строка со словом');
    await qa.waitFor(() => qa.q('.a7-ta'), 3000, 'строка стала полем');
    const w = qa.q('.a7-ta').value.trim();
    qa.type('.a7-ta', '    <option>' + w + '</option>', 'слово в option');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.a7-opt').length === 2, 'в списке две оценки');
  } },
  { name: 'e1: вывод', shot: 'e1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.a7-tab.is-ok').length === 3 && !qa.q('.a7-fav.is-off'), 'все четыре вкладки горят');
    qa.expect(qa.qa('.a7-doc .a7-tx').length === 1 && !qa.q('.a7-doc .a7-btn'), 'на странице список и большое поле, кнопки нет (кнопка — часть 2)');
  } },
  { name: 'e1: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Спорт' && Array.isArray(a.options) && a.options.length === 3 && a.button === ''
      && /<h1>Спорт<\/h1>/.test(a.html) && /<option>Плавание<\/option>/.test(a.html),
      'артефакт — страница со списком из трёх option', { a });
  } }
];
export default {
  title: 'Практика 7, часть 1, курса HTML «Лагерь Коди: select, option и textarea» (облик «Редактор»)',
  file: 'html/07p1-formy-vybor',
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
    { name: 't1: li → причина, вторая неудача → подсказка; select', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'li', 'li'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.type('.kz-gap textarea', 'select', 'select'); await qa.sleep(200);
      qa.expect(qa.qa('.a7-opt').length === 2, 'браузер честно: пункта по-прежнему нет');
      await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/li/.test(one) && /option/.test(one) && /весь список/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });} }] },
    { name: 't2: input остался, textarea не закрыт, type, чужой placeholder, слова', start: 2, langs: ['ru'], steps: [{ name: 't2: ветки', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      qa.expect(/на одну строку/.test(qa.text('.b-sheet p')) && /textarea/.test(qa.text('.b-sheet p')), 'input остался: он на одну строку, нужен textarea');
      const ph = /placeholder="([^"]*)"/.exec(qa.q('.a7-ta').value)[1];
      qa.type('.a7-ta', '    <textarea placeholder="' + ph + '">', 'textarea не закрыт'); await qa.sleep(200);
      qa.expect(qa.qa('.a7-tx').length === 1 && /<\/form>/.test(qa.text('.a7-doc .a7-tx')), 'честно: без закрывающего тега код ниже — текст в поле');
      await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/textarea не закрыт/.test(qa.text('.b-sheet p')), 'причина: textarea не закрыт');
      qa.type('.a7-ta', '    <textarea type="text" placeholder="' + ph + '"></textarea>', 'type'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Атрибут type — для input/.test(qa.text('.b-sheet p')), 'type у textarea не нужен');
      qa.type('.a7-ta', '    <textarea placeholder="Другое"></textarea>', 'чужой placeholder'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Подсказка placeholder в поле должна остаться прежней/.test(qa.text('.b-sheet p')), 'placeholder менять нельзя');} }] },
    { name: 't2: лампочка до образца → дополнительная задача', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a7-sample'), 3000, 'образец третьей ступени');
      const ph = /placeholder="([^"]*)"/.exec(qa.q('.a7-ta').value)[1];
      qa.type('.a7-ta', '    <textarea placeholder="' + ph + '"></textarea>', 'textarea'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.expect(qa.qa('.a7-in').length === 1 && !qa.q('.a7-doc .a7-tx'), 'в дополнительной задаче — снова поле в одну строку');
      const ph2 = /placeholder="([^"]*)"/.exec(qa.q('.a7-ta').value)[1];
      qa.type('.a7-ta', '    <textarea placeholder="' + ph2 + '"></textarea>', 'textarea'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: слово без option, li вместо option', start: 3, langs: ['ru'], steps: [{ name: 't3: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a7-ta', '<select>\nФутбол\n</select>', 'слово без option'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /без тега option/.test(qa.text('.b-sheet p')), 3000, 'слово без option не в списке');
      qa.type('.a7-ta', '<select>\n<li>Футбол</li>\n</select>', 'li'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /обычного списка/.test(qa.text('.b-sheet p')), 3000, 'li — для обычного списка');} }] },
    { name: 't4: не та строка; лампочка → дополнительная задача (Klublar)', start: 4, langs: ['ru'], steps: [{ name: 't4: дополнительная', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a7-tap', 4, 'пункт выше'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a7-ta') && /ниже/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — ниже');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.clickNth('.a7-tap', 5, 'строка со словом');
      await qa.waitFor(() => qa.q('.a7-ta'), 3000, 'строка стала полем');
      qa.type('.a7-ta', '    <option>' + qa.q('.a7-ta').value.trim() + '</option>', 'слово в option'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(qa.qa('.a7-opt').length === 2 && /Кружки/.test(qa.text('.kz-br-tab.is-cur')) , 'в дополнительной задаче — страница кружков, слово посреди списка без option');
      await qa.clickNth('.a7-tap', 4, 'пункт с option'); await qa.waitFor(() => /Ищи слово без option/.test(qa.text('.b-sheet p')), 3000, 'причина для пункта с option');
      await qa.clickNth('.a7-tap', 5, 'строка со словом'); await qa.waitFor(() => qa.q('.a7-ta'), 3000, 'строка стала полем');
      qa.type('.a7-ta', '    <option>' + qa.q('.a7-ta').value.trim() + '</option>', 'слово в option'); await qa.sleep(200);
      qa.expect(qa.qa('.a7-opt').length === 3, 'в списке кружков три пункта сразу при наборе');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'option', 'имя тега'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a7-ta', '    <textarea placeholder="Мой', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<textarea placeholder="Мой/.test(qa.q('.a7-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a7-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
