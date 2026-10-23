// Сценарий проверки урока 1 курса HTML lessons/html/01-struktura-dokumenta.jsx («Бумажная страница», эталон курса).
// Основной путь: все 18 экранов действиями ученика (снимок каждого экрана — в решённом виде, до «Дальше»), своё имя (s7) и привет (s10)
// по кнопке «Готово», каркас (s13), починка </title> (s14), итоговая проверка q1 (вкладка/окно) и q2 (зачем </title>),
// onFinished один раз, артефакт со своим именем.
// Ветки: неверный закрывающий тег; промах в прогнозе → дополнительный раунд; имя страницы в теле → объяснение;
// s7: пауза в наборе не засчитывает, пробелы и теги не принимаются, похвала один раз, правка после засчёта — в артефакт;
// q1: фраза не туда → причина, без засчёта; q2: неверный ответ → причина, можно снова.
// Функции шагов выполняются в странице: только аргумент qa.

const STEPS = [
  { name: 's1: страница в браузере собирается в человечка', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br') && !qa.q('.kz-man'), 'сначала бумажная страница в браузере');
    await qa.waitFor(() => { const b = qa.q('.kz-btn.is-coral'); return b && !b.disabled; }, 40000, 'Коди показал вкладку и окно, кнопка включилась');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.q('.kz-s1.is-man .kz-man') && !qa.q('.kz-s1 .kz-br'), 5000, 'собрался человечек, браузера нет');
    await qa.platform.ready(30000);
  } },
  { name: 's2: карточки плана открываются сами', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'план рассказан');
    qa.expect(qa.qa('.kz-card.is-open').length === 4, 'все четыре карточки открыты');
  } },
  { name: 'tg1: слово в скобках — тег, косая черта — закрывающий', shot: 'tg1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(/html/.test(qa.text('.kz-br-page')), 'без скобок браузер показывает слово html');
    // Показ: ученик ничего не нажимает — скобки и косая черта влетают сами; ни кнопок, ни руки.
    qa.expect(!qa.q('.kz-sheet .kz-btn, .kz-tg-key') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.qa('.kz-tg-strip .kz-tg-tag').length === 1, 40000, 'показ: слово стало тегом');
    qa.expect(!/html/.test(qa.text('.kz-br-page')), 'в скобках слово пропало со страницы');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'показ закончен');
    qa.expect(qa.qa('.kz-tg-strip .kz-tg-tag').length === 2, 'открывающий и закрывающий тег');
  } },
  { name: 's3: бирки рамки', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'показ: обе бирки загорелись, Коди назвал их');
    qa.expect(qa.qa('.kz-label.is-on').length === 2, 'обе бирки отмечены');
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
    await qa.waitFor(() => qa.text('.kz-br-tab-t') === qa.data.site, 60000, 'показ: карточка title улетела на вкладку');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'показ закончен');
    const said = (re) => qa.events('tts').some((e) => re.test((e.data && e.data.text) || ''));
    qa.expect(said(new RegExp(qa.data.endS6)), 'последняя реплика показа прозвучала (показ не обрывается)');
  } },
  { name: 's7: своё имя в title', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myTitle, 'имя');
    await qa.sleep(1600);
    qa.expect(qa.text('.kz-br-tab-t') === qa.data.myTitle, 'вкладка показывает имя сразу при наборе');
    qa.expect(!qa.platform.nextEnabled(), 'пауза в наборе не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    qa.expect(qa.q('.kz-ready').disabled, 'пока Коди хвалит, второе «Готово» не нажать');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
    await qa.waitFor(() => !qa.q('.kz-ready').disabled, 10000, '«Готово» снова доступна');
    await qa.click('.kz-ready', 'Готово ещё раз (засчёт и событие — один раз, проверка в конце)');
    await qa.sleep(300);
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
    await qa.waitFor(() => qa.q('.kz-bit-pic'), 40000, 'показ: картинка вылетела в окно');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'показ закончен');
    const said = (re) => qa.events('tts').some((e) => re.test((e.data && e.data.text) || ''));
    qa.expect(said(new RegExp(qa.data.endS9)), 'последняя реплика показа прозвучала');
  } },
  { name: 's10: привет в body', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.draft, 'черновик');
    await qa.sleep(1600);
    qa.expect(qa.text('.kz-br-text') === qa.data.draft, 'окно показывает текст сразу при наборе');
    qa.expect(!qa.platform.nextEnabled(), 'пауза в наборе не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
    qa.type('.kz-line textarea', qa.data.myText, 'правка после засчёта');
    await qa.sleep(300);
    qa.expect(qa.text('.kz-br-text') === qa.data.myText, 'окно показывает правку (в артефакт — тоже, проверка в конце)');
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
    await qa.platform.ready(30000);
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.q('.kz-col-text'), 40000, 'показ: страница собрана');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'показ закончен');
    // Коди сам объяснил все части; по желанию ученик нажимает строку кода или блок справа — Коди повторяет.
    const said = (re) => qa.events('tts').some((e) => re.test((e.data && e.data.text) || ''));
    qa.expect(said(new RegExp(qa.data.walkS12)) && said(new RegExp(qa.data.endS12)), 'Коди прошёл по частям до конца и пригласил нажать');
    qa.expect(!qa.q('.kz-ask-n'), 'счётчика нет: нажимать не обязательно');
    await qa.click(qa.qa('.kz-line.kz-tap').find((x) => x.textContent.indexOf('<title>') === 0), 'строка title');
    qa.expect(qa.qa('.kz-line.is-say').length === 1, 'title: своя строка подсвечена');
    await qa.click('.kz-col-body', 'блок body справа');
    qa.expect(qa.qa('.kz-line.is-say').length === 3, 'body: три строки body подсвечены');
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
  { name: 'q1: «Роботы» на вкладку, «Привет!» в окно', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-q1-slot .led, .kz-scrap.is-led'), 'до первой попытки ответ не подсвечен');
    await qa.clickText('.kz-scrap', qa.data.robots); await qa.click('.kz-q1-slot[data-place="tab"]', 'место в title'); await qa.sleep(300);
    await qa.clickText('.kz-scrap', qa.data.salom); await qa.click('.kz-q1-slot[data-place="win"]', 'место в body');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.kz-br-tab-t') === qa.data.robots && qa.text('.kz-br-text') === qa.data.salom, 'вкладка и окно — честно');
  } },
  { name: 'q2: зачем нужен </title>', shot: 'q2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-quiz .kz-btn').length === 3 && !qa.q('.kz-quiz .kz-btn.is-ok, .kz-quiz .kz-btn.is-led'), 'три варианта, ничего не подсвечено');
    await qa.clickNth('.kz-quiz .kz-btn', 1, 'верный ответ');
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
    qa.expect(html.indexOf('<title>' + qa.data.myTitle + '</title>') >= 0 && html.indexOf(qa.data.myText) >= 0 && html.indexOf(qa.data.draft) < 0, 'артефакт — своя страница, с правкой после засчёта', { html });
    const ans = (pl && pl.answers) || [];
    const n = (id) => ans.filter((e) => e.screenId === id).length;
    qa.expect(n('s7') === 1 && n('s10') === 1 && n('q1') === 1 && n('q2') === 1, 'события засчёта s7, s10, q1, q2 — по одному', { s7: n('s7'), s10: n('s10'), q1: n('q1'), q2: n('q2') });
  } }
];

export default {
  title: 'Урок 1 курса HTML «Бумажная страница» (эталон курса)',
  file: 'html/01-struktura-dokumenta',
  adapter: 'canon-html',
  langs: ['ru'],
  size: '1280x720',
  voice: 'fast',
  screens: 18,
  inputScreens: [5, 8, 11],
  expectFinish: true,
  data: {
    ru: { site: 'Мой сайт', myTitle: 'Шахматы', myText: 'Сыграем партию?', hello: 'Привет, мир!', pic: 'картинка', play: 'Играть', robots: 'Роботы', salom: 'Привет!', draft: 'Черновик', endS6: 'Итак: в head', endS9: 'текст, картинки, кнопки', walkS12: 'Это твой текст', endS12: 'послушать ещё раз' },
    uz: { site: 'Mening saytim', myTitle: 'Shaxmat', myText: 'Bir o‘yin o‘ynaymizmi?', hello: 'Salom, dunyo!', pic: 'rasm', play: 'O‘ynash', robots: 'Robotlar', salom: 'Salom!', draft: 'Qoralama', endS6: 'title ichida esa sahifa nomi', endS9: 'hamma narsa bor', walkS12: 'Bu sizning matningiz', endS12: 'Yana eshitmoqchi' },
    en: { site: 'My site', myTitle: 'Chess', myText: 'Shall we play a game?', hello: 'Hello, world!', pic: 'picture', play: 'Play', robots: 'Robots', salom: 'Hello!', draft: 'Draft', endS6: 'the page name is inside title', endS9: 'body holds everything you see', walkS12: 'This is your text', endS12: 'hear it again' }
  },
  steps: STEPS,
  flows: [
    { name: 's4: открывающий вместо закрывающего', start: 4, langs: ['ru'], steps: [{ name: '<html> → причина, без засчёта', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<html>', 'открывающий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's8: промах → дополнительный раунд', start: 8, langs: ['ru'], steps: [{ name: 'неверный ответ', run: async (qa) => {
      await qa.platform.ready();
      const slip = qa.text('.kz-slip');
      await qa.clickNth('.kz-pick .kz-btn', slip.indexOf('<title>') >= 0 ? 1 : 0, 'неверный ответ');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's11: имя в тело — объяснение', start: 11, langs: ['ru'], steps: [{ name: 'имя → body', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-scrap', '<title>' + qa.data.site + '</title>');
      await qa.click('.kz-zone[data-place="body"]', 'тело');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'объяснение на месте задания');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 4, 'вырезка не легла');
    } }] },
    { name: 's7: «Готово» — только по кнопке, один раз; правка — в артефакт', start: 7, langs: ['ru'], steps: [{ name: 'пробелы, теги, засчёт, правка', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '   ', 'одни пробелы');
      qa.expect(qa.q('.kz-ready').disabled, 'пробелы: «Готово» выключена');
      qa.type('.kz-line textarea', '<b>Шахматы</b>', 'с тегами');
      await qa.sleep(200);
      qa.expect(qa.q('.kz-ready').disabled && /угловых скобок/.test(qa.text('.kz-ask')), 'теги: «Готово» выключена, причина на месте задания', { ask: qa.text('.kz-ask') });
      qa.type('.kz-line textarea', 'Ш', 'одна буква');
      await qa.sleep(1500);
      qa.expect(qa.q('.kz-ready').disabled && !qa.platform.nextEnabled(), 'одна буква и пауза — не засчитано');
      qa.type('.kz-line textarea', 'Шахматы', 'имя');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
      qa.type('.kz-line textarea', 'Шашки', 'правка после засчёта');
      await qa.sleep(300);
      qa.expect(qa.text('.kz-br-tab-t') === 'Шашки', 'вкладка показывает правку');
    } }] },
    { name: 'q1: фраза не туда → причина', start: 15, langs: ['ru'], steps: [{ name: '«Роботы» в body', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-scrap', 'Роботы'); await qa.click('.kz-q1-slot[data-place="win"]', 'место в body');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(/title/.test(qa.text('.kz-ask')) && qa.qa('.kz-tray .kz-scrap').length === 2 && !qa.platform.nextEnabled(), 'фраза вернулась, «Дальше» закрыта', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 'q2: неверный ответ → причина, снова', start: 16, langs: ['ru'], steps: [{ name: 'первый вариант', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-quiz .kz-btn', 0, 'неверный ответ');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(qa.qa('.kz-quiz .kz-btn.is-off').length === 1 && !qa.platform.nextEnabled(), 'вариант погас, можно выбрать снова');
      await qa.waitFor(() => !qa.qa('.kz-quiz .kz-btn')[1].disabled, 20000, 'остальные варианты доступны');
      await qa.clickNth('.kz-quiz .kz-btn', 1, 'верный ответ');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] }
  ]
};
