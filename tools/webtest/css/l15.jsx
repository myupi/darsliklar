// =============================================================================
// ТЕСТЫ К УРОКУ 15 КУРСА CSS «CSS-анимации» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: имя в animation должно совпадать с @keyframes буква в букву (Sakra ≠ sakra); в animation пишется имя плана;
// число после времени — сколько раз; само, без мышки — animation, а не transition; кадр пишется с %.
// Анимация на странице идёт по-настоящему (вопрос 4 — мигающая звезда), ответ от кадра не зависит.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'animacii';
const QS = [
  { id: 'css-15t1', target: 'css-15', ptype: 'CSS', tag: 'name-case', correct: 0,
    vis: () => <WqVis file="style.css" code={`@keyframes sakra {\n  from { transform: translateY(0px); }\n  to { transform: translateY(-40px); }\n}\n.kub {\n  animation: Sakra 1s infinite;\n}`} mark={[6]} />,
    uz: { ctx: "Kubik sakrashi kerak edi, lekin joyidan qimirlamayapti.", q: "Nima buzilib qolibdi?", opts: ['Nom: Sakra katta harf bilan, reja esa sakra', 'infinite yozmaslik kerak edi', "from va to o'rniga foiz kerak", 'Bir soniya juda qisqa'],
      ok: "To'ppa-to'g'ri! Brauzer katta va kichik harfni farqlaydi: Sakra degan reja yo'q, shuning uchun kubik turibdi.", hint: "keyframes so'zidan keyingi nomni animation qatoridagi nom bilan harfma-harf solishtirib ko'ring.", alt: "@keyframes va animation qatori" },
    ru: { ctx: 'Кубик должен был прыгать, а он стоит на месте.', q: 'Что сломалось?', opts: ['Имя: Sakra с большой буквы, а план — sakra', 'infinite писать не надо было', 'Вместо from и to нужны проценты', 'Одна секунда — слишком мало'],
      ok: 'Верно! Браузер различает большие и маленькие буквы: плана Sakra нет, поэтому кубик стоит.', hint: 'Сравни по буквам имя после keyframes и имя в строке animation.', alt: '@keyframes и строка animation' },
    en: { ctx: 'The cube should jump, but it isn’t moving.', q: 'What broke?', opts: ['The name: Sakra has a capital, the plan is sakra', 'infinite shouldn’t be there', 'Percentages are needed instead of from and to', 'One second is too short'],
      ok: 'Right! The browser tells capital and small letters apart: there is no plan called Sakra, so the cube stands still.', hint: 'Compare the name after keyframes with the name in the animation line, letter by letter.', alt: '@keyframes and the animation line' } },
  { id: 'css-15t2', target: 'css-15', ptype: 'CSS', tag: 'animation-name', correct: 1, mono: true,
    vis: () => <WqVis file="style.css" code={`@keyframes aylan {\n  to { transform: rotate(360deg); }\n}\n.kub {\n  animation: ___ 2s infinite;\n}`} mark={[5]} />,
    uz: { ctx: "Harakat rejasi tayyor. Endi kubikni aylantiramiz.", q: "Bo'sh joyga nima yoziladi?", opts: ['rotate', 'aylan', 'keyframes', 'kub'],
      ok: "Qoyil! animation qatoriga rejaning nomi yoziladi, u esa keyframes so'zidan keyin turibdi: aylan.", hint: "animation qaysi rejani ishga tushirishi kerak? Rejaning nomi birinchi qatorda turibdi.", alt: "Nomi bo'sh animation qatori" },
    ru: { ctx: 'План движения готов. Теперь закрутим кубик.', q: 'Что пишется на пустое место?', opts: ['rotate', 'aylan', 'keyframes', 'kub'],
      ok: 'Здорово! В animation пишется имя плана, а оно стоит после слова keyframes: aylan.', hint: 'Какой план должен запустить animation? Его имя — в первой строке.', alt: 'Строка animation с пустым именем' },
    en: { ctx: 'The motion plan is ready. Now let’s spin the cube.', q: 'What goes in the empty spot?', opts: ['rotate', 'aylan', 'keyframes', 'kub'],
      ok: 'Nice work! animation takes the plan’s name, and it comes after the word keyframes: aylan.', hint: 'Which plan should animation start? Its name is on the first line.', alt: 'An animation line with an empty name' } },
  { id: 'css-15t3', target: 'css-15', ptype: 'CSS', tag: 'count', correct: 2,
    vis: () => <WqVis file="style.css" code={`.kub {\n  animation: sakra 1s 3;\n}`} mark={[2]} />,
    uz: { ctx: "Vaqtdan keyin yana bir son turibdi.", q: "Kubik necha marta sakraydi?", opts: ['Bir marta', "Cheksiz, to'xtamasdan", 'Uch marta', 'Uch soniya davomida'],
      ok: "Xuddi shunday! Vaqtdan keyingi son takrorlar sonini aytadi: uch marta sakraydi va to'xtaydi.", hint: "1s bu vaqt. Undan keyingi son nimani aytadi: soniyanimi yoki necha martaligini?", alt: "animation: sakra 1s 3" },
    ru: { ctx: 'После времени стоит ещё одно число.', q: 'Сколько раз прыгнет кубик?', opts: ['Один раз', 'Бесконечно, без остановки', 'Три раза', 'В течение трёх секунд'],
      ok: 'Именно! Число после времени — это сколько повторов: три прыжка, и стоп.', hint: '1s — это время. А что говорит число после него: секунды или сколько раз?', alt: 'animation: sakra 1s 3' },
    en: { ctx: 'There is one more number after the time.', q: 'How many times will the cube jump?', opts: ['Once', 'Forever, non-stop', 'Three times', 'For three seconds'],
      ok: 'Exactly! The number after the time is how many repeats: three jumps, then stop.', hint: '1s is the time. What does the number after it say: seconds, or how many times?', alt: 'animation: sakra 1s 3' } },
  { id: 'css-15t4', target: 'css-15', ptype: 'CSS', tag: 'animation-vs-transition', correct: 3,
    vis: (L) => { const T = aqL(L); return <WqVis
      html={`<div class="osmon"><span class="yulduz">⭐</span><b>${T('Tungi osmon', 'Ночное небо', 'Night sky')}</b></div>`}
      css={'@keyframes milt { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } } .osmon { display: flex; align-items: center; gap: 14px; padding: 18px; border-radius: 14px; background: #1E1B4B; color: #fff; font-size: 20px; } .yulduz { font-size: 44px; animation: milt 1.2s infinite; }'} />; },
    uz: { ctx: "Sahifa ochilishi bilan yulduz o'zi miltillab turibdi. Sichqoncha kerak emas.", q: "Buning uchun nima kerak?", opts: [':hover va transform', 'transition', 'position: fixed', '@keyframes va animation'],
      ok: "Juda zo'r! transition faqat biror narsa o'zgarganda ishlaydi, animation esa o'zi, sichqonchasiz takrorlanadi.", hint: "transition sichqoncha kelishini kutadi. Qaysi biri o'zi boshlanib, o'zi takrorlanadi?", alt: "Miltillayotgan yulduz" },
    ru: { ctx: 'Звезда мигает сама, сразу при открытии страницы. Мышка не нужна.', q: 'Что для этого нужно?', opts: [':hover и transform', 'transition', 'position: fixed', '@keyframes и animation'],
      ok: 'Отлично! transition срабатывает, только когда что-то меняется, а animation повторяется сама, без мышки.', hint: 'transition ждёт мышку. Что запускается само и само повторяется?', alt: 'Мигающая звезда' },
    en: { ctx: 'The star twinkles on its own as soon as the page opens. No mouse needed.', q: 'What does this need?', opts: [':hover and transform', 'transition', 'position: fixed', '@keyframes and animation'],
      ok: 'Great! transition only runs when something changes, but animation repeats on its own, with no mouse.', hint: 'transition waits for the mouse. Which one starts and repeats by itself?', alt: 'A twinkling star' } },
  { id: 'css-15t5', target: 'css-15', ptype: 'CSS', tag: 'percent', correct: 0,
    vis: () => <WqVis file="style.css" code={`@keyframes sakra {\n  0% { transform: translateY(0px); }\n  50 { transform: translateY(-40px); }\n  100% { transform: translateY(0px); }\n}`} mark={[3]} />,
    uz: { ctx: "Kubik o'rtada tepaga ko'tarilishi kerak edi, lekin turib qoldi.", q: "Rejada nima tushib qolibdi?", opts: ['3-qatorda 50 dan keyin % belgisi', "2-qatorda 0% o'rniga from", '4-qatordagi 100% ortiqcha', '1-qatorda nom katta harf bilan'],
      ok: "Qoyil! Kadr foiz bilan yoziladi: 50%. Foizsiz brauzer bu kadrni tanimaydi.", hint: "Har bir kadrning boshiga qarang: qaysi birida belgi yetishmayapti?", alt: "Uchta kadrli harakat rejasi" },
    ru: { ctx: 'Кубик должен был подняться посередине, а он стоит.', q: 'Что потерялось в плане?', opts: ['В строке 3 — знак % после 50', 'В строке 2 — from вместо 0%', 'В строке 4 — лишний 100%', 'В строке 1 — имя с большой буквы'],
      ok: 'Здорово! Кадр пишется с процентом: 50%. Без процента браузер этот кадр не узнаёт.', hint: 'Посмотри на начало каждого кадра: где не хватает знака?', alt: 'План движения из трёх кадров' },
    en: { ctx: 'The cube should rise in the middle, but it stands still.', q: 'What is missing in the plan?', opts: ['Line 3: the % sign after 50', 'Line 2: from instead of 0%', 'Line 4: 100% is extra', 'Line 1: the name has a capital'],
      ok: 'Nice work! A frame is written with a percent: 50%. Without it the browser doesn’t recognise the frame.', hint: 'Look at the start of each frame: which one is missing a sign?', alt: 'A motion plan with three frames' } }
];
