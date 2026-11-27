// Сценарий проверки практики к уроку 4, ЧАСТЬ 2 lessons/html/04p2-ssylki-i-atributy.jsx («Путешествие Коди»: сайты в
// интернете и своя ссылка; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: «Википедия» без
// https («Файл не найден»), четыре страницы (полный адрес https://… в href, дописать потерянное https://, абзац со ссылкой
// внутри, своя страница со ссылкой), вывод; ссылки в браузере нажимаются: на свой файл, на известный сайт (заглушка), на
// имя сайта без https («Файл не найден»); onFinished один раз, артефакт — своя страница. Ветки: причина в панели, подсказка
// после второй неудачи подряд, лампочка до образца и дополнительная задача, нет https / нет двоеточия / опечатка в имени
// сайта, адрес не изменён, абзац без ссылки, своя страница с именем сайта без https и с ссылкой на сайт, «Назад».

const STEPS = [
  { name: 'h2: ссылка на Википедию без https', shot: 'h2-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a4-tab.is-ok').length === 3 && qa.qa('.a4-doc .a4-a').length === 2, 'четыре вкладки горят, в меню две ссылки');
    await qa.clickNth('.a4-doc .a4-a', 0, 'ссылка Самарканд');
    await qa.waitFor(() => /samarqand\.html/.test(qa.text('.kz-br-url-t')) && !qa.q('.a4-br.is-nf'), 3000, 'своя ссылка открывает страницу');
    await qa.click('.a4-back', 'назад');
    await qa.waitFor(() => /index\.html/.test(qa.text('.kz-br-url-t')), 3000, '«назад» вернул страницу');
    await qa.clickNth('.a4-doc .a4-a', 1, 'ссылка Википедия');
    await qa.waitFor(() => qa.q('.a4-br.is-nf') && /wikipedia\.org/.test(qa.text('.kz-br-url-t')), 3000, 'браузер честно: «Файл не найден»');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');
  } },
  { name: 't1: полный адрес в href', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a4-addr .a4-slot').length === 2 && /https/.test(qa.text('.a4-addr')), 'под кодом — подпись из двух частей адреса');
    const addr = 'https://' + qa.qa('.a4-addr code')[1].textContent;
    qa.type('.kz-gap textarea', addr, 'адрес');
    await qa.sleep(200);
    await qa.clickNth('.a4-doc .a4-a', 1, 'ссылка на сайт');
    await qa.waitFor(() => qa.q('.a4-br') && !qa.q('.a4-br.is-nf') && /wikipedia\.org/.test(qa.text('.kz-br-url-t')) && /Википедия/.test(qa.text('.a4-doc')), 3000, 'адрес с https открывает сайт');
    await qa.click('.a4-back', 'назад');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: дописать https', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a4-tab.is-ok').length === 1, 'первая вкладка горит');
    const ta = qa.q('.a4-ta');
    qa.expect(/href="www\.google\.com"/.test(ta.value) && qa.qa('.a4-doc .a4-a').length === 1, 'в поле — строка без https, на странице синяя ссылка');
    await qa.click('.a4-doc .a4-a', 'ссылка без https');
    await qa.waitFor(() => qa.q('.a4-br.is-nf') && /www\.google\.com/.test(qa.text('.kz-br-url-t')), 3000, 'браузер честно: «Файл не найден»');
    await qa.click('.a4-back', 'назад');
    qa.type('.a4-ta', ta.value.replace('href="', 'href="https://'), 'дописать начало');
    await qa.sleep(200);
    await qa.click('.a4-doc .a4-a', 'ссылка');
    await qa.waitFor(() => !qa.q('.a4-br.is-nf') && /Google/.test(qa.text('.a4-doc')) && /Поисковая/.test(qa.text('.a4-doc')), 3000, 'исправленная ссылка открывает сайт');
    await qa.click('.a4-back', 'назад');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: абзац со ссылкой', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a4-tab.is-ok').length === 2, 'две вкладки горят');
    const w = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    const pre = w.replace(/\s*\S+$/, ''), city = w.replace(/^.*\s/, '');
    qa.type('.a4-ta', '  <p>' + pre + ' <a href="buxoro.html">' + city + '</a></p>', 'абзац');
    await qa.sleep(200);
    qa.expect(qa.qa('.a4-doc .a4-a').length === 1, 'ссылка внутри абзаца');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: своя страница', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a4-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
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
    await qa.waitFor(() => qa.platform.nextEnabled(), 100000, '«Завершить практику»');
    qa.expect(qa.qa('.a4-tab.is-ok').length === 3 && !qa.q('.a4-fav.is-off'), 'все четыре вкладки горят');
    qa.expect(qa.qa('.kz-role').length === 4 && /https/.test(qa.text('.kz-roles')), 'четыре плашки, среди них про https');
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
  title: 'Практика 4, часть 2, курса HTML «Путешествие Коди: сайты в интернете и своя ссылка» (облик «Редактор»)',
  file: 'html/04p2-ssylki-i-atributy',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 6,
  inputScreens: [1, 2, 3, 4],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 't1: без https, без двоеточия, опечатка в имени сайта; вторая неудача → подсказка', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      const host = qa.qa('.a4-addr code')[1].textContent;
      qa.type('.kz-gap textarea', host, 'без https'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.type('.kz-gap textarea', 'https:/' + host, 'без одной косой'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/нет https/.test(one) && /двоеточие/.test(two) && /Для другого сайта/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });
      qa.type('.kz-gap textarea', 'https://' + host.replace(/org$/, 'ogr'), 'опечатка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /чуть отличается/.test(qa.text('.b-sheet p')), 3000, 'причина: имя сайта чуть другое');
      qa.type('.kz-gap textarea', 'samarqand.html', 'файл сайта'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /имя файла нашего сайта/.test(qa.text('.b-sheet p')), 3000, 'причина: это файл нашего сайта');
      qa.type('.kz-gap textarea', 'https://' + host + '/wiki', 'с хвостом'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /длиннее/.test(qa.text('.b-sheet p')), 3000, 'причина: адрес длиннее');
      qa.type('.kz-gap textarea', 'https://google.com', 'другой сайт'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /адрес другого сайта/.test(qa.text('.b-sheet p')), 3000, 'причина: другой сайт');} }] },
    { name: 't2: лампочка до образца → дополнительная задача; адрес не изменён', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.key-go', 'Проверить без правки');
      await qa.waitFor(() => /Адрес пока прежний/.test(qa.text('.b-sheet p')), 3000, 'причина: адрес не изменён');
      qa.type('.a4-ta', '  <a href="http:www.google.com">Google</a>', 'без косых'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/двоеточие/.test(qa.text('.b-sheet p')) && !qa.platform.nextEnabled(), 'вторая неудача — про двоеточие и косые черты и подсказка');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a4-sample'), 3000, 'образец третьей ступени');
      qa.type('.a4-ta', '  <a href="https://www.google.com">Google</a>', 'верно'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled() && /www\.wikipedia\.org/.test(qa.q('.a4-ta').value), '«Дальше» ждёт дополнительную задачу, в поле — другой сайт без https');
      qa.type('.a4-ta', '  <a href="https://www.wikipedia.org">Википедия</a>', 'Википедия'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: абзац без ссылки, ссылка без абзаца, другой сайт вместо файла', start: 3, langs: ['ru'], steps: [{ name: 't3: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a4-ta', '<p>Следующий город: Бухара</p>', 'без ссылки'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /добавь в него ссылку/.test(qa.text('.b-sheet p')), 3000, 'нужна ссылка');
      qa.type('.a4-ta', '<a href="buxoro.html">Бухара</a>', 'без p'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /тег p/.test(qa.text('.b-sheet p')), 3000, 'нужен p');
      qa.type('.a4-ta', '<p>Следующий город: <a href="https://www.google.com">Бухара</a></p>', 'ссылка на сайт'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /ведёт на другую страницу/.test(qa.text('.b-sheet p')), 3000, 'ссылка ведёт не на Бухару');} }] },
    { name: 't4: имя сайта без https; ссылка на сайт засчитывается; страница без ссылки', start: 4, langs: ['ru'], steps: [{ name: 't4: ссылки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a4-ta', '<h1>Моя</h1><p>Текст</p>', 'без ссылки'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /добавь в него ссылку/.test(qa.text('.b-sheet p')), 3000, 'нужна ссылка');
      qa.type('.a4-ta', '<h1>Моя</h1><p>Читай <a href="ru.wikipedia.org">Википедию</a></p>', 'без https'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /нет https/.test(qa.text('.b-sheet p')), 3000, 'причина: нет https');
      qa.type('.a4-ta', '<h1>Моя</h1><p>Читай <a href="https://www.youtube.com">видео</a></p>', 'сайт'); await qa.sleep(200);
      await qa.click('.a4-doc .a4-a', 'ссылка на сайт');
      await qa.waitFor(() => !qa.q('.a4-br.is-nf') && /YouTube/.test(qa.text('.a4-doc')), 3000, 'ссылка на сайт открывает заглушку сайта');
      await qa.click('.a4-back', 'назад');
      qa.expect(qa.qa('.a4-tree-r.is-ok').length === 4, 'схема отмечает ссылку на сайт');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'https://' + qa.qa('.a4-addr code')[1].textContent, 'адрес'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a4-ta', '  <a href="https://www.go', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<a href="https:\/\/www\.go/.test(qa.q('.a4-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a4-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
