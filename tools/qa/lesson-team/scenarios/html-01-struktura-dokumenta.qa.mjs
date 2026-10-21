// Сценарий проверки урока 1 курса HTML lessons/html/01-struktura-dokumenta.jsx («Бумажная страница», эталон курса).
// Основной путь: все 15 экранов действиями ученика (снимок каждого экрана — в решённом виде, до «Дальше»), своё имя (s7) и привет (s10),
// каркас (s13), починка </title> (s14), onFinished один раз, артефакт со своим именем.
// Ветки: неверный закрывающий тег; промах в прогнозе → дополнительный раунд;
// имя страницы в теле → объяснение, без засчёта.
// Функции шагов выполняются в странице: только аргумент qa.

const STEPS = [
  { name: 's1: превратить человечка в страницу', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.q('.kz-br'), 5000, 'бумажный браузер');
    await qa.platform.ready(30000);
  } },
  { name: 's2: карточки плана открываются сами', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'план рассказан');
    qa.expect(qa.qa('.kz-card.is-open').length === 4, 'все четыре карточки открыты');
  } },
  { name: 's3: бирки рамки', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.click('.kz-frame-lbl-top', 'верхняя бирка'); await qa.platform.ready(30000);
    await qa.click('.kz-frame-lbl-bot', 'нижняя бирка'); await qa.platform.ready(30000);
  } },
  { name: 's4: набрать </html>', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', '</html>', 'закрывающий тег');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's5: бирки по местам, лишняя остаётся', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickText('.kz-scrap', '<html>'); await qa.click('.kz-slot-top', 'верхнее место'); await qa.sleep(300);
    await qa.clickText('.kz-scrap', '</html>'); await qa.click('.kz-slot-bot', 'нижнее место');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-tray .kz-scrap').length === 1, 'лишняя бирка осталась');
  } },
  { name: 's6: голова → карточка title → имя на вкладке', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.click('.kz-man [aria-label="head"]', 'голова'); await qa.platform.ready(20000);
    await qa.click('.kz-man [aria-label="title"]', 'карточка title');
    await qa.waitFor(() => qa.text('.kz-br-tab-t') === qa.data.site, 4000, 'имя на вкладке');
    await qa.platform.ready(30000);
  } },
  { name: 's7: своё имя в title', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myTitle, 'имя');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.kz-br-tab-t') === qa.data.myTitle, 'вкладка = своё имя');
  } },
  { name: 's8: вкладка или окно', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.kz-pick'); r += 1) {
      await qa.platform.ready(30000);
      const slip = qa.text('.kz-slip');
      await qa.clickNth('.kz-pick .kz-btn', slip.indexOf('<title>') >= 0 ? 0 : 1, 'ответ');
      await qa.waitFor(() => !qa.q('.kz-pick') || qa.qa('.kz-pick .kz-btn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's9: тело → содержимое в окне', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.click('.kz-man [aria-label="body"]', 'тело');
    await qa.waitFor(() => qa.q('.kz-bit-pic'), 4000, 'картинка в окне');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's10: привет в body', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myText, 'привет');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.kz-br-text') === qa.data.myText, 'окно = свой текст');
  } },
  { name: 's11: разложить вырезки', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const put = async (t, where) => { await qa.clickText('.kz-scrap', t); await qa.click('.kz-zone[data-place="' + where + '"]', where); await qa.sleep(300); };
    await put('<title>' + qa.data.myTitle + '</title>', 'head'); await put(qa.data.hello, 'body'); await put(qa.data.pic, 'body'); await put(qa.data.play, 'body');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's12: читать как браузер', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.click('.kz-btn.is-coral', 'Читать как браузер');
    await qa.waitFor(() => qa.q('.kz-col-text'), 12000, 'страница собрана');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'засчитано');
  } },
  { name: 's13: собрать каркас', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const t of ['<html>', '<head>', '<title>…</title>', '</head>', '<body>', qa.data.myText, '</body>', '</html>']) {
      const b = qa.qa('.kz-pool .kz-scrap').find((x) => x.textContent.replace(/\s+/g, '') === t.replace(/\s+/g, ''));
      await qa.click(b, 'полоска ' + t); await qa.sleep(150);
    }
    await qa.click('.kz-build-side .kz-btn', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'каркас верный');
  } },
  { name: 's14: вкладка съела страницу — </title>', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.text('.kz-br-tab-t').indexOf('</head>') > 0, 'вкладка съела страницу');
    await qa.clickText('.kz-scrap', '</title>');
    await qa.waitFor(() => qa.text('.kz-br-tab-t') === qa.data.myTitle, 4000, 'вкладка = имя');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, '«Завершить урок»');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<title>' + qa.data.myTitle + '</title>') >= 0 && html.indexOf(qa.data.myText) >= 0, 'артефакт — своя страница', { html });
  } }
];

export default {
  title: 'Урок 1 курса HTML «Бумажная страница» (эталон курса)',
  file: 'html/01-struktura-dokumenta',
  adapter: 'canon-html',
  langs: ['ru'],
  size: '1280x720',
  voice: 'fast',
  screens: 15,
  inputScreens: [4, 7, 10],
  expectFinish: true,
  data: {
    ru: { site: 'Мой сайт', myTitle: 'Шахматы', myText: 'Сыграем партию?', hello: 'Привет, мир!', pic: 'картинка', play: 'Играть' },
    uz: { site: 'Mening saytim', myTitle: 'Shaxmat', myText: 'Bir o‘yin o‘ynaymizmi?', hello: 'Salom, dunyo!', pic: 'rasm', play: 'O‘ynash' },
    en: { site: 'My site', myTitle: 'Chess', myText: 'Shall we play a game?', hello: 'Hello, world!', pic: 'picture', play: 'Play' }
  },
  steps: STEPS,
  flows: [
    { name: 's4: открывающий вместо закрывающего', start: 3, langs: ['ru'], steps: [{ name: '<html> → причина, без засчёта', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<html>', 'открывающий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's8: промах → дополнительный раунд', start: 7, langs: ['ru'], steps: [{ name: 'неверный ответ', run: async (qa) => {
      await qa.platform.ready();
      const slip = qa.text('.kz-slip');
      await qa.clickNth('.kz-pick .kz-btn', slip.indexOf('<title>') >= 0 ? 1 : 0, 'неверный ответ');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's11: имя в тело — объяснение', start: 10, langs: ['ru'], steps: [{ name: 'имя → body', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-scrap', '<title>' + qa.data.site + '</title>');
      await qa.click('.kz-zone[data-place="body"]', 'тело');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'объяснение на месте задания');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 4, 'вырезка не легла');
    } }] }
  ]
};
