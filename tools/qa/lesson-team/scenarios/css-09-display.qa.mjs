// Сценарий проверки урока 9 курса CSS lessons/css/09-display.jsx («Как элементы ведут себя на странице», 06.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (настоящие теги; display, размеры — по
// getComputedStyle и getBoundingClientRect); своё меню (s14), onFinished один раз, артефакт.
// Ветки: «inline block» с пробелом и inline вместо block (s3); hidden (s6); block вместо inline-block (s9); пробел остался
// (s12); inline в правиле целиком (w1); верная строка (s13); none в своём меню (s14); неверный ответ (q1).

const STEPS = [
  { name: 's1: меню — inline-block', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const ws = () => qa.qa('.kz-br-page a.c9-a').map((e) => Math.round(e.getBoundingClientRect().width));
    qa.expect(new Set(ws()).size === 3, 'до превращения: ссылки разной ширины', { w: ws() });
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(600);
    qa.expect(ws().every((w) => w === 126), 'честно: каждая ссылка 110 + padding 8 с двух сторон', { w: ws() });
    qa.expect(/a 126×/.test(qa.text('.c9-ilist')), 'Инспектор показывает размер');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: block и inline (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    const d = qa.qa('.kz-br-page div.c9-div'), sp = qa.qa('.kz-br-page span.c9-span');
    qa.expect(d.every((e) => e.offsetWidth === 150) && d[1].offsetTop > d[0].offsetTop, 'div по 150 и друг под другом');
    qa.expect(Math.abs(sp[0].getBoundingClientRect().top - sp[1].getBoundingClientRect().top) < 2, 'span рядом в строке');
  } },
  { name: 's3: вписать block', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c9-slot textarea', 'block', 'display');
    await qa.sleep(300);
    const sp = qa.qa('.kz-br-page span.c9-span');
    qa.expect(sp[1].getBoundingClientRect().top > sp[0].getBoundingClientRect().bottom - 1, 'честно: span на разных строках сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: block или inline', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['block', 'inline', 'block', 'inline']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c9-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c9-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c9-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: display (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.qa('.kz-br-page div.c9-div').every((e) => e.getClientRects().length === 0), 'div спрятаны (none)');
  } },
  { name: 's6: вписать none', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c9-slot textarea', 'none', 'display');
    await qa.sleep(300);
    qa.expect(qa.q('.kz-br-page p.c9-p').getClientRects().length === 0, 'честно: абзац спрятан сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: какое правило у страницы', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['span { display: block; }', 'div { display: inline; }', 'div { display: none; }']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c9-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      qa.qa('.c9-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c9-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: inline-block (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    const a = qa.qa('.kz-br-page a.c9-a');
    qa.expect(a.every((e) => e.offsetWidth === 110 && e.offsetHeight === 40), 'ссылки 110×40');
  } },
  { name: 's9: вписать inline-block', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const a = () => qa.qa('.kz-br-page a.c9-a');
    qa.expect(a()[0].offsetWidth !== 110, 'до: width у строчной ссылки не действует');
    qa.type('.c9-slot textarea', 'inline-block', 'display');
    await qa.sleep(300);
    qa.expect(a().every((e) => e.offsetWidth === 110), 'честно: ширина 110 сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: какой display у меню', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['inline-block', 'block', 'inline']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c9-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c9-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c9-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда не работает (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const sp = qa.q('.kz-br-page span.c9-span');
    qa.expect(Math.round(sp.getBoundingClientRect().width) < 120, 'width у строчного span не действует');
  } },
  { name: 's12: исправить «inline block»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c9-slot textarea') && qa.q('.c9-slot textarea').value === 'inline block', 3000, 'в поле «inline block»');
    qa.type('.c9-slot textarea', 'inline-block', 'с чёрточкой');
    await qa.sleep(300);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page a.c9-a').every((e) => e.offsetWidth === 110), 'кнопки 110');
  } },
  { name: 's13: найти правило, которое не работает', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'inlineblock');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'width у span');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c9-slot-rule textarea', 'a { display: block; }', 'правило');
    await qa.sleep(300);
    const a = qa.qa('.kz-br-page a.c9-a');
    qa.expect(a[1].getBoundingClientRect().top > a[0].getBoundingClientRect().bottom - 1, 'честно: ссылки столбиком сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: своё меню', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c9-slot textarea');
    qa.type(f[0], 'inline-block', 'display'); qa.type(f[1], '100px', 'ширина'); qa.type(f[2], 'gold', 'фон');
    await qa.sleep(300);
    qa.expect(qa.qa('.kz-br-page a.c9-a').every((e) => e.offsetWidth === 100), 'честно: ссылки по 100');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c9-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c9-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c9-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить урок»');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('a { display: inline-block; }') >= 0 && html.indexOf('a { width: 100px; }') >= 0 && html.indexOf('a { background-color: gold; }') >= 0, 'артефакт — своё меню', { html });
  } }
];

export default {
  title: 'Урок 9 курса CSS «Как элементы ведут себя на странице» (облик «Редактор»)',
  file: 'css/09-display',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 6, 9, 12, 14, 15],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 's3: «inline block» → причина', start: 2, langs: ['ru'], steps: [{ name: 'inline block', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c9-slot textarea', 'inline block', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /чёрточку/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про чёрточку');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's3: inline → причина', start: 2, langs: ['ru'], steps: [{ name: 'inline', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c9-slot textarea', 'inline', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /рядом/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's6: hidden → причина', start: 5, langs: ['ru'], steps: [{ name: 'hidden', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c9-slot textarea', 'hidden', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /нет такого слова/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's9: block → причина', start: 8, langs: ['ru'], steps: [{ name: 'block', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c9-slot textarea', 'block', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /друг под другом/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's12: пробел остался → причина', start: 11, langs: ['ru'], steps: [{ name: 'inline block', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c9-slot textarea') && qa.q('.c9-slot textarea').value === 'inline block', 3000, 'в поле «inline block»');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /пробел/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про пробел');
    } }] },
    { name: 'w1: inline → причина', start: 13, langs: ['ru'], steps: [{ name: 'inline', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c9-slot-rule textarea', 'a { display: inline; }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /рядом/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 's14: none → причина', start: 14, langs: ['ru'], steps: [{ name: 'none', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c9-slot textarea');
      qa.type(f[0], 'none', 'display'); qa.type(f[1], '100px', 'ширина'); qa.type(f[2], 'gold', 'фон');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /пропад/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про div', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c9-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c9-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c9-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
