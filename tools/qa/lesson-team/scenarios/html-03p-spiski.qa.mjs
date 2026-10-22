// Сценарий проверки практики к уроку 3 курса HTML lessons/html/03p-spiski.jsx («Походный блокнот», 7 слайдов).
// Основной путь: хук (касание «Дождь!»), пять заданий действиями ученика (снимок каждого экрана — в решённом виде),
// вывод, onFinished один раз, артефакт — страница со своим списком из t5.
// Ветки: слово без li, вторая неудача → подсказка; ul → ol только в открывающем теге; ol вместо ul в «привале»;
// подсказка 2 в «палатке» указывает строку; три лампочки → образец → дополнительная задача.
// Функции шагов выполняются в странице: только аргумент qa (помощники — прямо в шаге).

const STEPS = [
  { name: 'хук: дождь размыл списки', shot: 'intro', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-street .pp-house').length === 5, 'на тропе пять привалов');
    qa.expect(qa.qa('.pp-street .pp-house.is-lit').length === 4, 'до дождя четыре привала целые');
    await qa.waitFor(() => { const b = qa.q('.pp-wind'); return b && !b.disabled; }, 30000, 'кнопка «Дождь!» включилась');
    await qa.click('.pp-wind', 'Дождь');
    await qa.sleep(600);
    qa.expect(qa.qa('.pp-street .pp-house.is-wait').length === 4, 'после дождя привалы выцвели');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'задача рассказана');
  } },
  { name: 't1: новый пункт li', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.pg-doc .pg-li').length === 2, 'в списке два пункта');
    qa.type('.ed-ta', qa.data.t1, 'пункт');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.pg-doc .pg-li').length === 3, 'в списке три пункта');
  } },
  { name: 't2: ul → ol', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.pg-doc .pg-ul'), 'сначала список с точками');
    qa.type('.ed-ta', qa.q('.ed-ta').value.replace(/<ul>/g, '<ol>').replace(/<\/ul>/g, '</ol>'), 'оба тега ol');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.pg-doc .pg-ol') && qa.text('.pg-doc .pg-ol .pg-mk') === '1.', 'теперь с номерами');
  } },
  { name: 't3: строка → список ul', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-target-li').length === 3, 'рядом — как должно быть');
    qa.type('.ed-ta', qa.data.t3, 'список');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.pg-doc .pg-ul .pg-li').length === 3, 'три пункта с точками');
  } },
  { name: 't4: починить два пункта', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/2/.test(qa.text('.pp-left')), 'счётчик: осталось 2', { left: qa.text('.pp-left') });
    qa.expect(!!qa.q('.pg-doc .pg-txt'), 'у шага нет номера');
    qa.type('.ed-ta', qa.data.t4, 'починенный список');
    await qa.sleep(200);
    qa.expect(!!qa.q('.pp-left.is-ok'), 'счётчик: всё исправлено');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.pg-doc .pg-li').length === 3 && !qa.q('.pg-doc .pg-txt'), 'три шага с номерами');
  } },
  { name: 't5: свой список', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-check-i').length === 4 && !qa.q('.pp-check-i.is-ok'), 'список условий пуст');
    qa.type('.ed-ta', qa.data.t5, 'свой список');
    await qa.sleep(200);
    qa.expect(qa.qa('.pp-check-i.is-ok').length === 4, 'все четыре условия загорелись');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.pg-doc .pg-h1') === qa.data.title, 'в окне своё название');
  } },
  { name: 'вывод: тропа горит, свой список', shot: 'fin', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, '«Завершить»');
    qa.expect(qa.qa('.pp-street .pp-house.is-lit').length === 5, 'все пять привалов горят');
    qa.expect(qa.text('.pp-fin .pg-h1') === qa.data.title, 'в выводе — свой список');
  } },
  { name: 'завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<h1>' + qa.data.title + '</h1>') >= 0 && pl.artifact.items.length === 3, 'артефакт — страница со своим списком', { html });
  } }
];

export default {
  title: 'Практика к уроку 3 курса HTML «Походный блокнот» (7 слайдов)',
  file: 'html/03p-spiski',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 7,
  inputScreens: [2, 3, 4, 5, 6],
  expectFinish: true,
  data: {
    ru: { t1: '<li>компас</li>',
      t3: '<ul>\n  <li>шапка</li>\n  <li>вода</li>\n  <li>карта</li>\n</ul>',
      t4: '<ol>\n  <li>Расстели палатку</li>\n  <li>Вбей колышки</li>\n  <li>Натяни верёвки</li>\n</ol>',
      title: 'Мои игры', t5: '<h1>Мои игры</h1>\n<ul>\n  <li>футбол</li>\n  <li>шахматы</li>\n  <li>прятки</li>\n</ul>' },
    uz: { t1: '<li>kompas</li>',
      t3: '<ul>\n  <li>qalpoq</li>\n  <li>suv</li>\n  <li>xarita</li>\n</ul>',
      t4: '<ol>\n  <li>Chodirni yoying</li>\n  <li>Qoziqlarni qoqing</li>\n  <li>Arqonlarni torting</li>\n</ol>',
      title: 'O‘yinlarim', t5: '<h1>O‘yinlarim</h1>\n<ul>\n  <li>futbol</li>\n  <li>shaxmat</li>\n  <li>bekinmachoq</li>\n</ul>' },
    en: { t1: '<li>compass</li>',
      t3: '<ul>\n  <li>hat</li>\n  <li>water</li>\n  <li>map</li>\n</ul>',
      t4: '<ol>\n  <li>Spread out the tent</li>\n  <li>Drive in the pegs</li>\n  <li>Pull the ropes</li>\n</ol>',
      title: 'My games', t5: '<h1>My games</h1>\n<ul>\n  <li>football</li>\n  <li>chess</li>\n  <li>hide and seek</li>\n</ul>' }
  },
  steps: STEPS,
  flows: [
    { name: 't1: слово без li, вторая неудача → подсказка', start: 1, langs: ['ru'], steps: [{ name: 'компас без тегов дважды', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', 'компас', 'слово без li');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(!!qa.q('.pp-note.is-fb') && /без li/.test(qa.text('.pp-note')), 'причина: текст без li', { note: qa.text('.pp-note') });
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(!!qa.q('.pp-note.is-hint'), 'со второй неудачи — ступень подсказки');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 't2: ol только в открывающем теге', start: 2, langs: ['ru'], steps: [{ name: '<ol> … </ul>', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', qa.q('.ed-ta').value.replace('<ul>', '<ol>'), 'только открывающий');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(/совпадать/.test(qa.text('.pp-note')), 'причина: пара должна совпадать', { note: qa.text('.pp-note') });
    } }] },
    { name: 't3: ol вместо ul', start: 3, langs: ['ru'], steps: [{ name: 'список с номерами для вещей', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', '<ol>\n<li>шапка</li>\n<li>вода</li>\n<li>карта</li>\n</ol>', 'ol');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(/не важен/.test(qa.text('.pp-note')), 'причина: порядок не важен — ul', { note: qa.text('.pp-note') });
    } }] },
    { name: 't4: подсказка 2 указывает строку', start: 4, langs: ['ru'], steps: [{ name: 'две лампочки', run: async (qa) => {
      await qa.platform.ready();
      for (let k = 0; k < 2; k += 1) { qa.platform.hint(); await qa.sleep(500); }
      qa.expect(/строку 10/.test(qa.text('.pp-note')) && !!qa.q('.ed-line.is-mark'), 'строка 10 названа и подсвечена', { note: qa.text('.pp-note') });
    } }] },
    { name: 't5: три лампочки → образец → дополнительная задача', start: 5, langs: ['ru'], steps: [{ name: 'подсказки до образца, решение, ещё одна', run: async (qa) => {
      await qa.platform.ready();
      for (let k = 0; k < 3; k += 1) { qa.platform.hint(); await qa.sleep(500); }
      qa.expect(/3\/3/.test(qa.text('.pp-note')) && !!qa.q('.pp-note .sample'), 'третья ступень с образцом', { note: qa.text('.pp-note') });
      qa.type('.ed-ta', '<h1>Мои игры</h1>\n<ul>\n<li>футбол</li>\n<li>шахматы</li>\n<li>прятки</li>\n</ul>', 'свой список');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      await qa.waitFor(() => qa.q('.pp-drill-tag'), 4000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.ed-ta', '<ol>\n<li>Вскипяти воду</li>\n<li>Положи чай</li>\n<li>Залей водой</li>\n</ol>', 'шаги чая');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] }
  ]
};
