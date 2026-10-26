// Сценарий проверки урока 4 курса HTML lessons/html/04-ssylki-i-atributy.jsx («Ссылки и атрибуты», бумажный стиль).
// Основной путь: все 17 экранов действиями ученика (снимок каждого — в решённом виде), честные переходы по ссылкам
// (адрес в строке браузера меняется), своя ссылка (s13), onFinished один раз, артефакт со своей ссылкой.
// Ветки: <a> вместо </a> (s4); промах в «Ссылка или текст?» → дополнительный раунд (s5); href без кавычек —
// браузер понял, проверка просит кавычки (s7); атрибут не на месте → честный показ (s8); нет такого файла →
// «Файл не найден» (s10); ловушка «Про котов» → dogs.html (s11); нет </a> (s13); </a> не на месте (s14);
// наклейка без имени href (q1); неверный ответ (q2).
// Функции шагов выполняются в странице: только аргумент qa (помощники — прямо в шаге).

const STEPS = [
  { name: 's1: синие слова открывают другую страницу', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.text('.kz-br-url-t') === 'index.html', 'сначала главная: index.html');
    await qa.click('.kz-br-page button.l4-a', 'ссылка «Про котов»');
    await qa.waitFor(() => qa.text('.kz-br-url-t') === 'cats.html', 6000, 'адрес стал cats.html');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'рассказано');
  } },
  { name: 's2: план', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'план рассказан');
    qa.expect(qa.qa('.kz-card.is-open').length === 4, 'четыре карточки открыты');
  } },
  { name: 's3: тег a — ссылка (показ)', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS3).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(qa.text('.kz-br-url-t') === 'cats.html', 'ссылка сама открыла cats.html');
  } },
  { name: 's4: набрать </a>', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br-page .l4-p .l4-a'), 'без </a> новость — часть ссылки');
    qa.type('.kz-line textarea', '</a>', 'закрывающий a');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.q('.kz-br-page .l4-p .l4-a') && qa.qa('.kz-br-page .l4-a').length === 1, 'новость снова обычный текст, ссылка одна');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's5: ссылка или текст', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.kz-pick'); r += 1) {
      await qa.platform.ready(30000);
      const code = qa.q('.kz-code') ? qa.q('.kz-code').textContent.replace(/\s+/g, '') : '';
      await qa.clickNth('.kz-pick .kz-btn', code.indexOf('<a') === 0 ? 0 : 1, 'ответ');
      await qa.waitFor(() => !qa.q('.kz-pick') || qa.qa('.kz-pick .kz-btn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's6: атрибут (показ)', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(!qa.q('.kz-br-page .l4-a'), 'a без href — обычный текст');
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.q('.l4-note'), 40000, 'наклейка «атрибут» в открывающем теге');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS6).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(qa.text('.kz-br-url-t') === 'cats.html' && !!qa.q('.l4-memo'), 'ссылка открыла cats.html, записка об атрибуте на месте');
  } },
  { name: 's7: вписать href="dogs.html"', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .l4-a'), 'без адреса слова чёрные');
    qa.type('.kz-line textarea', 'href="dogs.html"', 'атрибут');
    await qa.sleep(200);
    qa.expect(!!qa.q('.kz-br-page .l4-a'), 'с href слова синеют сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    await qa.click('.kz-br-page button.l4-a', 'ссылка «Про собак»');
    await qa.waitFor(() => qa.text('.kz-br-url-t') === 'dogs.html', 5000, 'открылась dogs.html');
  } },
  { name: 's8: атрибут — в открывающий тег', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.click('.l4-sticker', 'наклейка');
    await qa.click('.l4-spot[data-place="A"]', 'в открывающий тег');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .l4-a'), 'ссылка работает');
  } },
  { name: 's9: решает адрес (показ)', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS9).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(qa.text('.kz-br-url-t') === 'dogs.html', '«Про котов» с dogs.html открыла собак');
  } },
  { name: 's10: починить адрес', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.q('.kz-line textarea').value === 'cats.html', 'в href стоит cats.html');
    qa.type('.kz-line textarea', 'games.html', 'адрес игр');
    await qa.click('.key-go', 'Нажать ссылку');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.kz-br-url-t') === 'games.html', 'открылась games.html');
  } },
  { name: 's11: куда приведёт', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6; r += 1) {
      await qa.waitFor(() => qa.platform.nextEnabled() || qa.qa('.l4-map .l4-card').some((b) => !b.disabled), 40000, 'раунд готов');
      if (qa.platform.nextEnabled()) break;
      const m = /href="([^"]+)"/.exec(qa.q('.kz-code').textContent);
      await qa.click('.l4-card[data-url="' + m[1] + '"]', m[1]);
      await qa.sleep(500);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's12: ссылка по частям (показ)', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS12).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    await qa.click('.l4-part-val', 'часть «значение»');
    await qa.sleep(300);
    qa.expect(!!qa.q('.l4-part-val.is-on'), 'нажатая часть подсвечена');
  } },
  { name: 's13: своя ссылка целиком', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', '<a href="cartoons.html">' + qa.data.myLink, 'ссылка без </a>');
    await qa.sleep(200);
    qa.expect(qa.qa('.kz-br-page .l4-a').some((a) => a.textContent === qa.data.myLink), 'окно сразу показывает ссылку');
    qa.type('.kz-line textarea', '<a href="cartoons.html">' + qa.data.myLink + '</a>', 'ссылка целиком');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    const mine = qa.qa('.kz-br-page button.l4-a').find((a) => a.textContent === qa.data.myLink);
    mine.click();
    await qa.waitFor(() => qa.text('.kz-br-url-t') === 'cartoons.html', 5000, 'своя ссылка открыла cartoons.html');
  } },
  { name: 's14: </a> — сразу после «Игры»', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .l4-p .l4-a').length === 2, 'ссылка съела обе новости');
    await qa.click('.kz-scrap[data-id="close"]', '</a>');
    await qa.click('.l4-spot[data-place="A"]', 'после «Игры»');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.q('.kz-br-page .l4-p .l4-a'), 'новости снова обычный текст');
  } },
  { name: 'q1: адреса кружков', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.l4-spot .led, .kz-scrap.is-led'), 'до первой попытки ответ не подсвечен');
    const put = async (id, where) => { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.click('.l4-spot[data-place="' + where + '"]', where); await qa.sleep(300); };
    await put('foot', 'f'); await put('chess', 'c');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .l4-a').length === 2, 'две ссылки');
  } },
  { name: 'q2: что такое атрибут', shot: 'q2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-quiz .kz-btn').length === 3 && !qa.q('.kz-quiz .kz-btn.is-ok, .kz-quiz .kz-btn.is-led'), 'три варианта, ничего не подсвечено');
    await qa.clickNth('.kz-quiz .kz-btn', 1, 'верный ответ');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, '«Завершить урок»');
    qa.expect(qa.text('.l4-mine-tag') === qa.data.myLink, 'на карте — слова ученика');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<a href="cartoons.html">' + qa.data.myLink + '</a>') >= 0, 'артефакт — своя ссылка', { html });
  } }
];

export default {
  title: 'Урок 4 курса HTML «Ссылки и атрибуты» (бумажный стиль)',
  file: 'html/04-ssylki-i-atributy',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',   // QA_SIZE=360x640 — прогон сценария на телефоне
  voice: 'fast',
  screens: 17,
  inputScreens: [4, 7, 10, 13],
  expectFinish: true,
  data: {
    ru: { myLink: 'Смотреть мультики', endS3: 'уже на другой странице', endS6: 'ты уже там', endS9: 'решает адрес в', endS12: 'повторю её объяснение' },
    uz: { myLink: 'Multfilm ko‘rish', endS3: 'boshqa sahifaga', endS6: 'darhol', endS9: 'manzil hal qiladi', endS12: 'yana tushuntiraman' },
    en: { myLink: 'Watch cartoons', endS3: 'on another page', endS6: 'already there', endS9: 'decides where a link leads', endS12: 'explain it again' }
  },
  steps: STEPS,
  flows: [
    { name: 's4: <a> вместо </a>', start: 3, langs: ['ru'], steps: [{ name: 'открывающий → причина', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<a>', 'открывающий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(/черта|chiziq|slash/i.test(qa.text('.kz-ask')) && !qa.platform.nextEnabled(), 'причина: нужна косая черта; «Дальше» закрыта', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 's5: промах → дополнительный раунд', start: 4, langs: ['ru'], steps: [{ name: 'неверный ответ', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-pick .kz-btn', 1, 'неверно: «простой текст» про ссылку');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's7: без кавычек — браузер понял, проверка просит кавычки', start: 6, langs: ['ru'], steps: [{ name: 'href=dogs.html', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', 'href=dogs.html', 'без кавычек');
      await qa.sleep(200);
      qa.expect(!!qa.q('.kz-br-page .l4-a'), 'честно: ссылка работает и без кавычек');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(/кавычк/i.test(qa.text('.kz-ask')) && !qa.platform.nextEnabled(), 'просит кавычки', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 's8: атрибут после «>» — виден как текст', start: 7, langs: ['ru'], steps: [{ name: 'место B', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.l4-sticker', 'наклейка'); await qa.click('.l4-spot[data-place="B"]', 'между «>» и словами');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина');
      qa.expect(/href=/.test(qa.text('.kz-br-page')) && !qa.q('.kz-br-page .l4-a') && !qa.platform.nextEnabled(), 'честно: атрибут на странице текстом, ссылки нет', { page: qa.text('.kz-br-page') });
    } }] },
    { name: 's10: нет такого файла', start: 9, langs: ['ru'], steps: [{ name: 'game.html', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', 'game.html', 'без буквы s');
      await qa.click('.key-go', 'Нажать ссылку');
      await qa.waitFor(() => qa.q('.l4-nf'), 4000, '«Файл не найден»');
      qa.expect(qa.text('.kz-br-url-t') === 'game.html' && !qa.platform.nextEnabled() && /game\.html/.test(qa.text('.kz-ask')), 'адрес game.html, причина названа', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 's11: ловушка → дополнительный раунд', start: 10, langs: ['ru'], steps: [{ name: 'неверная страница', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.l4-card[data-url="cats.html"]', 'не та страница');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's13: нет </a>', start: 12, langs: ['ru'], steps: [{ name: 'без закрывающего', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<a href="cartoons.html">Мультики', 'без </a>');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(/закрывающ/i.test(qa.text('.kz-ask')) && !qa.platform.nextEnabled(), 'нужен закрывающий тег', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 's14: </a> в конце — всё ещё синее', start: 13, langs: ['ru'], steps: [{ name: 'место C', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="close"]', '</a>'); await qa.click('.l4-spot[data-place="C"]', 'в конце');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина');
      qa.expect(qa.qa('.kz-br-page .l4-p .l4-a').length === 2 && !qa.platform.nextEnabled(), 'честно: новости синие', {});
    } }] },
    { name: 'q1: наклейка без имени href', start: 14, langs: ['ru'], steps: [{ name: 'bare → f', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="bare"]', '"football.html"'); await qa.click('.l4-spot[data-place="f"]', 'Футбол');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина');
      qa.expect(/href/.test(qa.text('.kz-ask')) && !qa.q('.kz-br-page .l4-a') && qa.qa('.kz-tray .kz-scrap').length === 3 && !qa.platform.nextEnabled(), 'ссылки нет, наклейка вернулась', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 'q2: неверный ответ → причина, снова', start: 15, langs: ['ru'], steps: [{ name: 'первый вариант', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-quiz .kz-btn', 0, 'неверный ответ');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(qa.qa('.kz-quiz .kz-btn.is-off').length === 1 && !qa.platform.nextEnabled(), 'вариант погас, можно выбрать снова');
    } }] }
  ]
};
