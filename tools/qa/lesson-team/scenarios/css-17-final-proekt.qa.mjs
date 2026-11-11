// Сценарий проверки урока 17 курса CSS lessons/css/17-final-proekt.jsx («Финальный проект», 11.11.2026).
// Основной путь: все 21 экран действиями ученика — крючок (сбой стирает CSS), 16 станций (сборка из кусочков,
// выбор с живым результатом, «впиши», «исправь», пары, перетаскивание нажатием, окно своей ширины), большая проверка
// (пять поломок в любом порядке), верно/неверно, свой стиль («Готово»), вывод; onFinished один раз, артефакт.
// Честная страница: проверяются вычисленные стили сайта лагеря. Ветки ошибок — во flows. Шаги выполняются в странице.

// Шаги выполняются в странице (run.mjs берёт исходник функции), поэтому замыканий нет: общие помощники — строкой H,
// шаги-шаблоны собираются через AsyncFunction (её исходник — «async function anonymous(qa) {…}»).
const AF = Object.getPrototypeOf(async function () {}).constructor;
const H = "const cs = (sel) => getComputedStyle(qa.q('.kz-br-page ' + sel));\n"
  + "const placeAll = async (ids) => { for (const id of ids) { await qa.waitFor(() => qa.q('.c17-piece[data-id=\"' + id + '\"]:not(:disabled)'), 30000, 'кусочек нажимается'); await qa.click('.c17-piece[data-id=\"' + id + '\"]', id); await qa.sleep(250); } };\n";
const J = JSON.stringify;
const fillGo = (name, value, check) => ({ name, shot: name.split(':')[0] + '-done', run: new AF('qa', H
  + 'await qa.platform.next(); await qa.platform.ready();\n'
  + "qa.type('.c17-slot textarea', " + J(value) + ", 'значение'); await qa.click('.key-go', 'Проверить');\n"
  + "await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');\n" + (check || '')) });
const pickGo = (name, v, check) => ({ name, shot: name.split(':')[0] + '-done', run: new AF('qa', H
  + 'await qa.platform.next(); await qa.platform.ready(30000);\n'
  + "await qa.waitFor(() => qa.q('.c17-opt:not(:disabled)'), 30000, 'варианты нажимаются');\n"
  + "await qa.click('.c17-opt[data-v=\"' + " + J(v) + " + '\"]', " + J(v) + ");\n"
  + "await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');\n" + (check || '')) });
const step = (name, body, shot) => ({ name, shot: shot === undefined ? name.split(':')[0] + '-done' : shot, run: new AF('qa', H + body) });

const STEPS = [
  step('s1: сбой стирает CSS → путь из 16 станций', `
    await qa.platform.ready();
    qa.expect(cs('.shapka').backgroundSize === 'cover' && cs('.qator').display === 'flex', 'в начале сайт красивый (весь CSS)');
    await qa.waitFor(() => qa.q('.kz-btn.is-coral:not(:disabled)'), 60000, 'сбой: «Починить» нажимается');
    qa.expect(cs('.qator').display === 'block' && cs('.tugma').backgroundColor !== 'rgb(250, 79, 40)', 'после сбоя CSS нет');
    await qa.click('.kz-btn.is-coral', 'Починить');
    await qa.waitFor(() => qa.qa('.c17-dot').length === 16, 3000, 'путь из 16 станций');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');`),
  step('k1: правило из кусочков', `
    await qa.platform.next(); await qa.platform.ready();
    await placeAll(['{', 'background-color', ':', 'lightyellow', ';', '}']);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(getComputedStyle(qa.q('.c17-doc')).backgroundColor === 'rgb(255, 255, 224)', 'честно: фон страницы lightyellow');`),
  pickGo('k2: селектор .karta', '.karta', "qa.expect(cs('.karta').color === 'rgb(0, 0, 128)' && cs('.menu').color !== 'rgb(0, 0, 128)', 'синие только карточки');"),
  fillGo('k3: hex из палитры', '#1E9E72', "qa.expect(cs('.shapka').backgroundColor === 'rgb(30, 158, 114)', 'шапка цвета лагеря');"),
  step('k4: no-repeat и cover', `
    await qa.platform.next(); await qa.platform.ready();
    qa.expect(cs('.shapka').backgroundRepeat === 'repeat', 'до: картинка плитками');
    await placeAll(['no-repeat', 'cover']);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(cs('.shapka').backgroundRepeat === 'no-repeat' && cs('.shapka').backgroundSize === 'cover', 'одна картинка на всю шапку');`),
  fillGo('k5: text-align center', 'center', "qa.expect(cs('h1').textAlign === 'center', 'заголовок по центру');"),
  step('k6: 600px → 100%', `
    await qa.platform.next(); await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c17-slot textarea') && qa.q('.c17-slot textarea').value === '600px', 3000, 'в поле 600px Коди');
    qa.expect(qa.q('.kz-br-page .rasm').offsetWidth === 600, 'честно: 600px шире окна');
    qa.type('.c17-slot textarea', '100%', 'ширина'); await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.q('.kz-br-page .rasm').offsetWidth <= qa.q('.c17-doc').clientWidth, 'картинка по окну');`),
  fillGo('k7: свойство padding', 'padding', "qa.expect(cs('.karta').paddingTop === '12px', 'отступ внутри');"),
  step('k8: пары код ↔ вид', `
    await qa.platform.next(); await qa.platform.ready();
    for (const k of ['rad', 'sh', 'top']) {
      await qa.waitFor(() => qa.q('.c17-mtag[data-t="' + k + '"]:not(:disabled)'), 30000, 'код нажимается');
      await qa.click('.c17-mtag[data-t="' + k + '"]', k);
      await qa.click('.c17-mcard[data-card="' + k + '"]', 'вид ' + k);
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(cs('.karta').borderTopLeftRadius === '12px' && cs('.karta').borderTopWidth === '4px', 'карточки скруглены, полоса сверху');`),
  pickGo('k9: inline-block', 'inline-block', "const t = qa.qa('.kz-br-page .menu').map((e) => Math.round(e.getBoundingClientRect().top)); qa.expect(t[0] === t[1] && t[1] === t[2], 'меню в одну строку', { t });"),
  fillGo('k10: display flex', 'flex', "qa.expect(cs('.qator').display === 'flex', 'карточки в ряд');"),
  pickGo('k11: space-between', 'space-between', "qa.expect(cs('.qator').justifyContent === 'space-between', 'карточки до краёв');"),
  pickGo('k12: absolute', 'absolute', "qa.expect(cs('.yangi').position === 'absolute', 'значок в углу');"),
  fillGo('k13: :hover scale', 'scale(1.1)', "await qa.sleep(1500); qa.expect(cs('.tugma').transform === 'matrix(1.1, 0, 0, 1.1, 0, 0)', 'показ: мышка над кнопкой — она больше');"),
  fillGo('k14: transition', 'transform 0.3s', "qa.expect(/transform 0\\.3s/.test(cs('.tugma').transition), 'плавный переход');"),
  fillGo('k15: имя анимации', 'aylan', "qa.expect(/aylan$/.test(cs('.quyosh').animationName), 'солнце крутится');"),
  step('k16: @media column', `
    await qa.platform.next(); await qa.platform.ready();
    qa.type('.c17-slot textarea', 'column', 'значение');
    await qa.sleep(1400);
    qa.expect(cs('.qator').flexDirection === 'column' && !qa.q('.c17-vw.is-over'), 'на телефоне столбиком, ничего не вылезло');
    await qa.click('.c17-wt-b[data-w="800"]', 'Компьютер');
    await qa.sleep(1400);
    qa.expect(cs('.qator').flexDirection === 'row', 'на компьютере в ряд');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');`),
  step('boss: пять поломок', `
    await qa.platform.next(); await qa.platform.ready(30000);
    qa.expect(cs('.qator').display === 'block' && cs('.menu').display === 'block', 'поломки видны на странице');
    for (const t of ['.Karta', 'width: 100;', 'flexbox', 'orang', 'display inline']) {
      const line = () => qa.qa('.kz-line.c17-hline').find((l) => l.textContent.replace(/\\s+/g, ' ').indexOf(t) >= 0);
      await qa.waitFor(() => line() && !line().disabled, 30000, 'строка нажимается');
      line().click();
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
    qa.expect(cs('.qator').display === 'flex' && cs('.tugma').backgroundColor === 'rgb(255, 165, 0)', 'сайт починен');`),
  step('q1: верно или нет', `
    await qa.platform.next();
    for (const k of [0, 1, 0, 1, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c17-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c17-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c17-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');`),
  step('own: свой стиль', `
    await qa.platform.next(); await qa.platform.ready();
    const f = qa.qa('.c17-own textarea');
    qa.type(f[0], 'lavender', 'фон'); qa.type(f[1], 'tomato', 'кнопка'); qa.type(f[2], '16px', 'углы');
    await qa.sleep(300);
    qa.expect(getComputedStyle(qa.q('.c17-doc')).backgroundColor === 'rgb(230, 230, 250)', 'фон виден сразу');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');`),
  step('fin: вывод', `
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, '«Завершить урок»');
    qa.expect(cs('.tugma').backgroundColor === 'rgb(255, 99, 71)', 'свой сайт — кнопка tomato');
    qa.expect(/^\\d+$/.test(qa.text('.c17-count b')), 'счёт правил на экране');`),
  step('fin: завершение один раз', `
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('body { background-color: lavender; }') >= 0 && html.indexOf('@media (max-width: 600px)') >= 0 && html.indexOf('@keyframes aylan') >= 0, 'артефакт — сайт лагеря со своим стилем', { html });`, null)
];
const flow = (name, start, body) => ({ name, start, langs: ['ru'], steps: [{ name, run: new AF('qa', H + body) }] });

export default {
  title: 'Урок 17 курса CSS «Финальный проект» (облик «Редактор»)',
  file: 'css/17-final-proekt',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 21,
  inputScreens: [4, 6, 7, 8, 11, 14, 15, 16, 17, 20],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    flow('k1: не тот кусочек → причина', 1, `
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c17-piece:not(:disabled)'), 30000, 'кусочки нажимаются');
      await qa.click('.c17-piece[data-id=":"]', ':');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /фигурная скобка/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');`),
    flow('k2: div → красит всё', 2, `
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c17-opt:not(:disabled)'), 30000, 'варианты нажимаются');
      await qa.click('.c17-opt[data-v="div"]', 'div');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /все div/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(cs('.menu').color === 'rgb(0, 0, 128)', 'честно: меню тоже посинело');`),
    flow('k3: без решётки → причина', 3, `
      await qa.platform.ready();
      qa.type('.c17-slot textarea', '1E9E72', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /решётки/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');`),
    flow('k7: margin → отступ снаружи', 7, `
      await qa.platform.ready();
      qa.type('.c17-slot textarea', 'margin', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /снаружи/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');`),
    flow('k13: rotate → не увеличивает', 13, `
      await qa.platform.ready();
      qa.type('.c17-slot textarea', 'rotate(10deg)', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /поворачивает/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');`),
    flow('k15: чужое имя → нет keyframes', 15, `
      await qa.platform.ready();
      qa.type('.c17-slot textarea', 'Aylan', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /keyframes с таким именем нет/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');`),
    flow('boss: верная строка → «работает»', 17, `
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.kz-line.c17-hline:not(:disabled)'), 30000, 'строки нажимаются');
      qa.qa('.kz-line.c17-hline').find((l) => /text-align/.test(l.textContent)).click();
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /работает/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-line.c17-hline.is-off').length >= 1 && !qa.platform.nextEnabled(), 'строка погасла');`),
    flow('own: неизвестный цвет → причина', 19, `
      await qa.platform.ready();
      const f = qa.qa('.c17-own textarea');
      qa.type(f[0], 'lavendr', 'фон'); qa.type(f[1], 'tomato', 'кнопка'); qa.type(f[2], '16px', 'углы');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /lavendr/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');`)
  ]
};
