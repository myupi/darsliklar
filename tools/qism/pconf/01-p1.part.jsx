// Практика 1 «Кодина вкладки», ЧАСТЬ 1: тег, head и title (tools/qism/build-prac.mjs, 27.11.2026).
// Хук S1 (сбой гасит четыре вкладки), два прежних задания (т1 слово между тегами title, т2 строка title целиком),
// два новых по темам части 1 урока (т3 написать head вокруг готовой строки title — блок, т4 найти и исправить
// опечатку «titel» в открывающем теге) и новый вывод E1. Четыре страницы-вкладки: Musiqa, O'yinlar — прежние,
// Oshxona и Sayohat — новые. Прежние т3 (body), т4 (незакрытый title) и т5 (своя страница) уехали в часть 2:
// им нужен body и «вкладка съела страницу» — это темы части 2 урока (экран S14).

Object.assign(A1_ICO, {
  pot: <><path d="M4 11h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" /><path d="M2 11h20M9 3c-1 1.5 1 2.5 0 4M15 3c-1 1.5 1 2.5 0 4" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>
});
// Карта части 1 — четыре вкладки: две прежние и две новые.
TABS.splice(0, TABS.length, TABS[0], TABS[1],
  { id: 'kitchen', ico: 'pot', c: '#F59E0B', name: L3("Oshxona", 'Кухня', 'Kitchen'), text: L3("Bugun palov pishiramiz", 'Сегодня готовим плов', 'Today we cook pilaf') },
  { id: 'trips', ico: 'pin', c: '#0FA38E', name: L3("Sayohat", 'Поездки', 'Trips'), text: L3("Yozgi ta'til", 'Летний отдых', 'Summer break') }
);

Object.assign(UI, {
  finishP1: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  nextPart: L3("Keyingi dars: body va sahifa tartibi", 'Следующий урок: body и порядок документа', 'Next lesson: body and page order')
});
Object.assign(NOT_SPOKEN_IN, { roles: { tag: 1, head: 1, title: 1, exact: 1 } });

// ── Крючок: пять страниц → четыре. ──
Object.assign(C.s1, {
  say: L3("Brauzerimda nechta varaq ochiq turibdi, sanab ko'ring-chi: to'rtta! Musiqa, o'yinlar, oshxona va sayohat sahifalari. Kecha ularni yangilamoqchi bo'lgandim, kompyuterim qotib qoldi. Keling, nima bo'lganini birga ko'ramiz: «Yangilash» tugmasini bosing.",
    'Привет! Это мой браузер. Здесь открыты четыре моих любимых страницы: музыка, игры, кухня и поездки. Вчера я хотел их обновить, но что-то случилось. Давай посмотрим вместе. Нажми «Обновить».',
    'Hi! This is my browser. Four of my favourite pages are open here: music, games, kitchen and trips. Yesterday I tried to refresh them, but something happened. Let’s look together. Tap “Refresh”.'),
  done: L3("Darsda tegni, head va title qismlarini o'rgandik. Endi shu bilimlar bilan to'rtta varaqni bittalab tuzatamiz. Bu safar kodni o'zingiz yozasiz, men esa yoningizdaman.",
    'На уроке мы узнали, что такое тег, head и title. Теперь с этими знаниями починим четыре вкладки по одной. В этот раз код пишешь ты, а я рядом.',
    'In the lesson we learned what a tag, head and title are. Now let’s use that to fix the four tabs one by one. This time you write the code, and I’ll be right here.'),
  askDone: L3("To'rtta varaqni tuzatamiz: kodni o'zingiz yozasiz", 'Починим четыре вкладки — код пишешь ты', 'Let’s fix four tabs — you write the code')
});

// ── Т3 · Oshxona: написать head вокруг готовой строки title (блок). ──
Object.assign(C, {
  t3: {
    eyebrow: L3("Oshxona", 'Кухня', 'Kitchen'),
    say: L3("Ikkita varaq yondi! Uchinchisi: oshxona. Voy, bu yerda sahifaning nomi yolg'iz qolibdi: title bor, lekin uni o'rab turadigan head yo'q. Esingizdami, title head ichida yashaydi? Nomning tepasiga ochuvchi head tegini, pastiga esa yopuvchi head tegini yozing, o'rtadagi qatorga esa tegmang.",
      'Две вкладки горят! Третья: кухня. Тут название страницы осталось одно: title есть, а head вокруг нет. Помнишь, title живёт внутри head? Напиши открывающий head над названием и закрывающий под ним, а среднюю строку не трогай.',
      'Two tabs are lit! The third is the kitchen. Here the page name is all alone: there’s a title, but no head around it. Remember, title lives inside head? Write the opening head above the name and the closing head below it, and leave the middle line alone.'),
    ask: L3("title qatorini head ichiga soling", 'Помести строку title внутрь head', 'Put the title line inside head'),
    ok: L3("Nom o'z uyiga kirdi: endi u head ichida turibdi! Oshxona varag'i yonib ketdi.",
      'Название зашло в свой дом: теперь оно внутри head! Вкладка «Кухня» загорелась.',
      'The name moved into its home: it’s inside head now! The “Kitchen” tab lit up.'),
    hints: [
      L3("Sahifaning nomi title tegida turadi. Mana shu title qaysi tegning ichida yashaydi? Qatorning tepasida nima turishi kerak, esingizdami?", 'Название лежит в title. А в каком теге живёт сам title? Вспомни, что должно стоять над ним.', 'The name sits in title. And which tag does title live inside? Remember what should stand above it.'),
      L3("title qatorining tepasiga ochuvchi head tegini, pastiga esa yopuvchi head tegini yozing. Yopuvchi tegda qiya chiziq bo'ladi.", 'Над строкой title напиши открывающий тег head, а под ней закрывающий. В закрывающем есть косая черта.', 'Write the opening head tag above the title line and the closing head tag below it. The closing one has a slash.'),
      L3("Mana sport sahifasi: title head ichida turibdi. Siz ham shunday qiling, nomi esa «Oshxona» bo'lib qolsin.", 'Вот страница про спорт: title стоит внутри head. Сделай так же, только название пусть остаётся «Кухня».', 'Here’s a sport page: title sits inside head. Do the same, and keep the name “Kitchen”.')
    ],
    drill: L3("Endi xuddi shunday: «Kitoblar» sahifasi", 'Теперь так же: страница «Книги»', 'Now the same thing: the “Books” page')
  },
  // ── Т4 · Sayohat: найти и исправить опечатку в открывающем теге title. ──
  t4: {
    eyebrow: L3("Sayohat", 'Поездки', 'Trips'),
    say: L3("Uchta varaq tayyor! To'rtinchisi: sayohat. Qarang, g'alati ish: sahifaning nomi oynaga chiqib ketibdi, varaqda esa faqat «index.html» turibdi. Brauzer nomni tanimayotganga o'xshaydi. Sizningcha, kodda qaysi qator aybdor? Uni topib, ustiga bosing.",
      'Три вкладки готовы! Четвёртая: поездки. Смотри, странно: название страницы попало в окно, а на вкладке только «index.html». Похоже, браузер не узнаёт название. Как думаешь, какая строка виновата? Найди её и нажми.',
      'Three tabs are done! The fourth is trips. Look, something’s odd: the page name ended up in the window, and the tab only says “index.html”. The browser doesn’t seem to recognise the name. Which line do you think is to blame? Find it and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Topdingiz! Ochuvchi tegda harflar adashib ketgan: «titel» deb yozilgan. Brauzer bunday tegni bilmaydi, shuning uchun nom oynaga chiqib qolgan. Qatorni to'g'ri yozing.",
      'Нашлась! В открывающем теге буквы перепутаны: написано «titel». Браузер не знает такого тега, поэтому название ушло в окно. Перепиши строку правильно.',
      'Found it! The letters in the opening tag got mixed up: it says “titel”. The browser doesn’t know that tag, so the name went into the window. Write the line correctly.'),
    ok: L3("Ishladi! Nom varaqqa qaytdi, oynada esa faqat matn qoldi. Bitta harf shuncha ish qilar ekan-a! Endi sayohat rejasini tuzaman.",
      'Заработало! Название вернулось на вкладку, а в окне остался только текст. Одна буква, а сколько бед! Пора планировать поездку.',
      'It works! The name is back on the tab, and only the text is left in the window. One letter, and so much trouble! Time to plan the trip.'),
    why: {
      0: L3("Bu doctype qatori, u doim eng tepada turadi va butun. Aybni nom yozilgan qatordan qidiring.", 'Это особая первая строка, она в порядке. Ищи там, где записано название.', 'That’s the special first line, it’s fine. Look where the name is written.'),
      1: L3("html tegi shu yerda ochiladi, eng pastda yopiladi. Bu qator butun.", 'html открывается здесь и закрывается в самом конце. Эта строка в порядке.', 'html opens here and closes at the very end. This line is fine.'),
      2: L3("head o'z joyida: shu yerda ochilib, pastroqda yopiladi.", 'head открывается здесь и закрывается ниже. Эта строка в порядке.', 'head opens here and closes further down. This line is fine.'),
      4: L3("Bu yopuvchi head tegi, o'zi joyida. Nom yozilgan qatorni qidiring.", 'Это закрывающий тег head, он на месте. Ищи строку с названием.', 'That’s the closing head tag, it’s in place. Look for the line with the name.'),
      5: L3("body to'g'ri ochilgan, qator butun. Nom yozilgan qatorga qarang.", 'body открыт как надо. Посмотри на строку с названием.', 'body opens just fine. Look at the line with the name.'),
      6: L3("Bu oynadagi matn, u o'z joyida. Nom esa boshqa qatorda yashaydi.", 'Это текст для окна, он на месте. А название живёт в другой строке.', 'That’s the window text, it’s in place. The name lives on a different line.'),
      7: L3("Bu yerda body yopiladi, qator butun.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.'),
      8: L3("Eng oxirgi qator: html shu yerda tugaydi. Bunisi ham butun.", 'html закрывается здесь, эта строка в порядке.', 'html closes here, this line is fine.')
    },
    hints: [
      L3("Varaqqa va oynaga qarang: nom oynada, varaq esa bo'sh. Nom qaysi tegning ichida turishi kerak? Brauzer o'sha tegni nimaga tanimayapti?", 'Посмотри на вкладку и окно: название в окне, а вкладка пустая. В каком теге должно стоять название? Почему браузер его не узнаёт?', 'Look at the tab and the window: the name is in the window and the tab is empty. Which tag should hold the name? Why doesn’t the browser recognise it?'),
      L3("Nom yozilgan qatorni diqqat bilan o'qing: ochuvchi tegni yopuvchi teg bilan solishtirib ko'ring. Harflari bir xilmi?", 'Прочитай строку с названием внимательно: сравни открывающий тег с закрывающим. Буквы одинаковые?', 'Read the line with the name carefully: compare the opening tag with the closing one. Are the letters the same?'),
      L3("Mana to'g'ri qator: ikkala tegda ham aynan bir xil so'z turibdi. Sizniki ham shunday bo'lsin.", 'Вот правильная строка: в обоих тегах стоит одно и то же слово. Пусть и у тебя будет так.', 'Here’s a proper line: both tags have exactly the same word. Make yours the same.')
    ],
    drill: L3("Yana bitta varaqda ham harflar adashgan: topib, tuzating", 'Здесь тоже перепутаны буквы: найди строку и почини', 'Letters are mixed up here too: find the line and fix it')
  },
  // ── Вывод части 1. ──
  e1: {
    eyebrow: L3("Xulosa", 'Итог', 'Summary'),
    ask: L3("To'rtta varaq yonib turibdi! «Amaliyotni tugatish»ni bosing", 'Четыре вкладки горят! Нажми «Завершить практику»', 'Four tabs are lit! Tap “Finish the practice”'),
    say: [
      { k: null, text: L3("Barakalla! To'rtta varaqning hammasi yonib turibdi: musiqa, o'yinlar, oshxona va sayohat. Brauzerim yana ishlayapti!",
        'Ура! Все четыре вкладки снова горят: музыка, игры, кухня и поездки. Мой браузер опять работает!',
        'Hooray! All four tabs are lit again: music, games, kitchen and trips. My browser works again!') },
      { k: 'tag', text: L3("Esingizdami? Teg burchakli qavs ichidagi so'z. Brauzer uni ko'rsatmaydi, faqat o'qiydi. Ochuvchi teg boshlaydi, qiya chiziqli yopuvchi teg esa tugatadi.",
        'Помнишь? Тег — это слово в угловых скобках. Браузер его не показывает, а только читает. Открывающий тег начинает, а закрывающий с косой чертой заканчивает.',
        'Remember? A tag is a word in angle brackets. The browser doesn’t show it, it just reads it. The opening tag starts, and the closing one with a slash ends.') },
      { k: 'head', text: L3("head sahifa haqidagi ma'lumotlarni saqlaydi, oynada esa ko'rinmaydi. Oshxona sahifasida title uchun uyni o'zingiz yasadingiz.",
        'head хранит сведения о странице, а в окне его не видно. На странице кухни ты сам построил для title дом.',
        'head keeps information about the page, and you can’t see it in the window. On the kitchen page you built a home for title yourself.') },
      { k: 'title', text: L3("title head ichida yashaydi. Unga sahifaning nomi yoziladi, brauzer esa shu nomni varaqda ko'rsatadi.",
        'title живёт внутри head. В нём пишут название страницы, а браузер показывает его на вкладке.',
        'title lives inside head. It holds the page name, and the browser shows that name on the tab.') },
      { k: 'exact', text: L3("Sayohat sahifasida esa bitta harf adashgan edi. Brauzer teg nomini harfma-harf o'qiydi, shuning uchun «titel» uning uchun begona so'z. Teg nomini aniq yozamiz.",
        'А на странице поездок была перепутана одна буква. Браузер читает название тега буква в букву, поэтому «titel» для него чужое слово. Название тега пишем точно.',
        'And on the trips page one letter was swapped. The browser reads a tag name letter by letter, so “titel” is a stranger to it. We write the tag name exactly.') },
      { k: null, text: L3("Lekin qarang: oynada matn turibdi. Sizningcha, u qaysi tegda yashaydi? Javobni keyingi darsda topamiz, oxirida esa o'z sahifangizni yozasiz!",
        'Но посмотри: в окне стоит текст. Как думаешь, в каком теге он живёт? Ответ найдём на следующем уроке, а в конце ты напишешь свою страницу!',
        'But look: there’s text in the window. Which tag do you think it lives in? We’ll find the answer in the next lesson, and at the end you’ll write your own page!') }
    ],
    roles: {
      tag: L3("Teg — burchakli qavs ichidagi so'z", 'Тег — слово в угловых скобках', 'A tag is a word in angle brackets'),
      head: L3("head — sahifa haqida", 'head — сведения о странице', 'head — info about the page'),
      title: L3("title — varaqdagi nom", 'title — название на вкладке', 'title — the name on the tab'),
      exact: L3("Teg nomi aniq yoziladi", 'Название тега пишут точно', 'Tag names are spelled exactly')
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Т3 · блок head: строка title готова, head вокруг неё — пишет ученик. Строка title внутри редактора, пустые строки
// сверху и снизу — туда пишутся теги. Помощь — схема «html → head → title»: головка загорается, когда head открыт и
// закрыт. Окно браузера не меняется (браузер и без head показывает название): результат видно в схеме и в панели.
// ─────────────────────────────────────────────────────────────────────────────
const A1_HEAD = [{ k: 'open', name: 'head' }].concat(A1_LINE, [{ k: 'close', name: 'head' }]);
function a1HeadCheck(code, want) {
  const r = a1Plan(code, A1_HEAD);
  if (!r.ok) return r;
  if (a1Norm(r.texts.title) !== a1Norm(want)) return { ok: false, msg: fillL(FB.wrongName, { got: r.texts.title, want }) };
  return { ok: true };
}
function A1HeadTree({ done }) {
  const pick = usePick();
  const D = done || {};
  const row = (pre, tag, c, note, ok) => (
    <div className={'a1-tree-r' + (ok ? ' is-ok' : '')}>
      <span className="a1-tree-pre" aria-hidden="true">{pre}</span>
      <code style={{ '--pc': c }}>{tag}</code>
      {note ? <span className="a1-tree-note">— {pick(note)}</span> : null}
      {ok ? <span className="a1-tree-ok"><Icon name="check" size={12} /></span> : null}
    </div>
  );
  return (
    <div className="a1-tree" translate="no">
      {row('', 'html', 'var(--r-html)', UI.given, true)}
      {row('└─ ', 'head', 'var(--r-head)', null, D.head)}
      {row('     └─ ', 'title', 'var(--r-head)', UI.bpTitle, D.title)}
    </div>
  );
}
const a1HeadInit = (name) => '\n    <title>' + name + '</title>\n';
function a1HeadView(pageText) {
  return (st, x) => {
    const before = [A1_DOC, '<html>'];
    const after = ['  <body>', '    ' + x.pick(pageText), '  </body>', '</html>'];
    const pg = a1Page(before.concat([st.code], after).join('\n'));
    const D = a1OwnDone(st.code);
    return {
      title: pg.title, text: pg.text,
      aid: <A1HeadTree done={{ head: D.head, title: D.title }} />,
      editor: <A1Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgV3 = (pick) => {
  const T = TABS[2];
  const want = pick(T.name);
  const books = pick(XTRA.books);
  return {
    id: 't3', num: 3, kind: 'write-head', C: C.t3,
    init: () => ({ code: a1HeadInit(want) }),
    check: (st) => a1HeadCheck(st.code, want),
    view: a1HeadView(T.text),
    sample: (pk) => ['<head>', '  <title>' + pk(XTRA.sport) + '</title>', '</head>'],
    drill: { init: () => ({ code: a1HeadInit(books) }), check: (st) => a1HeadCheck(st.code, books), view: a1HeadView(L3("Eng sevimli kitoblarim", 'Мои любимые книги', 'My favourite books')) }
  };
};
const V3 = ({ p }) => <A1Task p={p} make={cfgV3} />;

// ─────────────────────────────────────────────────────────────────────────────
// Т4 · найти строку и исправить опечатку в открывающем теге: «<titel>» вместо «<title>». Честный браузер: тега
// titel нет — название страницы уходит в окно, на вкладке «index.html». Нажать строку, потом переписать её целиком.
// ─────────────────────────────────────────────────────────────────────────────
function a1TypoView(title, text, C4, badTag) {
  return (st, x) => {
    const want = x.pick(title);
    const lines = a1Full(want, x.pick(text));
    lines[A1_BAD] = '    <' + badTag + '>' + want + '</title>';
    const pickLine = (i) => {
      if (i === A1_BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[A1_BAD], miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(C4.found, 'point');
        setTimeout(() => { const el = x.inRef.current; if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(C4.why[i]);
    };
    if (st.at == null) {
      const pg = a1Page(lines.join('\n'));
      return {
        title: pg.title, text: pg.text, tabHl: true, pageHl: true, keys: false, ask: C4.ask,
        editor: <A1Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? A1_BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, A1_BAD);
    const after = lines.slice(A1_BAD + 1);
    const pg = a1Page(before.concat([st.code], after).join('\n'));
    return {
      title: pg.title, text: pg.text, ask: C4.ask2,
      editor: <A1Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={A1_BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a1TypoCheck(st, want) {
  if (st.at == null) return { ok: false, msg: C.t4.ask };
  const r = a1Plan(st.code, A1_LINE);
  if (!r.ok) return r;
  if (a1Norm(r.texts.title) !== a1Norm(want)) return { ok: false, msg: fillL(FB.wrongName, { got: r.texts.title, want }) };
  return { ok: true };
}
const cfgV4 = (pick, store) => {
  const T = TABS[3];
  const sport = pick(XTRA.sport);
  return {
    id: 't4', num: 4, kind: 'find-fix-typo', C: C.t4,
    init: () => ({ at: null, code: '' }),
    check: (st) => a1TypoCheck(st, pick(T.name)),
    view: a1TypoView(T.name, T.text, C.t4, 'titel'),
    // Починенная страница «Sayohat» — артефакт части.
    onSolved: () => { store.set('myTitle', pick(T.name)); store.set('myText', pick(T.text)); },
    sample: (pk) => ['<title>' + pk(XTRA.books) + '</title>'],
    drill: { init: () => ({ at: null, code: '' }), check: (st) => a1TypoCheck(st, sport), view: a1TypoView(XTRA.sport, XTRA.football, C.t4, 'tilte') }
  };
};
const V4 = ({ p }) => <A1Task p={p} make={cfgV4} />;

// ─────────────────────────────────────────────────────────────────────────────
// E1 · ВЫВОД ЧАСТИ 1: четыре вкладки горят, открыта починенная «Sayohat»; плашки «тег · head · title · точно» загораются
// за речью, код подсвечивает свои строки; дальше — часть 2 (где живёт текст окна).
// ─────────────────────────────────────────────────────────────────────────────
function E1({ p }) {
  const pick = usePick();
  const c = C.e1;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'curious' : i === 0 ? 'celebrate' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA1Tabs(true);
  const T = TABS[3];
  const title = pick(T.name);
  const text = pick(T.text);
  const code = a1Full(title, text);
  const mark = curK === 'head' ? 2 : curK === 'tag' || curK === 'title' || curK === 'exact' ? 3 : null;
  const col = { tag: '#FA4F28', head: '#7C5CFA', title: '#7C5CFA', exact: '#F59E0B' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finishP1} /></>}>
      <Sheet cls="a1-sheet a1-fin">
        <KzAsk text={c.ask} />
        <div className="a1-work">
          <div className="a1-side">
            <A1Browser tabs={tabs} cur={3} title={title} tabHl={curK === 'title'}><A1Page text={text} /></A1Browser>
            <div className="a1-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a1-main">
            <A1Code lines={code} mark={mark} />
            <div className="kz-roles a1-roles">
              {['tag', 'head', 'title', 'exact'].map((k) => (
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
