// Сценарий проверки урока 5 курса HTML lessons/html/05-izobrazheniya.jsx («Изображения», бумажный стиль).
// Основной путь: все 17 экранов действиями ученика (снимок каждого — в решённом виде), честные картинки
// (нет src — пусто, нет файла — сломанная картинка и текст alt), своё описание (s10) по «Готово», свой тег
// картинки (s13), onFinished один раз, артефакт со своими описаниями.
// Ветки: </img вместо <img (s4); не то место (s5); href вместо src (s7); промах «Какая картинка?» (s8);
// кавычка в alt (s10); плохой alt (s11); </img> в своём теге (s13); не та часть тега (s14); наклейка href (q1);
// неверный ответ (q2).
// Функции шагов выполняются в странице: только аргумент qa (помощники — прямо в шаге).

const STEPS = [
  { name: 's1: фото кота влетает на страницу', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .l5-photo'), 'сначала на странице одни слова');
    await qa.click('.l5-s1-card .l5-card', 'фото кота');
    await qa.waitFor(() => qa.q('.kz-br-page .l5-photo'), 6000, 'фото на странице');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'рассказано');
  } },
  { name: 's2: план', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'план рассказан');
    qa.expect(qa.qa('.kz-card.is-open').length === 4, 'четыре карточки открыты');
  } },
  { name: 's3: тег img без пары (показ)', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.q('.l5-ghostclose'), 40000, '</img> появился');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS3).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(!qa.q('.l5-ghostclose'), '</img> упал');
  } },
  { name: 's4: набрать <img', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/src="dog\.jpg">/.test(qa.text('.kz-br-page')), 'без начала тега строка видна на странице текстом');
    qa.type('.kz-line textarea', '<img', 'начало тега');
    await qa.sleep(200);
    qa.expect(!!qa.q('.kz-br-page .l5-photo'), 'с <img — фото сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's5: где будет картинка', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6; r += 1) {
      await qa.waitFor(() => qa.platform.nextEnabled() || qa.qa('.l5-slot').some((b) => !b.disabled), 40000, 'раунд готов');
      if (qa.platform.nextEnabled()) break;
      const lines = qa.qa('.kz-code .kz-line').map((ln) => ln.textContent.replace(/\s+/g, ''));
      const at = lines.findIndex((t) => t.indexOf('<img') === 0);
      const slot = lines.slice(0, at).filter((t) => t.indexOf('<p>') === 0).length;
      await qa.click('.l5-slot[data-slot="' + slot + '"]', 'место ' + slot);
      await qa.sleep(500);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's6: атрибут src (показ)', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(!qa.q('.kz-br-page .l5-photo'), 'img без src — пусто');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS6).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(!!qa.q('.kz-br-page .l5-photo'), 'с src — фото');
  } },
  { name: 's7: вписать src="dog.jpg"', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', 'src="dgo.jpg"', 'опечатка в имени файла');
    await qa.sleep(200);
    qa.expect(!!qa.q('.kz-br-page .l5-broken') && !qa.q('.kz-br-page .l5-photo'), 'честно: файла нет — сломанная картинка');
    qa.type('.kz-line textarea', 'src="dog.jpg"', 'атрибут');
    await qa.sleep(200);
    qa.expect(!!qa.q('.kz-br-page .l5-photo'), 'фото собаки');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's8: какая картинка', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6; r += 1) {
      await qa.waitFor(() => qa.platform.nextEnabled() || qa.qa('.l5-files .l5-card').some((b) => !b.disabled), 40000, 'раунд готов');
      if (qa.platform.nextEnabled()) break;
      const m = /src="([^"]+)"/.exec(qa.q('.kz-code').textContent);
      const known = ['cat.jpg', 'dog.jpg', 'parrot.png', 'fish.jpg'].indexOf(m[1]) >= 0;
      await qa.click('.l5-files .l5-card[data-file="' + (known ? m[1] : 'broken') + '"]', m[1]);
      await qa.sleep(500);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's9: атрибут alt (показ)', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.q('.kz-br-page .l5-broken'), 40000, 'картинка не загрузилась — значок и текст alt');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS9).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    qa.expect(!!qa.q('.l5-reader') && !!qa.q('.kz-br-page .l5-photo'), 'программа чтения на месте, фото вернулось');
  } },
  { name: 's10: своё описание по «Готово»', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myAlt, 'описание');
    await qa.sleep(1600);
    qa.expect(qa.text('.l5-reader-t').indexOf(qa.data.myAlt) >= 0 && !qa.platform.nextEnabled(), 'программа чтения сразу читает описание, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's11: хороший alt', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 4; r += 1) {
      await qa.waitFor(() => qa.platform.nextEnabled() || qa.qa('.l5-quiz .kz-btn').some((b) => !b.disabled), 40000, 'раунд готов');
      if (qa.platform.nextEnabled()) break;
      const bs = qa.qa('.l5-quiz .kz-btn');
      const best = bs.reduce((a, b) => (b.textContent.length > a.textContent.length ? b : a));
      best.click();
      await qa.sleep(600);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'оба раунда');
  } },
  { name: 's12: картинка по частям (показ)', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS12).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
    const t = qa.q('.l5-walk').textContent.replace(/\s+/g, '');
    qa.expect(t.indexOf('alt=') < t.indexOf('src='), 'атрибуты поменялись местами — картинка та же', { t });
    await qa.click('.l5-part-src', 'часть src');
    await qa.sleep(300);
    qa.expect(!!qa.q('.l5-part-src.is-on'), 'нажатая часть подсвечена');
  } },
  { name: 's13: свой тег картинки', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', '<img src="fish.jpg" alt="' + qa.data.myFishAlt + '">', 'тег целиком');
    await qa.sleep(200);
    qa.expect(!!qa.q('.kz-br-page .l5-photo[data-file="fish.jpg"]'), 'окно сразу показывает рыбку');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.l5-reader-t').indexOf(qa.data.myFishAlt) >= 0, 'программа чтения читает своё описание');
  } },
  { name: 's14: почему нет картинки', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6; r += 1) {
      await qa.waitFor(() => qa.platform.nextEnabled() || qa.qa('.l5-bugline .l5-part').some((b) => !b.disabled), 40000, 'раунд готов');
      if (qa.platform.nextEnabled()) break;
      const bad = qa.q('.kz-br-page .l5-broken') ? 'v' : 'n';
      await qa.click('.l5-bug-' + bad, 'ошибочная часть ' + bad);
      await qa.sleep(500);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
    qa.expect(!!qa.q('.kz-br-page .l5-photo'), 'последняя картинка починена');
  } },
  { name: 'q1: файлы к описаниям', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.l5-spot .led, .kz-scrap.is-led'), 'до первой попытки ответ не подсвечен');
    const put = async (id, where) => { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.click('.l5-spot[data-place="' + where + '"]', where); await qa.sleep(300); };
    await put('sp', 'p'); await put('sf', 'f');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .l5-photo').length === 2, 'две картинки');
  } },
  { name: 'q2: что делает alt', shot: 'q2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-quiz .kz-btn').length === 3 && !qa.q('.kz-quiz .kz-btn.is-ok, .kz-quiz .kz-btn.is-led'), 'три варианта, ничего не подсвечено');
    await qa.clickNth('.kz-quiz .kz-btn', 1, 'верный ответ');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, '«Завершить урок»');
    qa.expect(qa.qa('.kz-br-page .l5-photo').length === 3, 'три фото на странице');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<img src="fish.jpg" alt="' + qa.data.myFishAlt + '">') >= 0 && html.indexOf('alt="' + qa.data.myAlt + '"') >= 0, 'артефакт — свои описания', { html });
  } }
];

export default {
  title: 'Урок 5 курса HTML «Изображения» (бумажный стиль)',
  file: 'html/05-izobrazheniya',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',   // QA_SIZE=360x640 — прогон сценария на телефоне
  voice: 'fast',
  screens: 17,
  inputScreens: [4, 7, 10, 13],
  expectFinish: true,
  data: {
    ru: { myAlt: 'Весёлая собака с мячом', myFishAlt: 'Рыбка в аквариуме', endS3: 'пишут его без пары', endS6: 'показал картинку', endS9: 'кто её не видит', endS12: 'повторю её объяснение' },
    uz: { myAlt: 'To‘p o‘ynayotgan it', myFishAlt: 'Akvariumdagi baliq', endS3: 'juftsiz yoziladi', endS6: 'qaysi faylni ochishni', endS9: 'ham uni tushunadi', endS12: 'yana tushuntiraman' },
    en: { myAlt: 'A happy dog with a ball', myFishAlt: 'A fish in a tank', endS3: 'written without a pair', endS6: 'it showed the picture', endS9: 'understand a picture even', endS12: 'explain it again' }
  },
  steps: STEPS,
  flows: [
    { name: 's4: </img вместо <img', start: 3, langs: ['ru'], steps: [{ name: 'косая черта → причина', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '</img', 'с косой чертой');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(/черта/i.test(qa.text('.kz-ask')) && !qa.platform.nextEnabled(), 'причина: черта не нужна; «Дальше» закрыта', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 's5: не то место → дополнительный раунд', start: 4, langs: ['ru'], steps: [{ name: 'верхнее место вместо среднего', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.l5-slot[data-slot="0"]', 'верхнее место');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's7: href вместо src', start: 6, langs: ['ru'], steps: [{ name: 'href="dog.jpg"', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', 'href="dog.jpg"', 'href');
      await qa.sleep(200);
      qa.expect(!qa.q('.kz-br-page .l5-photo'), 'честно: у img href ничего не делает');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(/src/.test(qa.text('.kz-ask')) && !qa.platform.nextEnabled(), 'причина: нужен src', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 's8: промах → дополнительный раунд', start: 7, langs: ['ru'], steps: [{ name: 'не тот файл', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.l5-files .l5-card[data-file="cat.jpg"]', 'кот вместо попугая');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's10: кавычка в описании', start: 9, langs: ['ru'], steps: [{ name: 'с кавычкой', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', 'Собака "Рекс"', 'с кавычками');
      await qa.sleep(300);
      qa.expect(qa.q('.kz-ready').disabled && /кавыч/i.test(qa.text('.kz-ask')), '«Готово» выключена, подсказка про кавычки', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 's11: плохой alt → причина', start: 10, langs: ['ru'], steps: [{ name: '«картинка»', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.l5-quiz .kz-btn', 0, '«картинка»');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина');
      qa.expect(qa.qa('.l5-quiz .kz-btn.is-off').length === 1 && /картинка/.test(qa.text('.l5-reader-t')) && !qa.platform.nextEnabled(), 'вариант погас, программа прочла «картинка»');
    } }] },
    { name: 's13: </img> в своём теге', start: 12, langs: ['ru'], steps: [{ name: 'с закрывающим', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<img src="fish.jpg" alt="Рыбка"></img>', 'с </img>');
      await qa.sleep(200);
      qa.expect(!!qa.q('.kz-br-page .l5-photo[data-file="fish.jpg"]'), 'честно: браузер </img> не заметил, рыбка видна');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(/не нужен/i.test(qa.text('.kz-ask')) && !qa.platform.nextEnabled(), 'закрывающий тег не нужен', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 's14: не та часть → дополнительный раунд', start: 13, langs: ['ru'], steps: [{ name: 'часть alt', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.l5-bug-a', 'alt — он в порядке');
      await qa.sleep(400);
      qa.expect(!qa.platform.nextEnabled(), 'раунд продолжается');
      await qa.waitFor(() => qa.qa('.l5-bugline .l5-part').some((b) => !b.disabled), 30000, 'подсказка рассказана');
      await qa.click('.l5-bug-n', 'имя атрибута');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 'q1: наклейка href', start: 14, langs: ['ru'], steps: [{ name: 'href → попугай', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="hp"]', 'href="parrot.png"'); await qa.click('.l5-spot[data-place="p"]', 'попугай');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина');
      qa.expect(/src/.test(qa.text('.kz-ask')) && !qa.q('.kz-br-page .l5-photo') && qa.qa('.kz-tray .kz-scrap').length === 3 && !qa.platform.nextEnabled(), 'фото нет (только alt), наклейка вернулась', { ask: qa.text('.kz-ask') });
    } }] },
    { name: 'q2: неверный ответ → причина, снова', start: 15, langs: ['ru'], steps: [{ name: 'первый вариант', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-quiz .kz-btn', 0, 'неверный ответ');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(qa.qa('.kz-quiz .kz-btn.is-off').length === 1 && !qa.platform.nextEnabled(), 'вариант погас, можно выбрать снова');
    } }] }
  ]
};
