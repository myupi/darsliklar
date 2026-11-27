// Сценарий проверки практики к уроку 6, ЧАСТЬ 1 lessons/html/06p1-formy-vvod.jsx («Анкеты Коди»: input и type; собрана
// tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: сохранение (стёрся вид поля, пароль виден всем),
// четыре анкеты (вписать значение в type, дописать атрибут type целиком, написать строку input с type, найти опечатку
// pasword в type и исправить), вывод части 1; onFinished один раз, артефакт — починенная анкета «Танцы». Ветки: причина в
// панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача, одно значение вместо
// атрибута, значение без кавычек, чужой вид, input с закрывающим тегом, не та строка, «Назад» сохраняет код и карту.
// В части 1 нет placeholder, label и form — ни в коде, ни на страницах. Шаги — в странице.

const STEPS = [
  { name: 's1: сохранение — пароль виден всем', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a6-tab.is-ok').length === 3 && /•••/.test(qa.text('.a6-doc')), 'четыре вкладки горят, пароль за точками');
    qa.expect(!/label|form|placeholder/.test(qa.text('.a6-main')), 'в коде части 1 нет label, form и placeholder');
    await qa.click('.a6-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a6-tab.is-off').length === 3, 5000, 'вкладки погасли');
    qa.expect(/gol2026/.test(qa.text('.a6-doc')), 'честно: без type пароль виден');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: значение в type', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/gol2026/.test(qa.text('.a6-doc')) && !/label|form|placeholder/.test(qa.text('.a6-kz')), 'пока type пустой — пароль виден; в коде нет label и form');
    qa.type('.kz-gap textarea', 'password', 'вид поля');
    await qa.sleep(200);
    qa.expect(!/gol2026/.test(qa.text('.a6-doc')) && /•••/.test(qa.text('.a6-doc')), 'пароль спрятался сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: атрибут type целиком', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a6-tab.is-ok').length === 1, 'первая вкладка горит');
    qa.expect(!qa.q('.a6-doc .a6-in.is-num'), 'пока атрибута нет — поле обычное, без стрелок');
    qa.type('.kz-gap textarea', 'type="number"', 'атрибут');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a6-doc .a6-in.is-num'), 'стрелки в поле сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: строка input', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.a6-in'), 'поля на странице пока нет');
    qa.type('.a6-ta', '  <input type="text">', 'строка');
    await qa.sleep(200);
    qa.expect(qa.qa('.a6-in').length === 1, 'поле на странице сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: опечатка в type', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a6-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
    qa.expect(/raqs2026/.test(qa.text('.a6-doc')), 'честно: с опечаткой в type пароль виден');
    await qa.clickNth('.a6-tap', 5, 'строка пароля');
    await qa.waitFor(() => qa.q('.a6-ta'), 3000, 'строка стала полем');
    qa.type('.a6-ta', qa.q('.a6-ta').value.replace('pasword', 'password'), 'исправить type');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!/raqs2026/.test(qa.text('.a6-doc')) && /•••/.test(qa.text('.a6-doc')), 'пароль спрятался');
  } },
  { name: 'e1: вывод части 1', shot: 'e1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.a6-tab.is-ok').length === 3 && !qa.q('.a6-fav.is-off'), 'все четыре вкладки горят');
    qa.expect(qa.qa('.kz-role').length === 3 && /placeholder/.test(qa.text('.kz-next')), 'три плашки; дальше — часть 2');
    qa.expect(/Танцы/.test(qa.text('.a6-h1')) && !qa.q('.a6-in-ph'), 'на открытой вкладке — починенная анкета');
  } },
  { name: 'e1: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Танцы' && Array.isArray(a.fields) && a.fields.length === 2
      && /<h1>Танцы<\/h1>/.test(a.html) && /<input type="password">/.test(a.html) && !/label|placeholder|<form/.test(a.html),
      'артефакт — починенная анкета, без label и form', { a });
  } }
];
export default {
  title: 'Практика 6, часть 1, курса HTML «Анкеты Коди: input и type» (облик «Редактор»)',
  file: 'html/06p1-formy-vvod',
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
    { name: 't1: лампочка до образца → дополнительная задача', start: 1, langs: ['ru'], steps: [{ name: 't1: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a6-sample'), 3000, 'образец третьей ступени');
      qa.expect(!/label|form/.test(qa.text('.a6-sample')), 'в образце нет label и form');
      qa.type('.kz-gap textarea', 'password', 'password'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.kz-gap textarea', 'number', 'number'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't2: одно значение, без кавычек, другой вид, не тот атрибут; дополнительная задача', start: 2, langs: ['ru'], steps: [{ name: 't2: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'number', 'одно значение'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /весь атрибут/.test(qa.text('.b-sheet p')), 3000, 'нужен весь атрибут');
      qa.type('.kz-gap textarea', 'type=number', 'без кавычек'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /кавычках/.test(qa.text('.b-sheet p')), 3000, 'значение пиши в кавычках');
      qa.type('.kz-gap textarea', 'type="text"', 'другой вид'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /другой вид/.test(qa.text('.b-sheet p')), 3000, 'это другой вид');
      qa.type('.kz-gap textarea', 'tipe="number"', 'другое имя'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /tipe/.test(qa.text('.b-sheet p')), 3000, 'такого атрибута нет');
      qa.type('.kz-gap textarea', 'type="number">', 'с уголком'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /уголки/.test(qa.text('.b-sheet p')), 3000, 'уголки уже стоят');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a6-sample'), 3000, 'образец третьей ступени');
      qa.type('.kz-gap textarea', 'type="number"', 'атрибут'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.kz-gap textarea', 'type="password"', 'пароль'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: </input>, чужой вид, не input; лампочка до образца → дополнительная задача', start: 3, langs: ['ru'], steps: [{ name: 't3: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a6-ta', '  <input type="text"></input>', 'с </input>'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не закрывается/.test(qa.text('.b-sheet p')), 3000, 'причина: input не закрывается');
      qa.type('.a6-ta', '  <input type="password">', 'другой вид'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /другой вид/.test(qa.text('.b-sheet p')), 3000, 'причина: другой вид');
      qa.type('.a6-ta', '  <p>Имя</p>', 'не input'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /нужен тег input/.test(qa.text('.b-sheet p')), 3000, 'причина: здесь нужен input');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a6-sample'), 3000, 'образец третьей ступени');
      qa.type('.a6-ta', '  <input type="text">', 'строка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.a6-ta', '  <input type="number">', 'возраст'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't4: не та строка → причина; text вместо password; дополнительная задача', start: 4, langs: ['ru'], steps: [{ name: 't4: ветки', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a6-tap', 3, 'поле имени'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a6-ta') && /ниже/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — ниже');
      await qa.clickNth('.a6-tap', 2, 'подпись'); await qa.sleep(300);
      qa.expect(!qa.q('.a6-ta') && /подпись/.test(qa.text('.b-sheet p')), 'подпись — не поле');
      await qa.clickNth('.a6-tap', 5, 'строка пароля'); await qa.waitFor(() => qa.q('.a6-ta'), 3000, 'строка стала полем');
      qa.type('.a6-ta', '  <input type="text">', 'text'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /пароль виден всем/.test(qa.text('.b-sheet p')), 3000, 'причина: text не прячет пароль');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a6-sample'), 3000, 'образец третьей ступени');
      qa.type('.a6-ta', '  <input type="password">', 'password'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(/robot2026/.test(qa.text('.a6-doc')), 'в дополнительной задаче — другая опечатка, пароль виден');
      await qa.clickNth('.a6-tap', 5, 'строка пароля'); await qa.waitFor(() => qa.q('.a6-ta'), 3000, 'строка стала полем');
      qa.type('.a6-ta', qa.q('.a6-ta').value.replace('passwrod', 'password'), 'исправить'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'password', 'вид'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.kz-gap textarea', 'type="nu', 'начало атрибута'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/type="nu/.test(qa.q('.kz-gap textarea').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a6-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
