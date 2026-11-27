// Практика 3 «Праздник Коди», ЧАСТЬ 1: ul, li и ol (tools/qism/build-prac.mjs, 27.11.2026).
// Хук S1, четыре прежних задания (t1 слово в li, t2 строка li, t3 список ol, t4 найти номер, вписанный руками)
// и новый вывод E1. Четыре страницы-вкладки — первые четыре из целой практики: Menyu, Bezaklar, Tort retsepti,
// Tayyorgarlik; пятая (свой список) уехала во вторую часть.

TABS.splice(4);   // карта части 1 — четыре вкладки

Object.assign(UI, {
  finishP1: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  nextPart: L3("Keyingi dars: ul yoki ol?", 'Следующий урок: ul или ol?', 'Next lesson: ul or ol?')
});
Object.assign(NOT_SPOKEN_IN, { roles: { ul: 1, ol: 1, li: 1, own: 1, num: 1 } });

// Крючок: пять страниц → четыре.
Object.assign(C.s1, {
  say: L3("Ertaga tug'ilgan kunim! Mehmonlarga sayt havolasini yubordim: menyu, bezaklar, tort retsepti va tayyorgarlik sahifalari tayyor. Oxirgi qadam qoldi: «Saqlash» tugmasi, bosing-chi, mehmonlar kutmasin.",
    'Привет! Завтра мой день рождения! Я сделал сайт для гостей: меню, украшения, рецепт торта и подготовка. Все списки готовы, осталось только сохранить сайт. Нажми «Сохранить».',
    'Hi! Tomorrow is my birthday! I made a website for the guests: menu, decorations, cake recipe and getting ready. All the lists are ready, I just need to save the site. Tap “Save”.'),
  done: L3("Mehmonlarga nima deymiz? Hech narsa, o'zimiz tuzatamiz! Har bir sahifadan bittadan bo'lak tushib qolgan, ularni ul, ol va li teglari qaytaradi. Qaysi sahifada nima yetishmasligini birga topamiz.",
    'На уроке мы познакомились со списками: теги ul, ol и li. Теперь с этими знаниями починим четыре страницы по одной. Код пишешь ты, а я рядом.',
    'In the lesson we met lists: the ul, ol and li tags. Now let’s use that to fix the four pages one by one. You write the code, and I’ll be right here.'),
  askDone: L3("To'rtta sahifani tuzatamiz — kodni o'zingiz yozasiz", 'Починим четыре страницы — код пишешь ты', 'Let’s fix four pages — you write the code')
});

// Вывод части 1: четыре вкладки горят; по ходу речи страница — меню (ul) или подготовка (ol).
Object.assign(C, {
  e1: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Barakalla! Bayram saytining to'rtta sahifasi yana yonib turibdi: menyu, bezaklar, tort retsepti va tayyorgarlik. Hammasi joy-joyiga tushdi!",
        'Ура! Четыре страницы праздничного сайта снова горят: меню, украшения, рецепт торта и подготовка. Всё встало на свои места!',
        'Hooray! Four pages of the party site are lit again: menu, decorations, cake recipe and getting ready. Everything is back in place!') },
      { k: 'ul', text: L3("Menyu bilan bezaklarda tartib muhim emas edi, shuning uchun ular ul tegida turdi va bandlar oldida nuqtalar chiqdi.",
        'В меню и украшениях порядок не важен, поэтому они стояли в ul, и перед пунктами появились точки.',
        'In the menu and the decorations the order doesn’t matter, so they sat in ul and the items got bullets.') },
      { k: 'ol', text: L3("Tort retsepti bilan tayyorgarlikda esa qadamlar tartib bilan yuradi. Ular ol tegida turdi, raqamlarni esa brauzerning o'zi qo'ydi.",
        'А в рецепте торта и подготовке шаги идут по порядку. Они стояли в ol, а номера поставил сам браузер.',
        'But in the cake recipe and getting ready, the steps go in order. They sat in ol, and the browser added the numbers itself.') },
      { k: 'li', text: L3("Har bir band esa o'z li tegida yashadi. Esingizdami, li doim ul yoki ol ichida turadi?",
        'Каждый пункт жил в своём li. Помнишь, li всегда стоит внутри ul или ol?',
        'Each item lived in its own li. Remember, li always sits inside ul or ol?') },
      { k: 'num', text: L3("Tayyorgarlikdagi g'alati buzilishning sababi ham ma'lum bo'ldi: bitta qadam oldida ikkita raqam chiqqan edi-ku! Bittasini qo'lda yozgan edik, ikkinchisini ol o'zi qo'ydi. Demak, ol ichida raqamlarni qo'lda yozmaymiz.",
        'А вот и причина странной поломки на странице подготовки. У одного шага было два номера: один вписан руками, второй поставил ol. Значит, в ol номера руками не пишут.',
        'And here’s the reason for the odd bug on the getting-ready page. One step had two numbers: one typed by hand, the other added by ol. So you never type numbers by hand in ol.') },
      { k: null, text: L3("Lekin bitta savol qoldi: qachon ul kerak, qachon ol? Buni keyingi darsda hal qilamiz, oxirida esa o'z ro'yxatingizni yozasiz!",
        'Но остался вопрос: когда нужен ul, а когда ol? Решим это на следующем уроке, а в конце ты напишешь свой список!',
        'But one question is left: when do you need ul, and when ol? We’ll sort that out in the next lesson, and at the end you’ll write your own list!') }
    ],
    roles: {
      ul: L3("ul — nuqtali ro'yxat", 'ul — список с точками', 'ul — bulleted list'),
      ol: L3("ol — raqamli ro'yxat", 'ol — список с номерами', 'ol — numbered list'),
      li: L3("li — ro'yxat bandi", 'li — пункт списка', 'li — list item'),
      num: L3("Raqamni brauzer qo'yadi", 'Номера ставит браузер', 'The browser adds numbers')
    },
    ask: L3("To'rtta sahifa yonib turibdi! «Amaliyotni tugatish»ni bosing", 'Четыре страницы горят! Нажми «Завершить практику»', 'Four pages are lit! Tap “Finish the practice”')
  }
});

// Т4 — последнее задание части 1: страница «Tayyorgarlik» после починки уходит в артефакт части.
const cfgV4 = (pick, store) => Object.assign(cfgT4(pick), {
  onSolved: () => {
    const name = pick(TABS[3].name);
    const steps = TABS[3].steps.map((t) => pick(t));
    store.set('myCode', ['<h1>' + name + '</h1>', '<ol>'].concat(steps.map((t) => '<li>' + t + '</li>'), ['</ol>']).join('\n'));
    store.set('myHead', name); store.set('myItems', steps); store.set('myTab', name);
  }
});
const V4 = ({ p }) => <A3Task p={p} make={cfgV4} />;

// ─────────────────────────────────────────────────────────────────────────────
// E1 · ВЫВОД ЧАСТИ 1: четыре вкладки горят; ul — страница «Menyu», остальное — починенная «Tayyorgarlik»;
// плашки ul · ol · li · «номера ставит браузер» загораются за речью; дальше — часть 2.
// ─────────────────────────────────────────────────────────────────────────────
function E1({ p }) {
  const pick = usePick();
  const c = C.e1;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'curious' : i === 0 ? 'celebrate' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA3Tabs(true);
  const menu = curK === 'ul';
  const T = menu ? TABS[0] : TABS[3];
  const name = pick(T.name);
  const items = menu ? T.items.concat([T.want]).map((t) => pick(t)) : T.steps.map((t) => pick(t));
  const tag = menu ? 'ul' : 'ol';
  const code = ['<h1>' + name + '</h1>', '<' + tag + '>'].concat(items.map((t) => '<li>' + t + '</li>'), ['</' + tag + '>']).join('\n');
  const lines = a3Body(a3Lines(code, false));
  const find = (re) => { const n = lines.findIndex((s) => re.test(s)); return n < 0 ? null : n; };
  const mark = curK === 'ul' ? find(/<ul>/) : curK === 'ol' ? find(/<ol>/) : curK === 'li' ? find(/<li>/) : null;
  const col = { ul: '#0FA38E', ol: '#7C5CFA', li: '#FA4F28', num: '#F59E0B' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finishP1} /></>}>
      <Sheet cls="a3-sheet a3-fin">
        <KzAsk text={c.ask} />
        <div className="a3-work">
          <div className="a3-side">
            <A3Browser tabs={tabs} cur={menu ? 0 : 3} title={name} pageHl={curK === 'num'}><A3Doc blocks={a3Page(code).blocks} flash={menu ? 1 : curK === 'ol' ? 2 : 0} /></A3Browser>
            <div className="a3-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a3-main">
            <A3Code lines={lines} mark={mark} />
            <div className="kz-roles a3-roles">
              {['ul', 'ol', 'li', 'num'].map((k) => (
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
