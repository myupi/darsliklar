// Тестовый урок 16 «B · O‘yin» — сценарий урока 1 (html-01-struktura-dokumenta.qa.mjs, 28.10.2026)
// с рамкой B: причина ошибки и подсказка — в панели «Maslahat» снизу (.b-sheet.is-hint), а не в строке задания.
// Сценарий проверки урока 1 курса HTML lessons/html/01-struktura-dokumenta.jsx («Бумажная страница», эталон курса).
// Основной путь: все 17 экранов действиями ученика (без экрана плана; rd «как читают код» — второй; «что такое тег» — на s3; «вкладка или окно» — после body, 26.10.2026) (снимок каждого экрана — в решённом виде, до «Дальше»), своё имя (s7) и привет (s10)
// по кнопке «Готово», каркас (s13), починка </title> (s14), итоговая проверка q1 (вкладка/окно) и q2 (зачем </title>),
// onFinished один раз, артефакт со своим именем.
// Ветки: неверный закрывающий тег; промах в прогнозе → дополнительный раунд и подсказка; имя страницы в теле → объяснение;
// s14: две ошибки → подсказка и светится </title>;
// s7: пауза в наборе не засчитывает, пробелы и теги не принимаются, похвала один раз, правка после засчёта — в артефакт;
// q1: фраза не туда → причина, без засчёта; q2: неверный ответ → причина, можно снова.
// Функции шагов выполняются в странице: только аргумент qa.

const STEPS = [
  { name: 's1: страница в браузере собирается в человечка', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br') && !qa.q('.kz-man'), 'сначала бумажная страница в браузере');
    await qa.waitFor(() => { const b = qa.q('.kz-btn.is-coral'); return b && !b.disabled; }, 40000, 'Коди показал вкладку и задал вопрос, кнопка включилась');
    const said = (re) => qa.events('tts').some((e) => re.test((e.data && e.data.text) || ''));
    qa.expect(!said(/Большое место ниже/), 'до превращения окно не объясняется (оно — на s6)');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.q('.kz-s1.is-man .kz-man') && !qa.q('.kz-s1 .kz-br'), 5000, 'собрался человечек, браузера нет');
    await qa.platform.ready(30000);
    qa.expect(said(new RegExp(qa.data.goalS1)), 'короткая цель вместо плана прозвучала');
  } },
  { name: 'rd: как читают код — слева направо, сверху вниз', shot: 'rd-done', run: async (qa) => {
    await qa.platform.next();
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.q('.kz-line.kz-sweep'), 30000, 'маркер бежит по строке');
    await qa.waitFor(() => qa.q('.kz-col-text'), 40000, 'страница собрана по ходу чтения');
    await qa.waitFor(() => qa.q('.kz-rd-arr.is-right.is-on'), 40000, 'стрелка «слева направо» загорелась');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'показ закончен');
    const said = (re) => qa.events('tts').some((e) => re.test((e.data && e.data.text) || ''));
    qa.expect(said(new RegExp(qa.data.lrRD)) && said(new RegExp(qa.data.tbRD)), 'Коди сказал «слева направо» и «сверху вниз»');
  } },
  { name: 's3: что такое тег — на бирках рамки', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    qa.expect(!qa.q('.kz-hand'), 'руки нет');
    await qa.waitFor(() => qa.q('.kz-label.is-spot'), 30000, '«прожектор» на бирке, о которой говорит Коди');
    // Реплики v2: ученик сам нажимает верхнюю бирку, потом нижнюю.
    await qa.waitFor(() => qa.q('.kz-frame-lbl-top.b16-tapme'), 40000, 'верхняя бирка зовёт нажать');
    qa.click(qa.q('.kz-frame-lbl-top'), 'верхняя бирка');
    await qa.waitFor(() => qa.q('.kz-label.hl-br'), 40000, '«угловые скобки» — светятся < и >');
    await qa.waitFor(() => qa.q('.kz-label.hl-nm'), 40000, '«название тега» — светится html');
    await qa.waitFor(() => qa.q('.kz-frame-lbl-bot.b16-tapme'), 60000, 'нижняя бирка зовёт нажать');
    qa.click(qa.q('.kz-frame-lbl-bot'), 'нижняя бирка');
    await qa.waitFor(() => qa.q('.kz-label.is-slash'), 60000, 'на закрывающем — косая черта крупно');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'показ: обе бирки загорелись, Коди назвал их');
    const said = (re) => qa.events('tts').some((e) => re.test((e.data && e.data.text) || ''));
    qa.expect(said(new RegExp(qa.data.tagS3)), 'Коди объяснил, что такое тег');
    qa.expect(qa.qa('.kz-label.is-on').length === 2, 'обе бирки отмечены');
    // Рамка html — вокруг всего браузера, вместе с вкладкой; открывающий тег — слева сверху.
    const box = qa.q('.kz-stagebox.is-br').getBoundingClientRect(), br = qa.q('.kz-br').getBoundingClientRect(), lbl = qa.q('.kz-frame-lbl-top').getBoundingClientRect();
    qa.expect(br.top > box.top && br.bottom < box.bottom && lbl.left < br.left + br.width / 2 && lbl.top < br.top, 'рамка вокруг всего браузера, <html> слева сверху', { box: [box.top, box.bottom], br: [br.left, br.top, br.bottom], lbl: [lbl.left, lbl.top] });
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
    qa.expect(!qa.q('.speaker-bubble') && !qa.q('.ctl-subs'), 'облака с текстом и кнопки «Aa» нет');
    await qa.waitFor(() => qa.q('.b16-tapme'), 60000, 'голова зовёт нажать');
    qa.click(qa.q('.b16-tapme'), 'голова человечка');
    await qa.waitFor(() => qa.q('.kz-man-title.b16-tapme'), 60000, 'бумажка с названием зовёт нажать');
    qa.click(qa.q('.kz-man-title.b16-tapme'), 'бумажка с названием');
    await qa.waitFor(() => qa.text('.kz-br-tab-t') === qa.data.site, 60000, 'карточка title улетела на вкладку');
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
  { name: 's9: тело → содержимое в окне', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.q('.kz-bit-pic'), 40000, 'показ: картинка вылетела в окно');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'показ закончен');
    qa.expect(!/\+/.test(qa.text('.kz-code')) && qa.text('.kz-code').indexOf(qa.data.pic) < 0, 'в коде body только текст, без «+ картинка + Играть»', { code: qa.text('.kz-code') });
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
  { name: 's8: вкладка или окно', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.kz-pick'); r += 1) {
      await qa.platform.ready(30000);
      const slip = qa.text('.kz-slip');
      qa.expect(/<(title|body)>/.test(slip), 'в строке кода — title или body, строк без тегов нет', { slip });
      await qa.clickNth('.kz-pick .kz-btn', slip.indexOf('<title>') >= 0 ? 0 : 1, 'ответ');
      await qa.waitFor(() => !qa.q('.kz-pick') || qa.qa('.kz-pick .kz-btn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
    qa.expect(qa.text('.kz-br-tab-t') !== 'index.html', 'на вкладке не имя файла');
  } },
  { name: 's11: разложить вырезки', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const put = async (t, where) => { await qa.clickText('.kz-scrap', t); await qa.click('.kz-zone[data-place="' + where + '"]', where); await qa.sleep(300); };
    await put('<title>' + qa.data.myTitle + '</title>', 'head'); await put(qa.data.myText, 'body'); await put(qa.data.pic, 'body'); await put(qa.data.play, 'body');   // v2: на вырезке — приветствие ученика
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
      await qa.waitFor(() => !qa.q('.kz-pool .kz-scrap:disabled'), 30000, 'полоски доступны');
      const b = qa.qa('.kz-pool .kz-scrap').find((x) => x.textContent.replace(/\s+/g, '') === t.replace(/\s+/g, ''));
      await qa.click(b, 'полоска ' + t); await qa.sleep(150);
    }
    const said = (re) => qa.events('tts').some((e) => re.test((e.data && e.data.text) || ''));
    qa.expect(said(new RegExp(qa.data.moveS13)), 'после первой полоски Коди объяснил стрелки и «Проверить»');
    await qa.waitFor(() => !qa.q('.kz-build-side .kz-btn').disabled, 30000, '«Проверить» доступна');
    await qa.click('.kz-build-side .kz-btn', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'каркас верный');
  } },
  { name: 's14: вкладка съела страницу — </title>', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.text('.kz-br-tab-t').indexOf('</head>') > 0, 'вкладка съела страницу');
    qa.expect(!qa.q('.kz-scrap.is-led'), 'до ошибок ответ не подсвечен');
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
    await qa.clickText('.kz-quiz .kz-btn', qa.data.q2ok, 'верный ответ');
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
  file: 'test/16-b-oyin',
  adapter: 'canon-html',
  langs: ['ru'],
  size: '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [4, 7, 9],
  expectFinish: true,
  data: {
    ru: { site: 'Мой сайт', myTitle: 'Шахматы', myText: 'Сыграем партию?', hello: 'Привет, мир!', pic: 'картинка', play: 'Играть', robots: 'Роботы', salom: 'Привет!', draft: 'Черновик', endS6: 'живёт внутри', endS9: 'на следующих уроках', walkS12: 'твоё приветствие', endS12: 'послушать ещё раз', goalS1: 'сделаешь свою страницу', tagS3: 'Скобки и имя вместе', lrRD: 'слева направо', tbRD: 'сверху вниз', moveS13: 'стрелками вверх и вниз', hintS8: 'тегами', noTags: 'угловых скобок', q2ok: 'Показывает, где кончается название', q2page: 'Показывает, где кончается страница', q2win: 'Показывает название в окне' },
    uz: { site: 'Mening saytim', myTitle: 'Shaxmat', myText: 'Bir o‘yin o‘ynaymizmi?', hello: 'Salom, dunyo!', pic: 'rasm', play: 'O‘ynash', robots: 'Robotlar', salom: 'Salom!', draft: 'Qoralama', endS6: 'ichida yashaydi', endS9: 'keyingi darslarda', walkS12: 'sizning salomingiz', endS12: 'eshitmoqchimisiz', goalS1: 'sahifangizni yasaysiz', tagS3: 'butunligicha', lrRD: 'chapdan o.ngga', tbRD: 'tepadan pastga', moveS13: 'o.qchalar bilan', hintS8: 'o.rtasida', noTags: 'qavslar kerak emas', q2ok: 'Nom qayerda tugashini ko‘rsatadi', q2page: 'Sahifa qayerda tugashini ko‘rsatadi', q2win: 'Nomni oynada ko‘rsatadi' },
    en: { site: 'My site', myTitle: 'Chess', myText: 'Shall we play a game?', hello: 'Hello, world!', pic: 'picture', play: 'Play', robots: 'Robots', salom: 'Hello!', draft: 'Draft', endS6: 'title lives inside head', endS9: 'lives inside body', walkS12: 'your greeting', endS12: 'hear it again', goalS1: 'make your own page', tagS3: 'together make a tag', lrRD: 'left to right', tbRD: 'top to bottom', moveS13: 'with the arrows', hintS8: 'Which tags', noTags: 'angle brackets', q2ok: 'Shows where the name ends', q2page: 'Shows where the page ends', q2win: 'Shows the name in the window' }
  },
  steps: STEPS,
  flows: [
    { name: 's4: открывающий вместо закрывающего', start: 3, langs: ['ru', 'uz', 'en'], steps: [{ name: '<html> → причина, без засчёта', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<html>', 'открывающий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина на месте задания');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's8: промах → дополнительный раунд, после двух — подсказка', start: 9, langs: ['ru', 'uz', 'en'], steps: [{ name: 'неверные ответы', run: async (qa) => {
      await qa.platform.ready();
      const wrong = async () => { const slip = qa.text('.kz-slip'); await qa.clickNth('.kz-pick .kz-btn', slip.indexOf('<title>') >= 0 ? 1 : 0, 'неверный ответ'); };
      await wrong();
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
      await qa.waitFor(() => qa.qa('.kz-pick .kz-btn').every((b) => !b.disabled), 30000, 'следующий раунд');
      await wrong();
      await qa.waitFor(() => qa.qa('.kz-pick .kz-btn').every((b) => !b.disabled) && qa.q('.b-sheet.is-hint'), 30000, 'после двух промахов — подсказка');
      qa.expect(new RegExp(qa.data.hintS8).test((qa.text('.b-sheet-tx') || qa.text('.kz-ask'))), 'первая ступень: «Между какими тегами стоит слово?»', { ask: (qa.text('.b-sheet-tx') || qa.text('.kz-ask')) });
    } }] },
    { name: 's14: две ошибки → подсказка, светится </title>', start: 13, langs: ['ru', 'uz', 'en'], steps: [{ name: '<title>, потом </head>', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-scrap', '<title>');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина на месте задания');
      await qa.waitFor(() => !qa.qa('.kz-scrap').find((b) => b.textContent === '</head>').disabled, 20000, 'можно выбрать снова');
      await qa.clickText('.kz-scrap', '</head>');
      await qa.waitFor(() => qa.q('.kz-scrap.is-led'), 3000, 'светится </title>');
      qa.expect(qa.q('.kz-scrap.is-led').textContent === '</title>' && !qa.platform.nextEnabled(), 'подсвечен верный тег, «Дальше» закрыта');
    } }] },
    { name: 's11: имя в тело — объяснение', start: 10, langs: ['ru', 'uz', 'en'], steps: [{ name: 'имя → body', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-scrap', '<title>' + qa.data.site + '</title>');
      await qa.click('.kz-zone[data-place="body"]', 'тело');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение на месте задания');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 4, 'вырезка не легла');
    } }] },
    { name: 's7: «Готово» — только по кнопке, один раз; правка — в артефакт', start: 6, langs: ['ru', 'uz', 'en'], steps: [{ name: 'пробелы, теги, засчёт, правка', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '   ', 'одни пробелы');
      qa.expect(qa.q('.kz-ready').disabled, 'пробелы: «Готово» выключена');
      qa.type('.kz-line textarea', '<b>Шахматы</b>', 'с тегами');
      await qa.sleep(200);
      qa.expect(qa.q('.kz-ready').disabled && new RegExp(qa.data.noTags).test((qa.text('.b-sheet-tx') || qa.text('.kz-ask'))), 'теги: «Готово» выключена, причина на месте задания', { ask: (qa.text('.b-sheet-tx') || qa.text('.kz-ask')) });
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
    { name: 'q1: фраза не туда → причина', start: 14, langs: ['ru', 'uz', 'en'], steps: [{ name: '«Роботы» в body', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-scrap', qa.data.robots); await qa.click('.kz-q1-slot[data-place="win"]', 'место в body');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина на месте задания');
      qa.expect(/title/.test((qa.text('.b-sheet-tx') || qa.text('.kz-ask'))) && qa.qa('.kz-tray .kz-scrap').length === 2 && !qa.platform.nextEnabled(), 'фраза вернулась, «Дальше» закрыта', { ask: (qa.text('.b-sheet-tx') || qa.text('.kz-ask')) });
    } }] },
    { name: 's4: знаки не по порядку → «проверь порядок» и опора', start: 3, langs: ['ru', 'uz', 'en'], steps: [{ name: '<ht/ml>', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<ht/ml>', 'черта не на месте');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина на месте задания');
      qa.expect(!qa.q('.kz-order-hint') && qa.q('.kz-frame-lbl-top.is-on'), 'опора: верхний тег на рамке; кнопки набора — только на третьей ступени (v2)');
      qa.expect(qa.q('.kz-line textarea').value === '<ht/ml>' && !qa.platform.nextEnabled(), 'набранное сохранено, «Дальше» закрыта');
    } }] },
    { name: 's5: тег с обратной чертой → причина', start: 4, langs: ['ru', 'uz', 'en'], steps: [{ name: 'обратная черта наверх', run: async (qa) => {
      await qa.platform.ready();
      await qa.click(qa.qa('.kz-tray .kz-scrap').find((x) => x.textContent.indexOf('\\') >= 0), 'тег с обратной чертой'); await qa.click('.kz-slot-top', 'верхнее место');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина на месте задания');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 3 && !qa.platform.nextEnabled(), 'тег вернулся в лоток');
    } }] },
    { name: 's10: теги в приветствии → причина', start: 8, langs: ['ru', 'uz', 'en'], steps: [{ name: 'с тегами', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<b>' + qa.data.myText + '</b>', 'с тегами');
      await qa.sleep(200);
      qa.expect(qa.q('.kz-ready').disabled && new RegExp(qa.data.noTags).test((qa.text('.b-sheet-tx') || qa.text('.kz-ask'))), 'теги: «Готово» выключена, причина на месте задания', { ask: (qa.text('.b-sheet-tx') || qa.text('.kz-ask')) });
    } }] },
    { name: 's13: неверный порядок → правило; подсказка 3 → обмен нажатиями', start: 12, langs: ['ru', 'uz', 'en'], steps: [{ name: 'закрывающий head раньше открывающего, потом обмен', run: async (qa) => {
      await qa.platform.ready();
      // Экран открыт сразу — в полоске текста стоит приветствие по умолчанию: это единственная полоска не с «<».
      for (const t of ['<html>', '</head>', '<title>…</title>', '<head>', '<body>', null, '</body>', '</html>']) {
        await qa.waitFor(() => !qa.q('.kz-pool .kz-scrap:disabled'), 30000, 'полоски доступны');
        const b = qa.qa('.kz-pool .kz-scrap').find((x) => (t === null ? x.textContent.trim().charAt(0) !== '<' : x.textContent.replace(/\s+/g, '') === t.replace(/\s+/g, '')));
        qa.expect(!!b, 'полоска в лотке: ' + (t || 'текст'));
        await qa.click(b, 'полоска ' + (t || 'текст')); await qa.sleep(150);
      }
      await qa.waitFor(() => qa.q('.kz-build-side .kz-btn') && !qa.q('.kz-build-side .kz-btn').disabled, 30000, '«Проверить» доступна');
      await qa.click('.kz-build-side .kz-btn', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint') && qa.qa('.kz-line.is-mark').length === 2, 4000, 'правило названо, две полоски отмечены');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(500); }
      await qa.waitFor(() => qa.qa('.kz-line.is-mark .led.on, .kz-line.is-mark .led.is-on').length >= 1 || qa.qa('.kz-line.is-mark').length === 2, 5000, 'отмеченные полоски на месте');
      await qa.waitFor(() => !qa.qa('.kz-line.is-mark')[0].disabled, 30000, 'полоски можно нажать');
      const m = qa.qa('.kz-line.is-mark');
      await qa.click(m[0], 'первая отмеченная'); await qa.sleep(200);
      await qa.click(qa.qa('.kz-line.is-mark').find((x) => x !== m[0]) || m[1], 'вторая отмеченная'); await qa.sleep(300);
      await qa.click('.kz-build-side .kz-btn', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'после обмена код верный');
    } }] },
    { name: 'q2: второй неверный ответ → причина', start: 15, langs: ['ru', 'uz', 'en'], steps: [{ name: '«Начинает новую страницу»', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-quiz .kz-btn', qa.data.q2page, 'неверный ответ');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина на месте задания');
      qa.expect(qa.qa('.kz-quiz .kz-btn.is-off').length === 1 && !qa.platform.nextEnabled(), 'вариант погас');
    } }] },
    { name: 'q2: неверный ответ → причина, снова', start: 15, langs: ['ru', 'uz', 'en'], steps: [{ name: 'первый вариант', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-quiz .kz-btn', qa.data.q2win, 'неверный ответ');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина на месте задания');
      qa.expect(qa.qa('.kz-quiz .kz-btn.is-off').length === 1 && !qa.platform.nextEnabled(), 'вариант погас, можно выбрать снова');
      await qa.waitFor(() => !qa.qa('.kz-quiz .kz-btn').find((b) => b.textContent.trim() === qa.data.q2ok).disabled, 20000, 'остальные варианты доступны');
      await qa.clickText('.kz-quiz .kz-btn', qa.data.q2ok, 'верный ответ');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] }
  ]
};
