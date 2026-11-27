// Сценарий проверки практики к уроку 2, ЧАСТЬ 2 lessons/html/02p2-zagolovki-i-tekst.jsx («Газета Коди»: b, i и своя статья;
// собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: «Выделить» (в объявлении слова становятся
// жирным и наклонным), четыре страницы (слова жирным — b, слово наклонным i и слово жирным b, найти и закрыть незакрытый b,
// своя статья), вывод; onFinished один раз, артефакт — своя статья. Ветки: i вместо b, другие слова жирным, перепутанные
// теги, только жирное во втором, лампочка до образца и дополнительная задача, не та строка, статья без заголовка,
// «Назад» сохраняет код и карту. Шаги — в странице.

const STEPS = [
  { name: 'h2: «Выделить» — слова жирным и наклонным', shot: 'h2-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a2-tab.is-ok').length === 3 && !qa.q('.a2-wb') && !qa.q('.a2-wi'), 'три боковые вкладки горят, выделенных слов нет');
    await qa.click('.a2-publish', 'Выделить');
    await qa.waitFor(() => qa.q('.a2-wb') && qa.q('.a2-wi'), 5000, 'слова стали жирным и наклонным');
    qa.expect(/экзамен/.test(qa.text('.a2-wb')) && /ручку/.test(qa.text('.a2-wi')), 'жирное — «экзамен», наклонное — «свою ручку»');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: слова жирным (b)', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const w = (/[«“]([^»”]+)[»”]/.exec(qa.text('.kz-ask')) || [])[1];
    qa.expect(/встреча/.test(qa.q('.a2-ta').value) && !qa.q('.a2-wb'), 'абзац уже в редакторе, жирных слов пока нет');
    qa.type('.a2-ta', qa.q('.a2-ta').value.replace(w, '<b>' + w + '</b>'), 'b вокруг слов');
    await qa.sleep(200);
    qa.expect(qa.text('.a2-wb').indexOf(w) >= 0, 'слова жирные на странице сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: слово наклонным и слово жирным', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a2-tab.is-ok').length === 1, 'первая вкладка горит');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((s) => s.slice(1, -1));
    qa.expect(ws.length === 2, 'в строке задания два слова', { ws });
    qa.type('.a2-ta', qa.q('.a2-ta').value.replace(ws[0], '<i>' + ws[0] + '</i>').replace(ws[1], '<b>' + ws[1] + '</b>'), 'i и b');
    await qa.sleep(200);
    qa.expect(qa.text('.a2-wi').indexOf(ws[0]) >= 0 && qa.text('.a2-wb').indexOf(ws[1]) >= 0, 'одно слово наклонное, другое жирное');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: найти и закрыть b', shot: 't3-done', run: async (qa) => {
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
  { name: 't4: своя статья', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a2-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
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
    qa.expect(qa.qa('.a2-tab.is-ok').length === 3 && !qa.q('.a2-fav.is-off'), 'все четыре вкладки горят');
    qa.expect(/Кошки & собаки/.test(qa.text('.a2-h1')), 'на открытой вкладке — своя статья');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Кошки & собаки' && /<h1>Кошки &amp; собаки<\/h1>/.test(a.html) && /<b>лучшие<\/b>/.test(a.html) && a.text === 'Они лучшие друзья.' && a.title === 'Моя статья',
      'артефакт — своя статья, текст экранирован', { a });
  } }
];
export default {
  title: 'Практика 2, часть 2, курса HTML «Газета Коди: b, i и своя статья» (облик «Редактор»)',
  file: 'html/02p2-zagolovki-i-tekst',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 6,
  inputScreens: [2, 3, 5],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 't1: i вместо b, другие слова → причина; лампочка до образца → дополнительная задача', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a2-ta', '  <p>Завтра встреча начнётся <i>в десять часов</i>.</p>', 'i вместо b'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /наклонным/.test(qa.text('.b-sheet p')), 3000, 'причина: i наклоняет, нужно жирное');
      qa.type('.a2-ta', '  <p>Завтра <b>встреча</b> начнётся в десять часов.</p>', 'другие слова'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Жирным вышло другое/.test(qa.text('.b-sheet p')) && /встреча/.test(qa.text('.b-sheet p')) && /в десять часов/.test(qa.text('.b-sheet p')), 'причина: слова другие, нужны «в десять часов»', { t: qa.text('.b-sheet p') });
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a2-sample'), 3000, 'образец третьей ступени');
      qa.type('.a2-ta', '  <p>Завтра встреча начнётся <b>в десять часов</b>.</p>', 'верно'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled() && /девять/.test(qa.q('.a2-ta').value), '«Дальше» ждёт дополнительную; другой абзац');
      qa.type('.a2-ta', '  <p>Урок начнётся <b>в девять часов</b>.</p>', 'девять'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't1: слова тронуты, b не закрыт → причины', start: 1, langs: ['ru'], steps: [{ name: 't1: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a2-ta', '  <p>Завтра встреча <b>в десять часов.</p>', 'b не закрыт'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не закрыт/.test(qa.text('.b-sheet p')), 3000, 'причина: b не закрыт');
      qa.type('.a2-ta', '  <p>Завтра <b>в десять часов</b>.</p>', 'слова тронуты'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/пробелы/.test(qa.text('.b-sheet p')), 'причина: слова не трогать', { t: qa.text('.b-sheet p') });
      qa.type('.a2-ta', '  <p>Завтра встреча начнётся в десять часов.</p>', 'без тегов'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/жирного слова/.test(qa.text('.b-sheet p')), 'причина: нет жирного слова', { t: qa.text('.b-sheet p') });} }] },
    { name: 't2: перепутанные теги, только жирное, чужое слово → причины', start: 2, langs: ['ru'], steps: [{ name: 't2: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a2-ta', '  <p>Я прочитал книгу <b>Роботы</b>, она <i>очень</i> интересная!</p>', 'теги наоборот'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /поменялись местами/.test(qa.text('.b-sheet p')), 3000, 'причина: теги наоборот');
      qa.type('.a2-ta', '  <p>Я прочитал книгу Роботы, она <b>очень</b> интересная!</p>', 'только жирное'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Наклонного слова/.test(qa.text('.b-sheet p')), 'причина: нет наклонного слова', { t: qa.text('.b-sheet p') });
      qa.type('.a2-ta', '  <p>Я прочитал <i>книгу</i> Роботы, она <b>очень</b> интересная!</p>', 'не то слово'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/Наклонным вышло другое/.test(qa.text('.b-sheet p')) && /Роботы/.test(qa.text('.b-sheet p')), 'причина: наклонным вышло другое, нужно «Роботы»', { t: qa.text('.b-sheet p') });} }] },
    { name: 't3: не та строка → причина выше', start: 3, langs: ['ru'], steps: [{ name: 't3: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a2-tap', 3, 'абзац ниже'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a2-ta') && /выше/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — выше');} }] },
    { name: 't4: статья без заголовка → h1', start: 4, langs: ['ru'], steps: [{ name: 't4: порядок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a2-ta', '<p>Мой кот</p>', 'p'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /начинается с заголовка/.test(qa.text('.b-sheet p')), 3000, 'причина: сначала h1');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a2-ta', '  <p>Завтра встреча начнётся <b>в десять часов</b>.</p>', 'верно'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a2-ta', '  <p>Я прочитал <i>кни', 'начало'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<i>кни/.test(qa.q('.a2-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a2-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
