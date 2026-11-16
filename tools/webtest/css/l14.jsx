// =============================================================================
// ТЕСТЫ К УРОКУ 14 КУРСА CSS «Плавные эффекты» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: transition внутри :hover — обратно прыжком; 0.5s = 500ms; в transition пишется свойство, а не значение;
// время с точкой, а не с запятой; ровная скорость — linear.
// Время и :hover честная страница не покажет — все вопросы по коду. Апостроф — только ASCII «'».
// Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'transition';
const QS = [
  { id: 'css-14t1', target: 'css-14', ptype: 'CSS', tag: 'transition-place', correct: 1,
    vis: () => <WqVis file="style.css" code={`.tugma:hover {\n  transform: scale(1.2);\n  transition: transform 0.6s;\n}`} mark={[3]} />,
    uz: { ctx: "Sichqoncha kelganda tugma silliq o'sadi.", q: "Sichqoncha ketganda-chi?", opts: ['Silliq kichrayadi', 'Birdaniga kichrayadi', 'Katta bo\'lib qoladi', "Yo'q bo'lib ketadi"],
      ok: "Qoyil! transition :hover ichida turibdi: sichqoncha ketganda u ham ketadi, shuning uchun qaytish birdaniga bo'ladi.", hint: "transition qaysi qoidaning ichida yozilgan? Sichqoncha ketganda bu qoida ishlayaptimi?", alt: "transition :hover ichida yozilgan qoida" },
    ru: { ctx: 'При наведении кнопка плавно растёт.', q: 'А когда мышка уходит?', opts: ['Плавно уменьшается', 'Уменьшается сразу, прыжком', 'Остаётся большой', 'Исчезает'],
      ok: 'Здорово! transition стоит внутри :hover: мышка уходит — и он уходит вместе с правилом, поэтому обратно — прыжком.', hint: 'Внутри какого правила написан transition? Работает ли это правило, когда мышка ушла?', alt: 'Правило, где transition внутри :hover' },
    en: { ctx: 'On hover, the button grows smoothly.', q: 'And when the mouse leaves?', opts: ['It shrinks smoothly', 'It shrinks at once, in a jump', 'It stays big', 'It disappears'],
      ok: 'Nice work! transition is inside :hover: when the mouse leaves, it leaves with the rule, so the way back is a jump.', hint: 'Which rule is transition written in? Does that rule work once the mouse has left?', alt: 'A rule with transition inside :hover' } },
  { id: 'css-14t2', target: 'css-14', ptype: 'CSS', tag: 'time', correct: 2, mono: true,
    vis: () => <WqVis file="style.css" code={`.tugma {\n  transition: transform 0.5s;\n}`} mark={[2]} />,
    uz: { ctx: "Yarim soniyani millisoniyada ham yozsa bo'ladi.", q: "Qaysi biri 0.5s bilan bir xil?", opts: ['transform 5ms', 'transform 50ms', 'transform 500ms', 'transform 5s'],
      ok: "Xuddi shunday! Bir soniyada 1000 millisoniya bor, demak yarim soniya 500ms bo'ladi.", hint: "1s bu 1000ms. Uning yarmi qancha?", alt: "transform 0.5s yozilgan qoida" },
    ru: { ctx: 'Полсекунды можно записать и в миллисекундах.', q: 'Что равно 0.5s?', opts: ['transform 5ms', 'transform 50ms', 'transform 500ms', 'transform 5s'],
      ok: 'Именно! В одной секунде 1000 миллисекунд, значит, полсекунды — это 500ms.', hint: '1s — это 1000ms. Сколько будет половина?', alt: 'Правило с transform 0.5s' },
    en: { ctx: 'Half a second can also be written in milliseconds.', q: 'Which one equals 0.5s?', opts: ['transform 5ms', 'transform 50ms', 'transform 500ms', 'transform 5s'],
      ok: 'Exactly! One second has 1000 milliseconds, so half a second is 500ms.', hint: '1s is 1000ms. What is half of that?', alt: 'A rule with transform 0.5s' } },
  { id: 'css-14t3', target: 'css-14', ptype: 'CSS', tag: 'property', correct: 3, mono: true,
    vis: () => <WqVis file="style.css" code={`.tugma {\n  transition: ___ 0.5s;\n}\n.tugma:hover {\n  background-color: gold;\n}`} mark={[2]} />,
    uz: { ctx: "Sichqoncha kelganda tugmaning foni oltin rangga kiradi.", q: "Fon silliq o'zgarishi uchun bo'sh joyga nima yoziladi?", opts: ['gold', 'color', 'transform', 'background-color'],
      ok: "Juda zo'r! transition qoidasiga qiymat emas, xususiyat nomi kerak: aynan background-color o'zgaryapti.", hint: "gold bu qiymat. :hover ichida qaysi xususiyat o'zgaryapti? Aynan o'shaning nomi kerak.", alt: "transition xususiyati bo'sh qoida" },
    ru: { ctx: 'При наведении фон кнопки становится золотым.', q: 'Что написать на пустое место, чтобы фон менялся плавно?', opts: ['gold', 'color', 'transform', 'background-color'],
      ok: 'Отлично! В transition пишется не значение, а имя свойства: меняется именно background-color.', hint: 'gold — это значение. Какое свойство меняется внутри :hover? Нужно его имя.', alt: 'Правило с пустым свойством в transition' },
    en: { ctx: 'On hover, the button’s background turns gold.', q: 'What goes in the gap so the background changes smoothly?', opts: ['gold', 'color', 'transform', 'background-color'],
      ok: 'Great! transition needs a property name, not a value: it’s background-color that changes.', hint: 'gold is a value. Which property changes inside :hover? Its name is what you need.', alt: 'A rule with an empty transition property' } },
  { id: 'css-14t4', target: 'css-14', ptype: 'CSS', tag: 'debug', correct: 0,
    vis: () => <WqVis file="style.css" code={`.tugma {\n  transition: transform 0,5s;\n}\n.tugma:hover {\n  transform: scale(1.2);\n}`} mark={[2]} />,
    uz: { ctx: "Tugma baribir birdaniga o'syapti, silliq emas.", q: "2-qatorda nima buzilib qolibdi?", opts: ['Vergul: vaqt nuqta bilan yoziladi', "transform o'rniga all kerak", 'Vaqt juda qisqa', 'transition faqat :hover ichida ishlaydi'],
      ok: "To'ppa-to'g'ri! 0,5s ni brauzer tanimaydi va butun qatorni tashlab yuboradi. To'g'risi: 0.5s.", hint: "Vaqtga diqqat bilan qarang. Kasr son CSSda qanday belgi bilan yoziladi?", alt: "Vaqti vergul bilan yozilgan qoida" },
    ru: { ctx: 'Кнопка всё равно растёт прыжком, а не плавно.', q: 'Что сломалось в строке 2?', opts: ['Запятая: время пишется с точкой', 'Вместо transform нужен all', 'Время слишком короткое', 'transition работает только внутри :hover'],
      ok: 'Верно! 0,5s браузер не понимает и выбрасывает всю строку. Правильно: 0.5s.', hint: 'Посмотри внимательно на время. Каким знаком в CSS пишется дробное число?', alt: 'Правило со временем через запятую' },
    en: { ctx: 'The button still grows in a jump, not smoothly.', q: 'What broke on line 2?', opts: ['The comma: time is written with a dot', 'all is needed instead of transform', 'The time is too short', 'transition only works inside :hover'],
      ok: 'Right! The browser doesn’t understand 0,5s and drops the whole line. The right way: 0.5s.', hint: 'Look closely at the time. Which sign writes a decimal number in CSS?', alt: 'A rule with the time written with a comma' } },
  { id: 'css-14t5', target: 'css-14', ptype: 'CSS', tag: 'linear', correct: 1, mono: true,
    vis: () => <WqVis file="style.css" code={`.kub {\n  transition: transform 2s ___;\n}`} mark={[2]} />,
    uz: { ctx: "Kubik butun yo'lni bir xil tezlikda, tormozlamasdan o'tsin.", q: "Bo'sh joyga nima yoziladi?", opts: ['ease', 'linear', 'all', 'infinite'],
      ok: "Qoyil! linear ya'ni tekis degani: boshidan oxirigacha bir xil tezlik.", hint: "ease boshida tezlashib, oxirida sekinlashadi. Qaysi so'z tezlikni tekis qiladi?", alt: "Tezlik so'zi bo'sh qoida" },
    ru: { ctx: 'Кубик должен пройти весь путь с одной скоростью, без торможения.', q: 'Что пишется на пустое место?', opts: ['ease', 'linear', 'all', 'infinite'],
      ok: 'Здорово! linear — значит ровно: одна скорость от начала до конца.', hint: 'ease разгоняется в начале и тормозит в конце. Какое слово делает скорость ровной?', alt: 'Правило с пустым словом скорости' },
    en: { ctx: 'The cube should travel the whole way at one speed, without slowing down.', q: 'What goes in the empty spot?', opts: ['ease', 'linear', 'all', 'infinite'],
      ok: 'Nice work! linear means even: the same speed from start to finish.', hint: 'ease speeds up at the start and slows at the end. Which word makes the speed even?', alt: 'A rule with an empty speed word' } }
];
