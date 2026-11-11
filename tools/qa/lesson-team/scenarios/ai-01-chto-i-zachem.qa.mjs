// Сценарий проверки урока 1 модуля «ИИ» lessons/ai/01-chto-i-zachem.jsx («Что создаём и зачем?», 11.11.2026).
// Основной путь: все 17 экранов действиями ученика (промпт в строках редактора → «Yuborish» → сайт от ИИ-симулятора),
// снимок готового состояния каждого экрана; onFinished один раз, артефакт — свой промпт. Шаги выполняются в странице:
// общие помощники — строкой H, шаги собираются через AsyncFunction (исходник «async function anonymous(qa) {…}»).
const AF = Object.getPrototypeOf(async function () {}).constructor;
const H = `
const site = () => qa.qa('.kz-br-page .title, .kz-br-page .cta, .kz-br-page .gh').map((e) => e.textContent).join(' | ');
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
  step('s1: промпт Коди → сайт «не о том»', `
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 60000, '«Yuborish» нажимается');
    await qa.click('.a1-send', 'Yuborish');
    await qa.waitFor(() => /olami/.test(site()), 10000, 'сайт готов');
    qa.expect(/Futbol olami/.test(site()) && !qa.q('.kz-br-page .gh'), 'красивый, но общий сайт без цели', { site: site() });
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');`),
  show('s2: показ «Nima?»', "qa.expect(/do'koni/.test(site()), 'в конце — сайт магазина', { site: site() });"),
  task('s3: строка «Nima?»', ["Shaxmat to'garagi sayti"], "qa.expect(/Shaxmat to'garagi/.test(site()), 'сайт кружка', { site: site() });"),
  rounds('s4: что точнее', ['b', 'a', 'b']),
  show('s5: показ «Nega?»', "qa.expect(/Qo'ng'iroq/.test(site()), 'в конце — кнопка звонка', { site: site() });"),
  task('s6: строка «Nega?»', ["bolalar to'garakka yozilsin"], "qa.expect(/Ro'yxatdan o'tish/.test(site()), 'кнопка и форма записи', { site: site() });"),
  rounds('s7: цель или пожелание', ['goal', 'wish', 'goal', 'wish', 'goal']),
  task('s8: пиццерия', ['odamlar pitsa buyurtma qilsin'], "qa.expect(/Buyurtma/.test(site()), 'кнопка и список заказа', { site: site() });"),
  task('s8b: две цели', ["turnir qachon va qayerdaligini aytsin, o'yinchilar ro'yxatdan o'tsin"], "qa.expect(/Qachon va qayerda/.test(site()) && /Ro'yxatdan/.test(site()), 'обе цели на сайте', { site: site() });"),
  show('s9: показ «каждая строка — след»'),
  task('g1: ИИ угадал не то', ['bolalar jamoaga yozilsin'], "qa.expect(!/Buyurtma/.test(site()) && /Ro'yxatdan/.test(site()), 'догадка сменилась записью', { site: site() });"),
  rounds('det: детектив', ['a', 'why', 'c', 'what']),
  step('s12: почини промпт Коди', `
    await qa.platform.next(); await qa.platform.ready(30000);
    await fill(0, "bolalar to'garakka yozilsin"); await send();
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'засчитано');`),
  task('s13: с нуля', ["Kitob ko'rgazmasi sayti", "ko'rgazma qachon va qayerdaligini aytsin, odamlar kelsin"]),
  task('s14: свой сайт', ['Roblox klubimiz sayti', "o'yinchilar klubga yozilsin"]),
  rounds('q1: верно или нет', ['false', 'true', 'false', 'true', 'false']),
  step('fin: вывод', `
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 180000, '«Завершить урок»');
    qa.expect(qa.qa('.a1-pin').length >= 2, 'метки «откуда что» на своём сайте');`),
  step('fin: завершение один раз', `
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    qa.expect(pl && pl.artifact && /Roblox/.test(pl.artifact.what), 'артефакт — свой промпт', { pl });`, null)
];

export default {
  title: 'Урок 1 модуля «ИИ» «Что создаём и зачем?»',
  file: 'ai/01-chto-i-zachem',
  adapter: 'canon-html',
  langs: ['uz'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 6, 8, 9, 11, 13, 14, 15],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: []
};
