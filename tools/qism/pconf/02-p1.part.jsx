// Практика 2 «Газета Коди», ЧАСТЬ 1: h1–h6 и абзац p (tools/qism/build-prac.mjs, 27.11.2026).
// Хук S1 (прежний, текст про «четыре страницы»), три прежних задания (т1 слова в h1, т2 строка h2, т3 два абзаца p),
// новое т4 «найди заголовок не того уровня» (главный заголовок записан как h6 — получился мелким; нажать строку и
// исправить на h1; решённая страница уходит в артефакт части) и новый вывод E1. Четыре страницы-вкладки: Maktab gazetasi,
// Sport, Hayvonlar и новая Maktab oshxonasi; пятая (погода) и своя статья уехали во вторую часть.

// ── Карта части 1: четыре вкладки. Погода и «Моя статья» (TABS[3], TABS[4]) уходят, их место — столовая. ──
Object.assign(A2_ICO, {
  food: <><path d="M6 3v6a2 2 0 0 0 4 0V3" /><path d="M8 3v18" /><path d="M17 21V3c-2.2 1.2-3.5 3.8-3.5 7H17" /></>
});
TABS.splice(3, 2,
  { id: 'canteen', ico: 'food', c: '#F59E0B', name: L3("Maktab oshxonasi", 'Школьная столовая', 'School canteen'),
    h2: L3("Bugungi menyu", 'Меню на сегодня', 'Today’s menu'),
    text: L3("Bugun sho'rva va kompot bor.", 'Сегодня суп и компот.', 'Today there is soup and compote.') }
);
// Содержимое дополнительной задачи, образца и вывода (другое, чем в заданиях).
const XTRA2 = {
  gym: L3("Sport zali", 'Спортзал', 'Sports hall'),
  lib: { h: L3("Maktab kutubxonasi", 'Школьная библиотека', 'School library'), h2: L3("Yangi kitoblar", 'Новые книги', 'New books'),
    text: L3("Bu hafta ko'p kitob keldi.", 'На этой неделе пришло много книг.', 'Lots of books arrived this week.'), lvl: 5 },
  pets: [L3("Mushuklar ko'p uxlaydi.", 'Кошки много спят.', 'Cats sleep a lot.'), L3("Ular baliqni yaxshi ko'radi.", 'Они любят рыбу.', 'They love fish.')]
};

Object.assign(UI, {
  finishP1: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  nextPart: L3("Keyingi dars: b, i va o'z maqolangiz", 'Следующий урок: b, i и своя статья', 'Next lesson: b, i and your own article')
});
Object.assign(NOT_SPOKEN_IN, { roles: { h: 1, h2: 1, p: 1, lvl: 1, bi: 1, own: 1 } });

// ── Фразы проверки нового задания. ──
Object.assign(FB, {
  keepHead: L3("So'zlarga tegmang, sarlavha o'sha-o'sha qolsin. O'zgaradigani faqat teg.", 'Слова пусть остаются прежними. Меняется только тег.', 'Keep the words as they were. Only the tag changes.')
});

// ── Тексты. Звучат: say, broke, done, ok, hints, found, why; печатаются: eyebrow, ask, roles. ──
// Крючок: пять страниц → четыре.
Object.assign(C.s1, {
  say: L3("Maktab gazetamiz chiqishiga yarim soat qoldi, saytni esa bir haftada yasab chiqdim. Bosh sahifa, sport, hayvonlar va oshxona sahifalari tayyor. Faqat nashr qilish qoldi, shundan keyin butun maktab o'qiydi. «Nashr qilish» tugmasini bosing, ko'ramiz!",
    'Привет! Это сайт нашей школьной газеты. В нём четыре страницы: главная, спорт, животные и столовая. Всё готово, осталось только опубликовать сайт. Нажми «Опубликовать».',
    'Hi! This is our school newspaper website. It has four pages: the front page, sport, animals and the canteen. Everything is ready, we just need to publish the site. Tap “Publish”.'),
  done: L3("Yarim soat kam emas, ulguramiz! Darsda sarlavhalar bilan abzaslar matnni qanday tartibga solishini ko'rdik. Endi shu bilimlar bilan to'rtta sahifani bittalab tuzatamiz. Kodni o'zingiz yozasiz, men esa yoningizda turaman.",
    'На уроке мы увидели, как заголовки и абзацы наводят порядок в тексте. Теперь с этими знаниями починим четыре страницы по одной. Код пишешь ты, а я рядом.',
    'In the lesson we saw how headings and paragraphs put text in order. Now let’s use that to fix the four pages one by one. You write the code, and I’ll be right here.'),
  askDone: L3("To'rtta sahifani tuzatamiz: kodni o'zingiz yozasiz", 'Починим четыре страницы — код пишешь ты', 'Let’s fix four pages — you write the code')
});

// Т4 · Maktab oshxonasi: главный заголовок записан как h6.
C.t4 = {
  eyebrow: L3("Oshxona", 'Столовая', 'Canteen'),
  say: L3("Oxirgi sahifa: maktab oshxonasi. Voy, bunda g'alati narsa bor: sahifaning asosiy sarlavhasi juda mayda chiqibdi, u hatto bo'lim sarlavhasidan ham kichik! Demak, kodda bitta sarlavha boshqa raqam bilan yozilib qolgan. Oldin o'sha qatorni toping-da, ustiga bosing.",
    'Последняя страница: школьная столовая. Здесь странность: главный заголовок страницы получился очень мелким, мельче даже заголовка раздела! Значит, в коде один заголовок записан с другой цифрой. Сначала найди эту строку и нажми на неё.',
    'The last page: the school canteen. Something’s odd here: the main heading of the page came out tiny, smaller even than the section heading! So one heading in the code is written with the wrong number. First find that line and tap it.'),
  ask: L3("Eng mayda sarlavha qatorini bosing", 'Нажми строку мелкого заголовка', 'Tap the line of the tiny heading'),
  ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
  found: L3("Topdingiz! Bu asosiy sarlavha, lekin u h6 bilan yozilgan, h6 eng kichik sarlavha bo'ladi. Asosiy sarlavha h1 bo'lishi kerak. Qatorni tuzating, so'zlar o'sha-o'sha qolsin.",
    'Нашлась! Это главный заголовок, а записан он как h6, самый мелкий. Главному нужен h1. Исправь строку, слова оставь прежними.',
    'Found it! This is the main heading, but it’s written as h6, the smallest one. The main heading needs h1. Fix the line and keep the words.'),
  ok: L3("Mana, tuzaldi! Endi asosiy sarlavha sahifadagi eng katta yozuv. Raqam qancha kichik bo'lsa, sarlavha shuncha katta chiqadi, esingizda bo'lsin!",
    'Ура, заработало! Теперь главный заголовок самый крупный на странице. Чем меньше цифра, тем крупнее заголовок.',
    'Yes, it works! Now the main heading is the biggest thing on the page. The smaller the number, the bigger the heading.'),
  why: {
    0: L3("Bu body qatori, unda hammasi joyida. Sahifaga qarang: qaysi sarlavha juda mayda?", 'Здесь открывается body, строка в порядке. Посмотри на страницу: какой заголовок слишком мелкий?', 'body opens here, this line is fine. Look at the page: which heading is too small?'),
    2: L3("Bu bo'lim sarlavhasi, h2 unga aynan mos-ku. Sahifadagi eng mayda sarlavhani qidiring.", 'Это заголовок раздела, ему h2 как раз подходит. Ищи самый мелкий заголовок.', 'This is a section heading, and h2 suits it just right. Look for the tiniest heading.'),
    3: L3("Abzasning o'zi joyida. Eng mayda sarlavha qaysi qatorda turibdi?", 'Абзац в порядке. В какой строке мелкий заголовок?', 'The paragraph is fine. Which line has the tiny heading?'),
    4: L3("Pastda body yopiladi, bu qator ham butun.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
  },
  hints: [
    L3("Sahifaga qarang: asosiy sarlavha nega mayda chiqdi?", 'Посмотри на страницу: почему главный заголовок вышел мелким?', 'Look at the page: why did the main heading come out tiny?'),
    L3("Esingizdami? Raqam qancha katta bo'lsa, sarlavha shuncha kichik bo'ladi. Qaysi qatorda raqam eng katta?", 'Помнишь? Чем больше цифра, тем мельче заголовок. В какой строке самая большая цифра?', 'Remember? The bigger the number, the smaller the heading. Which line has the biggest number?'),
    L3("Mana to'g'ri yozilgan asosiy sarlavha: h1. Sizniki ham h1 bo'lsin, ochilishida ham, yopilishida ham.", 'Вот правильный главный заголовок: h1. Сделай и ты h1, и при открытии, и при закрытии.', 'Here’s a properly written main heading: h1. Make yours h1 too, both when it opens and when it closes.')
  ],
  drill: L3("Boshqa sahifada ham xuddi shunday: mayda asosiy sarlavhani topib, tuzating", 'Здесь то же самое: найди мелкий главный заголовок и почини', 'Same thing here: find the tiny main heading and fix it')
};

// Вывод части 1: четыре вкладки горят; по ходу речи открыта главная, спорт, животные или столовая; плашки h1 · h2 · p · «цифра больше — заголовок мельче».
C.e1 = {
  eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
  say: [
    { k: 'all', text: L3("Barakalla! Gazetaning to'rtta sahifasi yana yonib turibdi: bosh sahifa, sport, hayvonlar va oshxona. Hammasi joy-joyiga tushdi!",
      'Ура! Четыре страницы газеты снова горят: главная, спорт, животные и столовая. Всё встало на свои места!',
      'Hooray! Four pages of the paper are lit again: the front page, sport, animals and the canteen. Everything is back in place!') },
    { k: 'h', text: L3("Bosh sahifada asosiy sarlavha h1 tegida turdi. h1 eng katta sarlavha bo'ladi, shuning uchun gazetaning nomi aynan unda yozildi.",
      'На главной главный заголовок стоял в h1. h1 самый крупный, поэтому название газеты написано именно им.',
      'On the front page the main heading sat in h1. h1 is the biggest, so the name of the paper was written with it.') },
    { k: 'h2', text: L3("Sport sahifasida bo'lim sarlavhasi h2 bo'ldi. U asosiy sarlavhadan sal kichikroq bo'ladi, lekin oddiy matndan baribir kattaroq.",
      'На странице спорта заголовок раздела стоял в h2. Он мельче главного, но всё равно крупнее обычного текста.',
      'On the sport page the section heading sat in h2. It’s smaller than the main one, but still bigger than plain text.') },
    { k: 'p', text: L3("Hayvonlar sahifasida esa har bir abzas o'z p tegida turdi. Shuning uchun mushuklar haqidagi gaplar bir-biriga yopishmadi.",
      'А на странице про животных каждый абзац стоял в своём p, поэтому фразы про кошек не слиплись.',
      'And on the animals page each paragraph sat in its own p, so the sentences about cats didn’t glue together.') },
    { k: 'lvl', text: L3("Oshxona sahifasida asosiy sarlavha h6 bo'lib qolgan edi, shuning uchun mayda chiqdi. Endi bilasiz: raqam qancha katta bo'lsa, sarlavha shuncha kichik bo'ladi, asosiy sarlavha uchun esa doim h1 kerak.",
      'В столовой главный заголовок был записан как h6, поэтому вышел мелким. Теперь ты знаешь: чем больше цифра, тем мельче заголовок, а главному всегда нужен h1.',
      'In the canteen the main heading was written as h6, so it came out tiny. Now you know: the bigger the number, the smaller the heading, and the main one always needs h1.') },
    { k: null, text: L3("Lekin gazetada hali bir sir qoldi: ba'zi so'zlar qalin, ba'zilari qiya yozilgan. Ularni qaysi teglar qilishini keyingi darsda topamiz, oxirida esa o'z maqolangizni yozasiz!",
      'Но в газете осталась ещё одна загадка: одни слова жирные, а другие наклонные. Какие теги это делают, узнаем на следующем уроке, а в конце напишешь свою статью!',
      'But the paper still has one more mystery: some words are bold and others are slanted. We’ll find out which tags do that in the next lesson, and at the end you’ll write your own article!') }
  ],
  roles: {
    h: L3("h1 — asosiy sarlavha", 'h1 — главный заголовок', 'h1 — main heading'),
    h2: L3("h2 — bo'lim sarlavhasi", 'h2 — заголовок раздела', 'h2 — section heading'),
    p: L3("p — abzas", 'p — абзац', 'p — paragraph'),
    lvl: L3("Raqam katta, sarlavha kichik", 'Цифра больше — заголовок мельче', 'Bigger number, smaller heading')
  },
  ask: L3("To'rtta sahifa yonib turibdi! «Amaliyotni tugatish»ni bosing", 'Четыре страницы горят! Нажми «Завершить практику»', 'Four pages are lit! Tap “Finish the practice”')
};

// ─────────────────────────────────────────────────────────────────────────────
// Т4 · найти строку и исправить: главный заголовок записан как h6 (на странице он мельче заголовка раздела).
// Нажать строку, потом написать её целиком: <h1>слова</h1>, слова не менять. Решённая страница — в артефакт части.
// ─────────────────────────────────────────────────────────────────────────────
const A2_H1_LINE = [{ k: 'open', name: 'h1' }, { k: 'text', name: 'h1', key: 'h' }, { k: 'close', name: 'h1' }];
const A2_LVL_BAD = 1;
function a2LevelView(getD, V) {
  return (st, x) => {
    const D = getD();
    const lines = a2Body(['<h' + D.lvl + '>' + x.pick(D.h) + '</h' + D.lvl + '>', '<h2>' + x.pick(D.h2) + '</h2>', '<p>' + x.pick(D.text) + '</p>']);
    const title = x.pick(D.h);
    const pickLine = (i) => {
      if (i === A2_LVL_BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[A2_LVL_BAD], miss: null });   // с отступом, как в коде страницы
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(V.found, 'point');
        setTimeout(() => { const el = x.inRef.current; if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(V.why[i]);
    };
    if (st.at == null) {
      return {
        title, blocks: a2Page(lines.join('\n')).blocks, pageHl: true, keys: false, ask: V.ask,
        editor: <A2Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? A2_LVL_BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, A2_LVL_BAD);
    const after = lines.slice(A2_LVL_BAD + 1);
    return {
      title, blocks: a2Page(before.concat([st.code], after).join('\n')).blocks, ask: V.ask2,
      editor: <A2Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={A2_LVL_BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a2LevelCheck(st, want, V) {
  if (st.at == null) return { ok: false, msg: V.ask };
  const r = a2Plan(st.code, A2_H1_LINE);
  if (!r.ok) return r;
  if (a2Norm(r.texts.h) !== a2Norm(want)) return { ok: false, msg: FB.keepHead };
  return { ok: true };
}
const cfgV4 = (pick, store) => {
  const T = TABS[3];
  const lib = XTRA2.lib;
  return {
    id: 't4', num: 4, kind: 'find-fix-level', C: C.t4,
    init: () => ({ at: null, code: '' }),
    check: (st) => a2LevelCheck(st, pick(T.name), C.t4),
    view: a2LevelView(() => ({ h: T.name, h2: T.h2, text: T.text, lvl: 6 }), C.t4),
    sample: (pk) => ['<h1>' + pk(XTRA2.gym) + '</h1>'],
    onSolved: () => {
      store.set('myCode', ['<h1>' + pick(T.name) + '</h1>', '<h2>' + pick(T.h2) + '</h2>', '<p>' + pick(T.text) + '</p>'].join('\n'));
      store.set('myHead', pick(T.name)); store.set('myText', pick(T.text)); store.set('myTab', pick(T.name));
    },
    drill: { init: () => ({ at: null, code: '' }), check: (st) => a2LevelCheck(st, pick(lib.h), C.t4), view: a2LevelView(() => lib, C.t4) }
  };
};
const V4 = ({ p }) => <A2Task p={p} make={cfgV4} />;

// ─────────────────────────────────────────────────────────────────────────────
// E1 · ВЫВОД ЧАСТИ 1: четыре вкладки горят; на странице по ходу речи — главная (h1), спорт (h2), животные (p),
// столовая (h6 → h1); плашки h1 · h2 · p · «цифра больше — заголовок мельче» загораются за речью; дальше — часть 2.
// ─────────────────────────────────────────────────────────────────────────────
function E1({ p }) {
  const pick = usePick();
  const c = C.e1;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'curious' : i === 0 ? 'celebrate' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA2Tabs(true);
  const pg = curK === 'h2' ? 1 : curK === 'p' ? 2 : curK === 'lvl' ? 3 : 0;
  const T = TABS[pg];
  const name = pick(T.name);
  const paras = pg === 2 ? XTRA2.pets.map((t) => pick(t)) : [pick(T.text)];
  const code = ['<h1>' + name + '</h1>'].concat(T.h2 ? ['<h2>' + pick(T.h2) + '</h2>'] : [], paras.map((t) => '<p>' + t + '</p>')).join('\n');
  const lines = a2Body(code.split('\n'));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = curK === 'h' || curK === 'lvl' ? find(/<h1>/) : curK === 'h2' ? find(/<h2>/) : curK === 'p' ? find(/<p>/) : null;
  const col = { h: '#FA4F28', h2: '#7C5CFA', p: '#0FA38E', lvl: '#F59E0B' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finishP1} /></>}>
      <Sheet cls="a2-sheet a2-fin">
        <KzAsk text={c.ask} />
        <div className="a2-work">
          <div className="a2-side">
            <A2Browser tabs={tabs} cur={pg} title={name}><A2Doc blocks={a2Page(lines.join('\n')).blocks} flash={pg + 1} /></A2Browser>
            <div className="a2-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a2-main">
            <A2Code lines={lines} mark={mark} />
            <div className="kz-roles a2-roles">
              {['h', 'h2', 'p', 'lvl'].map((k) => (
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
