// Практика 7 «Лагерь Коди», ЧАСТЬ 1: select, option и textarea (tools/qism/build-prac.mjs, 27.11.2026).
// Хук S1 (сохранение ломает анкеты), четыре задания лесенкой «вписать → переписать строку → написать блок → найти и
// исправить» и новый вывод E1:
//   t1 — прежнее: имя тега option у пункта списка (поле в строке);
//   t2 — НОВОЕ: input → textarea (поле в одну строку мало для длинного вопроса; закрывающий тег, placeholder прежний);
//   t3 — прежнее (бывшее t3): select с тремя option;
//   t4 — прежнее: найти слово в select без option; дополнительная задача заменена (на странице кружков «Klublar»:
//        слово посреди списка), потому что прежняя — незакрытый textarea с кнопкой — уехала во вторую часть.
// Четыре вкладки: Smena, Savollar, Sport, Fikrlar. Кнопка button и своя анкета — часть 2.

// ── Карта части 1: четыре страницы. Новые страницы, пункты и подсказки больших полей. ──
Object.assign(A7_ICO, {
  ask: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9.6a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1.1.9-1.1 1.7M12 17h.01" /></>
});
Object.assign(PG, {
  klub: L3("Klublar", 'Кружки', 'Clubs'),
  taklif: L3("Takliflar", 'Предложения', 'Ideas')
});
Object.assign(OPT, {
  klub: L3(['Rasm', 'Musiqa', 'Robot'], ['Рисование', 'Музыка', 'Роботы'], ['Drawing', 'Music', 'Robots'])
});
Object.assign(PH, {
  taklif: L3("Taklifingizni yozing", 'Напиши своё предложение', 'Write your idea')
});
TABS.splice(0, TABS.length,
  { id: 'smena', file: 'smena.html', ico: 'sun', c: '#FA4F28', name: PG.smena },
  { id: 'savol', file: 'savollar.html', ico: 'ask', c: '#7C5CFA', name: PG.savol },
  { id: 'sport', file: 'sport.html', ico: 'ball', c: '#0FA38E', name: PG.sport },
  { id: 'fikr', file: 'fikr.html', ico: 'chat', c: '#F59E0B', name: PG.fikr }
);

Object.assign(UI, {
  finishP1: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  nextPart: L3("Keyingi dars: button va o'z anketangiz", 'Следующий урок: button и своя анкета', 'Next lesson: button and your own form')
});
Object.assign(SPOKEN, { foundD: 1, whyD: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { select: 1, option: 1, textarea: 1, button: 1, own: 1 } });

// ── Фразы проверки нового задания (t2). Слово ученика сюда не попадает. ──
Object.assign(FB, {
  swapNeed: L3("Bir qatorli maydonni input yasaydi, uzun savol esa unga sig'maydi. Katta maydon uchun textarea tegi kerak.",
    'input — это поле на одну строку, длинный вопрос в него не влезет. Для большого поля нужен тег textarea.',
    'input is a one-line field, a long question won’t fit in it. A big field needs the textarea tag.'),
  taType: L3("type atributi input uchun kerak. textarea o'zi katta matn maydoni, unga type shart emas.",
    'Атрибут type — для input. textarea и так большое текстовое поле, type ему не нужен.',
    'The type attribute is for input. textarea is a big text field already, it doesn’t need type.'),
  taPh: L3("Maydondagi placeholder yozuvi «{want}» bo'lsin, uni o'zgartirmang.",
    'Подсказка placeholder в поле должна остаться прежней: «{want}».',
    'The placeholder in the field should stay as it was: “{want}”.')
});

// ── Тексты: хук, новое задание t2, дополнительная задача t4, вывод E1. ──
Object.assign(C.s1, {
  say: L3("Yozgi lager ochilishiga bir hafta qoldi, sayt esa tayyor! Unda to'rtta anketa bor: smena, savollar, sport va fikrlar. Bolalar ro'yxatdan tanlaydi, katta maydonga yozadi. Smena ro'yxatida hozir uchta oy turibdi. Bolalar kirmasidan oldin «Saqlash»ni bosamiz.",
    'Привет! Я сделал сайт летнего лагеря. В нём страницы смены, вопросов, спорта и отзывов. На каждой анкета: выбираешь из списка и пишешь в большое поле. Смотри, на странице смены три месяца. Осталось сохранить сайт. Нажми «Сохранить».',
    'Hi! I made a website for a summer camp. It has pages for the shift, questions, sport and reviews. Each has a form: you pick from a list and write in a big field. Look, the shift page has three months. Now I just need to save the site. Tap “Save”.'),
  done: L3("Lager boshlanishiga ulgurib tuzatamiz! Anketani uchta teg qaytaradi: select, option va textarea. Qaysi qator buzilganini birga topamiz, kodni esa o'zingiz yozasiz.",
    'На прошлом уроке мы познакомились со списком и большим полем: select, option и textarea. Теперь с этими знаниями починим четыре анкеты по одной. Код пишешь ты, а я рядом.',
    'Last lesson we met the list and the big field: select, option and textarea. Now let’s use that to fix four forms one by one. You write the code, and I’ll be right here.')
});

Object.assign(C, {
  t2: {
    eyebrow: L3("Savollar", 'Вопросы', 'Questions'),
    say: L3("Smena tuzaldi, endi savollar sahifasi! Bolalar bu yerga uzun-uzun savollar yozadi, maydon esa bitta qatorli, savol sig'may qolyapti. Bitta qatorga input yetadi, uzun gap uchun esa boshqa teg kerak. Qaysi teg katta maydon yasaydi? Input o'rniga shuni qo'ying, placeholder esa o'sha-o'sha qolsin.",
      'Смена готова, теперь вопросы. Ребята пишут сюда длинные вопросы, а поле в одну строку, и вопрос не помещается. Для одной строки хватает input, а для длинного текста нужен другой тег. Какой? Поставь его вместо input, а placeholder оставь прежним.',
      'The shift is done, now questions. Kids write long questions here, but the field is one line, so a question doesn’t fit. input is enough for one line, but long text needs another tag. Which one? Put it instead of input, and keep placeholder as it was.'),
    ask: L3("input o'rniga katta maydon: textarea yopuvchi teg bilan", 'Вместо input — большое поле: textarea с закрывающим тегом', 'Instead of input, a big field: textarea with a closing tag'),
    ok: L3("Mana, maydon kattalashdi! Endi uzun savol ham bemalol sig'adi. Ko'rdingizmi, textarea yopuvchi teg bilan yoziladi.",
      'Вот это да! Поле стало большим, и длинный вопрос поместится. А textarea, как видишь, пишут с закрывающим тегом.',
      'Wow! The field is big now, and a long question fits. And textarea, as you can see, is written with a closing tag.'),
    hints: [
      L3("Katta matn maydoni inglizchada text area bo'ladi. Shu so'zlardan teg nomi qanday tuzilishini o'ylab ko'ring.", 'По-английски большое поле для текста — text area. Подумай, как из этих слов получается имя тега.', 'In English a big field for text is a text area. Think how those words make the tag name.'),
      L3("input yolg'iz turardi, textarea esa ochiladi va yopiladi: yopuvchi teg qatorning oxirida turadi. placeholder esa ochuvchi tegning ichida qoladi.", 'input стоял один, а textarea открывается и закрывается: закрывающий тег в конце строки. А placeholder остаётся внутри открывающего тега.', 'input stood alone, but textarea opens and closes: the closing tag goes at the end of the line. And placeholder stays inside the opening tag.'),
      L3("Mana boshqa maydonning qatori: ochuvchi textarea, ichida placeholder, oxirida yopuvchi teg. Siz ham shunday yozing, placeholder esa o'sha-o'sha qolsin.", 'Вот строка другого поля. Напиши так же, только placeholder оставь прежним.', 'Here’s the line for another field. Write yours the same way, and keep placeholder as it was.')
    ],
    drill: L3("Takliflar sahifasida ham maydon kichkina: uni ham katta qiling", 'На странице предложений поле тоже маленькое: сделай и его большим', 'The ideas page has a small field too: make it big as well')
  },
  e1: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Barakalla! Lager saytining to'rtta sahifasi yana ishlayapti: smena, savollar, sport va fikrlar. Ro'yxatlar to'la, katta maydon ham joyida!",
        'Ура! Четыре страницы лагеря снова работают: смена, вопросы, спорт и отзывы. Списки полные, большое поле на месте!',
        'Hooray! Four pages of the camp site work again: shift, questions, sport and reviews. The lists are full, the big field is in place!') },
      { k: 'select', text: L3("Ro'yxatning o'zini select tegi yasadi. Uni kichkina strelkasidan taniysiz: bossangiz, variantlar ochiladi.",
        'Весь список делает тег select. Его легко узнать по маленькой стрелке: нажми на неё, и варианты раскроются.',
        'The whole list is made by the select tag. You can spot it by the little arrow: tap it, and the choices open.') },
      { k: 'option', text: L3("Har bir variantni option tegi yasadi. Iyul nega yo'qolgan edi? Chunki uning option tegi buzilgan edi. Fikrlar sahifasida ham so'z option tegisiz qolgandi. Demak, option tegisiz so'z ro'yxatga hech qachon tushmaydi.",
        'Каждый вариант делает option. Почему пропал июль? У него был сломан тег option. И на странице отзывов слово осталось без option. Значит, слово без option в список не попадает.',
        'Each choice is made by option. Why did July disappear? Its option tag was broken. And on the reviews page a word was left without option. So a word without option never gets into the list.') },
      { k: 'textarea', text: L3("Uzun gap input tegiga sig'maydi, shuning uchun katta maydonni textarea yasadi. Uni ham yopuvchi teg bilan yozdingiz.",
        'Длинный текст не влезает в input, поэтому большое поле делает textarea. И у него обязательно есть закрывающий тег.',
        'A long text doesn’t fit in input, so the big field is made by textarea. And you wrote it with a closing tag.') },
      { k: null, text: L3("Lekin bitta narsa yetishmayapti: bola ro'yxatdan tanladi, o'zi haqida yozdi, endi anketani nima bilan yuboradi? Buni keyingi darsda hal qilamiz, oxirida esa o'z anketangizni yozasiz!",
        'Но кое-чего не хватает: человек выбрал из списка, написал о себе, а чем отправить анкету? Это решим на следующем уроке, а в конце ты напишешь свою анкету!',
        'But something is still missing: a person picked from the list and wrote about themselves, so what do they send the form with? We’ll sort that out in the next lesson, and at the end you’ll write your own form!') }
    ],
    roles: {
      select: L3("select — ro'yxat", 'select — список', 'select — list'),
      option: L3("option — variant", 'option — вариант', 'option — choice'),
      textarea: L3("textarea — katta maydon", 'textarea — большое поле', 'textarea — big field')
    },
    ask: L3("To'rtta sahifa yonib turibdi! «Amaliyotni tugatish»ni bosing", 'Четыре страницы горят! Нажми «Завершить практику»', 'Four pages are lit! Tap “Finish the practice”')
  }
});
// Т4 — дополнительная задача про слово без option на странице кружков (слово посреди списка).
Object.assign(C.t4, {
  drill: L3("Klublar ro'yxatida ham bitta variant yo'q: buzilgan qatorni toping va tuzating", 'В списке кружков тоже пропал вариант: найди сломанную строку и почини', 'A club is missing from the clubs list too: find the broken line and fix it'),
  foundD: L3("Topdingiz! Bu so'z select ichida turibdi-yu, option tegi yo'q. Uni ochuvchi va yopuvchi option teglari bilan o'rab qo'ying.",
    'Нашлась! Это слово стоит внутри select, но без тега option. Оберни слово тегами option.',
    'Found it! This word is inside select, but without the option tag. Wrap the word in option tags.'),
  whyD: {
    0: L3("Bu yerda sahifa boshlanadi, qator butun. Ro'yxatga qarang: qaysi to'garak ko'rinmayapti?", 'Здесь открывается body, строка в порядке. Посмотри на список: какого кружка нет?', 'body opens here, this line is fine. Look at the list: which club is missing?'),
    1: L3("Sarlavha o'z joyida, qator butun. Ro'yxat ichidagi qatorlarni qidiring.", 'Заголовок h1 открыт и закрыт как надо. Ищи строку внутри списка.', 'The h1 heading opens and closes just right. Look for a line inside the list.'),
    2: L3("Bu yerda anketa boshlanadi, qator butun. Ro'yxat tomonga qarang.", 'Здесь начинается анкета, строка в порядке. Посмотри на список.', 'The form starts here, this line is fine. Look at the list.'),
    3: L3("select shu yerda ochilyapti, qator butun. Variantlarni bittalab o'qing.", 'Здесь открывается список, строка в порядке. Прочитай пункты по очереди.', 'The list opens here, this line is fine. Read the items one by one.'),
    4: L3("Bu variant option ichida turibdi, shuning uchun ro'yxatda bor. option tegisiz so'zni qidiring.", 'Этот пункт внутри option, он в списке есть. Ищи слово без option.', 'This item is inside option, it’s in the list. Look for the word without option.'),
    6: L3("Bu variant option ichida turibdi, shuning uchun ro'yxatda bor. option tegisiz so'zni qidiring.", 'Этот пункт внутри option, он в списке есть. Ищи слово без option.', 'This item is inside option, it’s in the list. Look for the word without option.'),
    7: L3("Ro'yxat shu qatorda yopiladi, qator butun.", 'Здесь закрывается список, строка в порядке.', 'The list closes here, this line is fine.'),
    8: L3("Anketa shu yerda yopiladi, qator butun.", 'Здесь закрывается анкета, строка в порядке.', 'The form closes here, this line is fine.'),
    9: L3("Bu yerda sahifa tugaydi, ayb bu qatorda emas.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Т2 (новое) · input → textarea: строка с полем в одну строку переписывается в большое поле.
// Верно: одна строка textarea с закрывающим тегом, placeholder прежний, type нет.
// ─────────────────────────────────────────────────────────────────────────────
function a7TaSwap(code, ph) {
  const toks = lexA7(code);
  if (!toks.length) return { ok: false, msg: FB.empty };
  const ta = toks.find((t) => t.k === 'open' && t.name === 'textarea');
  if (ta && ta.attrErr && ta.attrErr.why === 'attrTypo' && /^type$/i.test(ta.attrErr.bad)) return { ok: false, msg: FB.taType };
  const r = a7Form(code, { inForm: true });
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  const f = N[0];
  if (!f) return { ok: false, msg: FB.empty };
  if (f.kind === 'input') return { ok: false, msg: FB.swapNeed };
  if (f.kind !== 'textarea') return { ok: false, msg: a7Fb('wrongOpen', { tag: 'textarea', got: f.tag || f.kind }) };
  if (N.length > 1) return { ok: false, msg: a7Fb('extra', { got: '<' + (N[1].tag || N[1].kind) + '>' }) };
  if (a7Norm(f.attrs.placeholder) !== a7Norm(ph)) return { ok: false, msg: fillL(FB.taPh, { want: ph }) };
  return { ok: true };
}
const A7_V2 = { pg: 'savol', ph: 'savol' };
const A7_V2X = { pg: 'taklif', ph: 'taklif' };
function a7SwapView(d) {
  return (st, x) => {
    const pg = x.pick(PG[d.pg]);
    const before = ['<body>', '  <h1>' + pg + '</h1>', '  <form>'];
    const after = ['  </form>', '</body>'];
    return {
      title: pg, url: d.pg + '.html', blocks: a7Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid: <A7Parts parts={[{ code: '<textarea placeholder="…">' }, { code: '</textarea>' }]} />,
      editor: <A7Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const a7InputLine = (ph) => '    <input' + a7At('placeholder', ph) + '>';
const cfgV2 = (pick) => ({
  id: 't2', num: 2, kind: 'swap-textarea', C: C.t2,
  init: () => ({ code: a7InputLine(pick(PH[A7_V2.ph])) }),
  check: (st) => a7TaSwap(st.code, pick(PH[A7_V2.ph])),
  view: a7SwapView(A7_V2),
  sample: (pk) => ['<textarea placeholder="' + pk(PH.about) + '"></textarea>'],
  drill: { init: () => ({ code: a7InputLine(pick(PH[A7_V2X.ph])) }), check: (st) => a7TaSwap(st.code, pick(PH[A7_V2X.ph])), view: a7SwapView(A7_V2X) }
});

// Т3 — прежнее (select с тремя option); решённая страница «Sport» уходит в артефакт части.
const cfgV3 = (pick, store) => {
  const base = cfgT3(pick);
  const was = base.check;
  return Object.assign(base, {
    check: (st) => { const r = was(st); return r.ok ? Object.assign({}, r, { result: { code: st.code } }) : r; },
    onSolved: (r) => {
      const pg = pick(PG[A7_T3.pg]);
      store.set('myCode', '<h1>' + pg + '</h1>\n<form>\n' + String(r.result.code).trim() + '\n</form>');
      store.set('myHead', pg); store.set('myOpts', pick(OPT[A7_T3.opts])); store.set('myBtn', ''); store.set('myTab', pg);
    }
  });
};
// Т4 — прежнее; дополнительная задача — слово без option на странице «Klublar».
const A7_T4D = {
  pg: 'klub', bad: 5, why: 'whyD', found: 'foundD', kind: 'opt',
  lines: (pk) => a7Body(['<h1>' + pk(PG.klub) + '</h1>', '<form>', '  <select>', '    ' + a7Opt(pk(OPT.klub)[0]), '    ' + pk(OPT.klub)[1], '    ' + a7Opt(pk(OPT.klub)[2]), '  </select>', '</form>'])
};
const cfgV4 = (pick) => Object.assign(cfgT4(pick), {
  drill: {
    init: () => ({ at: null, code: '' }),
    check: (st) => (st.at == null ? { ok: false, msg: C.t4.ask } : a7OptLine(st.code, pick(OPT.klub)[1])),
    view: a7FixView(A7_T4D, C.t4)
  }
});

const V2 = ({ p }) => <A7Task p={p} make={cfgV2} />;
const V3 = ({ p }) => <A7Task p={p} make={cfgV3} />;
const V4 = ({ p }) => <A7Task p={p} make={cfgV4} />;

// ─────────────────────────────────────────────────────────────────────────────
// E1 · ВЫВОД ЧАСТИ 1: четыре вкладки горят; страница «Smena» — список месяцев и большое поле (кнопки нет: кнопка —
// часть 2); за речью загораются select, option и textarea; дальше — часть 2.
// ─────────────────────────────────────────────────────────────────────────────
function E1({ p }) {
  const pick = usePick();
  const c = C.e1;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'curious' : i === 0 ? 'celebrate' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA7Tabs(true);
  const pg = pick(PG.smena);
  const code = '<h1>' + pg + '</h1><form><select>' + pick(OPT.oy).slice(0, 2).map((w) => a7Opt(w)).join('') + '</select>' + a7Ta(pick(PH.savol)) + '</form>';
  const lines = a7Body(a7Lines(code, false));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = curK === 'select' ? find(/<select>/) : curK === 'option' ? find(/<option>/) : curK === 'textarea' ? find(/<textarea/) : null;
  const col = { select: '#FA4F28', option: '#7C5CFA', textarea: '#0FA38E' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finishP1} /></>}>
      <Sheet cls="a7-sheet a7-fin">
        <KzAsk text={c.ask} />
        <div className="a7-work">
          <div className="a7-side">
            <A7Browser tabs={tabs} cur={0} title={pg} pageHl={curK === 'textarea'} url="smena.html"><A7Doc blocks={a7Page(code, { open: curK === 'option' || curK === 'select' }).blocks} /></A7Browser>
            <div className="a7-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a7-main">
            <A7Code lines={lines} mark={mark} />
            <div className="kz-roles a7-roles">
              {['select', 'option', 'textarea'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': col[k] }}>
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
