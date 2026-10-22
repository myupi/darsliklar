// Сценарий проверки урока 3 курса HTML lessons/html/03-spiski.jsx («Списки», бумажный стиль).
// Основной путь: все 15 экранов действиями ученика (снимок каждого — в решённом виде), свой список (s13),
// ul → ol на своём списке (s14), onFinished один раз, артефакт со своим названием и пунктами.
// Ветки: <li> вместо </li> (s4); промах в «Сколько точек?» → дополнительный раунд (s5); список не на тот лист (s8);
// <ul> вместо </ul> (s10); не та строка в «Найди поломку» → подсказка и дополнительный раунд (s11).
// Функции шагов выполняются в странице: только аргумент qa (помощники — прямо в шаге).

const STEPS = [
  { name: 's1: записки → два списка', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.l3-pile-strip').length === 6, 'шесть записок вперемешку');
    await qa.click('.kz-btn.is-coral', 'Разложить');
    await qa.waitFor(() => qa.qa('.l3-dot.is-num').length === 3, 6000, 'у шагов номера');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'рассказано');
  } },
  { name: 's2: план', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'план рассказан');
    qa.expect(qa.qa('.kz-card.is-open').length === 4, 'четыре карточки открыты');
  } },
  { name: 's3: обернуть вещи в li', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(!!qa.q('.kz-br-page .l3-txt') && !qa.q('.kz-br-page .l3-li'), 'вещи склеены в строку, точек нет');
    for (let k = 0; k < 3; k += 1) { await qa.click('.kz-line.kz-tap', 'вещь'); await qa.sleep(250); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .l3-li').length === 3, 'три пункта с точками');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's4: <li> и </li> вокруг спальника', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br-page .l3-miss'), 'у спальника нет точки — на её месте «?»');
    const f = qa.qa('.l3-slot textarea');
    qa.type(f[0], '<li>', 'перед словом'); qa.type(f[1], '</li>', 'после слова');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .l3-li').length === 4, 'четыре пункта');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's5: сколько точек', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.l3-pick3'); r += 1) {
      await qa.platform.ready(30000);
      const code = qa.q('.kz-code') ? qa.q('.kz-code').textContent : '';
      const n = (code.match(/<li>/g) || []).length;
      await qa.clickNth('.l3-pick3 .kz-btn', n - 1, 'ответ ' + n);
      await qa.waitFor(() => !qa.q('.l3-pick3') || qa.qa('.l3-pick3 .kz-btn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's6: перемешать рецепт', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(qa.qa('.kz-br-page .l3-ol .l3-li').length === 3, 'рецепт — список с номерами');
    await qa.click('.kz-btn.is-coral', 'Перемешать');
    await qa.waitFor(() => qa.q('.l3-oops'), 3000, 'шаги перепутались — «?!»');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'рассказано');
    qa.expect(!qa.q('.l3-oops'), 'шаги вернулись по местам');
  } },
  { name: 's7: <ol> сверху и </ol> снизу', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .l3-stray').length === 3, 'без тегов списка пункты без отступа');
    const f = qa.qa('.l3-slot textarea');
    qa.type(f[0], '<ol>', 'сверху');
    await qa.sleep(200);
    qa.expect(!!qa.q('.kz-br-page .l3-ol'), 'с <ol> появились номера');
    qa.type(f[1], '</ol>', 'снизу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's8: разложить списки по ul и ol', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const put = async (id, kind) => { await qa.click('.l3-card[data-id="' + id + '"]', id); await qa.click('.l3-sheet-btn[data-place="' + kind + '"]', kind); await qa.sleep(300); };
    await put('shop', 'ul'); await put('morning', 'ol'); await put('top', 'ol'); await put('friends', 'ul');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.l3-mini').length === 4, 'четыре списка на листах');
  } },
  { name: 's9: вернуть li в список', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(!!qa.q('.kz-br-page .l3-stray'), 'пункт выпал из списка');
    await qa.click('.kz-line.l3-stray-line', 'выпавший пункт');
    await qa.click('.kz-line[data-place="in"]', 'место внутри списка');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.q('.kz-br-page .l3-stray') && qa.qa('.kz-br-page .l3-li').length === 3, 'все пункты внутри списка');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's10: набрать </ul>', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br-page .l3-list .l3-p'), 'абзац сдвинут внутрь списка');
    qa.type('.kz-line textarea', '</ul>', 'закрывающий ul');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.q('.kz-br-page .l3-list .l3-p'), 'абзац снова на своём месте');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's11: найти поломку', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 8; r += 1) {
      await qa.waitFor(() => qa.platform.nextEnabled() || qa.qa('.kz-line.kz-tap').some((b) => !b.disabled), 40000, 'раунд готов');
      if (qa.platform.nextEnabled()) break;
      const lines = qa.qa('.kz-code .kz-line');
      const texts = lines.map((ln) => ln.textContent.replace(/\s+/g, ''));
      const close = texts.indexOf('</ul>');
      const bad = texts.findIndex((t, j) => (t.indexOf('<li>') >= 0 && j > close) || (t.indexOf('<') < 0) || ((t.match(/<li>/g) || []).length === 2 && t.indexOf('</li>') < 0));
      await qa.clickNth('.kz-code .kz-line', bad, 'сломанная строка ' + bad);
      await qa.sleep(500);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's12: читать как браузер', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.click('.kz-btn.is-coral', 'Читать как браузер');
    await qa.waitFor(() => qa.qa('.kz-br-page .l3-list').length === 2, 12000, 'страница собрана');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's13: свой список', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type(qa.qa('.kz-line textarea')[0], qa.data.myTitle, 'название');
    await qa.waitFor(() => qa.text('.kz-ask-n') === '2/2', 6000, 'шаг 2');
    const f = qa.qa('.kz-line textarea');
    qa.data.items.forEach((x, i) => qa.type(f[i + 1], x, 'пункт ' + (i + 1)));
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.kz-br-page .l3-h1') === qa.data.myTitle, 'h1 = своё название');
    qa.expect(qa.qa('.kz-br-page .l3-li').length === 3, 'три своих пункта');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's14: ul → ol', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br-page .l3-ul'), 'сначала список с точками');
    await qa.clickText('.kz-scrap', '<ol>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .l3-ol'), 'теперь с номерами');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, '«Завершить урок»');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<h1>' + qa.data.myTitle + '</h1>') >= 0 && html.indexOf('<ol>') >= 0 && html.indexOf('<li>' + qa.data.items[0] + '</li>') >= 0, 'артефакт — свой список', { html });
  } }
];

export default {
  title: 'Урок 3 курса HTML «Списки» (бумажный стиль)',
  file: 'html/03-spiski',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',   // QA_SIZE=360x640 — прогон сценария на телефоне
  voice: 'fast',
  screens: 15,
  inputScreens: [4, 7, 10, 13],
  expectFinish: true,
  data: {
    ru: { myTitle: 'Мои любимые игры', items: ['Футбол', 'Шахматы', 'Прятки'] },
    uz: { myTitle: 'Sevimli o‘yinlarim', items: ['Futbol', 'Shaxmat', 'Bekinmachoq'] },
    en: { myTitle: 'My favorite games', items: ['Football', 'Chess', 'Hide and seek'] }
  },
  steps: STEPS,
  flows: [
    { name: 's4: <li> вместо </li>', start: 3, langs: ['ru'], steps: [{ name: 'два открывающих → причина', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.l3-slot textarea');
      qa.type(f[0], '<li>', 'перед словом'); qa.type(f[1], '<li>', 'после слова — снова открывающий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(/черта|chiziq|slash/i.test(qa.text('.kz-ask')), 'причина: нужна косая черта', { ask: qa.text('.kz-ask') });
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's5: промах → дополнительный раунд', start: 4, langs: ['ru'], steps: [{ name: 'неверный ответ', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.l3-pick3 .kz-btn', 0, 'неверный ответ «1»');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's8: список не на тот лист', start: 7, langs: ['ru'], steps: [{ name: 'покупки → ol', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.l3-card[data-id="shop"]', 'покупки');
      await qa.click('.l3-sheet-btn[data-place="ol"]', 'лист ol');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина');
      qa.expect(qa.qa('.l3-card').length === 4 && qa.qa('.l3-mini').length === 0, 'карточка не легла');
    } }] },
    { name: 's10: <ul> вместо </ul>', start: 9, langs: ['ru'], steps: [{ name: 'открывающий → причина', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<ul>', 'открывающий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's11: не та строка → подсказка и ещё раунд', start: 10, langs: ['ru'], steps: [{ name: 'строка <ul>', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line', 0, 'строка <ul> — она в порядке');
      await qa.sleep(400);
      qa.expect(qa.qa('.kz-line.kz-tap').length > 0 && !qa.platform.nextEnabled(), 'раунд продолжается');
      await qa.waitFor(() => qa.qa('.kz-line.kz-tap').some((b) => !b.disabled), 30000, 'подсказка рассказана');
      await qa.clickNth('.kz-code .kz-line', 2, 'сломанная строка');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] }
  ]
};
