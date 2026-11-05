// Сценарий проверки практики к уроку 6 курса HTML lessons/html/06p-formy-vvod.jsx («Анкеты Коди»,
// облик «Редактор», 04.11.2026, на основе 05p).
// Основной путь: 7 слайдов действиями ученика — сохранение (стёрся вид поля, пароль виден всем), пять анкет
// (вид поля в type, строка input с type и placeholder, label с подписью и полем, найти поле пароля с type text
// и placeholder «Пароль», своя анкета: h1, form, два label), вывод; onFinished один раз, артефакт — своя анкета.
// Ветки: причина в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача,
// </input>, опечатка placehoder, подпись в p, поле снаружи label, не та строка, поля без form, «Назад» хранит код
// и карту. Шаги — в странице.

const STEPS = [
  { name: 's1: сохранение — пароль виден всем', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a6-tab.is-ok').length === 4 && /•••/.test(qa.text('.a6-doc')), 'до сохранения вкладки горят, пароль за точками');
    await qa.click('.a6-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a6-tab.is-off').length === 4, 5000, 'вкладки погасли');
    qa.expect(/gol2026/.test(qa.text('.a6-doc')), 'честно: без type пароль виден');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: вид поля в type', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/gol2026/.test(qa.text('.a6-doc')), 'пока type пустой — пароль виден');
    qa.type('.kz-gap textarea', 'password', 'вид поля');
    await qa.sleep(200);
    qa.expect(!/gol2026/.test(qa.text('.a6-doc')) && /•••/.test(qa.text('.a6-doc')), 'пароль спрятался сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: строка input', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a6-tab.is-ok').length === 1, 'первая вкладка горит');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a6-ta', '      <input type="' + ws[0] + '" placeholder="' + ws[1] + '">', 'строка');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a6-in-ph'), 'серая подсказка в поле сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: label с полем', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a6-ta', '    <label>' + ws[0] + ' <input type="' + ws[1] + '"></label>', 'label');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a6-in.is-num'), 'поле для числа со стрелками');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: пароль через placeholder', shot: 't4-done', run: async (qa) => {
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
  { name: 't5: своя анкета', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
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
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить практику»');
    qa.expect(qa.qa('.a6-tab.is-ok').length === 4 && !qa.q('.a6-fav.is-off'), 'все пять вкладок горят');
    qa.expect(/Клуб & друзья/.test(qa.text('.a6-h1')) && !!qa.q('.a6-in-ph'), 'на открытой вкладке — своя анкета с подсказкой');
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
  title: 'Практика 6 курса HTML «Анкеты Коди» (облик «Редактор»)',
  file: 'html/06p-formy-vvod',
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
    { name: 't1: text → причина, вторая неудача → подсказка; незнакомый вид', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'text', 'text'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.type('.kz-gap textarea', 'pasword', 'опечатка'); await qa.sleep(200);
      qa.expect(/gol2026/.test(qa.text('.a6-doc')), 'браузер честно: незнакомый вид — обычное поле');
      await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/password/.test(one) && /pasword/.test(two) && /type/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });} }] },
    { name: 't2: </input>, placehoder; лампочка до образца → дополнительная задача', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
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
    { name: 't3: подпись в p, поле снаружи label', start: 3, langs: ['ru'], steps: [{ name: 't3: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a6-ta', '<p>Возраст:</p>\n<input type="number">', 'подпись в p'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не связана/.test(qa.text('.b-sheet p')), 3000, 'подпись в p не связана с полем');
      qa.type('.a6-ta', '<label>Возраст:</label>\n<input type="number">', 'поле снаружи'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /снаружи label/.test(qa.text('.b-sheet p')), 3000, 'поле снаружи label');} }] },
    { name: 't4: не та строка → причина', start: 4, langs: ['ru'], steps: [{ name: 't4: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a6-tap', 3, 'поле имени'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a6-ta') && /ниже/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — ниже');} }] },
    { name: 't5: поля без form → причина', start: 5, langs: ['ru'], steps: [{ name: 't5: form', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a6-ta', '<h1>Мой клуб</h1>\n<label>Ник: <input type="text"></label>', 'без form'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /внутри form/.test(qa.text('.b-sheet p')), 3000, 'поля — внутри form');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'password', 'вид'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a6-ta', '      <input type="te', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<input type="te/.test(qa.q('.a6-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a6-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
