// Практика 8 «Сайт школы Коди», ЧАСТЬ 1: header, main, footer и nav (tools/qism/build-prac.mjs, 27.11.2026).
// Хук S1 (сохранение стирает имя main; четыре страницы), прежнее т1 (имя тега main), НОВОЕ т2 (написать footer целиком),
// прежнее т2 как т3 (строка nav со ссылкой), прежнее т4 (head вместо header) и новый вывод E1. Четыре страницы-вкладки:
// Bosh sahifa, Jamoa (новая), Yangiliklar, Aloqa; «To'garaklar» и «Mening saytim» уехали во вторую часть.

// ── Карта части 1: четыре страницы (вкладки). ──
Object.assign(A8_ICO, {
  people: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14.2c3 .3 5 2.4 5 5.3" /></>
});
Object.assign(PG, { team: L3("Jamoa", 'Команда', 'Team') });
Object.assign(TXT, {
  teamP: L3("Bizda do'stona jamoa bor.", 'У нас дружная команда.', 'We have a friendly team.'),
  foot2: L3("Kodi maktabi, 2026", 'Школа Коди, 2026', 'Kodi School, 2026'),
  foot3: L3("Galereya, 2026", 'Галерея, 2026', 'Gallery, 2026')
});
TABS.splice(0, TABS.length,
  { id: 'index', file: 'index.html', ico: 'home', c: '#FA4F28', name: PG.index },
  { id: 'team', file: 'jamoa.html', ico: 'people', c: '#0FA38E', name: PG.team },
  { id: 'news', file: 'yangiliklar.html', ico: 'news', c: '#7C5CFA', name: PG.news },
  { id: 'contact', file: 'aloqa.html', ico: 'phone', c: '#F59E0B', name: PG.contact }
);

Object.assign(UI, {
  finishP1: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  nextPart: L3("Keyingi dars: section va o'z saytingiz", 'Следующий урок: section и свой сайт', 'Next lesson: section and your own site')
});

// ── Фразы проверки: в части 1 «section» ещё не знаком, поэтому unknown без него; footWrap — новое задание. ──
Object.assign(FB, {
  unknown: L3("Maktab saytiga bu teg kerak emas: ⁣«{bad}»⁤. Sayt qismlarini header, nav, main va footer teglari yasaydi.",
    'Этот тег на нашем сайте не нужен: ⁣«{bad}»⁤. Части сайта: header, nav, main и footer.',
    'Our site doesn’t need this tag: ⁣“{bad}”⁤. The site parts are header, nav, main and footer.'),
  footWrap: L3("Yozuv bor-u, lekin u hali sayt oxiriga kirmagan. Uni ochuvchi va yopuvchi footer teglarining o'rtasiga qo'ying.",
    'Надпись есть, но она не в части сайта. Напиши её между открывающим и закрывающим footer.',
    'The text is there, but it’s not in a site part. Write it between the opening and closing footer.')
});

// ── Тексты. Звучат: say, broke, done, ok, hints, found, why; печатаются: eyebrow, ask, roles. ──
const OLD_NAV = C.t2;        // прежнее т2 (строка nav) становится т3
const FIN_OLD = C.fin;       // подписи плашек частей — прежние
Object.assign(C.s1, {
  say: L3("Maktabimizda yangi yordamchi paydo bo'ldi: Inspektor! U sayt qismlarini topadi va faqat to'g'ri yozilgan qismga rangli ramka chizadi. Maktab saytimizda bosh sahifa, jamoa, yangiliklar va aloqa bor, har birida uch qism: sayt boshi, asosiy qism va sayt oxiri. Direktor saytni ko'rmoqchi ekan, mana «Saqlash» tugmasi: bosing, nusxa unga ketadi.",
    'Привет! Я сделал сайт нашей школы: главная, команда, новости и контакты. Каждую страницу я разложил на части: верх, главная часть и низ. Смотри, Инспектор показывает их цветными рамками. Осталось сохранить сайт. Нажми «Сохранить».',
    'Hi! I made a website for our school: home, team, news and contacts. I split each page into parts: the top, the main part and the bottom. Look, the Inspector shows them with colored frames. Now I just need to save the site. Tap “Save”.'),
  done: L3("Direktorga bunday saytni ko'rsatib bo'lmaydi! Lekin Inspektor bizga yordam beradi: nima buzilganini sahifadan emas, ramkalardan topamiz. Ramkasiz qolgan qism buzilgan qism. To'rtta sahifani bittalab tuzatamiz, kodni esa o'zingiz yozasiz.",
    'На уроке мы познакомились с частями сайта: header, nav, main и footer. Вид страницы они не меняют, зато наводят порядок в коде. Теперь починим четыре страницы по одной. Код пишешь ты, а я рядом.',
    'In the lesson we met the site parts: header, nav, main and footer. They don’t change how the page looks, but they keep the code tidy. Now let’s fix four pages one by one. You write the code, and I’ll be right here.')
});

// Т1: подсказка второй ступени без «section» (его в части 1 ещё не учили).
C.t1.hints = [C.t1.hints[0],
  L3("Sahifaning o'rtasini, eng muhim qismini main tegi o'rab turadi. Sahifada main faqat bitta bo'ladi.",
    'Середину страницы, самое важное на ней, оборачивает main. Он на странице один.',
    'The middle of the page, the most important part, is wrapped by main. A page has just one.'),
  C.t1.hints[2]];

// Т2 (новое): написать footer целиком.
C.t2 = {
  eyebrow: L3("Jamoa", 'Команда', 'Team'),
  say: L3("Bosh sahifa tayyor! Endi jamoa sahifasi. Sayt boshi ham, asosiy qism ham joyida turibdi, lekin pastda sayt oxiri o'chib ketibdi, shuning uchun pastki ramkani Inspektor ko'rmayapti. Sayt oxirini footer tegi yasaydi. Uni o'zingiz yozing: oldin ochuvchi footer, ichida yozuv, keyin yopuvchi footer.",
    'Главная готова! Теперь страница команды. Верх и главная часть на месте, а низ сайта стёрся, поэтому нижнюю рамку Инспектор не видит. Низ сайта делает тег footer. Напиши его сам: открывающий footer, внутри надпись, потом закрывающий footer.',
    'Home is done! Now the team page. The top and the main part are in place, but the bottom of the site got erased, so the Inspector can’t see the bottom frame. The bottom of the site is made by the footer tag. Write it yourself: the opening footer, the text inside, then the closing footer.'),
  ask: L3("footer qatori: ichida «Kodi maktabi, 2026»", 'Строка footer: внутри «Школа Коди, 2026»', 'footer line: “Kodi School, 2026” inside'),
  ok: L3("Pastki ramka qaytdi! Inspektor sayt oxirini yana topdi.",
    'Класс! Нижняя рамка вернулась, и Инспектор снова видит низ сайта!',
    'Nice! The bottom frame is back, and the Inspector sees the bottom of the site again!'),
  hints: [
    L3("Sahifaning pastiga qarang-chi: u yerda ramka yo'q. Tepada sayt boshi bor, o'rtada asosiy qism. Pastni qaysi qism yasaydi?",
      'Посмотри на низ страницы: рамки там нет. Наверху верх сайта, посередине главная часть. Какая часть делает низ?',
      'Look at the bottom of the page: there’s no frame there. The top of the site is above, the main part is in the middle. Which part makes the bottom?'),
    L3("Sayt oxirini footer tegi yasaydi. Yozuvni ochuvchi footer bilan yopuvchi footer tegining o'rtasiga qo'ying.",
      'Низ сайта делает тег footer. Надпись пиши между открывающим и закрывающим footer.',
      'The bottom of the site is the footer tag. Write the text between the opening and closing footer.'),
    L3("Mana, boshqa sahifaning sayt oxiri shunday yoziladi. Siz ham shunday yozing, faqat yozuv boshqa.",
      'Вот так пишут низ сайта на другой странице. Напиши так же, только надпись другая.',
      'Here’s how the bottom of a site is written on another page. Write yours the same way, with a different text.')
  ],
  drill: L3("Endi galereya: footer qatori, ichida «Galereya, 2026»", 'Теперь галерея: строка footer, внутри «Галерея, 2026»', 'Now the gallery: a footer line with “Gallery, 2026” inside')
};

// Т3 (бывшее т2): строка nav со ссылкой — два готовых листа впереди.
C.t3 = Object.assign({}, OLD_NAV, {
  say: L3("Ikki sahifa tayyor! " + OLD_NAV.say.uz,
    OLD_NAV.say.ru.replace('Главная готова, теперь новости.', 'Главная и команда готовы, теперь новости.'),
    OLD_NAV.say.en.replace('Home is done, now news.', 'Home and team are done, now news.'))
});

// Вывод части 1: четыре вкладки горят; по ходу речи подсвечивается строка части в коде.
Object.assign(C, {
  e1: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Barakalla! Maktab saytining to'rtta sahifasi yana yonib turibdi: bosh sahifa, jamoa, yangiliklar va aloqa. Inspektor hamma qismni topdi!",
        'Ура! Четыре страницы школьного сайта снова горят: главная, команда, новости и контакты. Инспектор нашёл все части!',
        'Hooray! Four pages of the school site are lit again: home, team, news and contacts. The Inspector found every part!') },
      { k: 'header', text: L3("Eng tepada header turibdi: u sayt boshini o'rab turadi. Esingizdami, aloqa sahifasida uni head deb yozib qo'ygan edik? Ikkalasining nomi o'xshash, lekin head ko'rinmas ma'lumotlar uchun kerak.",
        'Наверху header: он оборачивает верх сайта. Помнишь, на странице контактов я написал вместо него head? Названия похожи, но head нужен для невидимых сведений.',
        'At the top is header: it wraps the top of the site. Remember, on the contacts page I wrote head instead of it? The names are alike, but head is for invisible details.') },
      { k: 'nav', text: L3("header ichida nav yashaydi: u menyuni o'rab oladi, menyuning ichida esa havola turadi. Yangiliklar sahifasiga aynan shu menyuni qaytardik.",
        'Внутри header живёт nav: он оборачивает меню, а в меню лежит ссылка. На страницу новостей мы вернули именно такое меню.',
        'Inside header lives nav: it wraps the menu, and the menu holds a link. That’s exactly the menu we brought back to the news page.') },
      { k: 'main', text: L3("O'rtada main turibdi: u sahifaning eng muhim qismini o'rab oladi. Esingizdami, sahifada main faqat bitta bo'ladi.",
        'Посередине main: он оборачивает самое важное на странице. Помнишь, main на странице бывает только один.',
        'In the middle is main: it wraps the most important part of the page. Remember, a page has only one main.') },
      { k: 'footer', text: L3("Eng pastda footer: bu sayt oxiri. Jamoa sahifasida uni o'zingiz yozdingiz, yozuvni footer ichiga solib.",
        'Внизу footer: это низ сайта. На странице команды надпись легла внутрь footer — это твоя работа.',
        'At the bottom is footer: the bottom of the site. On the team page you wrote it yourself, putting the text inside footer.') },
      { k: null, text: L3("Lekin bitta savol qoldi: main ichida mavzular ko'payib ketsa, ularni qanday ajratamiz? Buni keyingi darsda bilib olamiz, oxirida esa o'z saytingizni yig'asiz!",
        'Но остался вопрос: если тем внутри main станет много, как их разделить? Узнаем на следующем уроке, а в конце ты соберёшь свой сайт!',
        'But one question is left: if there get to be many topics inside main, how do we separate them? We’ll find out in the next lesson, and at the end you’ll build your own site!') }
    ],
    roles: { header: FIN_OLD.roles.header, nav: FIN_OLD.roles.nav, main: FIN_OLD.roles.main, footer: FIN_OLD.roles.footer },
    ask: L3("To'rtta sahifa yonib turibdi! «Amaliyotni tugatish»ni bosing", 'Четыре страницы горят! Нажми «Завершить практику»', 'Four pages are lit! Tap “Finish the practice”')
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Т2 (новое) · написать footer целиком. Страница «Jamoa»: header с h1 и main с абзацем на месте, низа нет — строка
// в редакторе пуста. Нужно <footer>надпись</footer>. Одна строка, Enter проверяет.
// ─────────────────────────────────────────────────────────────────────────────
function a8FootCheck(code, want) {
  const tk = lexA8(code);
  // head вместо footer — не путаница урока «head ≠ header», а просто не та часть.
  if (tk.some((t) => (t.k === 'open' || t.k === 'close') && t.name === 'head')) return { ok: false, msg: fillL(FB.partOther, { want: 'footer', role: ROLE.footer }) };
  const r = a8Struct(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  const f = N[0];
  if (f.kind !== 'part') return { ok: false, msg: FB.footWrap };
  if (f.tag !== 'footer') return { ok: false, msg: fillL(FB.partOther, { want: 'footer', role: ROLE.footer }) };
  if (!f.kids.length) return { ok: false, msg: a8Fb('needText', { tag: 'footer' }) };
  if (f.kids.some((k) => k.kind !== 'text') || a8Norm(a8Text(f.kids)) !== a8Norm(want)) return { ok: false, msg: FB.keepLine };
  if (N.length > 1) return { ok: false, msg: a8Fb('extra', { got: N[1].tag ? '<' + N[1].tag + '>' : N[1].v }) };
  return { ok: true };
}
const A8_N1 = { pg: 'team', file: 'jamoa.html', p: 'teamP', foot: 'foot2' };
const A8_N1X = { pg: 'gallery', file: 'galereya.html', p: 'soon', foot: 'foot3' };
function a8FootView(d) {
  return (st, x) => {
    const pg = x.pick(PG[d.pg]);
    const before = ['<body>', '  ' + a8Wrap('header', a8Wrap('h1', pg)), '  ' + a8Wrap('main', a8Wrap('p', x.pick(TXT[d.p])))];
    const after = ['</body>'];
    return {
      title: pg, url: d.file, tree: a8Page(before.concat([st.code], after).join('\n')), pageHl: true,
      aid: <A8Parts parts={[{ code: '<footer>' }, { word: L3("yozuv", 'надпись', 'text') }, { code: '</footer>' }]} />,
      editor: <A8Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgW2 = (pick) => ({
  id: 't2', num: 2, cls: 't2', kind: 'write-footer', C: C.t2,
  init: () => ({ code: '    ' }),
  check: (st) => a8FootCheck(st.code, pick(TXT[A8_N1.foot])),
  view: a8FootView(A8_N1),
  sample: (pk) => [a8Wrap('footer', pk(FOOT))],
  drill: { init: () => ({ code: '    ' }), check: (st) => a8FootCheck(st.code, pick(TXT[A8_N1X.foot])), view: a8FootView(A8_N1X) }
});

// Т3 · строка nav со ссылкой — прежнее задание 2 (номер 3, лист кода как у т2).
const cfgW3 = (pick) => Object.assign(cfgT2(pick), { id: 't3', num: 3, cls: 't2', C: C.t3 });

// Т4 · найти head вместо header — прежнее задание 4; последнее задание части 1: починенная страница «Aloqa» уходит в артефакт.
const cfgW4 = (pick, store) => Object.assign(cfgT4(pick), {
  onSolved: () => {
    const name = pick(PG.contact);
    const foot = pick(FOOT);
    store.set('myCode', a8Wrap('header', a8Wrap('h1', name)) + a8Wrap('main', a8Wrap('p', pick(TXT.phone))) + a8Wrap('footer', foot));
    store.set('myHead', name); store.set('mySecs', []); store.set('myFoot', foot); store.set('myTab', name);
  }
});

const W2 = ({ p }) => <A8Task p={p} make={cfgW2} />;
const W3 = ({ p }) => <A8Task p={p} make={cfgW3} />;
const W4 = ({ p }) => <A8Task p={p} make={cfgW4} />;

// ─────────────────────────────────────────────────────────────────────────────
// E1 · ВЫВОД ЧАСТИ 1: четыре вкладки горят; страница школы с header (h1, nav), main и footer; за речью загорается
// строка части в коде и плашка роли; дальше — часть 2 (section).
// ─────────────────────────────────────────────────────────────────────────────
function E1({ p }) {
  const pick = usePick();
  const c = C.e1;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'curious' : i === 0 ? 'celebrate' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA8Tabs(true);
  const code = a8Wrap('header', a8Wrap('h1', pick(SCHOOL)) + a8Wrap('nav', a8Link('index.html', pick(PG.index))))
    + a8Wrap('main', a8Wrap('p', pick(TXT.welcomeP))) + a8Wrap('footer', pick(FOOT));
  const lines = a8Body(a8Lines(code, false));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = A8_PART[curK] ? find(new RegExp('<' + curK + '>')) : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finishP1} /></>}>
      <Sheet cls="a8-sheet a8-fin a8-e1">
        <KzAsk text={c.ask} />
        <div className="a8-work">
          <div className="a8-side">
            <A8Browser tabs={tabs} cur={0} title={pick(PG.index)} url="index.html"><A8Doc tree={a8Page(code)} /></A8Browser>
            <div className="a8-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a8-main">
            <A8Code lines={lines} mark={mark} />
            <div className="kz-roles a8-roles">
              {['header', 'nav', 'main', 'footer'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': PART_C[k] }}>
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
