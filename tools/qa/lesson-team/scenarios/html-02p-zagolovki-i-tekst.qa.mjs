// Сценарий проверки практики к уроку 2 курса HTML lessons/html/02p-zagolovki-i-tekst.jsx («Газета Коди»,
// облик «Редактор», 04.11.2026, на каркасе 01p).
// Основной путь: 7 слайдов действиями ученика — публикация (теги пропали, слова слиплись), пять страниц газеты
// (слова в h1, строка h2, два абзаца p, найти и закрыть незакрытый b, своя статья: h1, p и b или i), вывод;
// onFinished один раз, артефакт — своя статья. Ветки: причина в панели, подсказка после второй неудачи подряд,
// лампочка до образца и дополнительная задача, h1 вместо h2, один абзац вместо двух, не та строка, статья без
// заголовка, «Назад» сохраняет код и карту. Шаги — в странице.

const STEPS = [
  { name: 's1: публикация — теги пропали', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a2-tab.is-ok').length === 4 && !!qa.q('.a2-h1'), 'до публикации вкладки горят, на странице заголовок');
    await qa.click('.a2-publish', 'Опубликовать');
    await qa.waitFor(() => qa.qa('.a2-tab.is-off').length === 4, 5000, 'вкладки погасли');
    qa.expect(qa.qa('.a2-blk').length === 1 && !!qa.q('.a2-raw'), 'честно: слова слиплись в одну строку');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: слова в h1', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const w1 = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    qa.expect(qa.text('.a2-tab.is-cur').indexOf(w1) >= 0 && !qa.q('.a2-h1'), 'название уже на вкладке, h1 на странице нет');
    qa.type('.kz-gap textarea', w1, 'заголовок');
    await qa.sleep(200);
    qa.expect(qa.text('.a2-h1').indexOf(w1) >= 0, 'заголовок на странице сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: строка h2', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a2-tab.is-ok').length === 1, 'первая вкладка горит');
    const w2 = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    qa.type('.a2-ta', '  <h2>' + w2 + '</h2>', 'строка');
    await qa.sleep(200);
    qa.expect(qa.text('.a2-h2').trim() === w2, 'заголовок раздела на странице');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: два абзаца', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.a2-p'), 'абзацев пока нет');
    qa.type('.a2-ta', '  <p>Кошки много спят.</p>\n  <p>Они любят рыбу.</p>', 'абзацы');
    await qa.sleep(200);
    qa.expect(qa.qa('.a2-p').length === 2, 'два абзаца на странице сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: найти и закрыть b', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a2-p').length === 2 && qa.qa('.a2-p .a2-wb').length === 2, 'честно: жирным стал и абзац ниже');
    await qa.clickNth('.a2-tap', 2, 'строка с b');
    await qa.waitFor(() => qa.q('.a2-ta'), 3000, 'строка стала полем');
    const v = qa.q('.a2-ta').value;
    qa.type('.a2-ta', v.replace('</p>', '</b></p>'), 'закрыть b');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.a2-p .a2-wb').length === 1, 'жирные только нужные слова');
  } },
  { name: 't5: своя статья', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a2-ta', '<h1>Кошки & собаки</h1>\n<p>Они лучшие друзья.</p>', 'статья без выделения');
    await qa.sleep(200);
    qa.expect(qa.qa('.a2-tree-r.is-ok').length === 3, 'схема отмечает body, h1 и p');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet'), 3000, 'ответ');
    qa.expect(!qa.q('.b-sheet.is-ok'), 'без b или i статья не засчитана');
    qa.type('.a2-ta', '<h1>Кошки & собаки</h1>\n<p>Они <b>лучшие</b> друзья.</p>', 'статья');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(/Кошки & собаки/.test(qa.text('.a2-h1')), 'свой заголовок, & — как текст');
  } },
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить практику»');
    qa.expect(qa.qa('.a2-tab.is-ok').length === 4 && !qa.q('.a2-fav.is-off'), 'все пять вкладок горят');
    qa.expect(/Кошки & собаки/.test(qa.text('.a2-h1')), 'на открытой вкладке — своя статья');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Кошки & собаки' && /<h1>Кошки &amp; собаки<\/h1>/.test(a.html) && /<b>лучшие<\/b>/.test(a.html) && a.text === 'Они лучшие друзья.',
      'артефакт — своя статья, текст экранирован', { a });
  } }
];
export default {
  title: 'Практика 2 курса HTML «Газета Коди» (облик «Редактор»)',
  file: 'html/02p-zagolovki-i-tekst',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 7,
  inputScreens: [2, 3, 4, 6],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 't1: другое слово → причина, вторая неудача → подсказка', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'Кино', 'Кино'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.type('.kz-gap textarea', '<b>', '<b>'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/Кино/.test(one) && /скоб/.test(two) && /title/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });} }] },
    { name: 't2: лампочка до образца → дополнительная задача', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a2-ta', '  <h2>Футбол<h2>', 'без косой черты'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /кос/.test(qa.text('.b-sheet p')), 3000, 'причина: нет косой черты');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a2-sample'), 3000, 'образец третьей ступени');
      qa.type('.a2-ta', '  <h2>Футбол</h2>', 'строка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.a2-ta', '  <h2>Шахматы</h2>', 'Шахматы'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't2: h1 вместо h2 и h3 → уровень', start: 2, langs: ['ru'], steps: [{ name: 't2: уровни', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a2-ta', '  <h1>Футбол</h1>', 'h1'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /главный заголовок/.test(qa.text('.b-sheet p')), 3000, 'h1 уже есть');
      qa.type('.a2-ta', '  <h3>Футбол</h3>', 'h3'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /больше цифра/.test(qa.text('.b-sheet p')), 3000, 'чем больше цифра, тем мельче');} }] },
    { name: 't3: строки без p и один p → правило', start: 3, langs: ['ru'], steps: [{ name: 't3: абзацы', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a2-ta', '  Кошки спят.\n  Они едят.', 'текст'); await qa.sleep(200);
      qa.expect(qa.qa('.a2-raw').length === 1 && /спят\. Они/.test(qa.text('.a2-raw')), 'браузер честно склеивает строки');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /слепит/.test(qa.text('.b-sheet p')), 3000, 'каждый абзац — в своём p');
      qa.type('.a2-ta', '  <p>Кошки спят.\n  Они едят.</p>', 'один p'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /абзац один/.test(qa.text('.b-sheet p')), 3000, 'нужен второй p');} }] },
    { name: 't4: не та строка → причина выше', start: 4, langs: ['ru'], steps: [{ name: 't4: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a2-tap', 3, 'абзац ниже'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a2-ta') && /выше/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — выше');} }] },
    { name: 't5: статья без заголовка → h1', start: 5, langs: ['ru'], steps: [{ name: 't5: порядок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a2-ta', '<p>Мой кот</p>', 'p'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /начинается с заголовка/.test(qa.text('.b-sheet p')), 3000, 'причина: сначала h1');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1], 'заголовок'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a2-ta', '  <h2>Фу', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<h2>Фу/.test(qa.q('.a2-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a2-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
