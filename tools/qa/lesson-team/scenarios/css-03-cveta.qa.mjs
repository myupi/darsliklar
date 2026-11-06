// Сценарий проверки урока 3 курса CSS lessons/css/03-cveta.jsx («Цвета», облик «Редактор», 05.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (цвета — по вычисленному стилю элементов);
// свои цвета (s14), onFinished один раз, артефакт со своими цветами.
// Ветки: «#» второй раз и короткая запись 00F (s3); лишний синий (s6); не тот код (s7); другое место на круге (s9);
// точка вместо решётки (s12); верная строка в «найди ошибку» (s13); код без «#» (w1); одинаковые и выдуманные
// цвета (s14); неверный ответ (q1). Функции шагов — в странице.


const STEPS = [
  { name: 's1: код попадает в цвет логотипа', shot: 's1-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.ready();
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(250, 79, 40)' && !!qa.q('.c3-cmp-r.is-ok'), 'честно: заголовок цвета логотипа, «Совпадает»');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: hex (показ)', shot: 's2-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(0, 0, 255)' && qa.text('.kz-code').indexOf('#0000FF') >= 0, 'в конце — #0000FF, заголовок синий');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's3: вписать hex синего', shot: 's3-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c3-slot textarea', '0000FF', 'hex');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(0, 0, 255)', 'честно: заголовок синий сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: hex ↔ цвет', shot: 's4-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    for (const k of ['red', 'green', 'black']) {
      await qa.waitFor(() => qa.q('.c3-mtag[data-t="' + k + '"]:not(:disabled)'), 20000, 'код нажимается');
      await qa.click('.c3-mtag[data-t="' + k + '"]', k); await qa.click('.c3-mcard[data-card="' + k + '"]', 'цвет ' + k);
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's5: rgb (показ)', shot: 's5-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(0, 0, 0)' && !!qa.q('.c3-mx-ext'), 'в конце — чёрный и подписи 0 и 255');
  } },
  { name: 's6: три числа для жёлтого фона', shot: 's6-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c3-slot textarea');
    qa.type(f[0], '255', 'красный'); qa.type(f[1], '255', 'зелёный'); qa.type(f[2], '0', 'синий');
    await qa.sleep(700);
    qa.expect(bgc(qa) === 'rgb(255, 255, 0)', 'честно: фон страницы жёлтый');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: какой rgb у цвета', shot: 's7-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    for (const v of ['rgb(255, 255, 0)', 'rgb(0, 0, 0)', 'rgb(128, 0, 128)']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c3-opt[data-v="' + v + '"]:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c3-opt[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c3-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: hsl (показ)', shot: 's8-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(900);
    qa.expect(/^rgb\(0, 0, 12[78]\)$/.test(h1c(qa)) && !!qa.q('.c3-lb'), 'в конце — тёмно-синий, полоса светлоты', { color: h1c(qa) });
  } },
  { name: 's9: место на круге для зелёного', shot: 's9-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c3-slot textarea', '120', 'место');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(0, 204, 0)', 'честно: заголовок зелёный', { color: h1c(qa) });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: светлый или тёмный', shot: 's10-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    for (const v of ['light', 'dark', 'light', 'dark']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c3-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c3-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c3-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда цвет ломается (показ)', shot: 's11-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(h1c(qa) !== 'rgb(250, 79, 40)' && !qa.q('.c3-cmp-r.is-ok'), 'честно: сломанный цвет не красит');
  } },
  { name: 's12: поставить решётку', shot: 's12-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c3-slot textarea', '#', 'решётка');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(250, 79, 40)' && !!qa.q('.c3-cmp-r.is-ok'), 'честно: заголовок цвета логотипа');
  } },
  { name: 's13: найти сломанное правило', shot: 's13-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, '#GG0000');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'hsl без процентов');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
    await qa.sleep(700);
    qa.expect(bgc(qa) !== 'rgba(0, 0, 0, 0)' && bgc(qa) !== 'rgb(255, 255, 255)', 'честно: после починки фон окрасился', { bg: bgc(qa) });
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c3-slot-rule textarea', 'body { background-color: #FFE0B2; }', 'правило');
    await qa.sleep(700);
    qa.expect(bgc(qa) === 'rgb(255, 224, 178)', 'честно: фон окрасился сразу', { bg: bgc(qa) });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: свои цвета', shot: 's14-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c3-slot textarea');
    qa.type(f[0], 'purple', 'цвет заголовка'); qa.type(f[1], 'lavender', 'цвет фона');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(128, 0, 128)' && bgc(qa) === 'rgb(230, 230, 250)', 'честно: страница в своих цветах');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    for (const k of [0, 1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c3-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c3-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c3-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить урок»');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('h1 { color: purple; }') >= 0 && html.indexOf('body { background-color: lavender; }') >= 0, 'артефакт — свои цвета', { html });
  } }
];

export default {
  title: 'Урок 3 курса CSS «Цвета» (облик «Редактор»)',
  file: 'css/03-cveta',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 6, 9, 12, 14, 15],
  expectFinish: true,
  data: {
    ru: { endS2: 'буквы от A до F' },
    uz: { endS2: 'A dan F gacha harflar' },
    en: { endS2: 'letters A to F' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: «#» второй раз → причина; 00F — тоже синий', start: 2, langs: ['ru'], steps: [{ name: '#0000FF, 00F', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      qa.type('.c3-slot textarea', '#0000FF', 'с решёткой');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /решётк/i), 3000, 'причина про решётку');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
      await qa.waitFor(() => qa.q('.key-go:not(:disabled)'), 30000, 'можно проверить снова');
      qa.type('.c3-slot textarea', '00F', 'короткая запись');
      await qa.sleep(600);
      qa.expect(h1c(qa) === 'rgb(0, 0, 255)', 'честно: 00F — синий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'короткая запись засчитана');
    } }] },
    { name: 's6: лишний синий → причина', start: 5, langs: ['ru'], steps: [{ name: '255, 255, 255', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      const f = qa.qa('.c3-slot textarea');
      qa.type(f[0], '255', 'к'); qa.type(f[1], '255', 'з'); qa.type(f[2], '255', 'с');
      await qa.sleep(600);
      qa.expect(bgc(qa) === 'rgb(255, 255, 255)', 'честно: получился белый');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /синий/i), 3000, 'причина про синий');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's7: не тот код → причина', start: 6, langs: ['ru'], steps: [{ name: 'rgb(0, 0, 255)', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c3-opt:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c3-opt[data-v="rgb(0, 0, 255)"]', 'синий');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.c3-opt.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] },
    { name: 's9: другое место → причина', start: 8, langs: ['ru'], steps: [{ name: '240', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      qa.type('.c3-slot textarea', '240', 'синий');
      await qa.sleep(600);
      qa.expect(h1c(qa) === 'rgb(0, 0, 204)', 'честно: заголовок синий', { color: h1c(qa) });
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /другой цвет/i), 3000, 'причина: другой цвет');
    } }] },
    { name: 's12: точка → причина', start: 11, langs: ['ru'], steps: [{ name: '.', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      qa.type('.c3-slot textarea', '.', 'точка');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /точк/i), 3000, 'причина про точку');
      qa.expect(!qa.platform.nextEnabled() && !qa.q('.c3-cmp-r.is-ok'), '«Дальше» закрыта, цвет не тот');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'вторая строка', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 'w1: код без «#» → причина', start: 13, langs: ['ru'], steps: [{ name: 'FFE0B2', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      qa.type('.c3-slot-rule textarea', 'body { background-color: FFE0B2; }', 'без решётки');
      await qa.sleep(700);
      qa.expect(bgc(qa) !== 'rgb(255, 224, 178)', 'честно: без решётки фон не окрасился', { bg: bgc(qa) });
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /решётк/i), 3000, 'причина про решётку');
    } }] },
    { name: 's14: одинаковые и выдуманные цвета → причина', start: 14, langs: ['ru'], steps: [{ name: 'red + red, redd', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      const f = qa.qa('.c3-slot textarea');
      qa.type(f[0], 'red', 'заголовок'); qa.type(f[1], '#FF0000', 'фон');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => hintIs(qa, /одного цвета/i), 3000, 'причина: один цвет');
      await qa.waitFor(() => qa.q('.kz-ready:not(:disabled)'), 30000, 'можно снова');
      qa.type(f[0], 'redd', 'выдуманный');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => hintIs(qa, /redd/), 3000, 'причина называет выдуманный цвет');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про FF0000', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c3-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c3-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c3-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
