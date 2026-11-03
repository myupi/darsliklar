// Сценарий проверки урока 6 курса HTML lessons/html/06-formy-vvod.jsx («Формы, часть 1: ввод данных», облик «Редактор», 03.11.2026).
// Основной путь: все 17 экранов действиями ученика; честный браузер (поле, точки пароля, стрелки числа, серая подсказка,
// label в одну строку и выбор поля); своя анкета (s12, s13), починка type (s14), onFinished один раз, артефакт.
// Ветки: не тот тег (s3); не та строка (s4); лишний </input> (s6); не та пара (s7); type вместо placeholder (s9);
// промах «до и после» (s10); text вместо password (s14); верная строка (q1); неверный ответ (q2).
// Функции шагов выполняются в странице: помощники — прямо в шаге.

const STEPS = [
  { name: 's1: подписи → анкета с полями', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z6-in'), 'сначала полей нет — одни подписи');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.qa('.kz-br-page .z6-in').length === 3, 4000, 'появились три поля');
    await qa.waitFor(() => /^•+$/.test(qa.text('.kz-br-page .z6-in.is-pass .z6-in-v')), 4000, 'пароль — точками');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: input и type (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, 'показ закончен');
    qa.expect(qa.text('.kz-br-page .z6-in') === 'Minecraft', 'в поле слово, которого нет в коде');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's3: вписать имя тега', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z6-in'), 'без имени тега поля нет');
    qa.type('.z6-slot textarea', 'input', 'имя тега');
    await qa.sleep(300);
    qa.expect(!!qa.q('.kz-br-page .z6-in'), 'поле появилось сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: вещь на странице ↔ строка кода', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const [r, j] of [[1, 4], [2, 1], [3, 2]]) {
      await qa.waitFor(() => new RegExp(r + '/3').test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'раунд ' + r);
      await qa.clickNth('.kz-code .kz-line.kz-tap', j, 'строка ' + (j + 1));
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: виды полей (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.passS5).test((e.data && e.data.text) || '')), 60000, 'пароль спрятан точками');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(!!qa.q('.kz-br-page .z6-in.is-num .z6-spin'), 'number — со стрелками');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS5).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's6: собрать поле пароля', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['open', 'type', 'eq', 'val', 'gt']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z6-in.is-pass'), 'поле пароля с точками');
  } },
  { name: 's7: type ↔ вид поля', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const t of ['text', 'password', 'number']) {
      await qa.waitFor(() => qa.q('.z6-mtag[data-t="' + t + '"]:not(:disabled)'), 20000, 'значение нажимается');
      await qa.click('.z6-mtag[data-t="' + t + '"]', t); await qa.click('.z6-mcard[data-card="' + t + '"]', 'поле ' + t); await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.z6-mcard.is-ok').length === 3, 'три пары');
  } },
  { name: 's8: placeholder (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.phS8).test((e.data && e.data.text) || '')), 60000, 'подсказка исчезла, когда написали');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(!!qa.q('.kz-br-page .z6-in-ph'), 'поле снова пустое — подсказка вернулась');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS8).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's9: вписать имя атрибута', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z6-in-ph'), 'без имени атрибута подсказки нет');
    qa.type('.z6-slot textarea', 'placeholder', 'placeholder');
    await qa.sleep(300);
    qa.expect(!!qa.q('.kz-br-page .z6-in-ph'), 'серая подсказка появилась сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: до и после', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.z6-tagbtn'); r += 1) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z6-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      const af = qa.qa('.z6-ba .z6-card')[1];
      const want = af.querySelector('.is-pass') ? 'pass' : af.querySelector('.is-num') ? 'num' : 'ph';
      await qa.clickNth('.z6-tagbtn', ['pass', 'ph', 'num'].indexOf(want), want);
      await qa.waitFor(() => !qa.q('.z6-tagbtn') || qa.qa('.z6-tagbtn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's11: label и form (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(!!qa.q('.kz-br-page .z6-lab .z6-in.is-focus'), 'label: подпись в строку с полем, поле выбрано');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS11).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's12: своя подпись по «Готово»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myCap, 'подпись');
    await qa.sleep(1600);
    qa.expect(qa.text('.kz-br-page .z6-cap') === qa.data.myCap && !qa.platform.nextEnabled(), 'окно показывает подпись сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's13: своя подсказка по «Готово»', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myPh, 'подсказка');
    await qa.sleep(1600);
    qa.expect(qa.text('.kz-br-page .z6-in-ph') === qa.data.myPh && !qa.platform.nextEnabled(), 'серая подсказка сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's14: вернуть "password"', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z6-in.is-pass') && /kodi2026/.test(qa.text('.kz-br-page')), 'честно: без type пароль виден');
    await qa.clickText('.kz-scrap', '"password"');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z6-in.is-pass'), 'пароль снова точками');
  } },
  { name: 'q1: найти строку с ошибкой', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-code .kz-line .led'), 'до первой попытки ответ не подсвечен');
    qa.expect(!qa.q('.kz-br-page .z6-in.is-pass'), 'честно: type text — пароль виден');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'пароль с type text');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    qa.expect(!qa.q('.kz-br-page .z6-in-ph'), 'честно: опечатка в placeholder — подсказки нет');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'опечатка placehoder');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'q2: верно или нет', shot: 'q2-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 0]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z6-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z6-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.z6-tf.is-ok'), 5000, 'ответ принят');
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
    qa.expect(html.indexOf('<label>' + qa.data.myCap + ' <input type="text" placeholder="' + qa.data.myPh + '"></label>') >= 0, 'артефакт — своя анкета', { html });
  } }
];

export default {
  title: 'Урок 6 курса HTML «Формы, часть 1: ввод данных» (облик «Редактор»)',
  file: 'html/06-formy-vvod',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 9, 12, 13],
  expectFinish: true,
  data: {
    ru: { myCap: 'Любимый спорт:', myPh: 'Например, футбол', endS2: 'говорит, какое это поле', passS5: 'спрятались за точками', endS5: 'для числа', phS8: 'серая подсказка исчезла', endS8: 'начинаешь писать, она исчезает', endS11: 'собирает все поля в одну анкету' },
    uz: { myCap: 'Sevimli sportingiz:', myPh: 'Masalan, futbol', endS2: 'maydon turini aytadi', passS5: 'nuqtalar bilan yashirindi', endS5: 'son uchun', phS8: "kulrang ishora yo'qoldi", endS8: "u yo'qoladi", endS11: "bitta anketaga yig'adi" },
    en: { myCap: 'Favorite sport:', myPh: 'For example, football', endS2: 'says what kind of field', passS5: 'hidden behind dots', endS5: 'for numbers', phS8: 'grey hint disappeared', endS8: 'when you start typing', endS11: 'into one form' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: не тот тег → причина', start: 2, langs: ['ru'], steps: [{ name: 'img', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z6-slot textarea', 'img', 'другой тег');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z6-in') && !qa.platform.nextEnabled(), 'поля нет, «Дальше» закрыта');
    } }] },
    { name: 's4: не та строка → причина', start: 3, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 20000, 'строки нажимаются');
      await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'первый input вместо второго');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(/1\/3/.test(qa.text('.kz-ask-n')) && qa.qa('.kz-code .kz-line.is-off').length === 1, 'раунд тот же, строка погасла');
    } }] },
    { name: 's6: лишний </input> → причина', start: 5, langs: ['ru'], steps: [{ name: '</input>', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="close"]', '</input>');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 6 && !qa.platform.nextEnabled(), 'кусок остался в лотке');
    } }] },
    { name: 's7: не та пара → причина', start: 6, langs: ['ru'], steps: [{ name: 'text ↔ точки', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z6-mtag[data-t="text"]:not(:disabled)'), 20000, 'значение нажимается');
      await qa.click('.z6-mtag[data-t="text"]', 'text'); await qa.click('.z6-mcard[data-card="password"]', 'поле с точками');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.z6-mcard.is-ok'), 'пара не закрепилась');
    } }] },
    { name: 's9: type вместо placeholder → причина', start: 8, langs: ['ru'], steps: [{ name: 'type', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z6-slot textarea', 'type', 'type');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z6-in-ph') && !qa.platform.nextEnabled(), 'подсказки нет, «Дальше» закрыта');
    } }] },
    { name: 's10: промах → дополнительный раунд', start: 9, langs: ['ru'], steps: [{ name: 'не то изменение', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z6-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z6-tagbtn', 1, 'placeholder вместо password');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's14: "text" → причина', start: 13, langs: ['ru'], steps: [{ name: '"text"', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-scrap', '"text"');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z6-in.is-pass') && !qa.platform.nextEnabled(), 'пароль виден, «Дальше» закрыта');
    } }] },
    { name: 'q1: верная строка → «в порядке»', start: 14, langs: ['ru'], steps: [{ name: 'вторая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла, «Дальше» закрыта');
    } }] },
    { name: 'q2: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про password', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z6-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z6-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.z6-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла, можно выбрать снова');
    } }] }
  ]
};
