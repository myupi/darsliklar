// Практика 6 «Анкеты Коди», ЧАСТЬ 1: input и type (tools/qism/build-prac.mjs, 27.11.2026).
// Хук S1 (правка build-prac: страница без label и form — как в части 1 урока: подпись в p, поле input на своей строке),
// четыре задания и новый вывод E1. Прежнее задание 1 (вписать значение type) идёт с той же проверкой, но на странице
// части 1; три новых: K2 — дописать атрибут type целиком в тег input, K3 — написать строку input с type, K4 — найти
// строку с опечаткой в значении type (pasword) и исправить. placeholder, label и form — часть 2: ни в репликах, ни в
// коде, ни на страницах этой части их нет. Четыре вкладки — свои (Futbol, Musiqa, Suzish, Raqs); шахматы, робототехника,
// рисование и «Моя анкета» — во второй части.

// ── Кружки и вкладки части 1. ──
Object.assign(A6_ICO, {
  note: <><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></>,
  wave: <><circle cx="15.5" cy="6.5" r="2.2" /><path d="M3 14.5c2 0 2-2 4.5-2s2.5 2 4.5 2 2.5-2 4.5-2 2.5 2 4.5 2M3 19c2 0 2-2 4.5-2s2.5 2 4.5 2 2.5-2 4.5-2 2.5 2 4.5 2" /></>,
  dance: <><circle cx="12" cy="4.8" r="2.2" /><path d="M12 8v6M6.5 9.5 12 11l5.5-3.5M12 14l-3.5 6M12 14l3.5 6" /></>
});
Object.assign(CLUB, { raqs: L3("Raqs", 'Танцы', 'Dance') });
TABS.splice(0, TABS.length,
  { id: 'futbol', file: 'futbol.html', ico: 'ball', c: '#FA4F28', name: CLUB.futbol },
  { id: 'musiqa', file: 'musiqa.html', ico: 'note', c: '#7C5CFA', name: CLUB.musiqa },
  { id: 'suzish', file: 'suzish.html', ico: 'wave', c: '#0FA38E', name: CLUB.suzish },
  { id: 'raqs', file: 'raqs.html', ico: 'dance', c: '#F59E0B', name: CLUB.raqs }
);

Object.assign(UI, {
  finishP1: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  nextPart: L3("Keyingi dars: placeholder, label va form", 'Следующий урок: placeholder, label и form', 'Next lesson: placeholder, label and form'),
  noAngle: L3("Bu yerga atributning o'zini yozing: burchakli qavslar kodda allaqachon turibdi.", 'Здесь нужен только атрибут: уголки в коде уже стоят.', 'Only the attribute here: the angle brackets are already in the code.')
});
Object.assign(NOT_SPOKEN_IN, { roles: { input: 1, type: 1, typo: 1 } });

// ── Фразы проверки новых заданий (слово ученика — в невидимых метках). ──
Object.assign(FB, {
  valueOnly: L3("Bu yerga qiymatning o'zi emas, butun atribut kerak: oldin nomi, keyin teng belgisi, keyin qo'shtirnoq ichida qiymati.",
    'Здесь нужен весь атрибут, а не одно значение: имя, знак равенства и значение в кавычках.',
    'You need the whole attribute here, not just the value: the name, an equals sign and the value in quotes.'),
  // В части 1 у input один атрибут — type (placeholder — часть 2): чужое имя атрибута называет только type.
  attrTypo: L3("Brauzer bunday atributni bilmaydi: \u2063«{bad}»\u2064. Bizga type atributi kerak.",
    'Такого атрибута нет: \u2063«{bad}»\u2064. Нам нужен атрибут type.',
    'There’s no such attribute: \u2063“{bad}”\u2064. We need the type attribute.')
});

// ── Тексты. Звучат: say, broke, done, ok, hints, found, why; печатаются: eyebrow, ask, roles. ──
// Хук: четыре кружка этой части; без placeholder и label.
Object.assign(C.s1, {
  say: L3("Onam telefon qildi: «Bolam, to'garaklaring qani?» Mana, saytimda to'rttasi bor: futbol, musiqa, suzish va raqs. Har birining anketasi bor, futbolniki esa parolni nuqtalar ortiga yashirib turibdi. Onamga ko'rsatishdan oldin yangi nusxani joyiga qo'yamiz: «Saqlash»ni bosing.",
    'Привет! Я открыл на сайте кружки: футбол, музыка, плавание и танцы. Для каждого сделал анкету записи. Смотри, в анкете футбола пароль спрятан за точками. Осталось сохранить сайт. Нажми «Сохранить».',
    'Hi! I opened clubs on my site: football, music, swimming and dance. I made a sign-up form for each one. Look, in the football form the password is hidden behind dots. Now I just need to save the site. Tap “Save”.'),
  done: L3("Parolni qaytarib yashirish bitta so'zning ishi. Futboldan boshlab, to'rtta anketani ketma-ket tuzatamiz: maydonni input yasaydi, uning turini esa type tanlaydi. Kodni o'zingiz yozasiz, men yoningizdaman.",
    'На прошлом уроке мы познакомились с полями: input делает поле, а type выбирает его вид. Теперь с этими знаниями починим четыре анкеты по одной. Код пишешь ты, а я рядом.',
    'Last lesson we met fields: input makes a field, and type chooses its kind. Now let’s use that to fix four forms one by one. You write the code, and I’ll be right here.')
});

// Задание 1 (прежнее): тексты те же, страница другая — без label и form.
Object.assign(C, {
  t2: {
    eyebrow: L3("Musiqa", 'Музыка', 'Music'),
    say: L3("Futbolchilarning paroli xavfsiz, endi musiqa to'garagi navbati. Bu anketada Yosh degan yozuv bor, uning ostidagi maydon esa oddiy chiqibdi: yoshga harf ham yozib yuborish mumkin. Chunki input tegida type atributi yo'q ekan. Atribut shunday yoziladi: oldin nomi, keyin teng belgisi, keyin qo'shtirnoq ichida qiymati. Bo'sh joyga type atributini number qiymati bilan yozing.",
      'Пароль футболистов в безопасности, теперь музыка. В этой анкете есть подпись «Возраст», а поле под ней обычное: в возраст можно вписать и буквы. Всё потому, что у тега input нет атрибута type. Атрибут пишется так: сначала имя, потом знак равенства, потом значение в кавычках. Впиши в пустое место атрибут type со значением number.',
      'The football password is safe, now music. This form has the age caption, but the field under it is a plain one: you can even type letters into an age. That’s because the input tag has no type attribute. An attribute is written like this: first the name, then an equals sign, then the value in quotes. Write the type attribute with the value number in the empty spot.'),
    ask: L3("Yosh maydoniga atribut qo'shing: type, qiymati number", 'Добавь полю возраста атрибут: type со значением number', 'Give the age field an attribute: type with the value number'),
    ok: L3("Zo'r! Maydonda strelkalar paydo bo'ldi, endi unga faqat son yoziladi. Yosh maydoni tuzaldi!",
      'Огонь! В поле появились стрелки, и теперь в него пишутся только числа. Поле возраста починено!',
      'Awesome! Arrows appeared in the field, and now only numbers can go in. The age field is fixed!'),
    hints: [
      L3("Maydon qanaqa bo'lishini brauzerga type aytadi. Bo'sh joyga atributning o'zini yozasiz: burchakli qavslar kodda turibdi-ku.", 'Каким будет поле, говорит type. Впиши в пустое место сам атрибут: уголки в коде уже стоят.', 'type says what the field is like. Write the attribute itself in the empty spot: the angle brackets are already in the code.'),
      L3("Atribut uchta bo'lakdan iborat: nomi, teng belgisi va qo'shtirnoq ichidagi qiymat. Nomi type, qiymati number.", 'Атрибут из трёх частей: имя, знак равенства и значение в кавычках. Имя type, значение number.', 'An attribute has three parts: a name, an equals sign and a value in quotes. The name is type, the value is number.'),
      L3("Mana, parol maydoniga type shunday yoziladi. Siz ham xuddi shunday yozing, faqat qiymati boshqa.", 'Вот так type записан у поля пароля. Напиши так же, только значение другое.', 'Here’s how type is written for a password field. Write yours the same way, just with another value.')
    ],
    drill: L3("Endi parol maydoni: type atributini password qiymati bilan yozing", 'Теперь поле пароля: впиши type со значением password', 'Now a password field: write type with the value password')
  },
  t3: {
    eyebrow: L3("Suzish", 'Плавание', 'Swimming'),
    say: L3("Yosh maydoni ham tayyor, endi suzish to'garagi! Bu anketada Ism degan yozuv turibdi-yu, uning maydoni butunlay o'chib ketibdi. Maydonni input tegi chiqaradi, uning turini esa type tanlaydi. Qani, bo'sh qatorga input qatorini type bilan birga yozing-da, «Tekshirish»ni bosing. input tegini yopmaysiz: u yolg'iz yuradi.",
      'Возраст готов, теперь плавание! В этой анкете подпись «Имя» есть, а строка с полем стёрлась целиком. Поле ставит тег input, а вид выбирает type. Напиши в пустой строке тег input с атрибутом type. Помнишь, input не закрывается.',
      'Age is done, now swimming! This form has the name caption, but the field line got erased completely. The input tag puts a field on the page, and type chooses its kind. Write the input tag with the type attribute in the empty row. Remember, input doesn’t close.'),
    ask: L3("input qatori: type «text»", 'Строка input: type «text»', 'input line: type “text”'),
    ok: L3("Ism maydoni qaytdi! Endi suzuvchilar o'z ismini yoza oladi.",
      'Вот это да! Вся строка твоими руками, и поле с именем вернулось!',
      'Wow! You wrote the whole line yourself, and the name field is back!'),
    hints: [
      L3("Maydonni input tegi chiqaradi. Ismni hamma ko'ra olsin, shuning uchun type qiymati text bo'ladi.", 'Поле ставит тег input. Имя пусть видят все, поэтому type будет text.', 'The input tag puts a field on the page. Everyone may see a name, so type will be text.'),
      L3("Tartibi shunday: oldin input so'zi, keyin type atributi, qo'shtirnoq ichida text. Oxirida o'ng burchakli qavs turadi.", 'Порядок такой: сначала слово input, потом атрибут type, в кавычках text. В конце стоит правый уголок.', 'The order is: first the word input, then the type attribute with text in quotes. The right angle bracket goes at the end.'),
      L3("Mana, yosh maydonining qatori. Siz ham xuddi shunday yozing, faqat qiymati text.", 'Вот строка поля возраста. Напиши так же, только значение text.', 'Here’s the line for an age field. Write yours the same way, just with the value text.')
    ],
    drill: L3("Endi yosh: type «number» bilan input qatori", 'Теперь возраст: строка input с type «number»', 'Now age: the input line with type “number”')
  },
  t4: {
    eyebrow: L3("Raqs", 'Танцы', 'Dance'),
    say: L3("Uchta anketa tayyor, qoldi raqs to'garagi. Bu yerda parol maydonini yozayotib shoshib qolgan edim. Lekin qarang: bola parolini yozgan zahoti harflari ko'rinib qoldi! Menimcha, bitta qatorda adashganman. Qaysi qatorda ekanini topa olasizmi? O'sha qatorni bosing.",
      'Три анкеты готовы, осталась танцевальная. Здесь я спешил, когда писал поле пароля. Но смотри: гость написал пароль, и его видно всем! Значит, одна строка сломана. Сначала найди эту строку и нажми на неё.',
      'Three forms are done, only dance is left. I was in a hurry here when I wrote the password field. But look: a visitor typed a password and everyone can see it! So one line is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Mana u! type ichida pasword deb yozilgan, bitta harf tushib qolibdi. Brauzer bunday turni bilmaydi, shuning uchun maydonni oddiy qilib qo'ydi. Harfni qo'shib, to'g'ri yozing.",
      'Нашлась! В type написано pasword: одной буквы не хватает. Браузер не знает такого вида и сделал обычное поле. Допиши букву.',
      'Found it! type says pasword, one letter is missing. The browser doesn’t know such a kind and made a plain field. Add the letter.'),
    ok: L3("Parol yana nuqtalar ortiga bekindi! Demak, brauzer har bir harfni aniq o'qiydi: bitta harf adashsa, maydon oddiy bo'lib qoladi.",
      'Ура, заработало! Пароль спрятался за точками. Браузер читает каждую букву точно: ошибёшься в одной, и поле станет обычным.',
      'Yes, it works! The password is hidden behind dots. The browser reads every letter exactly: miss one and the field turns plain.'),
    why: {
      0: L3("Bu body qatori, parolga uning aloqasi yo'q. Parol qaysi maydonda ko'rinib turibdi, shuni qidiring.", 'Здесь открывается body, строка в порядке. Посмотри на поле пароля.', 'body opens here, this line is fine. Look at the password field.'),
      1: L3("Sarlavha o'qilib turibdi, demak, h1 butun. Parolni boshqa joydan izlang.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      cap: L3("Bu faqat yozuv, maydonning o'zi uning ostidagi qatorda turibdi. Parol ko'rinib turgan maydonni toping.", 'Это только подпись, само поле на строке ниже. Найди поле, где виден пароль.', 'This is only a caption, the field itself is on the next line. Find the field where the password shows.'),
      3: L3("Ismni hamma ko'rsa ham bo'laveradi, bu maydon o'z joyida. Parol-chi? Pastroqqa tushib qarang.", 'Имя можно видеть всем, это поле в порядке. А где пароль? Посмотри ниже.', 'Everyone can see a name, this field is fine. Where’s the password? Look further down.'),
      6: L3("Sahifa shu yerda tugaydi, parol esa undan tepada ochiq turibdi. Tepaga qarang.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Parolning harflari ochiq ko'rinyapti. Qaysi maydon parol uchun ekan?", 'Пароль виден. Какое поле для пароля?', 'The password shows. Which field is for the password?'),
      L3("Endi o'sha maydonning qatorini toping-da, type ichida nima yozilganiga qarang. Hamma harf joyidami?", 'Посмотри на строку этого поля: что написано в type? Все ли буквы на месте?', 'Look at the line of that field: what’s in type? Are all the letters there?'),
      L3("Parol maydonining type qiymati password bo'lishi kerak. Oynaning tagidagi turlar ro'yxati bilan solishtirib ko'ring.", 'У поля пароля в type должно стоять password. Сравни с перечнем видов под окном.', 'A password field needs password in type. Compare with the list of kinds under the window.')
    ],
    drill: L3("Bu anketada ham bitta qator buzilgan, uni toping", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it')
  }
});
// Вывод части 1: четыре анкеты, input, type и опечатка; интрига на часть 2.
Object.assign(C, {
  e1: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Barakalla! To'rtala anketa yana ishlab turibdi: futbol, musiqa, suzish va raqs. Parollar yana sir saqlaydi!",
        'Ура! Все четыре анкеты снова работают: футбол, музыка, плавание и танцы. Пароли снова хранят секрет!',
        'Hooray! All four forms work again: football, music, swimming and dance. The passwords keep their secrets again!') },
      { k: 'input', text: L3("Har bir maydonni input tegi yasadi. Uni yopish shart emas: input yolg'iz yashaydi, uning jufti yo'q.",
        'Каждое поле поставил тег input. Закрывающий тег ему не нужен: у input нет пары.',
        'Every field was made by the input tag. It needs no closing tag: input has no pair.') },
      { k: 'type', text: L3("Maydon qanaqa bo'lishini type tanladi. text bo'lsa yozuv ochiq turadi, number bo'lsa faqat son yoziladi, password bo'lsa harflar nuqtalar ortiga yashirinadi.",
        'А каким будет поле, выбирал type. С text текст виден, с number пишутся только числа, а с password буквы прячутся за точками.',
        'And type chose what each field is like. With text the text is visible, with number only numbers go in, and with password the letters hide behind dots.') },
      { k: 'typo', text: L3("Raqs anketasida esa bitta harf tushib qolgan edi: pasword. Brauzer bunday turni bilmaydi, shuning uchun maydonni oddiy qilib qo'ydi. Demak, type ichiga so'zni aynan yozamiz.",
        'А в танцевальной анкете не хватало одной буквы: pasword. Браузер не знает такого вида и сделал обычное поле. Значит, в type слово пишется точно.',
        'And in the dance form one letter was missing: pasword. The browser doesn’t know such a kind and made a plain field. So in type the word has to be written exactly.') },
      { k: null, text: L3("Lekin bitta savol qoldi. Sahifaga kirgan odam bo'sh maydonni ko'radi-yu, unga nima yozishni qayerdan bilsin? Keyingi darsda maydonga kulrang ishora qo'yamiz, yozuvni maydon bilan bog'laymiz va hammasini bitta anketaga yig'amiz!",
        'Но остался вопрос. Человек открывает страницу и видит пустое поле: откуда ему знать, что туда писать? На следующем уроке мы научим поле подсказывать, свяжем подпись с полем и соберём всё в одну анкету!',
        'But one problem is left. A person opens the page and sees an empty field: how would they know what to type there? In the next lesson we’ll make the field give a hint, tie each caption to its field and gather everything into one form!') }
    ],
    roles: {
      input: L3("input — maydon", 'input — поле', 'input — field'),
      type: L3("type — maydon turi", 'type — вид поля', 'type — field type'),
      typo: L3("Har bir harf muhim", 'Каждая буква важна', 'Every letter matters')
    },
    ask: L3("To'rtta anketa ishlayapti! «Amaliyotni tugatish»ni bosing", 'Четыре анкеты работают! Нажми «Завершить практику»', 'Four forms work! Tap “Finish the practice”')
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Страница части 1: заголовок, подпись в p и поле input на своей строке (как в уроке 6, часть 1). Без label и form.
// ─────────────────────────────────────────────────────────────────────────────
const p1Cap = (cap) => '<p>' + cap + '</p>';
const p1Sample = (pick) => ['<h1>' + pick(CLUB.raqs) + '</h1>', p1Cap(pick(CAP.name)), a6Input('text'), p1Cap(pick(CAP.pass)), a6Input('password')].join('');

// ── K1 · вписать значение в пустой type (прежнее задание 1): пароль виден всем. ──
const P1_K1 = { club: 'futbol', cap: 'pass', val: VIS.pass, want: 'password' };
const P1_K1X = { club: 'robot', cap: 'age', val: VIS.age, want: 'number' };
// Поле в строке кода: пока не решено — рамка с полем, потом — вписанное слово цветом атрибута.
const p1Gap = (x, v, max) => (x.solved ? <span key="v" className="a6-a">{v}</span> : (
  <span key="g" className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
    <InlineInput value={v} onChange={(s2) => x.set({ v: s2 })} inputRef={x.inRef} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={max}
      onFocus={(e) => { const el = e.target; setTimeout(() => { const box = el.closest('.a6-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
  </span>));
function p1FieldView(d) {
  return (st, x) => {
    const v = st.v || '';
    const club = x.pick(CLUB[d.club]);
    const cap = x.pick(CAP[d.cap]);
    const lines = [
      { k: 'h1', parts: [T_('h1'), W_(club), T_('h1', true)] },
      { k: 'c', parts: [T_('p'), W_(cap), T_('p', true)] },
      { k: 'i', cls: x.solved ? 'is-new' : 'is-hl', parts: [
        <span key="ah" className="a6-g"><span className="a6-b">&lt;</span><span className="a6-n">input</span><span className="a6-a"> type="</span></span>,
        p1Gap(x, v, 20),
        <span key="az" className="a6-g"><span className="a6-a">"</span><span className="a6-b">&gt;</span></span>
      ] }
    ];
    const code = '<h1>' + club + '</h1>' + p1Cap(cap) + a6Input(v);
    return {
      title: club, url: d.club + '.html', blocks: a6Page(code, [d.val]).blocks,
      aid: <A6Types />,
      editor: <div className="a6-fieldwrap"><KzCode cls="a6-kz" lines={lines} /></div>,
      keys: !x.solved, syms: []
    };
  };
}
const cfgK1 = () => ({
  id: 't1', num: 1, cls: 'k1', kind: 'write-type', C: C.t1,
  init: () => ({ v: '' }),
  check: (st) => a6FieldCheck(st.v, P1_K1.want),
  view: p1FieldView(P1_K1),
  sample: (pk) => [p1Cap(pk(CAP.age)), a6Input('number')],
  drill: { init: () => ({ v: '' }), check: (st) => a6FieldCheck(st.v, P1_K1X.want), view: p1FieldView(P1_K1X) }
});

// ── K2 · дописать атрибут type целиком в тег input (<input ___>): type="number" — в поле появляются стрелки. ──
function p1AttrCheck(v, want) {
  const s = a6Squash(v);
  if (!s) return { ok: false, msg: FB.noType };
  if (/[<>]/.test(s)) return { ok: false, msg: UI.noAngle };
  if (A6_TYPES.indexOf(s.toLowerCase()) >= 0) return { ok: false, msg: FB.valueOnly };
  const t = lexA6('<input ' + s + '>')[0];
  if (!t || t.k !== 'open' || t.name !== 'input') return { ok: false, msg: FB.noType };
  const er = t.attrErr;
  if (er) return { ok: false, msg: a6Fb(er.why, { bad: er.bad || '', attr: er.attr || '', tag: 'input', list: 'type' }) };
  const m = a6TypeIssue(t.attrs, want);
  return m ? { ok: false, msg: m } : { ok: true };
}
const P1_K2 = { club: 'musiqa', cap: 'age', val: VIS.age, want: 'number' };
const P1_K2X = { club: 'shaxmat', cap: 'pass', val: 'gambit26', want: 'password' };
function p1AttrView(d) {
  return (st, x) => {
    const v = st.v || '';
    const club = x.pick(CLUB[d.club]);
    const cap = x.pick(CAP[d.cap]);
    const lines = [
      { k: 'h1', parts: [T_('h1'), W_(club), T_('h1', true)] },
      { k: 'c', parts: [T_('p'), W_(cap), T_('p', true)] },
      { k: 'i', cls: x.solved ? 'is-new' : 'is-hl', parts: [
        <span key="ah" className="a6-g"><span className="a6-b">&lt;</span><span className="a6-n">input</span><span className="a6-a">{' '}</span></span>,
        p1Gap(x, v, 30),
        <span key="az" className="a6-g"><span className="a6-b">&gt;</span></span>
      ] }
    ];
    const code = '<h1>' + club + '</h1>' + p1Cap(cap) + '<input ' + v + '>';
    return {
      title: club, url: d.club + '.html', blocks: a6Page(code, [d.val]).blocks,
      aid: <A6Types />,
      editor: <div className="a6-fieldwrap"><KzCode cls="a6-kz" lines={lines} /></div>,
      keys: !x.solved, syms: ['=', '"']
    };
  };
}
const cfgK2 = () => ({
  id: 't2', num: 2, cls: 'k2', kind: 'write-attr', C: C.t2,
  init: () => ({ v: '' }),
  check: (st) => p1AttrCheck(st.v, P1_K2.want),
  view: p1AttrView(P1_K2),
  sample: () => [a6Input('password')],
  drill: { init: () => ({ v: '' }), check: (st) => p1AttrCheck(st.v, P1_K2X.want), view: p1AttrView(P1_K2X) }
});

// ── K3 · написать строку input с type целиком (тег не закрывается): поле появляется на странице. ──
function p1LineCheck(code, wantType) {
  const toks = lexA6(code);
  const bad = a6Bad(toks) || a6Outer(toks, false);
  if (bad) return { ok: false, msg: bad };
  const ins = toks.filter((t) => t.k === 'open' && t.name === 'input');
  const other = toks.find((t) => !(t.k === 'open' && t.name === 'input'));
  if (!ins.length) {
    if (other && (other.k === 'open' || other.k === 'close')) return { ok: false, msg: a6Fb('wrongOpen', { tag: 'input', got: other.name }) };
    return { ok: false, msg: toks.length ? FB.needInput : FB.empty };
  }
  if (ins.length > 1) return { ok: false, msg: FB.oneInput };
  if (other) return { ok: false, msg: a6Fb('extra', { got: other.k === 'text' ? other.v : other.raw }) };
  const m = a6TypeIssue(ins[0].attrs, wantType);
  return m ? { ok: false, msg: m } : { ok: true };
}
const P1_K3 = { club: 'suzish', cap: 'name', val: VIS.name, type: 'text' };
const P1_K3X = { club: 'rasm', cap: 'age', val: VIS.age, type: 'number' };
function p1LineView(d) {
  return (st, x) => {
    const club = x.pick(CLUB[d.club]);
    const before = ['<body>', '  <h1>' + club + '</h1>', '  ' + p1Cap(x.pick(CAP[d.cap]))];
    const after = ['</body>'];
    return {
      title: club, url: d.club + '.html', blocks: a6Page(before.concat([st.code], after).join('\n'), [d.val]).blocks,
      aid: <A6Parts parts={[{ code: '<input' }, { code: 'type="…"' }, { code: '>' }]} />,
      editor: <A6Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgK3 = () => ({
  id: 't3', num: 3, cls: 'k3', kind: 'write-input', C: C.t3,
  init: () => ({ code: '  ' }),
  check: (st) => p1LineCheck(st.code, P1_K3.type),
  view: p1LineView(P1_K3),
  sample: () => [a6Input('number')],
  drill: { init: () => ({ code: '  ' }), check: (st) => p1LineCheck(st.code, P1_K3X.type), view: p1LineView(P1_K3X) }
});

// ── K4 · найти строку и исправить: опечатка в значении type (pasword) — пароль виден всем. Страница после починки
// уходит в артефакт части 1. ──
const P1_K4 = { club: 'raqs', bad: 'pasword', val: 'raqs2026' };
const P1_K4X = { club: 'robot', bad: 'passwrod', val: 'robot2026' };
function p1FixView(d, V) {
  return (st, x) => {
    const club = x.pick(CLUB[d.club]);
    const lines = a6Body(['<h1>' + club + '</h1>', p1Cap(x.pick(CAP.name)), a6Input('text'), p1Cap(x.pick(CAP.pass)), a6Input(d.bad)]);
    const BAD = 5;
    const vals = [VIS.name, d.val];
    // Нажатая строка: верная раскрывается в поле с её текстом (значение type выделено), неверная — своя причина.
    const pickLine = (i) => {
      if (i === BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[BAD], miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(V.found, 'point');
        setTimeout(() => {
          const el = x.inRef.current;
          if (!el) return;
          el.focus();
          const m = /type="([^"]*)"/.exec(el.value);
          if (m) { const a = m.index + 6; el.setSelectionRange(a, a + m[1].length); } else el.setSelectionRange(el.value.length, el.value.length);
        }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(V.why[i] || (i === 2 || i === 4 ? V.why.cap : V.why[0]));
    };
    if (st.at == null) {
      return {
        title: club, url: d.club + '.html', blocks: a6Page(lines.join('\n'), vals).blocks, pageHl: true, keys: false, ask: V.ask, aid: <A6Types />,
        editor: <A6Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, BAD);
    const after = lines.slice(BAD + 1);
    return {
      title: club, url: d.club + '.html', blocks: a6Page(before.concat([st.code], after).join('\n'), vals).blocks, ask: V.ask2, aid: <A6Types />,
      editor: <A6Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function p1FixCheck(st, V) {
  if (st.at == null) return { ok: false, msg: V.ask };
  const toks = lexA6(st.code);
  const bad = a6Bad(toks) || a6Outer(toks, false);
  if (bad) return { ok: false, msg: bad };
  const ins = toks.filter((t) => t.k === 'open' && t.name === 'input');
  if (!ins.length) return { ok: false, msg: FB.needInput };
  if (ins.length > 1 || toks.length > 1) return { ok: false, msg: FB.oneInput };
  const m = a6TypeIssue(ins[0].attrs, 'password');
  return m ? { ok: false, msg: m } : { ok: true };
}
const cfgK4 = (pick, store) => ({
  id: 't4', num: 4, cls: 'k4', kind: 'find-fix', C: C.t4,
  init: () => ({ at: null, code: '' }),
  check: (st) => p1FixCheck(st, C.t4),
  onSolved: () => {
    const club = pick(CLUB[P1_K4.club]);
    store.set('myCode', p1Sample(pick));
    store.set('myHead', club);
    store.set('myFields', [{ cap: pick(CAP.name), type: 'text', ph: '' }, { cap: pick(CAP.pass), type: 'password', ph: '' }]);
    store.set('myTab', club);
  },
  view: p1FixView(P1_K4, C.t4),
  sample: () => [a6Input('password')],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => p1FixCheck(st, C.t4), view: p1FixView(P1_K4X, C.t4) }
});

const K1 = ({ p }) => <A6Task p={p} make={cfgK1} />;
const K2 = ({ p }) => <A6Task p={p} make={cfgK2} />;
const K3 = ({ p }) => <A6Task p={p} make={cfgK3} />;
const K4 = ({ p }) => <A6Task p={p} make={cfgK4} />;

// ─────────────────────────────────────────────────────────────────────────────
// E1 · ВЫВОД ЧАСТИ 1: четыре вкладки горят, на открытой — починенная страница «Raqs» с её кодом; плашки input · type ·
// «каждая буква важна» загораются за речью; дальше — часть 2.
// ─────────────────────────────────────────────────────────────────────────────
function E1({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.e1;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'curious' : i === 0 ? 'celebrate' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA6Tabs(true);
  const code = store.get('myCode') || p1Sample(pick);
  const lines = a6Body(a6Lines(code, false));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = curK === 'input' ? find(/<input/) : curK === 'type' ? find(/type="text"/) : curK === 'typo' ? find(/type="password"/) : null;
  const ROLE_C = { input: '#FA4F28', type: '#7C5CFA', typo: '#0FA38E' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finishP1} /></>}>
      <Sheet cls="a6-sheet a6-fin a6-five">
        <KzAsk text={c.ask} />
        <div className="a6-work">
          <div className="a6-side">
            <A6Browser tabs={tabs} cur={3} title={pick(TABS[3].name)} pageHl={curK === 'typo'} url="raqs.html"><A6Doc blocks={a6Page(code, [VIS.name, 'raqs2026']).blocks} /></A6Browser>
            <div className="a6-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a6-main">
            <A6Code lines={lines} mark={mark} />
            <div className="kz-roles a6-roles">
              {['input', 'type', 'typo'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': ROLE_C[k] }}>
                  <i aria-hidden="true" />{pick(c.roles[k])}
                </span>
              ))}
            </div>
            <div className="kz-next"><Icon name="doc" size={18} /><span><b>{pick(UI.nextPart)}</b></span></div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
