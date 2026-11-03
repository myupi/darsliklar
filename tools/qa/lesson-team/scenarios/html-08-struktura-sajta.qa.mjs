// Сценарий проверки урока 8 курса HTML lessons/html/08-struktura-sajta.jsx («Структура настоящего сайта», облик «Редактор», 03.11.2026).
// Основной путь: все 17 экранов действиями ученика; честно: страница не меняется, части видны в Инспекторе
// (рамки .z8-reg-*), опечатка или head вместо header — рамки нет; программа чтения (s11); свой сайт (s12, s13),
// починка header (s14), onFinished один раз, артефакт.
// Ветки: header вместо footer (s3); не та строка (s4); лишний head (s6); не та пара (s7); main вместо section (s9);
// промах «до и после» (s10); head вместо header (s14); верная строка (q1); неверный ответ (q2).
// Функции шагов выполняются в странице: помощники — прямо в шаге.

const STEPS = [
  { name: 's1: код кучей → по частям, страница та же', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z8-reg'), 'сначала частей нет');
    const before = qa.text('.kz-br-page');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.qa('.kz-br-page .z8-reg.is-insp').length === 6, 4000, 'в Инспекторе шесть частей');
    qa.expect(qa.text('.kz-br-page').replace(/Inspektor|Инспектор|Inspector|header|nav|main|section|footer/g, '').replace(/\s+/g, '') === before.replace(/\s+/g, ''), 'текст страницы тот же');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: header, main, footer (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, 'показ закончен');
    qa.expect(['header', 'main', 'footer'].every((t) => qa.q('.kz-br-page .z8-reg-' + t)), 'рамки header, main, footer');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's3: вписать footer', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z8-reg-footer'), 'без имени тега рамки footer нет');
    qa.type('.z8-slot textarea', 'footer', 'footer');
    await qa.sleep(300);
    qa.expect(!!qa.q('.kz-br-page .z8-reg-footer'), 'рамка появилась сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: рамка ↔ строка кода', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const [r, j] of [[1, 8], [2, 0], [3, 4]]) {
      await qa.waitFor(() => new RegExp(r + '/3').test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'раунд ' + r);
      await qa.clickNth('.kz-code .kz-line.kz-tap', j, 'строка ' + (j + 1));
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: nav, head ≠ header (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.q('.kz-br-page .z8-reg-nav'), 60000, 'меню в рамке nav');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.qa('.z8-vs-i').length === 2, 'head и header рядом');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS5).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's6: собрать каркас', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['header', 'main', 'footer']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(['header', 'main', 'footer'].every((t) => qa.q('.kz-br-page .z8-reg-' + t)), 'три части на месте');
  } },
  { name: 's7: тег ↔ часть схемы', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const t of ['header', 'nav', 'main', 'footer']) {
      await qa.waitFor(() => qa.q('.z8-mtag[data-t="' + t + '"]:not(:disabled)'), 20000, 'тег нажимается');
      await qa.click('.z8-mtag[data-t="' + t + '"]', t); await qa.click('.z8-mcard[data-card="' + t + '"]', 'схема ' + t); await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.z8-mcard.is-ok').length === 4, 'четыре пары');
  } },
  { name: 's8: section (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.qa('.kz-br-page .z8-reg-section').length === 2, 'два раздела');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS8).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's9: вписать section', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .z8-reg-section').length === 1, 'без имени тега — один раздел');
    qa.type('.z8-slot textarea', 'section', 'section');
    await qa.sleep(300);
    qa.expect(qa.qa('.kz-br-page .z8-reg-section').length === 2, 'второй раздел сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: до и после', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.z8-tagbtn'); r += 1) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z8-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      const [bf, af] = qa.qa('.z8-ba .z8-card');
      const cnt = (el, t) => el.querySelectorAll('.z8-reg-' + t).length;
      const want = cnt(af, 'nav') > cnt(bf, 'nav') ? 'nav' : cnt(af, 'section') > cnt(bf, 'section') ? 'section' : 'footer';
      await qa.clickNth('.z8-tagbtn', ['nav', 'section', 'footer'].indexOf(want), want);
      await qa.waitFor(() => !qa.q('.z8-tagbtn') || qa.qa('.z8-tagbtn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's11: зачем — программа чтения (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.qa('.z8-land').length === 4 && /main/.test(qa.text('.z8-land.is-on')), 'четыре части, переход к main');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS11).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's12: свой footer по «Готово»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myFoot, 'подвал');
    await qa.sleep(1600);
    qa.expect(qa.text('.kz-br-page .z8-foot') === qa.data.myFoot && !qa.platform.nextEnabled(), 'подвал на странице сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's13: свой раздел по «Готово»', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.mySec, 'заголовок раздела');
    await qa.sleep(1600);
    qa.expect(qa.text('.kz-br-page .z8-h2') === qa.data.mySec && !qa.platform.nextEnabled(), 'заголовок раздела сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's14: head → header', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z8-reg-header'), 'честно: с head рамки header нет');
    await qa.click('.kz-scrap[data-o="header"]', '<header>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z8-reg-header'), 'рамка header вернулась');
  } },
  { name: 'q1: найти строку с ошибкой', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-code .kz-line .led'), 'до первой попытки ответ не подсвечен');
    qa.expect(!!qa.q('.kz-br-page .z8-reg-nav .z8-h1'), 'честно: nav вокруг заголовка');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'nav вокруг h1');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    qa.expect(!qa.q('.kz-br-page .z8-reg-footer'), 'честно: опечатка foter — рамки нет');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 5, 'опечатка foter');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'q2: верно или нет', shot: 'q2-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [1, 1, 0]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z8-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z8-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.z8-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить урок»');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<footer>' + qa.data.myFoot + '</footer>') >= 0 && html.indexOf('<h2>' + qa.data.mySec + '</h2>') >= 0, 'артефакт — каркас своего сайта', { html });
  } }
];

export default {
  title: 'Урок 8 курса HTML «Структура настоящего сайта» (облик «Редактор»)',
  file: 'html/08-struktura-sajta',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 9, 12, 13],
  expectFinish: true,
  data: {
    ru: { myFoot: 'Сделано мной, 2026', mySec: 'Мои рисунки', endS2: 'говорят, что это за часть', endS5: 'для невидимых сведений о странице', endS8: 'их может быть несколько', endS11: 'понятным для людей, программ и поисковиков' },
    uz: { myFoot: '2026, men yasadim', mySec: 'Rasmlarim', endS2: 'qism ekanini aytadi', endS5: "ko'rinmas ma'lumot uchun", endS8: "bir nechta bo'lishi mumkin", endS11: 'qidiruv tizimlari uchun tushunarli' },
    en: { myFoot: 'Made by me, 2026', mySec: 'My drawings', endS2: 'only say what each part is', endS5: 'invisible information about the page', endS8: 'can hold several of them', endS11: 'clear for people, programs and search engines' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: header вместо footer → причина', start: 2, langs: ['ru'], steps: [{ name: 'header', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z8-slot textarea', 'header', 'header');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z8-reg-footer') && !qa.platform.nextEnabled(), 'рамки footer нет, «Дальше» закрыта');
    } }] },
    { name: 's4: не та строка → причина', start: 3, langs: ['ru'], steps: [{ name: 'строка header', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 20000, 'строки нажимаются');
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'header вместо footer');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(/1\/3/.test(qa.text('.kz-ask-n')) && qa.qa('.kz-code .kz-line.is-off').length === 1, 'раунд тот же, строка погасла');
    } }] },
    { name: 's6: лишний head → причина', start: 5, langs: ['ru'], steps: [{ name: 'head', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="head"]', 'head');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 4 && !qa.platform.nextEnabled(), 'кусок остался в лотке');
    } }] },
    { name: 's7: не та пара → причина', start: 6, langs: ['ru'], steps: [{ name: 'header ↔ меню', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z8-mtag[data-t="header"]:not(:disabled)'), 20000, 'тег нажимается');
      await qa.click('.z8-mtag[data-t="header"]', 'header'); await qa.click('.z8-mcard[data-card="nav"]', 'схема меню');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.z8-mcard.is-ok'), 'пара не закрепилась');
    } }] },
    { name: 's9: main вместо section → причина', start: 8, langs: ['ru'], steps: [{ name: 'main', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z8-slot textarea', 'main', 'main');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-br-page .z8-reg-section').length === 1 && !qa.platform.nextEnabled(), 'раздел один, «Дальше» закрыта');
    } }] },
    { name: 's10: промах → дополнительный раунд', start: 9, langs: ['ru'], steps: [{ name: 'не тот тег', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z8-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z8-tagbtn', 1, 'section вместо nav');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's14: head вместо header → причина', start: 13, langs: ['ru'], steps: [{ name: '<head>', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-o="head"]', '<head>');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z8-reg-header') && !qa.platform.nextEnabled(), 'рамки header нет, «Дальше» закрыта');
    } }] },
    { name: 'q1: верная строка → «в порядке»', start: 14, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла, «Дальше» закрыта');
    } }] },
    { name: 'q2: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Верно» про header', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z8-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z8-tf', 0, 'Верно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.z8-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла, можно выбрать снова');
    } }] }
  ]
};
