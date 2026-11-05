// Сценарий проверки практики к уроку 7 курса HTML lessons/html/07p-formy-vybor.jsx («Лагерь Коди»,
// облик «Редактор», 04.11.2026, на основе 06p).
// Основной путь: 7 слайдов действиями ученика — сохранение (у июля стёрлось имя тега — пункт пропал из списка),
// пять анкет (имя тега option, строка кнопки button, select с тремя option, найти слово в select без option,
// своя анкета: h1, form, select, textarea, button), вывод; onFinished один раз, артефакт — своя анкета.
// Ветки: причина в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача
// (незакрытый textarea: код кнопки — текст в поле), li вместо option, слово без option, незакрытая кнопка,
// не та строка, поля без form, «Назад» хранит код и карту. Шаги — в странице.

const STEPS = [
  { name: 's1: сохранение — пункт пропал', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-tab.is-ok').length === 4 && qa.qa('.a7-opt').length === 3, 'до сохранения вкладки горят, в списке три месяца');
    await qa.click('.a7-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a7-tab.is-off').length === 4, 5000, 'вкладки погасли');
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
  { name: 't2: строка button', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-tab.is-ok').length === 1, 'первая вкладка горит');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a7-ta', '    <button>' + ws[0] + '</button>', 'кнопка');
    await qa.sleep(200);
    qa.expect(qa.text('.a7-btn') === ws[0], 'кнопка с надписью на странице сразу');
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
  { name: 't5: своя анкета', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const SEL = '<select>\n<option>Рисование</option>\n<option>Музыка</option>\n</select>\n';
    qa.type('.a7-ta', '<h1>Мой кружок & друзья</h1>\n<form>\n' + SEL + '<textarea>\n<button>Записаться</button>\n</form>', 'незакрытый textarea');
    await qa.sleep(200);
    qa.expect(/<button>/.test(qa.text('.a7-doc .a7-tx')) && !qa.q('.a7-doc .a7-btn'), 'честно: без </textarea> код кнопки — текст в поле');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина: textarea не закрыт');
    qa.expect(/textarea/.test(qa.text('.b-sheet p')), 'в причине — textarea');
    qa.type('.a7-ta', '<h1>Мой кружок & друзья</h1>\n<form>\n' + SEL + '<textarea placeholder="О себе"></textarea>\n<button>Записаться</button>\n</form>', 'анкета');
    await qa.sleep(200);
    qa.expect(qa.qa('.a7-tree-r.is-ok').length === 6, 'схема отмечает body, h1, form, select, textarea и button');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить практику»');
    qa.expect(qa.qa('.a7-tab.is-ok').length === 4 && !qa.q('.a7-fav.is-off'), 'все пять вкладок горят');
    qa.expect(/Мой кружок & друзья/.test(qa.text('.a7-h1')) && qa.text('.a7-btn') === 'Записаться', 'на открытой вкладке — своя анкета с кнопкой');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Мой кружок & друзья' && Array.isArray(a.options) && a.options.length === 2 && a.button === 'Записаться'
      && /<h1>Мой кружок &amp; друзья<\/h1>/.test(a.html) && /<option>Музыка<\/option>/.test(a.html) && /<textarea placeholder="О себе"><\/textarea>/.test(a.html),
      'артефакт — своя анкета, текст экранирован', { a });
  } }
];
export default {
  title: 'Практика 7 курса HTML «Лагерь Коди» (облик «Редактор»)',
  file: 'html/07p-formy-vybor',
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
    { name: 't2: input, незакрытая кнопка; лампочка до образца → дополнительная задача', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a7-ta', '    <input type="button">', 'input'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /делает тег button/.test(qa.text('.b-sheet p')), 3000, 'причина: кнопку делает button');
      qa.type('.a7-ta', '    <button>Отправить', 'без закрывающего'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не закрыта/.test(qa.text('.b-sheet p')), 3000, 'причина: button не закрыт');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a7-sample'), 3000, 'образец третьей ступени');
      qa.type('.a7-ta', '    <button>Отправить</button>', 'кнопка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.a7-ta', '    <button>Сохранить</button>', 'сохранить'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: слово без option, li вместо option', start: 3, langs: ['ru'], steps: [{ name: 't3: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a7-ta', '<select>\nФутбол\n</select>', 'слово без option'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /без тега option/.test(qa.text('.b-sheet p')), 3000, 'слово без option не в списке');
      qa.type('.a7-ta', '<select>\n<li>Футбол</li>\n</select>', 'li'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /обычного списка/.test(qa.text('.b-sheet p')), 3000, 'li — для обычного списка');} }] },
    { name: 't4: лампочка → дополнительная задача: незакрытый textarea', start: 4, langs: ['ru'], steps: [{ name: 't4: textarea', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a7-tap', 4, 'пункт выше'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a7-ta') && /ниже/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — ниже');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.clickNth('.a7-tap', 5, 'строка со словом');
      await qa.waitFor(() => qa.q('.a7-ta'), 3000, 'строка стала полем');
      qa.type('.a7-ta', '    <option>' + qa.q('.a7-ta').value.trim() + '</option>', 'слово в option'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(/<button>/.test(qa.text('.a7-tx')) && !qa.q('.a7-btn'), 'честно: без </textarea> кнопка — текст в поле');
      await qa.clickNth('.a7-tap', 3, 'строка textarea');
      await qa.waitFor(() => qa.q('.a7-ta'), 3000, 'строка стала полем');
      qa.type('.a7-ta', qa.q('.a7-ta').value + '</textarea>', 'закрыть textarea'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't5: поля без form → причина', start: 5, langs: ['ru'], steps: [{ name: 't5: form', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a7-ta', '<h1>Мой кружок</h1>\n<button>Ок</button>', 'без form'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /внутри form/.test(qa.text('.b-sheet p')), 3000, 'список, поле и кнопка — внутри form');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'option', 'имя тега'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a7-ta', '    <butt', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<butt/.test(qa.q('.a7-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a7-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
