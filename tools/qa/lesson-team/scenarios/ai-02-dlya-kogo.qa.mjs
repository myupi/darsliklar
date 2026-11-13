// Сценарий проверки урока 2 модуля «ИИ» lessons/ai/02-dlya-kogo.jsx («Для кого создаём?», 11.11.2026).
// Основной путь: все 17 экранов действиями ученика (промпт в строках редактора → «Yuborish» → сайт от ИИ-симулятора),
// снимок готового состояния каждого экрана; onFinished один раз, артефакт — свой промпт. Шаги выполняются в странице:
// общие помощники — строкой H, шаги собираются через AsyncFunction (исходник «async function anonymous(qa) {…}»).
const AF = Object.getPrototypeOf(async function () {}).constructor;
const H = `
const site = () => qa.qa('.kz-br-page .badge, .kz-br-page .title, .kz-br-page .ch, .kz-br-page .cta, .kz-br-page .gh, .kz-br-page .gh2').map((e) => e.textContent).join(' | ');
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
  step('s1: промпт Коди без «Kim uchun?»', `
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 60000, '«Yuborish» нажимается');
    await qa.click('.a1-send', 'Yuborish');
    await qa.waitFor(() => /Futbol turniri/.test(site()), 10000, 'сайт готов');
    qa.expect(!/yosh uchun|Ota-onalar uchun/.test(site()), 'сайт ни под кого', { site: site() });
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');`),
  show('s2: показ «Kim uchun?»', "qa.expect(/Keksalar uchun/.test(site()) && /Savolingiz/.test(site()), 'в конце — сайт для бабушек и дедушек', { site: site() });"),
  task('s3: подростки', ["12–14 yoshli maktab o'quvchilari"], "qa.expect(/12–14 yosh/.test(site()), 'плашка возраста', { site: site() });"),
  rounds('s4: что точнее', ['b', 'a', 'b']),
  show('s5: показ интересов', "qa.expect(/O'yinlar/.test(site()) && /Sovg'alar/.test(site()), 'в конце — карточки игр и подарков', { site: site() });"),
  task('s6: праздник животных', ["8–10 yoshli bolalar, hayvonlar va o'yinlarni yaxshi ko'radi"], "qa.expect(/Hayvonlar/.test(site()), 'карточка животных', { site: site() });"),
  rounds('s7: какая строка', ['what', 'who', 'why', 'who', 'why', 'what']),
  task('s8: столовая — пожилые', ['mahalladagi buvi va bobolar'], "qa.expect(/Savolingiz/.test(site()), 'крупный телефон для пожилых', { site: site() });"),
  show('s9: показ двух аудиторий', "qa.expect(/8–12 yosh/.test(site()) && /Ota-onalar uchun/.test(site()), 'дети и раздел для родителей', { site: site() });"),
  task('s10: дети и родители', ['6–9 yoshli bolalar va ularning ota-onalari'], "qa.expect(/6–9 yosh/.test(site()) && /Ota-onalar uchun/.test(site()), 'обе аудитории', { site: site() });"),
  task('g1: ИИ угадал не то', ['5–7 yoshli kichkintoylar'], "qa.expect(/5–7 yosh/.test(site()), 'догадка сменилась малышами', { site: site() });"),
  rounds('det: детектив', ['kids', 'old', 'parents', 'c']),
  task('s12: почини «hamma uchun»', ["10–13 yoshli o'yinchilar, qurilishni yaxshi ko'radi"], "qa.expect(/Qurilish/.test(site()), 'карточка стройки', { site: site() });"),
  task('s13: три строки с нуля', ["Robotlar ko'rgazmasi sayti", "bolalar ko'rgazmaga kelsin", "9–11 yoshli bolalar, o'yinlarni yaxshi ko'radi"]),
  task('s14: свой сайт', ['Roblox klubimiz sayti', "o'yinchilar klubga yozilsin", "12–14 yoshli o'quvchilar, o'yinlarni yaxshi ko'radi"]),
  rounds('q1: верно или нет', ['false', 'true', 'false', 'true', 'false']),
  step('fin: вывод', `
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 180000, '«Завершить урок»');
    qa.expect(qa.qa('.a1-pin').length >= 2, 'метки «откуда что» на своём сайте (в окне сайта на итоге — не больше двух, правило урока)');`),
  step('fin: завершение один раз', `
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    qa.expect(pl && pl.artifact && /Roblox/.test(pl.artifact.what) && /12–14/.test(pl.artifact.who), 'артефакт — свой промпт из трёх строк', { pl });`, null)
];

export default {
  title: 'Урок 2 модуля «ИИ» «Для кого создаём?»',
  file: 'ai/02-dlya-kogo',
  adapter: 'canon-html',
  langs: ['uz'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 6, 8, 10, 11, 13, 14, 15],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: []
};
