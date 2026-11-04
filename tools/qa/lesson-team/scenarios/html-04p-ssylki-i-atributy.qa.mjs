// Сценарий проверки практики к уроку 4 курса HTML lessons/html/04p-ssylki-i-atributy.jsx («Путешествие Коди»,
// облик «Редактор», 04.11.2026, на основе 03p).
// Основной путь: 7 слайдов действиями ученика — сохранение (ссылки оборвались), пять страниц сайта (имя файла в href,
// ссылка на главную, абзац со ссылкой, найти a без href, своя страница со ссылкой), вывод; ссылки в браузере
// нажимаются и открывают страницы, «назад» возвращает; onFinished один раз, артефакт — своя страница. Ветки: причина
// в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача, нет кавычек, нет
// файла («Файл не найден» и в браузере), a без href, не та строка, страница без ссылки, «Назад» хранит код и карту.

const STEPS = [
  { name: 's1: сохранение — ссылки оборвались', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a4-tab.is-ok').length === 4 && qa.qa('.a4-doc .a4-a').length === 2, 'до сохранения вкладки горят, в меню ссылки');
    await qa.click('.a4-doc .a4-a', 'ссылка Ташкент');
    await qa.waitFor(() => /toshkent\.html/.test(qa.text('.kz-br-url-t')), 3000, 'ссылка открыла страницу');
    await qa.click('.a4-back', 'назад');
    await qa.waitFor(() => /index\.html/.test(qa.text('.kz-br-url-t')), 3000, '«назад» вернул главную');
    await qa.click('.a4-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a4-tab.is-off').length === 4, 5000, 'вкладки погасли');
    qa.expect(!qa.q('.a4-doc .a4-a'), 'честно: названия городов — простой текст');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: имя файла в href', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-gap textarea', 'samarqand.html', 'имя файла');
    await qa.sleep(200);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: ссылка на главную', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a4-tab.is-ok').length === 1, 'первая вкладка горит');
    const w = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    qa.type('.a4-ta', '  <a href="index.html">' + w + '</a>', 'ссылка');
    await qa.sleep(200);
    const links = qa.qa('.a4-doc .a4-a');
    qa.expect(links.length === 1 && links[0].textContent === w, 'ссылка на странице сразу');
    links[0].click();
    await qa.waitFor(() => /index\.html/.test(qa.text('.kz-br-url-t')), 3000, 'ссылка ведёт на главную');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: абзац со ссылкой', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const w = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    const pre = w.replace(/\s*\S+$/, ''), city = w.replace(/^.*\s/, '');
    qa.type('.a4-ta', '  <p>' + pre + ' <a href="buxoro.html">' + city + '</a></p>', 'абзац');
    await qa.sleep(200);
    qa.expect(qa.qa('.a4-doc .a4-a').length === 1, 'ссылка внутри абзаца');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: a без href', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.a4-doc .a4-a'), 'честно: слово без href — простой текст');
    await qa.clickNth('.a4-tap', 3, 'строка с a');
    await qa.waitFor(() => qa.q('.a4-ta'), 3000, 'строка стала полем');
    qa.type('.a4-ta', qa.q('.a4-ta').value.replace('<a>', '<a href="xiva.html">'), 'добавить href');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.a4-doc .a4-a').length === 1, 'слово стало ссылкой');
  } },
  { name: 't5: своя страница', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a4-ta', '<h1>Моя поездка & план</h1>\n<p>Хочу в <a href="moskva.html">Москву</a></p>', 'нет файла');
    await qa.sleep(200);
    await qa.click('.a4-doc .a4-a', 'ссылка');
    await qa.waitFor(() => qa.q('.a4-br.is-nf'), 3000, 'браузер: «Файл не найден»');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина: нет такого файла');
    qa.expect(/moskva\.html/.test(qa.text('.b-sheet p')), 'в причине — имя файла');
    qa.type('.a4-ta', '<h1>Моя поездка & план</h1>\n<p>Хочу в <a href="xiva.html">Хиву</a></p>', 'страница');
    await qa.sleep(200);
    qa.expect(qa.qa('.a4-tree-r.is-ok').length === 4, 'схема отмечает body, h1, p и ссылку');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить практику»');
    qa.expect(qa.qa('.a4-tab.is-ok').length === 4 && !qa.q('.a4-fav.is-off'), 'все пять вкладок горят');
    await qa.click('.a4-doc .a4-a', 'своя ссылка');
    await qa.waitFor(() => /xiva\.html/.test(qa.text('.kz-br-url-t')), 3000, 'своя ссылка открывает страницу');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Моя поездка & план' && a.href === 'xiva.html' && /<h1>Моя поездка &amp; план<\/h1>/.test(a.html) && /<a href="xiva.html">Хиву<\/a>/.test(a.html),
      'артефакт — своя страница, текст экранирован', { a });
  } }
];
export default {
  title: 'Практика 4 курса HTML «Путешествие Коди» (облик «Редактор»)',
  file: 'html/04p-ssylki-i-atributy',
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
    { name: 't1: другой файл → причина, вторая неудача → подсказка; нет файла', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'buxoro.html', 'другой файл'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.type('.kz-gap textarea', 'Samarqand.html', 'с большой буквы'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/buxoro\.html/.test(one) && /Samarqand\.html/.test(two) && /href/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });
      const ls = qa.qa('.a4-doc .a4-a'); ls[ls.length - 1].click();
      await qa.waitFor(() => qa.q('.a4-br.is-nf'), 3000, 'браузер честно: «Файл не найден»');} }] },
    { name: 't2: лампочка до образца → дополнительная задача; без кавычек; без href', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a4-ta', '  <a href=index.html>Главная</a>', 'без кавычек'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /кавычк/.test(qa.text('.b-sheet p')), 3000, 'причина: кавычки');
      qa.type('.a4-ta', '  <a>Главная</a>', 'без href'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /нет href/.test(qa.text('.b-sheet p')), 3000, 'причина: нет href');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a4-sample'), 3000, 'образец третьей ступени');
      qa.type('.a4-ta', '  <a href="index.html">Главная</a>', 'ссылка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.a4-ta', '  <a href="samarqand.html">Самарканд</a>', 'Самарканд'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: абзац без ссылки, ссылка без абзаца', start: 3, langs: ['ru'], steps: [{ name: 't3: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a4-ta', '<p>Следующий город: Бухара</p>', 'без ссылки'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /добавь в него ссылку/.test(qa.text('.b-sheet p')), 3000, 'нужна ссылка');
      qa.type('.a4-ta', '<a href="buxoro.html">Бухара</a>', 'без p'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /тег p/.test(qa.text('.b-sheet p')), 3000, 'нужен p');} }] },
    { name: 't4: не та строка → причина', start: 4, langs: ['ru'], steps: [{ name: 't4: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a4-tap', 2, 'абзац выше'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a4-ta') && /ниже/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — ниже');} }] },
    { name: 't5: страница без ссылки → нужна ссылка', start: 5, langs: ['ru'], steps: [{ name: 't5: ссылка', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a4-ta', '<h1>Моя</h1><p>Текст</p>', 'без ссылки'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /добавь в него ссылку/.test(qa.text('.b-sheet p')), 3000, 'нужна ссылка');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'samarqand.html', 'файл'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a4-ta', '  <a href="ind', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<a href="ind/.test(qa.q('.a4-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a4-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
