// Сценарий проверки практики к уроку 9 курса HTML lessons/html/09p-final-proekt.jsx («Мой сайт от и до», облик
// «Редактор», 06.11.2026, на основе 08p; 11 слайдов — заказчик: в финальной практике можно больше семи).
// Основной путь: «Начать» (план из девяти шагов) → title → header с h1 → nav → main с разделом → список → раздел с
// картинкой → footer с абзацем → форма → select и button → вывод; сайт растёт в браузере; план горит зелёным;
// onFinished один раз, артефакт — весь сайт (текст экранирован).
// Ветки: причина в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача,
// h1 без header, li без ul, нет файла картинки (сломанная картинка), option без select, «Назад» хранит код и план.
// Шаги выполняются в странице — помощники объявлены внутри шага.

const STEPS = [
  { name: 's1: «Начать» — план из девяти шагов', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!!qa.q('.a9-plan.is-hidden'), 'до начала плана не видно');
    await qa.click('.a9-publish', 'Начать');
    await qa.waitFor(() => qa.q('.a9-plan:not(.is-hidden)') && qa.qa('.a9-st').length === 9, 5000, 'план из девяти шагов');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: title — название на вкладке', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a9-ta', '<title>Мой мир & код</title>', 'title');
    await qa.sleep(200);
    qa.expect(/Мой мир & код/.test(qa.text('.a9-tab.is-cur')), 'название сразу на вкладке', { tab: qa.text('.a9-tab.is-cur') });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.a9-st.is-done').length === 1, 'первый шаг плана зелёный');
  } },
  { name: 't2: header с h1', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a9-ta', '<header>\n  <h1>Мой мир</h1>\n</header>', 'код');
    await qa.sleep(250);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: меню nav', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.a9-doc .a9-reg-header') && /Мой мир/.test(qa.text('.a9-doc .a9-h1')), 'заголовок из прошлого шага на странице');
    qa.type('.a9-ta', '<nav><a href="index.html">Главная</a></nav>', 'меню');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a9-doc .a9-reg-header .a9-reg-nav') && qa.text('.a9-doc .a9-a') === 'Главная', 'меню внутри header, ссылка на странице');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: main с разделом', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a9-ta', '<main>\n  <section>\n    <h2>Обо мне</h2>\n    <p>Я учусь в 6 классе.</p>\n  </section>\n</main>', 'код');
    await qa.sleep(250);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't5: список в разделе', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a9-ta', '<ul>\n  <li>Футбол</li>\n  <li>Шахматы</li>\n</ul>', 'список');
    await qa.sleep(200);
    qa.expect(qa.qa('.a9-doc .a9-reg-section .a9-list li').length === 2, 'список из двух пунктов внутри раздела');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't6: раздел с картинкой', shot: 't6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a9-ta', '<section>\n  <h2>Мой зверь</h2>\n  <img src="sher.jpg" alt="Лев">\n</section>', 'картинка');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a9-doc .a9-reg-main .a9-imgbox') && !!qa.q('.a9-pic.is-on'), 'рисунок в main, файл отмечен в полосе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't7: footer с абзацем', shot: 't7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a9-ta', '<footer>\n  <p>© 2026 Мой мир</p>\n</footer>', 'код');
    await qa.sleep(250);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't8: форма в footer', shot: 't8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a9-ta', '<form>\n  <label>Имя: <input type="text"></label>\n</form>', 'форма');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a9-doc .a9-reg-footer .a9-in'), 'поле внутри footer');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't9: select и button', shot: 't9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a9-ta', '<select>\n  <option>Футбол</option>\n  <option>Шахматы</option>\n</select>', 'без кнопки');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet.is-err') && /button/.test(qa.text('.b-sheet p')), 3000, 'причина: нужна кнопка');
    qa.type('.a9-ta', '<select>\n  <option>Футбол</option>\n  <option>Шахматы</option>\n</select>\n<button>Отправить</button>', 'выбор и кнопка');
    await qa.sleep(200);
    qa.expect(/Футбол/.test(qa.text('.a9-doc .a9-sel')) && !!qa.q('.a9-doc .a9-btn'), 'список выбора с первым пунктом и кнопка на странице');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, '«Завершить практику»');
    qa.expect(qa.qa('.a9-st.is-done').length === 9, 'весь план зелёный');
    qa.expect(/Мой мир & код/.test(qa.text('.a9-tab.is-cur')) && !!qa.q('.a9-doc .a9-imgbox') && !!qa.q('.a9-doc .a9-sel'), 'открыт весь свой сайт');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    const h = a ? a.html : '';
    qa.expect(!!a && a.type === 'html-page' && a.title === 'Мой мир & код' && /<title>Мой мир &amp; код<\/title>/.test(h) && /<nav><a href="index.html">Главная<\/a><\/nav>/.test(h)
      && /<li>Футбол<\/li>/.test(h) && /<img src="sher.jpg" alt="Лев">/.test(h) && /<option>Шахматы<\/option>/.test(h) && /<button>Отправить<\/button>/.test(h) && /<p>© 2026 Мой мир<\/p>/.test(h)
      && h.indexOf('<form>') < h.indexOf('<p>© 2026'), 'артефакт — весь сайт в верном порядке, текст экранирован', { h });
  } }
];
export default {
  title: 'Практика 9 курса HTML «Мой сайт от и до» (облик «Редактор»)',
  file: 'html/09p-final-proekt',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 11,
  inputScreens: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 't1: без слеша → причина, вторая неудача → подсказка; лампочка → дополнительная задача', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a9-ta', '<title>Мой сайт<title>', 'без слеша'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      await qa.waitFor(() => qa.q('.key-go:not(:disabled)'), 30000, 'можно снова');
      qa.type('.a9-ta', '<titel>Мой сайт</titel>', 'опечатка'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/черта/.test(one) && /titel/.test(two) && /Название пишется/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a9-sample'), 3000, 'образец третьей ступени');
      qa.type('.a9-ta', '<title>Мой сайт</title>', 'title'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      const w = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/) || [])[1];
      qa.type('.a9-ta', '<title>' + w + '</title>', 'по заданию'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't2: h1 без header; меню раньше времени', start: 2, langs: ['ru'], steps: [{ name: 't2: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a9-ta', '<h1>Мой мир</h1>', 'без header'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /между открывающим и закрывающим header/.test(qa.text('.b-sheet p')), 3000, 'нужен header');
      qa.type('.a9-ta', '<header>\n<h1>Мой мир</h1>\n<nav><a href="index.html">Главная</a></nav>\n</header>', 'с меню'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /только h1/.test(qa.text('.b-sheet p')), 3000, 'меню — на следующем шаге');} }] },
    { name: 't5: li без ul, один пункт', start: 5, langs: ['ru'], steps: [{ name: 't5: список', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a9-ta', '<li>Футбол</li>', 'li без ul'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не в списке/.test(qa.text('.b-sheet p')), 3000, 'пункты не в списке');
      qa.type('.a9-ta', '<ul><li>Футбол</li></ul>', 'один пункт'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /два пункта/.test(qa.text('.b-sheet p')), 3000, 'нужно два пункта');} }] },
    { name: 't6: нет файла — сломанная картинка, нет alt', start: 6, langs: ['ru'], steps: [{ name: 't6: картинка', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a9-ta', '<section>\n<h2>Зверь</h2>\n<img src="kot.jpg" alt="Кот">\n</section>', 'нет файла'); await qa.sleep(200);
      qa.expect(!!qa.q('.a9-doc .a9-broken'), 'честно: значок сломанной картинки и alt');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /kot\.jpg/.test(qa.text('.b-sheet p')), 3000, 'причина называет файл');
      qa.type('.a9-ta', '<section>\n<h2>Зверь</h2>\n<img src="fil.jpg">\n</section>', 'без alt'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /alt/.test(qa.text('.b-sheet p')), 3000, 'нужен alt');} }] },
    { name: 't9: option без select', start: 9, langs: ['ru'], steps: [{ name: 't9: select', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a9-ta', '<option>Футбол</option>\n<option>Шахматы</option>\n<button>Отправить</button>', 'без select'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не в select/.test(qa.text('.b-sheet p')), 3000, 'нужен select');} }] },
    { name: '«Назад» хранит код и план', start: 1, langs: ['ru'], steps: [{ name: 'назад', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a9-ta', '<title>Мой сайт</title>', 'title'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a9-ta', '<header>\n<h1>Мо', 'начало'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<h1>Мо/.test(qa.q('.a9-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a9-st.is-done').length === 1, 'первый шаг плана по-прежнему зелёный');} }] }
  ]
};
