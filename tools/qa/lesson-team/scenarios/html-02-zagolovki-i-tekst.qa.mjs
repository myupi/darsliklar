// Сценарий проверки урока 2 курса HTML lessons/html/02-zagolovki-i-tekst.jsx («Заголовки и текст», облик «Редактор», 03.11.2026).
// По сценарию прежнего урока 2 (test-20-zagolovki-i-tekst.qa.mjs): экрана плана нет, причины ошибок и подсказки —
// в панели снизу (.b-sheet.is-hint), как в уроке 1.
// Основной путь: все экраны действиями ученика (снимок каждого — в решённом виде), своя страница (s13),
// починка </b> (s14), onFinished один раз, артефакт со своим названием и текстом.
// Ветки: открывающий вместо закрывающего (s4); h6 на раздел (s5); </p> первым (s7); не тот абзац → дополнительный раунд (s8);
// неверный тег b/i → дополнительный раунд (s11); <b> без </b> честно делает жирным хвост абзаца (s10).
// Функции шагов выполняются в странице: только аргумент qa (помощники — прямо в шаге).

const STEPS = [
  { name: 's1: каша → страница', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!!qa.q('.z2-wall'), 'сначала каша из текста');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.q('.z2-h1'), 5000, 'появился h1');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'рассказано');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's3: самый крупный и самый мелкий заголовок', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(qa.qa('.z2-hstrip').length === 6, 'шесть полосок h1–h6');
    qa.expect(!qa.q('button.z2-hstrip'), 'показ: полоски не нажимаются');
    await qa.waitFor(() => qa.q('.z2-star'), 40000, 'h1 загорелся звездой');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS3).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(!!qa.q('.z2-loupe'), 'у h6 лупа');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's4: набрать </h1>', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.z2-inh1'), 'абзац огромный, пока h1 не закрыт');
    qa.type('.kz-line textarea', '</h1>', 'закрывающий h1');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.q('.z2-inh1'), 'абзац снова обычный');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's5: h1 и два h2 по местам', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const put = async (t, k) => { await qa.clickText('.kz-scrap', t); await qa.click('.kz-line[data-place="' + k + '"]', 'строка ' + k); await qa.sleep(300); };
    await put('<h1>', 0); await put('<h2>', 1); await put('<h2>', 2);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-tray .kz-scrap').length === 0 || qa.qa('.kz-scrap').length <= 1, 'лишний h6 остался');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's6: обернуть строки в p', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(!qa.q('.kz-line.kz-tap'), 'показ: строки не нажимаются');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS6).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(qa.qa('.z2-p').length === 3, 'три абзаца в окне');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's7: собрать абзац из кусков (Code Builder)', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .z2-p').length === 0 && qa.qa('.kz-scrap').length === 3, 'три куска в лотке, абзаца ещё нет');
    await qa.click('.kz-scrap[data-id="open"]', '<p>'); await qa.sleep(300);
    await qa.click('.kz-scrap[data-id="text"]', 'текст'); await qa.sleep(300);
    qa.expect(qa.qa('.kz-br-page .z2-p').length === 1, 'честно: с текстом внутри <p> строка — уже абзац');
    await qa.click('.kz-scrap[data-id="close"]', '</p>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .z2-p').length === 1 && qa.qa('.kz-br-page .z2-raw').length === 1, 'вторая строка — отдельный абзац, первая осталась текстом');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's8: слово в коде ↔ абзац на странице (Visual Code Mapping)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('button.z2-map.is-call'); r += 1) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('button.z2-map.is-call:not(:disabled)'), 30000, 'абзацы нажимаются');
      const w = qa.text('.kz-code .z2-target');
      const k = qa.qa('button.z2-map').findIndex((b) => b.textContent.indexOf(w) >= 0);
      await qa.clickNth('button.z2-map', k, 'абзац со словом');
      await qa.waitFor(() => qa.q('button.z2-map.is-call:not(:disabled)') || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's9: теги b и i', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.q('.z2-w.is-b.is-on'), 40000, 'слово стало жирным');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS9).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(!!qa.q('.z2-w.is-b.is-on') && !!qa.q('.z2-w.is-i.is-on'), 'слово жирное с полоской и слово курсивом');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's10: <b> и </b> вокруг слова', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.z2-slot textarea');
    qa.type(f[0], '<b>', 'перед словом');
    await qa.sleep(200);
    qa.expect(!!qa.q('.kz-br-page .z2-b'), 'без </b> жирное до конца абзаца');
    qa.type(f[1], '</b>', 'после слова');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's11: b или i', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.z2-tagbtn'); r += 1) {
      await qa.platform.ready(30000);
      const want = qa.q('.z2-card .z2-b') ? 0 : 1;
      await qa.clickNth('.z2-tagbtn', want, 'ответ');
      await qa.waitFor(() => !qa.q('.z2-tagbtn') || qa.qa('.z2-tagbtn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's12: читать как браузер', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.qa('.kz-br-page .z2-blk').length === 4, 40000, 'страница собрана');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS12).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's13: свой заголовок по «Готово»', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myTitle, 'заголовок');
    await qa.sleep(1600);
    qa.expect(qa.text('.kz-br-page .z2-h1') === qa.data.myTitle && !qa.platform.nextEnabled(), 'окно показывает заголовок сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's13b: свой абзац по «Готово»', shot: 's13b-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.text('.kz-br-page .z2-h1') === qa.data.myTitle, 'h1 = свой заголовок с прошлого экрана');
    qa.type('.kz-line textarea', qa.data.myText, 'предложение');
    await qa.sleep(1600);
    qa.expect(!qa.platform.nextEnabled(), 'пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's14: вставить </b>', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .z2-b').length === 2, 'всё жирное до конца страницы');
    await qa.clickText('.kz-scrap', '</b>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .z2-b').length === 1, 'жирное одно слово');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 'q1: найти строку с ошибкой (Error Detective)', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-code .kz-line .led'), 'до первой попытки ответ не подсвечен');
    qa.expect(qa.qa('.kz-br-page .z2-inh1').length >= 1, 'честно: без </h1> текст ниже огромный');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'строка h1');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    qa.expect(qa.qa('.kz-br-page .z2-b').length >= 2, 'честно: без </b> жирным и следующий абзац');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'строка с b');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .z2-b').length === 1, 'после починки жирное одно слово');
  } },
  { name: 'q2: верно или нет (True / False)', shot: 'q2-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [1, 1, 0]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z2-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z2-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.z2-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, '«Завершить урок»');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<h1>' + qa.data.myTitle + '</h1>') >= 0 && html.indexOf(qa.data.myText) >= 0, 'артефакт — своя страница', { html });
  } }
];

export default {
  title: 'Урок 2 курса HTML «Заголовки и текст» (облик «Редактор»)',
  file: 'html/02-zagolovki-i-tekst',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',   // QA_SIZE=360x640 — прогон сценария на телефоне
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 6, 9, 12, 13],
  expectFinish: true,
  data: {
    ru: { myTitle: 'Шахматы', myText: 'Я играю в шахматы с папой.', endS3: 'полоски мы сделали для наглядности', endS6: 'Между абзацами браузер сам делает отступ', endS9: 'закрывающий после', endS12: 'заголовок раздела, и снова абзац' },
    uz: { myTitle: 'Shaxmat', myText: "Men dadam bilan shaxmat o'ynayman.", endS3: 'tasmalarni esa yaqqol', endS6: "o'rtasida brauzer", endS9: 'atrofiga', endS12: 'esa yana abzas' },
    en: { myTitle: 'Chess', myText: 'I play chess with my dad.', endS3: 'We made these strips', endS6: 'adds space between paragraphs', endS9: 'the closing tag after', endS12: 'and another paragraph' }
  },
  steps: STEPS,
  flows: [
    { name: 's4: открывающий вместо закрывающего', start: 2, langs: ['ru'], steps: [{ name: '<h1> → причина, без засчёта', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<h1>', 'открывающий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина на месте задания');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's5: h6 на раздел', start: 3, langs: ['ru'], steps: [{ name: 'h6 → объяснение', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-scrap', '<h6>');
      await qa.click('.kz-line[data-place="1"]', 'раздел');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение');
      qa.expect(qa.qa('.kz-scrap').length === 4, 'бирка не легла');
    } }] },
    { name: 's7: </p> первым → причина', start: 5, langs: ['ru'], steps: [{ name: '</p> в первую строку', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="close"]', '</p>');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-scrap').length === 3 && !qa.platform.nextEnabled(), 'кусок остался в лотке, «Дальше» закрыта');
    } }] },
    { name: 's8: промах → дополнительный раунд', start: 6, langs: ['ru'], steps: [{ name: 'не тот абзац', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('button.z2-map.is-call:not(:disabled)'), 30000, 'абзацы нажимаются');
      await qa.clickNth('button.z2-map', 0, 'первый абзац вместо второго');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's11: неверный тег → дополнительный раунд', start: 9, langs: ['ru'], steps: [{ name: 'i вместо b', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.z2-tagbtn', 1, 'i вместо b');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] }
    ,{ name: 'q1: верная строка → «эта строка в порядке»', start: 14, langs: ['ru'], steps: [{ name: 'строка с p', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла, «Дальше» закрыта');
    } }] },
    { name: 'q2: неверный ответ → объяснение, снова', start: 15, langs: ['ru'], steps: [{ name: '«Верно» про h6', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z2-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z2-tf', 0, 'Верно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.z2-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла, можно выбрать снова');
    } }]}
  ]
};
