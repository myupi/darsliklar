// Сценарий проверки практики к уроку 4, ЧАСТЬ 1 lessons/html/04p1-ssylki-i-atributy.jsx («Путешествие Коди»: тег a, href
// и поломки ссылок; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: сохранение (ссылки
// оборвались), четыре страницы (имя файла в href, ссылка на главную, опечатка в имени файла — «Файл не найден», найти a
// без href), вывод части 1; ссылки в браузере нажимаются, «назад» возвращает; onFinished один раз, артефакт — починенная
// страница «Бухара». Ветки: причина в панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная
// задача, нет кавычек, без href, строка не изменена, другая опечатка, не та строка, «Назад» хранит код и карту.

const STEPS = [
  { name: 's1: сохранение — ссылки оборвались', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a4-tab.is-ok').length === 3 && qa.qa('.a4-doc .a4-a').length === 2, 'до сохранения вкладки горят, в меню ссылки');
    qa.expect(!/пят/i.test(qa.text('.kz-ask')), 'в строке задания нет «пяти страниц»');
    await qa.click('.a4-doc .a4-a', 'ссылка Ташкент');
    await qa.waitFor(() => /toshkent\.html/.test(qa.text('.kz-br-url-t')), 3000, 'ссылка открыла страницу');
    await qa.click('.a4-back', 'назад');
    await qa.waitFor(() => /index\.html/.test(qa.text('.kz-br-url-t')), 3000, '«назад» вернул главную');
    await qa.click('.a4-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a4-tab.is-off').length === 3, 5000, 'вкладки погасли');
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
  { name: 't3: опечатка в имени файла', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a4-tab.is-ok').length === 2, 'две вкладки горят');
    const ta = qa.q('.a4-ta');
    qa.expect(/samarkand\.html/.test(ta.value) && qa.qa('.a4-doc .a4-a').length === 1, 'строка с опечаткой уже в поле, на странице синяя ссылка');
    await qa.click('.a4-doc .a4-a', 'ссылка с опечаткой');
    await qa.waitFor(() => qa.q('.a4-br.is-nf') && /samarkand\.html/.test(qa.text('.kz-br-url-t')), 3000, 'браузер честно: «Файл не найден»');
    await qa.click('.a4-back', 'назад');
    qa.type('.a4-ta', ta.value.replace('samarkand', 'samarqand'), 'исправить имя');
    await qa.sleep(200);
    await qa.click('.a4-doc .a4-a', 'ссылка');
    await qa.waitFor(() => /samarqand\.html/.test(qa.text('.kz-br-url-t')) && !qa.q('.a4-br.is-nf'), 3000, 'исправленная ссылка открывает страницу');
    await qa.click('.a4-back', 'назад');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: a без href', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a4-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
    qa.expect(!qa.q('.a4-doc .a4-a'), 'честно: слово без href — простой текст');
    await qa.clickNth('.a4-tap', 3, 'строка с a');
    await qa.waitFor(() => qa.q('.a4-ta'), 3000, 'строка стала полем');
    qa.type('.a4-ta', qa.q('.a4-ta').value.replace('<a>', '<a href="xiva.html">'), 'добавить href');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.a4-doc .a4-a').length === 1, 'слово стало ссылкой');
  } },
  { name: 'e1: вывод части 1', shot: 'e1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.a4-tab.is-ok').length === 3 && !qa.q('.a4-fav.is-off'), 'все четыре вкладки горят');
    qa.expect(qa.qa('.a4-doc .a4-a').length === 2 && qa.qa('.kz-role').length === 4, 'на странице две ссылки; четыре плашки');
    qa.expect(/сайты в интернете/.test(qa.text('.kz-next')), 'дальше — часть 2');
    await qa.click('.a4-doc .a4-a', 'ссылка на странице вывода');
    await qa.waitFor(() => /toshkent\.html/.test(qa.text('.kz-br-url-t')), 3000, 'ссылка вывода открывает страницу');
  } },
  { name: 'e1: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Бухара' && a.href === 'xiva.html' && /<h1>Бухара<\/h1>/.test(a.html) && /<a href="xiva.html">Хива<\/a>/.test(a.html),
      'артефакт — починенная страница Бухары со ссылкой на Хиву', { a });
  } }
];
export default {
  title: 'Практика 4, часть 1, курса HTML «Путешествие Коди: тег a, href и поломки ссылок» (облик «Редактор»)',
  file: 'html/04p1-ssylki-i-atributy',
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
    { name: 't3: строка не изменена, другая опечатка, образец и дополнительная задача', start: 3, langs: ['ru'], steps: [{ name: 't3: ветки', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.key-go', 'Проверить без правки');
      await qa.waitFor(() => /Строка пока прежняя/.test(qa.text('.b-sheet p')), 3000, 'причина: строка не изменена');
      qa.type('.a4-ta', '  <a href="samarqand.htm">Самарканд</a>', 'без l'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/samarqand\.htm/.test(two) && /список/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина про файл и ступень подсказки', { two });
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a4-sample'), 3000, 'образец третьей ступени');
      qa.type('.a4-ta', '  <a href="samarqand.html">Самарканд</a>', 'верно'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled() && /bukhara\.html/.test(qa.q('.a4-ta').value), '«Дальше» ждёт дополнительную задачу, в поле — вторая опечатка');
      qa.type('.a4-ta', '  <a href="buxoro.html">Бухара</a>', 'Бухара'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't4: не та строка → причина', start: 4, langs: ['ru'], steps: [{ name: 't4: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a4-tap', 2, 'абзац выше'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a4-ta') && /ниже/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — ниже');} }] },
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
