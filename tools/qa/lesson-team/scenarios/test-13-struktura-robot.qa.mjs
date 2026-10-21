// Сценарий проверки урока 1 курса HTML lessons/html/01-struktura-dokumenta.jsx
// («Структура HTML-документа: робот Пиксель», эталон курса).
// Основной путь: все 15 экранов действиями ученика (снимок каждого экрана — в решённом
// виде, до «Дальше»): слои робота, экран Пикселя, план с кнопкой «Подсказка», две надписи,
// части строки title, шкаф документа, своё название и текст, прогноз, конструктор, пары,
// исправление вложенности, поломка без </title> и её починка, своя страница из 8 строк, финал с чтением
// страницы вслух; onFinished один раз, артефакт со своим названием и текстом.
// Ветки: ошибка в частях тега; промах в прогнозе → дополнительный раунд; title не в тот
// ящик; title не в тот тег при исправлении; открывающий вместо закрывающего.
// Шаги выполняются в странице: только аргумент qa. Нажатия — по классам и тегам, без
// текстов на языке урока, поэтому сценарий одинаков для uz/ru/en.

const STEPS = [
  { name: 'Экран 1 (r1): включить слои HTML, CSS, JavaScript', shot: 'e01-done', run: async (qa) => {
    await qa.platform.ready(30000);
    for (let i = 0; i < 3; i += 1) {
      await qa.waitFor(() => { const b = qa.qa('.rb-layer')[i]; return b && !b.disabled; }, 30000, 'слой ' + (i + 1) + ' доступен');
      await qa.clickNth('.rb-layer', i, 'слой ' + (i + 1));
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, 'три слоя включены');
  } },
  { name: 'Экран 2 (r2): открыть экран Пикселя', shot: 'e02-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.q('.rb-open-b') && !qa.q('.rb-open-b').disabled, 20000, 'кнопка «Открыть экран»');
    await qa.click('.rb-open-b', 'Открыть экран');
    await qa.waitFor(() => qa.q('.rb-open'), 5000, 'мини-браузер и код');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказ про страницу');
  } },
  { name: 'Экран 3 (m): план и кнопка «Подсказка»', shot: 'e03-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.q('.coach-card'), 40000, 'обучение кнопке «Подсказка»');
    await qa.sleep(600);
    qa.platform.hint();
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'план готов');
    qa.expect(!qa.q('.coach-card'), 'шаг «Пауза» убран: обучение закончилось после «Подсказки»');
  } },
  { name: 'Экран 4 (s1): поменять название', shot: 'e04-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.q('.act-card') && !qa.q('.act-card').disabled, 20000, 'карточки');
    await qa.clickNth('.act-card', 0, 'Поменять название');
    await qa.waitFor(() => qa.q('.opt-chip'), 4000, 'варианты');
    await qa.clickNth('.opt-chip', 0, 'первый вариант');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'страница поменялась');
  } },
  { name: 'Экран 5 (s2): части строки — конец, начало, содержимое', shot: 'e05-done', run: async (qa) => {
    await qa.platform.next();
    const part = async (sel, label) => {
      await qa.waitFor(() => qa.q(sel) && !qa.q(sel).disabled && !qa.q('.stage.is-speaking'), 60000, label + ' доступно');
      await qa.click(sel, label);
      await qa.sleep(500);
    };
    await part('.bl-end', 'конец');
    await part('.bl-start', 'начало');
    await part('.bl-content', 'содержимое');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все вопросы');
  } },
  { name: 'Экран 6 (s3): шкаф — html, head, title, body', shot: 'e06-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    const chip = (t) => qa.qa('.chip').find((b) => b.textContent.trim() === t);
    for (const t of ['html', 'head', 'title', 'body']) {
      await qa.waitFor(() => chip(t) && !chip(t).disabled && !qa.q('.stage.is-speaking'), 40000, 'чип ' + t);
      await qa.click(chip(t), 'чип ' + t);
      await qa.sleep(500);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'четыре части открыты');
  } },
  { name: 'Экран 7 (s4): своё название в title', shot: 'e07-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.type('.tk-input', qa.data.myTitle, 'название');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'название засчитано');
  } },
  { name: 'Экран 8 (s5): свой текст в body', shot: 'e08-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.type('.tk-input', qa.data.myText, 'текст');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'текст засчитан');
  } },
  { name: 'Экран 9 (s6): вкладка или окно', shot: 'e09-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 4 && !qa.platform.nextEnabled(); r += 1) {
      await qa.waitFor(() => qa.platform.nextEnabled() || (qa.q('.where-b') && qa.qa('.where-b').every((b) => !b.disabled) && !qa.q('.stage.is-speaking')), 40000, 'раунд ' + (r + 1));
      if (qa.platform.nextEnabled()) break;
      const isTitle = qa.qa('.cv-line.is-in').some((l) => l.textContent.indexOf('<title>') >= 0);
      await qa.clickNth('.where-b', isTitle ? 0 : 1, isTitle ? 'Вкладка' : 'Окно');
      await qa.sleep(800);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'все раунды');
  } },
  { name: 'Экран 10 (s7): конструктор — head и body в html, title в head', shot: 'e10-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    const piece = (t) => qa.qa('.piece').find((b) => b.textContent.replace(/\s+/g, '') === t);
    for (const [t, place] of [['<head>…</head>', 'html'], ['<body>…</body>', 'html'], ['<title>…</title>', 'head']]) {
      await qa.waitFor(() => piece(t) && !piece(t).disabled && !qa.q('.stage.is-speaking'), 30000, 'деталь ' + t);
      await qa.click(piece(t), 'деталь ' + t);
      await qa.waitFor(() => qa.q('.drop-zone[data-place="' + place + '"]'), 4000, 'место внутрь ' + place);
      await qa.click('.drop-zone[data-place="' + place + '"]', 'внутрь ' + place);
      await qa.sleep(600);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'шкаф собран');
  } },
  { name: 'Экран 11 (s8): четыре пары тегов', shot: 'e11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    const tk = (t) => qa.qa('.tk-btn').find((b) => b.textContent.trim() === t);
    for (const n of ['html', 'head', 'title', 'body']) {
      await qa.waitFor(() => tk('<' + n + '>') && !tk('<' + n + '>').disabled && !qa.q('.stage.is-speaking'), 30000, 'тег <' + n + '>');
      await qa.click(tk('<' + n + '>'), '<' + n + '>');
      await qa.sleep(250);
      await qa.click(tk('</' + n + '>'), '</' + n + '>');
      await qa.sleep(600);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'все пары');
  } },
  { name: 'Экран 12 (s9): перенести title в head', shot: 'e12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.q('.cv-line.is-draggable') && !qa.q('.cv-line.is-draggable').disabled, 20000, 'строка title');
    await qa.click('.cv-line.is-draggable', 'строка title');
    await qa.sleep(300);
    const headLine = qa.qa('.cv-line.cv-tap').find((l) => l.textContent.replace(/^\d+/, '').trim() === '<head>');
    await qa.click(headLine, 'строка <head>');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'title в head');
  } },
  { name: 'Экран 13 (s10): поломка — дописать </title>', shot: 'e13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    qa.expect(qa.text('.mb-tab-t').indexOf('</head>') > 0 && !qa.text('.mb-doc'), 'поломка: текст страницы на вкладке, окно пустое');
    qa.type('.tk-input', '</title>', 'закрывающий тег');
    await qa.waitFor(() => qa.q('.key-check') && !qa.q('.key-check').disabled, 10000, '«Проверить»');
    await qa.click('.key-check', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'тег засчитан');
    qa.expect(qa.text('.mb-tab-t') === qa.data.myTitle && qa.text('.mb-doc') === qa.data.myText, 'починено: название на вкладке, текст в окне');
  } },
  { name: 'Экран 14 (s13): своя страница — 8 строк и свои тексты', shot: 'e14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    const chip = (t) => qa.qa('.pool-chip').find((b) => b.textContent.replace(/\s+/g, '') === t);
    for (const t of ['<html>', '<head>', '<title>…</title>', '</head>', '<body>', 'TEXT', '</body>', '</html>']) {
      const b = t === 'TEXT' ? qa.qa('.pool-chip').find((x) => !/[<>]/.test(x.textContent)) : chip(t);
      await qa.click(b, 'строка ' + t);
      await qa.sleep(200);
    }
    await qa.waitFor(() => qa.q('.bigbtn') && !qa.q('.bigbtn').disabled, 20000, '«Проверить»');
    await qa.click('.bigbtn', 'Проверить');
    await qa.waitFor(() => qa.qa('.tk-input').length >= 2, 20000, 'поля своих текстов');
    await qa.platform.ready(30000);
    const f = qa.qa('.tk-input');
    qa.type(f[0], qa.data.myTitle, 'своё название');
    qa.type(f[1], qa.data.myText, 'свой текст');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'страница готова');
  } },
  { name: 'Экран 15 (s14): финал — Пиксель читает страницу', shot: 'e15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.q('.fig-robot.is-reading'), 40000, 'Пиксель читает страницу вслух');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, '«Завершить урок»');
  } },
  { name: 'Завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<title>' + qa.data.myTitle + '</title>') >= 0 && html.indexOf(qa.data.myText) >= 0, 'артефакт — своя страница', { html });
  } }
];

export default {
  title: 'Урок 1 «Структура HTML-документа: робот Пиксель»',
  file: 'html/01-struktura-dokumenta',
  adapter: 'canon-html',
  langs: ['ru'],
  size: '1280x720',
  voice: 'fast',
  screens: 15,
  inputScreens: [7, 8, 13, 14],
  expectFinish: true,
  data: {
    ru: { myTitle: 'Шахматы', myText: 'Сыграем партию?' },
    uz: { myTitle: 'Shaxmat', myText: 'Bir o‘yin o‘ynaymizmi?' },
    en: { myTitle: 'Chess', myText: 'Shall we play a game?' }
  },
  steps: STEPS,
  flows: [
    { name: 'экран 5: неверная часть тега', start: 4, langs: ['ru'], steps: [{ name: 'на «конец» нажато «начало»', run: async (qa) => {
      await qa.waitFor(() => qa.q('.bl-start') && !qa.q('.bl-start').disabled && !qa.q('.stage.is-speaking'), 60000, 'вопросы');
      await qa.click('.bl-start', 'начало вместо конца');
      await qa.waitFor(() => qa.q('.ask.ask-hint') || qa.q('.stage.is-speaking'), 4000, 'объяснение');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'экран 9: промах → дополнительный раунд', start: 8, langs: ['ru'], steps: [{ name: 'неверный ответ', run: async (qa) => {
      await qa.waitFor(() => qa.q('.where-b') && qa.qa('.where-b').every((b) => !b.disabled) && !qa.q('.stage.is-speaking'), 40000, 'кнопки');
      const isTitle = qa.qa('.cv-line.is-in').some((l) => l.textContent.indexOf('<title>') >= 0);
      await qa.clickNth('.where-b', isTitle ? 1 : 0, 'неверный ответ');
      await qa.waitFor(() => /\/3/.test(qa.text('.ask-n') || ''), 30000, 'раундов стало три');
    } }] },
    { name: 'экран 10: title не в тот ящик', start: 9, langs: ['ru'], steps: [{ name: 'title прямо в html', run: async (qa) => {
      await qa.platform.ready(30000);
      const piece = (t) => qa.qa('.piece').find((b) => b.textContent.replace(/\s+/g, '') === t);
      await qa.waitFor(() => piece('<title>…</title>') && !piece('<title>…</title>').disabled, 30000, 'деталь title');
      await qa.click(piece('<title>…</title>'), 'деталь title');
      await qa.waitFor(() => qa.q('.drop-zone[data-place="html"]'), 4000, 'место внутрь html');
      await qa.click('.drop-zone[data-place="html"]', 'внутрь html');
      await qa.waitFor(() => qa.q('.ask.ask-hint'), 4000, 'объяснение на месте задания');
      qa.expect(!!piece('<title>…</title>'), 'деталь не легла');
    } }] },
    { name: 'экран 12: title не в head', start: 11, langs: ['ru'], steps: [{ name: 'title в body', run: async (qa) => {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.cv-line.is-draggable') && !qa.q('.cv-line.is-draggable').disabled, 20000, 'строка title');
      await qa.click('.cv-line.is-draggable', 'строка title');
      await qa.sleep(300);
      const bodyLine = qa.qa('.cv-line.cv-tap').find((l) => l.textContent.replace(/^\d+/, '').trim() === '<body>');
      await qa.click(bodyLine, 'строка <body>');
      await qa.waitFor(() => qa.q('.ask.ask-hint') || qa.q('.stage.is-speaking'), 4000, 'объяснение');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'экран 13: открывающий вместо закрывающего', start: 12, langs: ['ru'], steps: [{ name: '<title> → причина', run: async (qa) => {
      await qa.platform.ready(30000);
      qa.type('.tk-input', '<title>', 'открывающий');
      await qa.waitFor(() => qa.q('.key-check') && !qa.q('.key-check').disabled, 10000, '«Проверить»');
      await qa.click('.key-check', 'Проверить');
      await qa.waitFor(() => qa.q('.ask.ask-hint'), 4000, 'причина на месте задания');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] }
  ]
};
