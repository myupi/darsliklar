// Сценарий проверки практики к уроку 6, ЧАСТЬ 2 lessons/html/06p2-formy-vvod.jsx («Анкеты Коди»: placeholder, label и
// form; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: «Saqlash» (серые подсказки пропали,
// подписи отлетели от полей), четыре анкеты (строка input с type и placeholder, label с подписью и полем, найти поле
// пароля с type text и placeholder «Пароль», своя анкета: h1, form, два label), вывод; onFinished один раз, артефакт —
// своя анкета. Ветки: причина в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная
// задача, </input>, опечатка placehoder, подпись в p, поле снаружи label, не та строка, поля без form, «Назад» хранит
// код и карту. Шаги — в странице.

const STEPS = [
  { name: 'h2: «Saqlash» — подсказки пропали', shot: 'h2-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a6-tab.is-ok').length === 3 && qa.qa('.a6-in-ph').length === 2, 'четыре вкладки горят, в обоих полях серые подсказки');
    await qa.click('.a6-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a6-tab.is-off').length === 3, 5000, 'вкладки погасли');
    qa.expect(!qa.q('.a6-in-ph') && qa.qa('.a6-p').length === 2, 'честно: подсказок нет, подписи — отдельными абзацами над пустыми полями');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: строка input', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a6-tab.is-ok').length === 0, 'пока ни одна из четырёх вкладок не горит');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a6-ta', '      <input type="' + ws[0] + '" placeholder="' + ws[1] + '">', 'строка');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a6-in-ph'), 'серая подсказка в поле сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't2: label с полем', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a6-tab.is-ok').length === 1, 'первая вкладка горит');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a6-ta', '    <label>' + ws[0] + ' <input type="' + ws[1] + '"></label>', 'label');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a6-in.is-num'), 'поле для числа со стрелками');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: пароль через placeholder', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/rasm2026/.test(qa.text('.a6-doc')), 'честно: с type text пароль виден, placeholder не прячет');
    await qa.clickNth('.a6-tap', 4, 'строка пароля');
    await qa.waitFor(() => qa.q('.a6-ta'), 3000, 'строка стала полем');
    qa.type('.a6-ta', qa.q('.a6-ta').value.replace('type="text"', 'type="password"'), 'password вместо text');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!/rasm2026/.test(qa.text('.a6-doc')), 'пароль спрятался');
  } },
  { name: 't4: своя анкета', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a6-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
    qa.type('.a6-ta', '<h1>Клуб & друзья</h1>\n<form>\n<label>Ник: <input type="text"></label>\n<label>Пароль: <input type="password"></label>\n</form>', 'без подсказки');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина: нет серой подсказки');
    qa.expect(/placeholder/.test(qa.text('.b-sheet p')), 'в причине — placeholder');
    qa.type('.a6-ta', '<h1>Клуб & друзья</h1>\n<form>\n<label>Ник: <input type="text" placeholder="Например, Kodi"></label>\n<label>Пароль: <input type="password"></label>\n</form>', 'анкета');
    await qa.sleep(200);
    qa.expect(qa.qa('.a6-tree-r.is-ok').length === 5, 'схема отмечает body, h1, form и оба label');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.a6-tab.is-ok').length === 3 && !qa.q('.a6-fav.is-off'), 'все четыре вкладки горят');
    qa.expect(/Клуб & друзья/.test(qa.text('.a6-h1')) && !!qa.q('.a6-in-ph'), 'на открытой вкладке — своя анкета с подсказкой');
    qa.expect(qa.qa('.kz-role').length === 5 && /form/.test(qa.text('.a6-roles')), 'пять плашек: placeholder, label, form, type, своя анкета');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Клуб & друзья' && Array.isArray(a.fields) && a.fields.length === 2
      && /<h1>Клуб &amp; друзья<\/h1>/.test(a.html) && /<input type="password">/.test(a.html) && /placeholder="Например, Kodi"/.test(a.html),
      'артефакт — своя анкета, текст экранирован', { a });
  } }
];
export default {
  title: 'Практика 6, часть 2, курса HTML «Анкеты Коди: placeholder, label и form» (облик «Редактор»)',
  file: 'html/06p2-formy-vvod',
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
    { name: 't1: </input>, placehoder; лампочка до образца → дополнительная задача', start: 1, langs: ['ru'], steps: [{ name: 't1: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a6-ta', '      <input type="text" placeholder="Твоё имя"></input>', 'с </input>'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не закрывается/.test(qa.text('.b-sheet p')), 3000, 'причина: input не закрывается');
      qa.type('.a6-ta', '      <input type="text" placehoder="Твоё имя">', 'опечатка в атрибуте'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /placehoder/.test(qa.text('.b-sheet p')), 3000, 'причина: такого атрибута нет');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a6-sample'), 3000, 'образец третьей ступени');
      qa.type('.a6-ta', '      <input type="text" placeholder="Твоё имя">', 'строка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.a6-ta', '      <input type="number" placeholder="Твой возраст">', 'возраст'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't2: подпись в p, поле снаружи label', start: 2, langs: ['ru'], steps: [{ name: 't2: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a6-ta', '<p>Возраст:</p>\n<input type="number">', 'подпись в p'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не связана/.test(qa.text('.b-sheet p')), 3000, 'подпись в p не связана с полем');
      qa.type('.a6-ta', '<label>Возраст:</label>\n<input type="number">', 'поле снаружи'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /снаружи label/.test(qa.text('.b-sheet p')), 3000, 'поле снаружи label');} }] },
    { name: 't3: не та строка → причина', start: 3, langs: ['ru'], steps: [{ name: 't3: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a6-tap', 3, 'поле имени'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a6-ta') && /ниже/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — ниже');} }] },
    { name: 't4: поля без form → причина', start: 4, langs: ['ru'], steps: [{ name: 't4: form', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a6-ta', '<h1>Мой клуб</h1>\n<label>Ник: <input type="text"></label>', 'без form'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /внутри form/.test(qa.text('.b-sheet p')), 3000, 'поля — внутри form');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
      qa.type('.a6-ta', '      <input type="' + ws[0] + '" placeholder="' + ws[1] + '">', 'строка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a6-ta', '    <label>Воз', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<label>Воз/.test(qa.q('.a6-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a6-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
