// Сценарий проверки урока 3 курса HTML lessons/html/03-spiski.jsx («Списки», облик «Редактор», 03.11.2026).
// Основной путь: все 17 экранов действиями ученика, свой список (s12, s13), починка <li> (s14), onFinished один раз,
// артефакт со своим списком. Ветки: </li> первым (s3); пункт вне списка (s4); рис первым (s6); не та пара (s7);
// промах «до и после» → дополнительный раунд (s10); верная строка в «найди ошибку» (q1); неверный ответ (q2).
// Причины ошибок и подсказки — в панели снизу (.b-sheet.is-hint). Функции шагов выполняются в странице.

const STEPS = [
  { name: 's1: каша → рецепт', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!!qa.q('.z3-wall'), 'сначала каша из текста');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.q('.kz-br-page ol.z3-ol') && qa.q('.kz-br-page ul.z3-ul'), 6000, 'появились два списка');
    await qa.waitFor(() => qa.platform.nextEnabled(), 50000, 'рассказано');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's2: ul и li (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 70000, 'показ закончен');
    qa.expect(qa.qa('.kz-br-page ul.z3-ul > li').length === 3 && !qa.q('.kz-br-page .z3-bare'), 'три пункта с точками');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
  } },
  { name: 's3: <li> и </li> вокруг слова', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .z3-bare').length === 1, 'честно: слово без li — без точки');
    const f = qa.qa('.z3-slot textarea');
    qa.type(f[0], '<li>', 'перед словом'); qa.type(f[1], '</li>', 'после слова');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page ul.z3-ul > li').length === 3 && !qa.q('.kz-br-page .z3-bare'), 'у слова появилась точка');
  } },
  { name: 's4: два пункта в список', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.click('.kz-scrap[data-id="3"]', 'пункт 1'); await qa.click('.kz-line[data-place="0"]', 'место 1'); await qa.sleep(300);
    await qa.click('.kz-scrap[data-id="4"]', 'пункт 2'); await qa.click('.kz-line[data-place="1"]', 'место 2');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page ul.z3-ul > li').length === 5, 'в списке пять пунктов');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's5: ol (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 70000, 'показ закончен');
    qa.expect(qa.qa('.kz-br-page ol.z3-ol > li').length === 4, 'четыре шага с номерами');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS5).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's6: шаги по порядку', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of [0, 1, 2]) { await qa.click('.kz-scrap[data-id="' + id + '"]', 'шаг ' + id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page ol.z3-ol > li').length === 3, 'три шага с номерами');
  } },
  { name: 's7: тег ↔ что делает', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const t of ['ul', 'ol', 'li']) {
      await qa.waitFor(() => qa.q('.z3-mtag[data-t="' + t + '"]:not(:disabled)'), 20000, 'тег нажимается');
      await qa.click('.z3-mtag[data-t="' + t + '"]', t); await qa.click('.z3-mcard[data-card="' + t + '"]', 'дело ' + t); await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.z3-mcard.is-ok').length === 3, 'три пары');
  } },
  { name: 's8: ul или ol (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, 'показ закончен');
    qa.expect(!!qa.q('.z3-ex ol.z3-ol') && !!qa.q('.z3-ex ul.z3-ul'), 'покупки — ul, утро — ol');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS8).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
  } },
  { name: 's9: ol вместо ul', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br-page ul.z3-ul'), 'сначала точки');
    const f = qa.qa('.z3-slot textarea');
    qa.type(f[0], '<ol>', 'начало'); qa.type(f[1], '</ol>', 'конец');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page ol.z3-ol') && !qa.q('.kz-br-page ul.z3-ul'), 'точки стали номерами');
  } },
  { name: 's10: до и после', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.z3-tagbtn'); r += 1) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z3-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      const [bf, af] = qa.qa('.z3-ba .z3-card');
      const tb = bf.querySelector('ol') ? 'ol' : 'ul', ta = af.querySelector('ol') ? 'ol' : 'ul';
      const want = tb !== ta ? ta : 'li';
      await qa.clickNth('.z3-tagbtn', ['ul', 'ol', 'li'].indexOf(want), want);
      await qa.waitFor(() => !qa.q('.z3-tagbtn') || qa.qa('.z3-tagbtn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's11: сверху вниз (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.platform.nextEnabled(), 70000, 'показ закончен');
    qa.expect(!!qa.q('.kz-br-page ul.z3-ul') && !!qa.q('.kz-br-page ol.z3-ol'), 'страница собрана');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS11).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's12: свой заголовок по «Готово»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myTitle, 'заголовок');
    await qa.sleep(1600);
    qa.expect(qa.text('.kz-br-page .z3-h2') === qa.data.myTitle && !qa.platform.nextEnabled(), 'окно показывает заголовок сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's13: три пункта по «Готово»', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.text('.kz-br-page .z3-h2') === qa.data.myTitle, 'h2 — свой заголовок с прошлого экрана');
    const f = qa.qa('.kz-line textarea');
    qa.data.myItems.forEach((x, j) => qa.type(f[j], x, 'пункт ' + (j + 1)));
    await qa.sleep(1200);
    qa.expect(!qa.platform.nextEnabled() && qa.qa('.kz-br-page ul.z3-ul > li').map((x) => x.textContent).join('|') === qa.data.myItems.join('|'), 'окно показывает пункты сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's14: вставить <li>', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .z3-bare').length === 1, 'честно: второй пункт без точки');
    await qa.clickText('.kz-scrap', '<li>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.q('.kz-br-page .z3-bare') && qa.qa('.kz-br-page ul.z3-ul > li').length === 3, 'у пункта снова точка');
  } },
  { name: 'q1: найти строку с ошибкой', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-code .kz-line .led'), 'до первой попытки ответ не подсвечен');
    qa.expect(qa.qa('.kz-br-page .z3-bare').length === 1, 'честно: пункт без li — без точки');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'строка без li');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    qa.expect(/2\.\s*2\./.test(qa.text('.kz-br-page')) || qa.qa('.kz-br-page ol.z3-ol > li')[1].textContent.indexOf('2.') === 0, 'честно: номер, вписанный руками, — второй');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'строка с номером');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'q2: верно или нет', shot: 'q2-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z3-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z3-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.z3-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, '«Завершить урок»');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<h2>' + qa.data.myTitle + '</h2>') >= 0 && qa.data.myItems.every((x) => html.indexOf('<li>' + x + '</li>') >= 0), 'артефакт — свой список', { html });
  } }
];

export default {
  title: 'Урок 3 курса HTML «Списки» (облик «Редактор»)',
  file: 'html/03-spiski',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 9, 12, 13],
  expectFinish: true,
  data: {
    ru: { myTitle: 'Мои игры', myItems: ['Футбол', 'Шахматы', 'Прятки'], endS2: 'Браузер сам ставит точку', endS5: 'А пункты в обоих', endS8: 'хватит', endS11: 'в списке с номерами' },
    uz: { myTitle: "Mening o'yinlarim", myItems: ['Futbol', 'Shaxmat', 'Berkinmachoq'], endS2: 'Brauzer har bir', endS5: 'Bandlar esa ikkalasida', endS8: "yetarli bo'ladi", endS11: "raqamli ro'yxatda turibdi" },
    en: { myTitle: 'My games', myItems: ['Football', 'Chess', 'Tag'], endS2: 'The browser puts a dot', endS5: 'The items in both', endS8: 'is enough', endS11: 'in a numbered list' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: </li> первым → причина', start: 2, langs: ['ru'], steps: [{ name: '</li> перед словом', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.z3-slot textarea');
      qa.type(f[0], '</li>', 'закрывающий первым'); qa.type(f[1], '</li>', 'после');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's4: пункт вне списка → причина', start: 3, langs: ['ru'], steps: [{ name: 'после </ul>', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="3"]', 'пункт'); await qa.click('.kz-line[data-place="out"]', 'вне списка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 2 && !qa.platform.nextEnabled(), 'пункт остался в лотке');
    } }] },
    { name: 's6: рис первым → причина', start: 5, langs: ['ru'], steps: [{ name: 'рис первым', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="2"]', 'рис');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 3 && !qa.platform.nextEnabled(), 'шаг остался в лотке');
    } }] },
    { name: 's7: не та пара → причина', start: 6, langs: ['ru'], steps: [{ name: 'ul ↔ номера', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z3-mtag[data-t="ul"]:not(:disabled)'), 20000, 'тег нажимается');
      await qa.click('.z3-mtag[data-t="ul"]', 'ul'); await qa.click('.z3-mcard[data-card="ol"]', 'дело ol');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.z3-mcard.is-ok'), 'пара не закрепилась');
    } }] },
    { name: 's10: промах → дополнительный раунд', start: 9, langs: ['ru'], steps: [{ name: 'не тот тег', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z3-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z3-tagbtn', 2, 'li вместо ol');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 'q1: верная строка → «в порядке»', start: 14, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла, «Дальше» закрыта');
    } }] },
    { name: 'q2: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Верно» про номера', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z3-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z3-tf', 0, 'Верно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.z3-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла, можно выбрать снова');
    } }] }
  ]
};
