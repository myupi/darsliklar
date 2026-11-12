// Сценарий проверки урока 3 модуля «ИИ» lessons/ai/03-chto-na-sajte.jsx («Что должно быть на сайте?», 12.11.2026).
// Основной путь: все 17 экранов действиями ученика (промпт в строках редактора → «Yuborish» → сайт от ИИ-симулятора),
// снимок готового состояния каждого экрана; onFinished один раз, артефакт — свой промпт. Шаги выполняются в странице:
// общие помощники — строкой H, шаги собираются через AsyncFunction (исходник «async function anonymous(qa) {…}»).
const AF = Object.getPrototypeOf(async function () {}).constructor;
const H = `
const site = () => qa.qa('.kz-br-page .title, .kz-br-page .ch, .kz-br-page .bh, .kz-br-page .pr, .kz-br-page .gp').map((e) => e.textContent).join(' | ');
const bh = () => qa.qa('.kz-br-page .bh').map((e) => e.textContent).join(',');
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
  step('s1: промпт Коди без «Ichida nima?»', `
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 60000, '«Yuborish» нажимается');
    await qa.click('.a1-send', 'Yuborish');
    await qa.waitFor(() => /Pitsa/.test(site()), 10000, 'сайт готов');
    qa.expect(!bh(), 'блоков нет — карточки-заглушки', { site: site() });
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');`),
  show('s2: показ блоков', "qa.expect(bh() === 'Menyu,Rasmlar,Sharhlar,Aloqa', 'в конце — меню, фото, отзывы, адрес', { bh: bh() });"),
  task('s3: футбольный клуб', ['jadval, murabbiylar, manzil'], "qa.expect(bh() === 'Jadval,Ustozlar,Aloqa', 'три блока по порядку', { bh: bh() });"),
  rounds('s4: что точнее', ['b', 'a', 'b']),
  show('s5: показ порядка', "qa.expect(bh() === 'Rasmlar,Narxlar,Sharhlar,Aloqa', 'в конце — лендинг по порядку', { bh: bh() });"),
  step('s6: собрать порядок', `
    await qa.platform.next(); await qa.platform.ready(30000);
    for (const k of ['gallery', 'prices', 'reviews', 'contact']) { await qa.waitFor(() => qa.q('.a3-chip[data-k="' + k + '"]:not(:disabled)'), 60000, 'блок ' + k); await qa.click('.a3-chip[data-k="' + k + '"]', k); await qa.sleep(250); }
    await send();
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'засчитано');
    qa.expect(bh() === 'Rasmlar,Narxlar,Sharhlar,Aloqa', 'порядок как в заказе', { bh: bh() });`),
  rounds('s7: вопрос → блок', ['prices', 'contact', 'reviews', 'schedule', 'gallery']),
  task('s8: сервер', ['rasmlar, qoidalar, savol-javob'], "qa.expect(bh() === 'Rasmlar,Qoidalar,Savol-javob', 'фото, правила, вопросы', { bh: bh() });"),
  show('s9: показ контента', "qa.expect(/150 000/.test(site()) && /555 11 22/.test(site()) && !qa.q('.a1-pin.is-guess'), 'настоящие цена и телефон, без «Taxmin»', { site: site() });"),
  task('s10: настоящие данные', ["narxlar: oyiga 200 000 so'm, aloqa: +998 91 234 56 78"], "qa.expect(/200 000/.test(site()) && /234 56 78/.test(site()), 'цена и телефон из заказа', { site: site() });"),
  task('g1: лишние блоки', ['rasmlar, narxlar, aloqa'], "qa.expect(bh() === 'Rasmlar,Narxlar,Aloqa', 'остались три блока', { bh: bh() });"),
  rounds('det: детектив', ['b', 'contact', 'a', 'reviews']),
  task('s12: почини «hamma narsa»', ['rasmlar, narxlar, aloqa'], "qa.expect(bh() === 'Rasmlar,Narxlar,Aloqa', 'фото, цены, контакты', { bh: bh() });"),
  task('s13: четыре строки с нуля', ['Maktab oshxonasi sayti', "o'quvchilar tushlikka buyurtma bersin", "10–14 yoshli o'quvchilar", 'menyu, narxlar, savol-javob']),
  task('s14: свой сайт', ['Roblox klubimiz sayti', "o'yinchilar klubga yozilsin", "12–14 yoshli o'quvchilar", 'rasmlar, qoidalar, aloqa']),
  rounds('q1: верно или нет', ['false', 'true', 'false', 'true', 'false']),
  step('fin: вывод', `
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 180000, '«Завершить урок»');
    qa.expect(qa.qa('.a1-pin').length >= 3, 'метки «откуда что» на своём сайте');`),
  step('fin: завершение один раз', `
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    qa.expect(pl && pl.artifact && /Roblox/.test(pl.artifact.what) && /qoidalar/.test(pl.artifact.inside), 'артефакт — свой промпт из четырёх строк', { pl });`, null)
];

export default {
  title: 'Урок 3 модуля «ИИ» «Что должно быть на сайте?»',
  file: 'ai/03-chto-na-sajte',
  adapter: 'canon-html',
  langs: ['uz'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 8, 10, 11, 13, 14, 15],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: []
};
