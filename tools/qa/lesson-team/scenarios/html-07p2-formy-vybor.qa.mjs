// Сценарий проверки практики к уроку 7, ЧАСТЬ 2 lessons/html/07p2-formy-vybor.jsx («Лагерь Коди»: button и своя
// анкета; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: «Сохранить» (строка кнопки
// стёрлась — кнопка пропала со страницы), четыре страницы (строка button, textarea и button, найти строку, проглотившую
// кнопку, своя анкета: h1, form, select, textarea, button), вывод; onFinished один раз, артефакт — своя анкета.
// Ветки: причина в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача, input
// вместо button, незакрытая кнопка, нет кнопки / кнопка раньше поля / чужой placeholder, незакрытый textarea, не та
// строка, поля без form, «Назад» сохраняет код и карту. Шаги — в странице.

const STEPS = [
  { name: 'h2: «Сохранить» — кнопка пропала', shot: 'h2-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-tab.is-ok').length === 3 && qa.qa('.a7-doc .a7-btn').length === 1, 'до сохранения вкладки горят, на странице есть кнопка');
    await qa.click('.a7-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a7-tab.is-off').length === 3, 5000, 'вкладки погасли');
    qa.expect(!qa.q('.a7-doc .a7-btn') && qa.qa('.a7-doc .a7-in').length === 1, 'честно: кнопка пропала, поле для имени осталось');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');
  } },
  { name: 't1: строка button', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-tab.is-ok').length === 0, 'ни одна вкладка ещё не горит');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a7-ta', '    <button>' + ws[0] + '</button>', 'кнопка');
    await qa.sleep(200);
    qa.expect(qa.text('.a7-btn') === ws[0], 'кнопка с надписью на странице сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't2: textarea и button', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-tab.is-ok').length === 1, 'первая вкладка горит');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a7-ta', '    <textarea placeholder="' + ws[0] + '">\n    <button>' + ws[1] + '</button>', 'textarea не закрыт');
    await qa.sleep(200);
    qa.expect(/<button>/.test(qa.text('.a7-doc .a7-tx')) && !qa.q('.a7-doc .a7-btn'), 'честно: без закрывающего textarea код кнопки — текст в поле');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина: textarea не закрыт');
    qa.expect(/textarea/.test(qa.text('.b-sheet p')), 'в причине — textarea');
    qa.type('.a7-ta', '    <textarea placeholder="' + ws[0] + '"></textarea>\n    <button>' + ws[1] + '</button>', 'поле и кнопка');
    await qa.sleep(200);
    qa.expect(qa.qa('.a7-doc .a7-tx').length === 1 && qa.text('.a7-doc .a7-btn') === ws[1], 'на странице большое поле и кнопка под ним');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: найти строку, проглотившую кнопку', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-tab.is-ok').length === 2, 'две вкладки горят');
    qa.expect(/<button>/.test(qa.text('.a7-doc .a7-tx')) && !qa.q('.a7-doc .a7-btn'), 'честно: код кнопки внутри поля, кнопки нет');
    await qa.clickNth('.a7-tap', 3, 'строка textarea');
    await qa.waitFor(() => qa.q('.a7-ta'), 3000, 'строка стала полем');
    qa.type('.a7-ta', qa.q('.a7-ta').value.trimEnd() + '</textarea>', 'закрыть textarea');
    await qa.sleep(200);
    qa.expect(qa.qa('.a7-doc .a7-btn').length === 1, 'кнопка вернулась на страницу сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: своя анкета', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a7-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
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
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.a7-tab.is-ok').length === 3 && !qa.q('.a7-fav.is-off'), 'все четыре вкладки горят');
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
  title: 'Практика 7, часть 2, курса HTML «Лагерь Коди: button и своя анкета» (облик «Редактор»)',
  file: 'html/07p2-formy-vybor',
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
    { name: 't1: input вместо button, незакрытая кнопка; лампочка до образца → дополнительная задача', start: 1, langs: ['ru'], steps: [{ name: 't1: образец и ещё разок', run: async (qa) => {
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
    { name: 't2: только поле, кнопка раньше поля, чужой placeholder, чужая надпись', start: 2, langs: ['ru'], steps: [{ name: 't2: ветки', run: async (qa) => {
      await qa.platform.ready();
      const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
      qa.type('.a7-ta', '    <textarea placeholder="' + ws[0] + '"></textarea>', 'только поле'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Последний шаг/.test(qa.text('.b-sheet p')), 3000, 'причина: нужна кнопка');
      qa.type('.a7-ta', '    <button>' + ws[1] + '</button>\n    <textarea placeholder="' + ws[0] + '"></textarea>', 'кнопка раньше поля'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Кнопка стоит в конце/.test(qa.text('.b-sheet p')), 'кнопка — под полем');
      qa.type('.a7-ta', '    <textarea placeholder="Другое"></textarea>\n    <button>' + ws[1] + '</button>', 'чужой placeholder'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Подсказка placeholder в поле должна быть такой/.test(qa.text('.b-sheet p')), 'placeholder как в задании');
      qa.type('.a7-ta', '    <textarea placeholder="' + ws[0] + '"></textarea>\n    <button>Другая</button>', 'чужая надпись'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Надпись другая/.test(qa.text('.b-sheet p')), 'надпись кнопки как в задании');} }] },
    { name: 't2: лампочка до образца → дополнительная задача (Ovqat)', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a7-sample'), 3000, 'образец третьей ступени');
      const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
      qa.type('.a7-ta', '    <textarea placeholder="' + ws[0] + '"></textarea>\n    <button>' + ws[1] + '</button>', 'поле и кнопка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      const ws2 = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
      qa.expect(ws2.length >= 2, 'в дополнительной задаче названы placeholder и надпись', { ws2 });
      qa.type('.a7-ta', '    <textarea placeholder="Напиши о блюде"></textarea>\n    <button>Сохранить</button>', 'поле и кнопка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: не та строка → причина; дополнительная задача (Savollar)', start: 3, langs: ['ru'], steps: [{ name: 't3: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a7-tap', 4, 'строка кнопки'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a7-ta') && /внутрь поля/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — код кнопки попал внутрь поля');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a7-sample'), 3000, 'образец третьей ступени');
      await qa.clickNth('.a7-tap', 3, 'строка textarea'); await qa.waitFor(() => qa.q('.a7-ta'), 3000, 'строка стала полем');
      qa.type('.a7-ta', qa.q('.a7-ta').value.trimEnd() + '</textarea>', 'закрыть textarea'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(/<button>/.test(qa.text('.a7-doc .a7-tx')) && !qa.q('.a7-doc .a7-btn'), 'в дополнительной задаче — снова код кнопки в поле');
      await qa.clickNth('.a7-tap', 3, 'строка textarea'); await qa.waitFor(() => qa.q('.a7-ta'), 3000, 'строка стала полем');
      qa.type('.a7-ta', qa.q('.a7-ta').value.trimEnd() + '</textarea>', 'закрыть textarea'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't4: поля без form → причина', start: 4, langs: ['ru'], steps: [{ name: 't4: form', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a7-ta', '<h1>Мой кружок</h1>\n<button>Ок</button>', 'без form'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /внутри form/.test(qa.text('.b-sheet p')), 3000, 'список, поле и кнопка — внутри form');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a7-ta', '    <button>Отправить</button>', 'кнопка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a7-ta', '    <textarea placeholder="Напи', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<textarea placeholder="Напи/.test(qa.q('.a7-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a7-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
