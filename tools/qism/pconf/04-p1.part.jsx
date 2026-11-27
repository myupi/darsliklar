// Практика 4 «Путешествие Коди», ЧАСТЬ 1: a, href и поломки ссылки (tools/qism/build-prac.mjs, 27.11.2026).
// Хук S1 (текст подправлен: четыре страницы), прежние т1 (имя файла в href) и т2 (строка-ссылка на главную), новое т3
// (опечатка в имени файла: ссылка синяя, а нажмёшь — «Fayl topilmadi»; починить имя по списку файлов), прежнее т4
// (найти a без href) и новый вывод E1. Четыре страницы-вкладки: Bosh sahifa, Toshkent, Xiva (она встала вместо Samarqand —
// страница Samarqand достанется заданию части 2), Buxoro; пятая (своя) уехала во вторую часть.

Object.assign(A4_ICO, { castle: <><path d="M4 20V8h3v3h3V8h4v3h3V8h3v12z" /><path d="M10 20v-5h4v5" /></> });
TABS.splice(2, 1, { id: 'xiv', file: 'xiva.html', ico: 'castle', c: '#0FA38E', name: CITY.xiva });
TABS.splice(4);   // карта части 1 — четыре вкладки

Object.assign(UI, {
  finishP1: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  nextPart: L3("Keyingi dars: internetdagi saytlar", 'Следующий урок: сайты в интернете', 'Next lesson: sites on the internet')
});
Object.assign(NOT_SPOKEN_IN, { roles: { a: 1, href: 1, val: 1, nf: 1 } });

// Крючок: пять страниц → четыре.
Object.assign(C.s1, {
  done: L3("Bu ahvolda yo'lga chiqib bo'lmaydi! Ko'p yo'llarni o'zim qayta ulab chiqdim, lekin to'rtta sahifada uzilgan joy qolibdi. Ularni a tegi bilan href atributi ulaydi. Rulga siz o'tirasiz, men esa xaritaga qarab turaman.",
    'На прошлом уроке мы познакомились со ссылками: тег a и атрибут href. Теперь с этими знаниями починим четыре страницы по одной. Код пишешь ты, а я рядом.',
    'Last lesson we met links: the a tag and the href attribute. Now let’s use that to fix the four pages one by one. You write the code, and I’ll be right here.'),
  askDone: L3("To'rtta sahifani tuzatamiz: kodni o'zingiz yozasiz", 'Починим четыре страницы — код пишешь ты', 'Let’s fix four pages — you write the code')
});

// ── Фраза проверки нового задания. ──
Object.assign(FB, {
  typoSame: L3("Qator hali o'sha-o'sha turibdi. Havola ko'k, lekin bossangiz «Fayl topilmadi» chiqadi. Fayl nomini fayllar ro'yxati bilan harfma-harf solishtirib, tuzating.",
    'Строка пока прежняя. Ссылка синяя, но нажмёшь, и «Файл не найден». Сверь имя файла со списком файлов буква в букву и поправь.',
    'The line is still the same. The link is blue, but tap it and you get “File not found”. Compare the file name with the list of files letter by letter and fix it.')
});

// ── Т3 (новое): опечатка в имени файла. ──
C.t3 = {
  eyebrow: L3("Xiva", 'Хива', 'Khiva'),
  say: L3("Toshkentdan bosh sahifaga yo'l ochildi. Endi Xiva sahifasi! Bu yerda Samarqandga havola turibdi, ko'k rangda. Lekin uni bossangiz, «Fayl topilmadi» chiqadi. Demak, havola bor, manzilida esa nimadir chalkashib ketibdi. Fayl nomini fayllar ro'yxati bilan solishtirib, tuzating.",
    'Из Ташкента на главную дорога есть. Теперь страница Хивы. Здесь есть ссылка на Самарканд, она синяя. Но нажмёшь, и появится «Файл не найден». Значит, ссылка есть, а с адресом что-то не так. Сверь имя файла со списком файлов и поправь.',
    'There’s a way from Tashkent back to the home page. Now the Khiva page. It has a link to Samarkand, and it’s blue. But tap it and you get “File not found”. So the link is there, but something is off with the address. Compare the file name with the list of files and fix it.'),
  ask: L3("Fayl nomini tuzating: ro'yxatdagidek yozing", 'Поправь имя файла: пиши как в списке', 'Fix the file name: write it as in the list'),
  ok: L3("Samarqand havolasi ochildi! Ko'rdingizmi, bitta harf butun yo'lni to'sib qo'yishi mumkin ekan. Bosib ko'ring!",
    'Теперь Самарканд открывается! Видишь, одна буква может перекрыть целую дорогу. Нажми!',
    'Samarkand opens now! See, one letter can block a whole road. Tap it!'),
  hints: [
    L3("Havola ko'k turibdi, demak, a tegi bilan href joyida. Lekin bossangiz «Fayl topilmadi» chiqadi, shuning uchun gap fayl nomida. Uni fayllar ro'yxati bilan solishtirib ko'ring.",
      'Ссылка синяя, значит, тег a и href на месте. Но нажмёшь, и «Файл не найден», поэтому дело в имени файла. Сравни его со списком файлов.',
      'The link is blue, so the a tag and href are in place. But tap it and you get “File not found”, so the problem is the file name. Compare it with the list of files.'),
    L3("Ro'yxatda Samarqand sahifasi samarqand.html deb yozilgan. Qatordagi nom bilan harfma-harf solishtiring: qaysi harf boshqacha?",
      'В списке страница Самарканда называется samarqand.html. Сравни с именем в строке буква в букву: какая буква другая?',
      'In the list the Samarkand page is called samarqand.html. Compare it with the name in the line letter by letter: which letter is different?'),
    L3("Mana, ishlaydigan havola: undagi nom ro'yxatdagi nom bilan bir xil. Siz ham samarqand.html deb yozing.",
      'Вот рабочая ссылка: имя в ней такое же, как в списке. Напиши и ты samarqand.html.',
      'Here’s a working link: its name is the same as in the list. Write samarqand.html too.')
  ],
  drill: L3("Endi Buxoroga havola ham ishlamayapti: nomini tuzating", 'Теперь не работает ссылка на Бухару: поправь имя', 'Now the Bukhara link doesn’t work either: fix the name')
};

// Строка с опечаткой — прямо в редакторе; страница честная: ссылка синяя, нажмёшь — «Fayl topilmadi».
const a4TypoStart = (pick, typo, city) => '  <a href="' + typo + '">' + pick(city) + '</a>';
function a4TypoCheck(code, start, want, city) {
  if (a4Squash(code) === a4Squash(start)) return { ok: false, msg: FB.typoSame };
  return a4LineCheck(code, want, city);
}
function a4TypoView() {
  return (st, x) => {
    const pg = SITE['xiva.html'];
    const before = ['<body>', '  <h1>' + x.pick(pg.title) + '</h1>', '  <p>' + x.pick(pg.p) + '</p>'];
    const after = ['</body>'];
    return {
      title: x.pick(pg.title), blocks: a4Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid: <A4Files />,
      editor: <A4Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={before.length}
        onChange={(c) => x.set({ code: c })} />,
      syms: []
    };
  };
}
const cfgZ3 = (pick) => {
  const s1 = a4TypoStart(pick, 'samarkand.html', CITY.samarqand);
  const s2 = a4TypoStart(pick, 'bukhara.html', CITY.buxoro);
  return {
    id: 't3', num: 3, kind: 'fix-file-name', C: C.t3,
    init: () => ({ code: s1 }),
    check: (st) => a4TypoCheck(st.code, s1, 'samarqand.html', pick(CITY.samarqand)),
    view: a4TypoView(),
    sample: (pk) => ['<a href="toshkent.html">' + pk(CITY.toshkent) + '</a>'],
    drill: { init: () => ({ code: s2 }), check: (st) => a4TypoCheck(st.code, s2, 'buxoro.html', pick(CITY.buxoro)), view: a4TypoView() }
  };
};
const Z3 = ({ p }) => <A4Task p={p} make={cfgZ3} />;

// ── Вывод части 1 (новый). ──
Object.assign(C, {
  e1: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Barakalla! Sayohat saytining to'rtta sahifasi yana yonib turibdi: bosh sahifa, Toshkent, Xiva va Buxoro. Hamma yo'llar joyiga tushdi!",
        'Ура! Четыре страницы сайта о путешествии снова горят: главная, Ташкент, Хива и Бухара. Все дороги встали на место!',
        'Hooray! Four pages of the trip site are lit again: home, Tashkent, Khiva and Bukhara. All the roads are back in place!') },
      { k: 'a', text: L3("Havola a tegida yashaydi. Shahar nomini shu tegga o'raganingizda, u ko'k bo'lib, bosiladigan bo'lib qoldi.",
        'Ссылка живёт в теге a. Слово города обернули в него, и оно стало синим и нажимаемым.',
        'The link lives in the a tag. We wrapped the city word in it, and it turned blue and tappable.') },
      { k: 'href', text: L3("Qayoqqa borishni esa href atributi aytib turdi. Uni olib tashlasak, so'z yana oddiy matn bo'lib qoladi, xuddi Buxorodagi Xiva kabi.",
        'А куда идти, подсказывал атрибут href. Уберём его, и слово снова станет простым текстом, как было с Хивой на странице Бухары.',
        'And href told the browser where to go. Take it away and the word becomes plain text again, like Khiva on the Bukhara page.') },
      { k: 'val', text: L3("href ichidagi fayl nomi esa qo'shtirnoq ichida turadi.",
        'Имя файла в href стоит в кавычках.',
        'The file name inside href sits in quotes.') },
      { k: 'nf', text: L3("Fayl nomini harfma-harf yozish kerak: bitta harf adashsa, brauzer «Fayl topilmadi» deydi. Xivadagi Samarqand havolasida shunday bo'lgan edi-ku!",
        'И писать имя файла надо буква в букву: ошибёшься в одной, и браузер скажет «Файл не найден». Так было со ссылкой на Самарканд!',
        'And the file name has to be written letter by letter: get one letter wrong and the browser says “File not found”. That’s what happened with the Samarkand link!') },
      { k: null, text: L3("Lekin hozircha faqat o'z saytimizdagi sahifalarga havola qildik. Boshqa saytga qanday boramiz? Buni keyingi darsda ko'ramiz, oxirida esa o'z sahifangizni yozasiz!",
        'Но пока мы ссылались только на страницы своего сайта. А как попасть на чужой сайт в интернете? Это узнаем на следующем уроке, а в конце ты напишешь свою страницу!',
        'But so far we only linked to pages of our own site. How do you get to someone else’s site on the internet? We’ll find out in the next lesson, and at the end you’ll write your own page!') }
    ],
    roles: {
      a: L3("a — havola", 'a — ссылка', 'a — link'),
      href: L3("href — manzil", 'href — адрес', 'href — address'),
      val: L3("qiymat — fayl nomi", 'значение — имя файла', 'value — file name'),
      nf: L3("Nom harfma-harf", 'Имя буква в букву', 'Name letter by letter')
    },
    ask: L3("To'rtta sahifa yonib turibdi! «Amaliyotni tugatish»ni bosing", 'Четыре страницы горят! Нажми «Завершить практику»', 'Four pages are lit! Tap “Finish the practice”')
  }
});

// Т4 — последнее задание части 1: страница «Buxoro» после починки уходит в артефакт части.
const cfgV4 = (pick, store) => Object.assign(cfgT4(pick), {
  onSolved: () => {
    const pg = SITE['buxoro.html'];
    const heading = pick(pg.title);
    const text = pick(A4_FIX.pre) + ' ' + pick(A4_FIX.word);
    store.set('myCode', ['<h1>' + heading + '</h1>', '<p>' + pick(pg.p) + '</p>',
      '<p>' + pick(A4_FIX.pre) + ' <a href="' + A4_FIX.href + '">' + pick(A4_FIX.word) + '</a></p>'].join('\n'));
    store.set('myHead', heading); store.set('myText', text); store.set('myHref', A4_FIX.href); store.set('myTab', heading);
  }
});
const V4 = ({ p }) => <A4Task p={p} make={cfgV4} />;

// ─────────────────────────────────────────────────────────────────────────────
// E1 · ВЫВОД ЧАСТИ 1: четыре вкладки горят; главная с двумя ссылками (нажимаются); плашки a · href · имя файла ·
// «буква в букву» загораются за речью (на «буква в букву» в окне — «Fayl topilmadi»); дальше — часть 2.
// ─────────────────────────────────────────────────────────────────────────────
function E1({ p }) {
  const pick = usePick();
  const c = C.e1;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'curious' : i === 0 ? 'celebrate' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA4Tabs(true);
  const nav = useA4Nav('index.html', 'e1');
  const typo = curK === 'nf';
  const name = pick(SITE['index.html'].title);
  const hrefOf = (k) => (typo && k === 'samarqand' ? 'samarkand.html' : k + '.html');
  const lines = ['<h1>' + name + '</h1>', '<ul>'].concat(['toshkent', 'samarqand'].map((k) => '  <li><a href="' + hrefOf(k) + '">' + pick(CITY[k]) + '</a></li>'), ['</ul>']);
  const own = { title: name, blocks: a4Page(lines.join('\n')).blocks, url: 'index.html' };
  const nfPage = { title: pick(UI.nf), blocks: a4Page('<h1>' + pick(UI.nf) + '</h1><p>' + pick(UI.nfText) + '</p>').blocks, url: 'samarkand.html', nf: true };
  const shown = typo ? nfPage : a4Shown(nav, own, pick);
  const mark = curK === 'nf' ? 3 : curK === 'a' || curK === 'href' || curK === 'val' ? 2 : null;
  const col = { a: '#0000EE', href: '#7C5CFA', val: '#0FA38E', nf: '#F59E0B' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finishP1} /></>}>
      <Sheet cls="a4-sheet a4-fin">
        <KzAsk text={c.ask} />
        <div className="a4-work">
          <div className="a4-side">
            <A4Browser tabs={tabs} cur={0} title={shown.title} pageHl={curK === 'a' && !nav.away && !typo} url={shown.url} onBack={typo ? null : nav.back} cls={shown.nf ? 'is-nf' : ''}>
              <A4Doc blocks={shown.blocks} onNav={nav.go} />
            </A4Browser>
            <div className="a4-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a4-main">
            <A4Code lines={lines} mark={mark} />
            <div className="kz-roles a4-roles">
              {['a', 'href', 'val', 'nf'].map((k) => (
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
