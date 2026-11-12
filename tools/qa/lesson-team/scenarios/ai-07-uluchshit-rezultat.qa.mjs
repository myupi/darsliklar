// Сценарий проверки урока 7 модуля «ИИ» lessons/ai/07-uluchshit-rezultat.jsx («Как улучшить результат ИИ?», 12.11.2026).
// Основной путь: все 18 экранов действиями ученика (второй промпт в строке поля → «Yuborish» → ИИ-симулятор правит сайт),
// снимок готового состояния каждого экрана; onFinished один раз, артефакт — правки ученика. Шаги выполняются в странице:
// общие помощники — строкой H, шаги собираются через AsyncFunction (исходник «async function anonymous(qa) {…}»).
const AF = Object.getPrototypeOf(async function () {}).constructor;
const H = `
const site = () => qa.qa('.kz-br-page .title, .kz-br-page .bh').map((e) => e.textContent).join(' | ');
const title = () => { const e = qa.q('.kz-br-page .title'); return e ? e.textContent : ''; };
const bh = () => qa.qa('.kz-br-page .bh').map((e) => e.textContent).join(',');
const pinTxt = () => qa.qa('.a1-pin').map((e) => e.textContent).join(',');
const has7 = (sel) => !!qa.q('.kz-br-page ' + sel);
const fs = (sel) => { const e = qa.q('.kz-br-page ' + sel); return e ? parseFloat(getComputedStyle(e).fontSize) : 0; };
const info = () => { const e = qa.q('.kz-br-page .info'); return e ? e.textContent : ''; };
const fill = async (i, v) => { await qa.waitFor(() => qa.qa('.a1-slot textarea')[i], 30000, 'поле ' + i); qa.type(qa.qa('.a1-slot textarea')[i], v, 'строка промпта'); };
const send = async () => { await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 60000, '«Yuborish» нажимается'); await qa.click('.a1-send', 'Yuborish'); await qa.sleep(1800); };
const opt = async (v) => { await qa.waitFor(() => qa.q('.a1-opt[data-v="' + v + '"]:not(:disabled)'), 60000, 'вариант ' + v); await qa.click('.a1-opt[data-v="' + v + '"]', v); await qa.waitFor(() => qa.q('.a1-opt.is-ok'), 5000, 'ответ принят'); await qa.sleep(400); };
`;
const step = (name, body, shot) => ({ name, shot: shot === undefined ? name.split(':')[0] + '-done' : shot, run: new AF('qa', H + body) });
const task = (name, lines, check) => step(name, `
  await qa.platform.next(); await qa.platform.ready(30000);
  ${lines.map((v, i) => `await fill(${i}, ${JSON.stringify(v)});`).join(' ')}
  await send();
  await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'засчитано');
  ${check || ''}`);
const show = (name, check) => step(name, `
  await qa.platform.next(); await qa.platform.ready(30000);
  await qa.waitFor(() => qa.platform.nextEnabled(), 180000, 'показ закончен');
  await qa.sleep(1500);
  ${check || ''}`);
const rounds = (name, vals) => step(name, `
  await qa.platform.next(); await qa.platform.ready(30000);
  for (const v of ${JSON.stringify(vals)}) { await opt(v); await qa.sleep(900); }
  await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'засчитано');`);

const STEPS = [
  step('s1: «yaxshiroq qil» → ИИ пишет сайт заново', `
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 60000, '«Yuborish» нажимается');
    const t0 = title();
    await qa.click('.a1-send', 'Yuborish');
    await qa.waitFor(() => title() && title() !== t0, 10000, 'сайт переписан');
    await qa.sleep(1200);
    qa.expect(!/Narx/.test(bh()), 'цен всё ещё нет', { bh: bh() });
    qa.expect(/O'zi o'zgartirdi/.test(pinTxt()), 'метки «Сам поменял»', { pins: pinTxt() });
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');`),
  show('s2: показ анализа', "qa.expect(qa.qa('.a7-chk-it.is-ok').length === 2 && qa.qa('.a7-chk-it.is-bad').length === 2, 'два ✓ и два ✗');"),
  step('s3: найди невыполненные пункты', `
    await qa.platform.next(); await qa.platform.ready(30000);
    await qa.waitFor(() => qa.q('.a7-chk-it[data-i="1"]:not(:disabled)'), 60000, 'пункты нажимаются');
    await qa.click('.a7-chk-it[data-i="1"]', 'Цены'); await qa.click('.a7-chk-it[data-i="2"]', 'Телефон');
    await qa.click('.a7-chk-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'засчитано');`),
  rounds('s4: что точнее', ['b', 'a', 'b']),
  show('s5: показ «остальное не меняй»', "qa.expect(/Narx/.test(bh()) && !/tanlov/.test(title()), 'только цены, название прежнее', { site: site() });"),
  task('s6: отзывы', ["sharhlar blokini qo'sh, qolganini o'zgartirma"], "qa.expect(/Sharh/.test(bh()) && /^Rasm/.test(bh()), 'отзывы добавлены, порядок прежний', { bh: bh() });"),
  rounds('s7: что меняет только нужное', ['b', 'a', 'a']),
  show('s8: показ «что и как»', "qa.expect(fs('.cta') >= 20, 'кнопка большая', { fs: fs('.cta') });"),
  task('s9: заголовок', ["sarlavhani kattaroq qil, qolganini o'zgartirma"], "qa.expect(fs('.title') >= 40, 'заголовок большой', { fs: fs('.title') });"),
  show('s10: показ второго и третьего промпта', "qa.expect(/100 20 30/.test(info()) && !has7('.chatb'), 'номер верный, чата нет', { info: info() });"),
  task('s11: второй промпт', ["tugmani kattaroq qil, qolganini o'zgartirma"], "qa.expect(fs('.cta') >= 20, 'кнопка большая', { fs: fs('.cta') });"),
  task('s12: третий промпт', ["Telegram tugmasini qo'sh, qolganini o'zgartirma"], "qa.expect(has7('.tg') && fs('.cta') >= 20, 'Telegram и большая кнопка');"),
  task('g1: цвет Коди', ["asosiy rangni qizil qil, qolganini o'zgartirma"]),
  rounds('det: детектив', ['b', 'a', 'c']),
  task('s13: почини «yaxshiroq qil»', ["narxlar blokini qo'sh, tugmani kattaroq qil, qolganini o'zgartirma"], "qa.expect(/Narx/.test(bh()) && fs('.cta') >= 20 && !/tanlov/.test(title()), 'цены, большая кнопка, остальное прежнее', { site: site() });"),
  task('s14: улучши сам', ["reklama oynasini olib tashla, sarlavhani kattaroq qil, qolganini o'zgartirma"], "qa.expect(!has7('.promo') && fs('.title') >= 40, 'окна нет, заголовок большой');"),
  rounds('q1: верно или нет', ['false', 'true', 'true', 'false', 'true']),
  step('fin: вывод', `
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 180000, '«Завершить урок»');
    qa.expect(qa.qa('.a1-pin').length >= 1, 'метки правки на сайте');`),
  step('fin: завершение один раз', `
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    qa.expect(pl && pl.artifact && /narxlar/.test(pl.artifact.fix) && /reklama/.test(pl.artifact.own), 'артефакт — правки ученика', { pl });`, null)
];

export default {
  title: 'Урок 7 модуля «ИИ» «Как улучшить результат ИИ?»',
  file: 'ai/07-uluchshit-rezultat',
  adapter: 'canon-html',
  langs: ['uz'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 18,
  inputScreens: [6, 9, 11, 12, 13, 15, 16],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: []
};
