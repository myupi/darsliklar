// Сценарий проверки урока 3 курса CSS lessons/css/03-cveta.jsx («Цвета», облик «Редактор»; упрощён 09.11.2026:
// названия, hex из палитры, rgb). Основной путь: все 17 экранов действиями ученика; честная страница (цвета — по
// вычисленному стилю элементов); свои цвета (s14), разгадка (#fa4f28 совпадает), onFinished один раз, артефакт.
// Ветки: опечатка и не тот цвет (s3); без решётки и пять знаков (s6); неверный выбор (s7); 300 и 100 (s9); точка (s12);
// верная строка в «найди ошибку» (s13); синий названием вместо rgb (w1); одинаковые и выдуманные цвета (s14);
// неверный ответ (q1); помощь 1-2-3 на объяснении (s2). Функции шагов — в странице.


const STEPS = [
  { name: 's1: код попадает в цвет логотипа', shot: 's1-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.ready();
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(250, 79, 40)' && !!qa.q('.c3-cmp-r.is-ok'), 'честно: заголовок цвета логотипа, «Совпадает»');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: названия цветов (показ)', shot: 's2-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(0, 0, 139)' && qa.text('.kz-code').indexOf('darkblue') >= 0, 'в конце — darkblue, заголовок тёмно-синий', { color: h1c(qa) });
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's3: вписать green', shot: 's3-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c3-slot textarea', 'green', 'ввод');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(0, 128, 0)', 'честно: заголовок зелёный сразу', { color: h1c(qa), p: pc(qa) });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: пятно → название', shot: 's4-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    for (const v of ['green', 'lightblue', 'darkblue']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c3-opt[data-v="' + v + '"]:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c3-opt[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c3-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: код из палитры (показ)', shot: 's5-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(30, 144, 255)' && !!qa.q('.c3-hexparts') && !!qa.q('.c3-pal-i.is-on'), 'в конце — #1E90FF из палитры, разбор «# и 6 знаков»', { color: h1c(qa) });
  } },
  { name: 's6: код фиолетового из палитры', shot: 's6-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c3-slot textarea', '#8E44AD', 'ввод');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(142, 68, 173)', 'честно: заголовок фиолетовый сразу', { color: h1c(qa), p: pc(qa) });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: код верный или сломан', shot: 's7-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    for (const v of ['ok', 'bad', 'bad', 'ok']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c3-opt[data-v="' + v + '"]:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c3-opt[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c3-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: rgb (показ)', shot: 's8-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(0, 0, 0)' && !!qa.q('.c3-mx-ext'), 'в конце — чёрный и подписи 0 и 255', { color: h1c(qa) });
  } },
  { name: 's9: зелёный луч на полную', shot: 's9-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c3-slot textarea', '255', 'ввод');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(0, 255, 0)', 'честно: заголовок ярко-зелёный', { color: h1c(qa), p: pc(qa) });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: rgb → цвет', shot: 's10-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    for (const v of ['red', 'black', 'blue', 'white']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c3-opt[data-v="' + v + '"]:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c3-opt[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c3-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда цвет ломается (показ)', shot: 's11-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(700);
    qa.expect(h1c(qa) !== 'rgb(250, 79, 40)' && !qa.q('.c3-cmp-r.is-ok'), 'честно: сломанный цвет не красит', { color: h1c(qa) });
  } },
  { name: 's12: поставить решётку', shot: 's12-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/FA4F28/.test(qa.q('.c3-slot textarea').value) && h1c(qa) !== 'rgb(250, 79, 40)', 'в поле код без решётки, цвет не тот');
    qa.type('.c3-slot textarea', '#FA4F28', 'решётка');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(250, 79, 40)' && !!qa.q('.c3-cmp-r.is-ok'), 'честно: заголовок цвета логотипа');
  } },
  { name: 's13: найти сломанное правило', shot: 's13-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(pc(qa) !== 'rgb(0, 128, 0)', 'честно: gren не красит абзац');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'gren');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, '#1E90F — пять знаков');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
    await qa.sleep(700);
    qa.expect(h1c(qa) === 'rgb(30, 144, 255)', 'честно: после починки заголовок синий', { color: h1c(qa) });
  } },
  { name: 'w1: правило целиком через rgb', shot: 'w1-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c3-slot-rule textarea', 'p { color: rgb(0, 0, 255); }', 'ввод');
    await qa.sleep(700);
    qa.expect(pc(qa) === 'rgb(0, 0, 255)', 'честно: абзац синий сразу', { color: h1c(qa), p: pc(qa) });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: свои цвета', shot: 's14-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
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
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    for (const k of [0, 0, 1, 0]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c3-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c3-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c3-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
    await qa.platform.next();
    await qa.sleep(1500);
    qa.expect(h1c(qa) === 'rgb(250, 79, 40)' && !!qa.q('.c3-cmp-r.is-ok'), 'разгадка: #fa4f28 — тот же цвет, «Совпадает»');
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить урок»');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
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
    ru: { endS2: 'без пробелов' },
    uz: { endS2: "bo'sh joysiz" },
    en: { endS2: 'without spaces' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: опечатка и не тот цвет → причины', start: 2, langs: ['ru'], steps: [{ name: 'gren, red', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      qa.type('.c3-slot textarea', 'gren', 'опечатка');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /без ошибок/i), 3000, 'причина: опечатка');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
      await qa.waitFor(() => qa.q('.key-go:not(:disabled)'), 30000, 'можно проверить снова');
      qa.type('.c3-slot textarea', 'red', 'другой цвет');
      await qa.sleep(500);
      qa.expect(h1c(qa) === 'rgb(255, 0, 0)', 'честно: заголовок красный');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /не зелёный/i), 3000, 'причина: не зелёный');
    } }] },
    { name: 's6: без решётки и пять знаков → причины', start: 5, langs: ['ru'], steps: [{ name: '8E44AD, #8E44A', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      qa.type('.c3-slot textarea', '8E44AD', 'без решётки');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /решётк/i), 3000, 'причина про решётку');
      await qa.waitFor(() => qa.q('.key-go:not(:disabled)'), 30000, 'можно проверить снова');
      qa.type('.c3-slot textarea', '#8E44A', 'пять знаков');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /потерял/i), 3000, 'причина: знак потерялся');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's7: неверный ответ → причина', start: 6, langs: ['ru'], steps: [{ name: '«Сломан» у верного кода', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c3-opt:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c3-opt[data-v="bad"]', 'Сломан');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.c3-opt.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] },
    { name: 's9: больше 255 и мало → причины', start: 8, langs: ['ru'], steps: [{ name: '300, 100', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      qa.type('.c3-slot textarea', '300', 'много');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /больш/i), 3000, 'причина: такого числа нет');
      await qa.waitFor(() => qa.q('.key-go:not(:disabled)'), 30000, 'можно проверить снова');
      qa.type('.c3-slot textarea', '100', 'мало');
      await qa.sleep(500);
      qa.expect(h1c(qa) === 'rgb(0, 100, 0)', 'честно: тёмно-зелёный', { color: h1c(qa) });
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /не на полную/i), 3000, 'причина: не на полную');
    } }] },
    { name: 's12: точка → причина', start: 11, langs: ['ru'], steps: [{ name: '.', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      qa.type('.c3-slot textarea', '.', 'точка');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /не узнал/i), 3000, 'причина: браузер не узнал');
      qa.expect(!qa.platform.nextEnabled() && !qa.q('.c3-cmp-r.is-ok'), '«Дальше» закрыта, цвет не тот');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 'w1: синий без rgb → причина', start: 13, langs: ['ru'], steps: [{ name: 'p { color: blue; }', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      qa.type('.c3-slot-rule textarea', 'p { color: blue; }', 'название');
      await qa.sleep(700);
      qa.expect(pc(qa) === 'rgb(0, 0, 255)', 'честно: абзац синий', { p: pc(qa) });
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /через rgb/i), 3000, 'причина: нужно через rgb');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's14: одинаковые и выдуманные цвета → причина', start: 14, langs: ['ru'], steps: [{ name: 'red + red, redd', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
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
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про red', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c3-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c3-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c3-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] },
    { name: 's2: помощь 1-2-3 на объяснении', start: 1, langs: ['ru'], steps: [{ name: 'лампочка три раза', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : ''); const h1c = (qa) => cs(qa.q('.kz-br-page .c3-h1')); const pc = (qa) => cs(qa.q('.kz-br-page .c3-p')); const bgc = (qa) => cs(qa.q('.kz-br-body'), 'backgroundColor'); const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready(30000);
      for (let k = 1; k <= 3; k++) {
        await qa.click('.ctl-hint', 'лампочка');
        await qa.waitFor(() => new RegExp('^' + k + '/3').test(qa.text('.b-sheet.is-hint p')), 3000, 'ступень ' + k + '/3');
      }
    } }] }
  ]
};
