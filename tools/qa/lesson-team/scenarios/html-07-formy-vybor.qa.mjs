// Сценарий проверки урока 7 курса HTML lessons/html/07-formy-vybor.jsx («Формы, часть 2: выбор и отправка», облик «Редактор», 03.11.2026).
// Основной путь: все 17 экранов действиями ученика; честный браузер (список и его пункты, большое поле, текст без
// </textarea> внутри поля, кнопка и «отправка» — страница заново); своя анкета (s12, s13), починка option (s14),
// onFinished один раз, артефакт.
// Ветки: li вместо option (s3); не тот пункт (s4); лишний type="text" (s6); не та пара (s7); открывающий вместо
// закрывающего (s9); промах «до и после» (s10); <li> вместо <option> (s14); верная строка (q1); неверный ответ (q2).
// Функции шагов выполняются в странице: помощники — прямо в шаге.

const STEPS = [
  { name: 's1: анкета вразнобой → список, поле, кнопка', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z7-sel') && !qa.q('.kz-br-page .z7-btn'), 'сначала ни списка, ни кнопки');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.q('.kz-br-page .z7-sel') && qa.q('.kz-br-page .z7-ta') && qa.q('.kz-br-page .z7-btn'), 4000, 'список, большое поле и кнопка');
    await qa.waitFor(() => qa.q('.kz-br-page .z7-pop'), 4000, 'список раскрылся');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: select и option (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, 'показ закончен');
    qa.expect(qa.text('.kz-br-page .z7-sel-v') === qa.data.second, 'выбран второй пункт');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's3: вписать имя тега пункта', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .z7-opt').length === 2, 'без имени тега пункта в списке нет');
    qa.type('.z7-slot textarea', 'option', 'option');
    await qa.sleep(300);
    qa.expect(qa.qa('.kz-br-page .z7-opt').length === 3, 'пункт появился сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: строка option ↔ пункт списка', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const [r, j] of [[1, 1], [2, 0], [3, 3]]) {
      await qa.waitFor(() => new RegExp(r + '/3').test(qa.text('.kz-ask-n')) && qa.q('.kz-br-page button.z7-opt:not(:disabled)'), 30000, 'раунд ' + r);
      await qa.clickNth('.kz-br-page button.z7-opt', j, 'пункт ' + (j + 1));
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: textarea (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.taS5).test((e.data && e.data.text) || '')), 60000, 'поле стало большим');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(!!qa.q('.kz-br-page .z7-ta .z7-grip') && qa.text('.kz-br-page .z7-ta') === qa.data.hello, 'текст между тегами — внутри поля');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS5).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's6: собрать textarea', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['open', 'ph', 'gt', 'close']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z7-ta .z7-ta-ph'), 'большое поле с серой подсказкой');
  } },
  { name: 's7: тег ↔ вещь', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const t of ['select', 'option', 'textarea']) {
      await qa.waitFor(() => qa.q('.z7-mtag[data-t="' + t + '"]:not(:disabled)'), 20000, 'тег нажимается');
      await qa.click('.z7-mtag[data-t="' + t + '"]', t); await qa.click('.z7-mcard[data-card="' + t + '"]', 'вещь ' + t); await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.z7-mcard.is-ok').length === 3, 'три пары');
  } },
  { name: 's8: кнопка отправляет (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.sentS8).test((e.data && e.data.text) || '')), 60000, 'честно: сервера нет — страница заново');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(!!qa.q('.kz-br-page .z7-btn') && !qa.text('.kz-br-page .z7-ta').trim(), 'кнопка есть, поле после отправки пустое');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS8).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's9: закрыть textarea', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z7-btn') && /<button>/.test(qa.text('.kz-br-page .z7-ta')), 'честно: без </textarea> кнопка — текст в поле');
    qa.type('.z7-slot textarea', '</textarea>', 'закрывающий тег');
    await qa.sleep(300);
    qa.expect(!!qa.q('.kz-br-page .z7-btn'), 'кнопка вернулась сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: до и после', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.z7-tagbtn'); r += 1) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z7-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      const [bf, af] = qa.qa('.z7-ba .z7-card');
      const want = af.querySelectorAll('.z7-opt').length > bf.querySelectorAll('.z7-opt').length ? 'opt' : bf.querySelector('.z7-ta.is-mono') ? 'close' : 'btn';
      await qa.clickNth('.z7-tagbtn', ['opt', 'close', 'btn'].indexOf(want), want);
      await qa.waitFor(() => !qa.q('.z7-tagbtn') || qa.qa('.z7-tagbtn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's11: анкета целиком (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.qa('.kz-br-page .z7-blk').length === 5 && !!qa.q('.kz-br-page .z7-btn'), 'подписи, список, поле, кнопка');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS11).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's12: своя кнопка по «Готово»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myBtn, 'надпись кнопки');
    await qa.sleep(1600);
    qa.expect(qa.text('.kz-br-page .z7-btn') === qa.data.myBtn && !qa.platform.nextEnabled(), 'кнопка с надписью сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's13: свой пункт по «Готово»', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myOpt, 'пункт');
    await qa.sleep(1600);
    const opts = qa.qa('.kz-br-page .z7-opt');
    qa.expect(opts.length === 3 && opts[2].textContent === qa.data.myOpt && !qa.platform.nextEnabled(), 'пункт в списке сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's14: вернуть option', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .z7-opt').length === 3, 'честно: слово без option — не в списке');
    await qa.click('.kz-scrap[data-o="option"]', '<option>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .z7-opt').length === 4, 'пункт добавился');
  } },
  { name: 'q1: найти строку с ошибкой', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-code .kz-line .led'), 'до первой попытки ответ не подсвечен');
    qa.expect(!qa.q('.kz-br-page .z7-btn'), 'честно: без </textarea> кнопки нет');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 3, 'textarea без закрывающего');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    qa.expect(qa.qa('.kz-br-page .z7-opt').length === 2, 'честно: опечатка opton — пункта нет');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'опечатка opton');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'q2: верно или нет', shot: 'q2-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z7-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z7-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.z7-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 70000, '«Завершить урок»');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<option>' + qa.data.myOpt + '</option>') >= 0 && html.indexOf('<button>' + qa.data.myBtn + '</button>') >= 0, 'артефакт — своя анкета', { html });
  } }
];

export default {
  title: 'Урок 7 курса HTML «Формы, часть 2: выбор и отправка» (облик «Редактор»)',
  file: 'html/07-formy-vybor',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 9, 12, 13],
  expectFinish: true,
  data: {
    ru: { second: 'Футбол', hello: 'Привет! Я люблю футбол.', myBtn: 'Хочу в клуб', myOpt: 'Теннис', endS2: 'Оба пишут с закрывающим тегом', taS5: 'поле стало большим', endS5: 'всегда пишется с закрывающим тегом', sentS8: 'страница просто открылась заново', endS8: 'отправляет анкету', endS11: 'отправляет всю анкету' },
    uz: { second: 'Futbol', hello: "Salom! Men futbolni yaxshi ko'raman.", myBtn: 'Klubga yozilaman', myOpt: 'Tennis', endS2: 'Ikkalasi ham yopuvchi', taS5: "maydon katta bo'ldi", endS5: 'doim yopuvchi', sentS8: 'sahifa shunchaki qaytadan ochildi', endS8: 'anketani yuboradi', endS11: 'butun anketani yuboradi' },
    en: { second: 'Football', hello: 'Hi! I love football.', myBtn: 'Count me in', myOpt: 'Tennis', endS2: 'Both have a closing tag', taS5: 'field got bigger', endS5: 'always has a closing tag', sentS8: 'page just opened again', endS8: 'sends the form', endS11: 'sends the whole form' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: li вместо option → причина', start: 2, langs: ['ru'], steps: [{ name: 'li', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z7-slot textarea', 'li', 'li');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-br-page .z7-opt').length === 2 && !qa.platform.nextEnabled(), 'пункта нет, «Дальше» закрыта');
    } }] },
    { name: 's4: не тот пункт → причина', start: 3, langs: ['ru'], steps: [{ name: 'первый пункт', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.kz-br-page button.z7-opt:not(:disabled)'), 20000, 'пункты нажимаются');
      await qa.clickNth('.kz-br-page button.z7-opt', 0, 'не тот пункт');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(/1\/3/.test(qa.text('.kz-ask-n')) && qa.qa('.kz-br-page button.z7-opt.is-off').length === 1, 'раунд тот же, пункт погас');
    } }] },
    { name: 's6: лишний type="text" → причина', start: 5, langs: ['ru'], steps: [{ name: 'type="text"', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="type"]', 'type="text"');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 5 && !qa.platform.nextEnabled(), 'кусок остался в лотке');
    } }] },
    { name: 's7: не та пара → причина', start: 6, langs: ['ru'], steps: [{ name: 'select ↔ большое поле', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z7-mtag[data-t="select"]:not(:disabled)'), 20000, 'тег нажимается');
      await qa.click('.z7-mtag[data-t="select"]', 'select'); await qa.click('.z7-mcard[data-card="textarea"]', 'большое поле');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.z7-mcard.is-ok'), 'пара не закрепилась');
    } }] },
    { name: 's9: открывающий вместо закрывающего → причина', start: 8, langs: ['ru'], steps: [{ name: '<textarea>', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z7-slot textarea', '<textarea>', 'открывающий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z7-btn') && !qa.platform.nextEnabled(), 'кнопки нет, «Дальше» закрыта');
    } }] },
    { name: 's10: промах → дополнительный раунд', start: 9, langs: ['ru'], steps: [{ name: 'не то изменение', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z7-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z7-tagbtn', 1, '</textarea> вместо option');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's14: <li> вместо <option> → причина', start: 13, langs: ['ru'], steps: [{ name: '<li>', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-o="li"]', '<li>');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-br-page .z7-opt').length === 3 && !qa.platform.nextEnabled(), 'пункта нет, «Дальше» закрыта');
    } }] },
    { name: 'q1: верная строка → «в порядке»', start: 14, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла, «Дальше» закрыта');
    } }] },
    { name: 'q2: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про textarea', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z7-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z7-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.z7-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла, можно выбрать снова');
    } }] }
  ]
};
