// Сценарий проверки урока 2 курса HTML lessons/html/02-zagolovki-i-tekst.jsx («Заголовки и текст», бумажный стиль).
// Основной путь: все 15 экранов действиями ученика (снимок каждого — в решённом виде), своя страница (s13),
// починка </b> (s14), onFinished один раз, артефакт со своим названием и текстом.
// Ветки: открывающий вместо закрывающего (s4); h6 на раздел (s5); промах в прогнозе → дополнительный раунд (s8);
// неверный тег b/i → дополнительный раунд (s11); <b> без </b> честно делает жирным хвост абзаца (s10).
// Функции шагов выполняются в странице: только аргумент qa (помощники — прямо в шаге).

const STEPS = [
  { name: 's1: каша → страница', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!!qa.q('.z2-wall'), 'сначала каша из текста');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.q('.z2-h1'), 5000, 'появился h1');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'рассказано');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's2: план', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'план рассказан');
    qa.expect(qa.qa('.kz-card.is-open').length === 4, 'четыре карточки открыты');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's3: самый крупный и самый мелкий заголовок', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(qa.qa('.z2-hstrip').length === 6, 'шесть полосок h1–h6');
    await qa.clickNth('.z2-hstrip.is-tap', 0, 'h1'); await qa.platform.ready(30000);
    await qa.clickNth('.z2-hstrip.is-tap', 1, 'h6');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's4: набрать </h1>', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.z2-inh1'), 'абзац огромный, пока h1 не закрыт');
    qa.type('.kz-line textarea', '</h1>', 'закрывающий h1');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!qa.q('.z2-inh1'), 'абзац снова обычный');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's5: h1 и два h2 по местам', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const put = async (t, k) => { await qa.clickText('.kz-scrap', t); await qa.click('.kz-line[data-place="' + k + '"]', 'строка ' + k); await qa.sleep(300); };
    await put('<h1>', 0); await put('<h2>', 1); await put('<h2>', 2);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-tray .kz-scrap').length === 0 || qa.qa('.kz-scrap').length <= 1, 'лишний h6 остался');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's6: обернуть строки в p', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(!!qa.q('.z2-raw'), 'три строки склеены в одну');
    for (let k = 0; k < 3; k += 1) { await qa.click('.kz-line.kz-tap', 'строка'); await qa.sleep(250); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.z2-p').length === 3, 'три абзаца в окне');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's7: <p> и </p> вокруг строки', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.z2-slot textarea');
    qa.type(f[0], '<p>', 'перед текстом'); qa.type(f[1], '</p>', 'после текста');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.z2-p').length === 2, 'два абзаца в окне');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's8: сколько абзацев', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    const want = () => {
      const lines = qa.qa('.kz-slip');
      let n = 0;
      lines.forEach((ln) => { n += (ln.textContent.match(/<p>/g) || []).length; });
      return n;
    };
    for (let r = 0; r < 6 && qa.q('.z2-pick3'); r += 1) {
      await qa.platform.ready(30000);
      await qa.clickNth('.z2-pick3 .kz-btn', want() - 1, 'ответ');
      await qa.waitFor(() => !qa.q('.z2-pick3') || qa.qa('.z2-pick3 .kz-btn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's9: теги b и i', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.click('.z2-w.is-b .kz-label', 'бирка b над словом'); await qa.platform.ready(30000);
    await qa.click('.z2-w.is-i .kz-label', 'бирка i над словом');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
    qa.expect(!!qa.q('.z2-w.is-b.is-on') && !!qa.q('.z2-w.is-i.is-on'), 'слово жирное с полоской и слово курсивом');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's10: <b> и </b> вокруг слова', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.z2-slot textarea');
    qa.type(f[0], '<b>', 'перед словом');
    await qa.sleep(200);
    qa.expect(!!qa.q('.kz-br-page .z2-b'), 'без </b> жирное до конца абзаца');
    qa.type(f[1], '</b>', 'после слова');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's11: b или i', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.z2-tagbtn'); r += 1) {
      await qa.platform.ready(30000);
      const want = qa.q('.z2-card .z2-b') ? 0 : 1;
      await qa.clickNth('.z2-tagbtn', want, 'ответ');
      await qa.waitFor(() => !qa.q('.z2-tagbtn') || qa.qa('.z2-tagbtn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's12: читать как браузер', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.click('.kz-btn.is-coral', 'Читать как браузер');
    await qa.waitFor(() => qa.qa('.kz-br-page .z2-blk').length === 4, 12000, 'страница собрана');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's13: своя страница', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type(qa.qa('.kz-line textarea')[0], qa.data.myTitle, 'название');
    await qa.waitFor(() => qa.text('.kz-ask-n') === '2/2', 6000, 'шаг 2');
    qa.type(qa.qa('.kz-line textarea')[1], qa.data.myText, 'предложение');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.kz-br-page .z2-h1') === qa.data.myTitle, 'h1 = своё название');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's14: вставить </b>', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .z2-b').length === 2, 'всё жирное до конца страницы');
    await qa.clickText('.kz-scrap', '</b>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .z2-b').length === 1, 'жирное одно слово');
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
    qa.expect(html.indexOf('<h1>' + qa.data.myTitle + '</h1>') >= 0 && html.indexOf(qa.data.myText) >= 0, 'артефакт — своя страница', { html });
  } }
];

export default {
  title: 'Урок 2 курса HTML «Заголовки и текст» (бумажный стиль)',
  file: 'html/02-zagolovki-i-tekst',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',   // QA_SIZE=360x640 — прогон сценария на телефоне
  voice: 'fast',
  screens: 15,
  inputScreens: [4, 7, 10, 13],
  expectFinish: true,
  data: {
    ru: { myTitle: 'Шахматы', myText: 'Я играю в шахматы с папой.' },
    uz: { myTitle: 'Shaxmat', myText: 'Men dadam bilan shaxmat o‘ynayman.' },
    en: { myTitle: 'Chess', myText: 'I play chess with my dad.' }
  },
  steps: STEPS,
  flows: [
    { name: 's4: открывающий вместо закрывающего', start: 3, langs: ['ru'], steps: [{ name: '<h1> → причина, без засчёта', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-line textarea', '<h1>', 'открывающий');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'причина на месте задания');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's5: h6 на раздел', start: 4, langs: ['ru'], steps: [{ name: 'h6 → объяснение', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-scrap', '<h6>');
      await qa.click('.kz-line[data-place="1"]', 'раздел');
      await qa.waitFor(() => qa.q('.kz-ask.is-hint'), 3000, 'объяснение');
      qa.expect(qa.qa('.kz-scrap').length === 4, 'бирка не легла');
    } }] },
    { name: 's8: промах → дополнительный раунд', start: 7, langs: ['ru'], steps: [{ name: 'неверный ответ', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.z2-pick3 .kz-btn', 0, 'неверный ответ «1»');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's11: неверный тег → дополнительный раунд', start: 10, langs: ['ru'], steps: [{ name: 'i вместо b', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.z2-tagbtn', 1, 'i вместо b');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] }
  ]
};
