// Сценарий проверки урока 4 курса CSS lessons/css/04-fon.jsx («Фон», облик «Редактор», 05.11.2026; упрощён 09.11.2026:
// повтор и размер — отдельные показы, задание на cover). Основной путь: все 19 экранов действиями ученика; честная страница (фон — по вычисленному стилю окна и элементов);
// свой фон (s14), onFinished один раз, артефакт со своим фоном.
// Ветки: другой цвет (s3); не то место (s4); src= (s6); «no repeat» с пробелом (s9); «url» без скобки (s12); верная
// строка в «найди ошибку» (s13); без url и чужое имя файла (w1); имени нет среди файлов (s14); неверный ответ (q1);
// contain вместо cover (s9b); помощь 1-2-3 на объяснении (s8b).
// Функции шагов выполняются в странице — помощники объявлены внутри каждого шага.

const STEPS = [
  { name: 's1: поле за страницей, белый фон под текстом', shot: 's1-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.ready();
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(700);
    qa.expect(/data:image\/svg/.test(cs(qa.q('.kz-br-body'), 'backgroundImage')) && cs(qa.q('.kz-br-page .c4-h1'), 'backgroundColor') === 'rgb(255, 255, 255)', 'честно: картинка поля на окне, заголовок на белом');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: фон элемента (показ)', shot: 's2-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(700);
    qa.expect(cs(qa.q('.kz-br-page .c4-h1'), 'backgroundColor') === 'rgb(255, 215, 0)' && cs(qa.q('.kz-br-page .c4-p'), 'backgroundColor') === 'rgb(255, 255, 255)', 'заголовок на золотом, абзацы на белом');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's3: белый фон заголовка', shot: 's3-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c4-slot textarea', 'white', 'цвет');
    await qa.sleep(700);
    qa.expect(cs(qa.q('.kz-br-page .c4-h1'), 'backgroundColor') === 'rgb(255, 255, 255)', 'честно: фон заголовка белый сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: что покрасило правило', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    for (const [i, t] of [['1', 'p'], [null, 'body'], ['0', 'h1']]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c4-doc.is-tap'), 30000, 'страница нажимается');
      if (i === null) qa.q('.c4-doc').click(); else qa.q('.c4-doc .c4-blk[data-i="' + i + '"]').click();
      await qa.waitFor(() => !qa.q('.c4-doc.is-tap') || qa.platform.nextEnabled(), 8000, 'ответ принят: ' + t);
      await qa.sleep(1500);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: картинка на фоне (показ)', shot: 's5-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(/data:image\/svg/.test(cs(qa.q('.kz-br-body'), 'backgroundImage')) && cs(qa.q('.kz-br-body'), 'backgroundRepeat') === 'repeat', 'звёзды на фоне, плиткой');
  } },
  { name: 's6: собрать url("osmon.jpg")', shot: 's6-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['url', 'file', 'close']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(/data:image\/svg/.test(cs(qa.q('.kz-br-body'), 'backgroundImage')), 'честно: небо на фоне');
  } },
  { name: 's7: какой код у страницы', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['background-image: url("yulduz.png");', 'background-color: skyblue;', 'background-image: url("maydon.jpg");']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c4-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      qa.qa('.c4-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c4-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: повтор (показ)', shot: 's8-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(cs(qa.q('.kz-br-body'), 'backgroundRepeat') === 'no-repeat', 'в конце — no-repeat, мяч один');
  } },
  { name: 's9: вписать no-repeat', shot: 's9-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c4-slot textarea', 'no-repeat', 'значение');
    await qa.sleep(600);
    qa.expect(cs(qa.q('.kz-br-body'), 'backgroundRepeat') === 'no-repeat', 'честно: мяч один');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's8b: размер (показ)', shot: 's8b-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(cs(qa.q('.kz-br-body'), 'backgroundSize') === 'cover' && cs(qa.q('.kz-br-body'), 'backgroundRepeat') === 'no-repeat', 'в конце — cover и no-repeat');
  } },
  { name: 's9b: вписать cover', shot: 's9b-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c4-slot textarea', 'cover', 'значение');
    await qa.sleep(600);
    qa.expect(cs(qa.q('.kz-br-body'), 'backgroundSize') === 'cover', 'честно: небо на весь фон');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: плиткой или одна', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['tile', 'one', 'tile', 'one']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c4-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c4-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c4-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда картинки нет (показ)', shot: 's11-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(600);
    qa.expect(cs(qa.q('.kz-br-body'), 'backgroundImage') === 'none' && cs(qa.q('.kz-br-body'), 'backgroundColor') === 'rgb(0, 128, 0)', 'файла нет — виден запасной зелёный');
  } },
  { name: 's12: поставить url(', shot: 's12-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c4-slot textarea', 'url(', 'url(');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(/data:image\/svg/.test(cs(qa.q('.kz-br-body'), 'backgroundImage')), 'честно: поле вернулось');
  } },
  { name: 's13: найти сломанное правило', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'osmon.jpeg');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'no repeat');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c4-slot-rule textarea', 'body { background-image: url("yulduz.png"); }', 'правило');
    await qa.sleep(700);
    qa.expect(/data:image\/svg/.test(cs(qa.q('.kz-br-body'), 'backgroundImage')), 'честно: звёзды на фоне сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: свой фон', shot: 's14-done', run: async (qa) => {
    const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c4-slot textarea');
    qa.type(f[0], 'osmon.jpg', 'картинка'); qa.type(f[1], 'white', 'цвет');
    await qa.sleep(700);
    qa.expect(/data:image\/svg/.test(cs(qa.q('.kz-br-body'), 'backgroundImage')) && cs(qa.q('.kz-br-page .c4-h1'), 'backgroundColor') === 'rgb(255, 255, 255)', 'честно: страница со своим фоном');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c4-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c4-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c4-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить урок»');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('background-image: url("osmon.jpg")') >= 0 && html.indexOf('h1 { background-color: white; }') >= 0, 'артефакт — свой фон', { html });
  } }
];

export default {
  title: 'Урок 4 курса CSS «Фон» (облик «Редактор»)',
  file: 'css/04-fon',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 19,
  inputScreens: [3, 9, 11, 14, 16, 17],
  expectFinish: true,
  data: {
    ru: { endS2: 'заголовка или абзаца' },
    uz: { endS2: 'sarlavhani yoki abzasni' },
    en: { endS2: 'a heading or a paragraph' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: другой цвет → причина', start: 2, langs: ['ru'], steps: [{ name: 'blue', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c4-slot textarea', 'blue', 'синий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /другой цвет/i.test(qa.text('.b-sheet.is-hint')), 3000, 'причина: другой цвет');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's4: не то место → причина', start: 3, langs: ['ru'], steps: [{ name: 'заголовок вместо абзаца', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c4-doc.is-tap'), 30000, 'страница нажимается');
      qa.q('.c4-doc .c4-blk[data-i="0"]').click();
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!!qa.q('.c4-blk.is-off') && !qa.platform.nextEnabled(), 'заголовок погас');
    } }] },
    { name: 's6: src= → причина', start: 5, langs: ['ru'], steps: [{ name: 'src=', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="src"]', 'src=');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /src/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про src');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 4 && !qa.platform.nextEnabled(), 'кусок остался в лотке');
    } }] },
    { name: 's9: «no repeat» с пробелом → причина', start: 8, langs: ['ru'], steps: [{ name: 'no repeat', run: async (qa) => {
      const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
      await qa.platform.ready();
      qa.type('.c4-slot textarea', 'no repeat', 'с пробелом');
      await qa.sleep(600);
      qa.expect(cs(qa.q('.kz-br-body'), 'backgroundRepeat') === 'repeat', 'честно: с пробелом мячи плиткой');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /дефис/i.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про дефис');
    } }] },
    { name: 's12: url без скобки → причина', start: 13, langs: ['ru'], steps: [{ name: 'url', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c4-slot textarea', 'url', 'без скобки');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /скобк/i.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про скобку');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's13: верная строка → «работает»', start: 14, langs: ['ru'], steps: [{ name: 'вторая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 'w1: без url и чужое имя → причины', start: 15, langs: ['ru'], steps: [{ name: '"yulduz.png", yulduz.jpg', run: async (qa) => {
      const cs = (e, p) => (e ? e.ownerDocument.defaultView.getComputedStyle(e)[p || 'color'] : '');
      await qa.platform.ready();
      qa.type('.c4-slot-rule textarea', 'body { background-image: "yulduz.png"; }', 'без url');
      await qa.sleep(600);
      qa.expect(cs(qa.q('.kz-br-body'), 'backgroundImage') === 'none', 'честно: без url картинки нет');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /url/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про url');
      await qa.waitFor(() => qa.q('.key-go:not(:disabled)'), 30000, 'можно снова');
      qa.type('.c4-slot-rule textarea', 'body { background-image: url("yulduz.jpg"); }', 'чужое имя');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /нет такого имени/i.test(qa.text('.b-sheet.is-hint')), 3000, 'причина: нет такого файла');
    } }] },
    { name: 's14: имени нет среди файлов → причина', start: 16, langs: ['ru'], steps: [{ name: 'osmon.png', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c4-slot textarea');
      qa.type(f[0], 'osmon.png', 'чужое имя'); qa.type(f[1], 'gold', 'цвет');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /osmon\.png/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина называет имя');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 17, langs: ['ru'], steps: [{ name: '«Неверно» про url', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c4-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c4-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c4-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] },
    { name: 's9b: contain → причина', start: 10, langs: ['ru'], steps: [{ name: 'contain', run: async (qa) => {
      const hintIs = (qa, re) => !!qa.q('.b-sheet.is-hint') && re.test(qa.text('.b-sheet.is-hint'));
      await qa.platform.ready();
      qa.type('.c4-slot textarea', 'contain', 'contain');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => hintIs(qa, /contain/i), 3000, 'причина про contain');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's8b: помощь 1-2-3 на объяснении', start: 9, langs: ['ru'], steps: [{ name: 'лампочка три раза', run: async (qa) => {
      await qa.platform.ready(30000);
      for (let k = 1; k <= 3; k++) {
        await qa.click('.ctl-hint', 'лампочка');
        await qa.waitFor(() => new RegExp('^' + k + '/3').test(qa.text('.b-sheet.is-hint p')), 3000, 'ступень ' + k + '/3');
      }
    } }] }
  ]
};
