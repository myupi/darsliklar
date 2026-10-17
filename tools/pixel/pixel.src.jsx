// =============================================================================
// == ТЕСТОВЫЙ УРОК · «Из чего сделан сайт: робот Пиксель» =========================
//
// Отдельный тестовый урок про робота Pixel (заказчик, 17.10.2026). Все его
// исходники — свои копии в tools/pixel/, поэтому правки здесь не трогают урок 07
// «Структура HTML» (tools/robot/) и другие уроки.
//   • r1 — Pixel собирается из трёх слоёв: детали · вид · движение = HTML · CSS ·
//     JavaScript. Ученик включает слои по очереди и видит, что даёт каждый;
//   • r2 — на экране Pixel игра «Битва знаний»: это обычная веб-страница, рядом
//     её код. Пока Коди говорит, обведено то, о чём он говорит;
//   • q — «Почини Пикселя»: у Pixel выключен один слой, ученик по виду узнаёт
//     какой и включает его (вид → движение → детали). Это перенос: слой
//     узнаётся по тому, что пропало;
//   • fin — Pixel целиком, три слоя одной строкой, следующий урок.
//
// ЛОВУШКА «ГОЛОВА». У робота есть голова, а head страницы — не голова. В речи
// у Pixel нет «головы»: head разбирается в уроке «Структура HTML».
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you». Файл собирается
// скриптом tools/pixel/pixel.build.mjs.
// =============================================================================

const META = {
  lessonId: 'test-html-robot-pixel',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: 'Sayt nimadan yasalgan: robot Piksel',
    ru: 'Из чего сделан сайт: робот Пиксель',
    en: 'What a website is made of: robot Pixel'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
    out[l] = s;
  });
  return out;
};

// Игра «Битва знаний» — страница на экране Pixel.
const SAMPLE = {
  title: L3('Bilimlar jangi', 'Битва знаний', 'Battle of Knowledge'),
  text: L3('Salom! O‘yinga xush kelibsiz!', 'Привет! Добро пожаловать в игру!', 'Hi! Welcome to the game!')
};

const UI = {
  inspector: L3('Tuzilma qoidasi', 'Правило структуры', 'Structure rule'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('HTML hujjat tuzilishi: sahifani o‘zingiz yozasiz', 'Структура HTML-документа: пишем страницу сами', 'HTML document structure: you write a page yourself'),
  done: L3('Bajarildi', 'Сделано', 'Done'),
  robot: L3('Robot Piksel: korpus, ekran, qo‘llar, oyoqlar, antenna', 'Робот Пиксель: корпус, экран, руки, ноги, антенна', 'Robot Pixel: case, screen, arms, legs, antenna'),
  pixel: L3('Piksel', 'Пиксель', 'Pixel'),
  layers: {
    html: { name: 'HTML', sub: L3('Detallar', 'Детали', 'Parts') },
    css: { name: 'CSS', sub: L3('Ko‘rinish', 'Вид', 'Look') },
    js: { name: 'JavaScript', sub: L3('Harakat', 'Движение', 'Moves') }
  },
  scr2: L3('1-savol', 'Вопрос 1', 'Question 1'),
  gameQ: L3('1-savol: o‘rgimchakning nechta oyog‘i bor?', 'Вопрос 1: сколько ног у паука?', 'Question 1: how many legs does a spider have?'),
  openScreen: L3('Ekranni ochish', 'Открыть экран', 'Open the screen')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплика Коди — 1–2 коротких предложения, одна мысль. Похвала — эмоция
// и что получилось. CSS и JavaScript в речи — по-английски во всех языках.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  r1: {
    eyebrow: L3('Robot Piksel', 'Робот Пиксель', 'Robot Pixel'),
    cast: [
      { pose: 'hello', text: L3('Salom! Men Kodi, dasturchi robotman. Bu mening loyiham — robot Piksel. Hozircha u ko‘rinmayapti.',
        'Привет! Я Коди, робот-программист. А это мой проект — робот Пиксель. Пока его не видно.',
        'Hi! I’m Kodi, a programmer robot. This is my project, robot Pixel. You can’t see him yet.') },
      { pose: 'point', text: L3('Piksel uch qatlamdan yig‘ilgan. Ularni navbat bilan yoqing!',
        'Пиксель собран из трёх слоёв. Включи их по очереди!',
        'Pixel is built from three layers. Turn them on one by one!') }
    ],
    on: {
      html: L3('Voy, detallar paydo bo‘ldi: korpus, ekran, qo‘llar, oyoqlar! Bu HTML — Piksel nimadan yasalgani.',
        'Ого, появились детали: корпус, экран, руки, ноги! Это HTML — из чего сделан Пиксель.',
        'Whoa, the parts appeared: the case, screen, arms and legs! That’s HTML: what Pixel is made of.'),
      css: L3('Endi Piksel rangli! Bu CSS — tashqi ko‘rinish.',
        'Теперь Пиксель цветной! Это CSS — внешний вид.',
        'Now Pixel has colours! That’s CSS: the look.'),
      js: L3('Mana endi Piksel sizga qo‘l silkitayapti! Bu JavaScript — harakat.',
        'А теперь Пиксель машет тебе! Это JavaScript — движения.',
        'And now Pixel is waving at you! That’s JavaScript: the moves.')
    },
    done: L3('Har bir sayt ham shunday tuzilgan: detallar, ko‘rinish, harakat. Asosiysi — HTML: usiz hech narsa yo‘q. Shundan boshlaymiz!',
      'Так устроен и каждый сайт: детали, вид, движение. Главное — HTML: без него ничего нет. С него и начнём!',
      'Every website works the same way: parts, look, moves. The key one is HTML: without it there’s nothing. That’s where we start!'),
    next: {
      css: L3('Endi keyingisini yoqing — «Ko‘rinish», ya’ni CSS.', 'Теперь включи следующий слой — «Вид», это CSS.', 'Now turn on the next layer, “Look”: that’s CSS.'),
      js: L3('Endi oxirgisi — «Harakat» qatlamini, JavaScript ni yoqing!', 'А теперь последний — включи «Движение», это JavaScript!', 'Now the last one: turn on “Moves”, that’s JavaScript!')
    },
    off: L3('Ko‘rdingizmi? HTML siz Piksel butunlay yo‘qoldi.', 'Видишь? Без HTML исчез весь Пиксель.', 'See? Without HTML, all of Pixel is gone.'),
    ask: L3('Qatlamlarni navbat bilan yoqing', 'Включи слои по очереди', 'Turn the layers on one by one'),
    askOne: L3('«{x}» qatlamini yoqing', 'Включи слой «{x}»', 'Turn on the “{x}” layer'),
    askDone: L3('Qatlamlarni o‘chirib-yoqib ko‘ring', 'Слои можно выключать и включать', 'You can switch the layers off and on')
  },

  r2: {
    eyebrow: L3('Piksel ekrani', 'Экран Пикселя', 'Pixel’s screen'),
    say: L3('Pikselning ko‘kragida ekran bor, unda «Bilimlar jangi» o‘yini. Ekranni bosing — ichiga qaraymiz!',
      'На груди у Пикселя экран, а на нём игра «Битва знаний». Нажми на экран — заглянем внутрь!',
      'Pixel has a screen on his chest with the game “Battle of Knowledge”. Tap the screen and let’s look inside!'),
    tab: L3('Bu oddiy veb-sahifa! Eng tepada, yorliqda — uning nomi: «Bilimlar jangi».',
      'Это обычная веб-страница! В самом верху, на вкладке, — её название: «Битва знаний».',
      'It’s a normal web page! At the very top, on the tab, is its name: “Battle of Knowledge”.'),
    win: L3('Pastda, oynada — sahifa mazmuni: o‘yin savoli. Uni o‘yinchi ko‘radi.',
      'А ниже, в окне, — содержимое страницы: вопрос игры. Его и видит игрок.',
      'And below, in the window, is the page content: the game question. That’s what the player sees.'),
    code: L3('Yonida esa uning kodi — brauzer uchun ko‘rsatmali matn. Brauzer uni o‘qib, sahifani chizadi. Ranglar yo‘q — bu faqat HTML.',
      'А рядом — её код: текст с подсказками для браузера. Браузер читает его и рисует страницу. Цветов нет — это только HTML.',
      'And next to it is its code: text with instructions for the browser. The browser reads it and draws the page. No colours: this is just HTML.'),
    done: L3('Internetdagi har bir sayt shunday yozilgan. Tez orada siz ham bunday kodni o‘zingiz yozasiz!',
      'Каждый сайт в интернете написан так. Скоро и ты будешь писать такой код сам!',
      'Every website on the internet is written like this. Soon you’ll write code like this yourself!'),
    ask: L3('Piksel ekranini bosing', 'Нажми на экран Пикселя', 'Tap Pixel’s screen'),
    askDone: L3('Bu sahifa kodi. Dars oxirida har bir qatorini tushunasiz', 'Это код страницы. К концу урока будет понятна каждая строчка', 'This is the page’s code. By the end you’ll understand every line')
  },
  q: {
    eyebrow: L3('Pikselni tuzating', 'Почини Пикселя', 'Fix Pixel'),
    say: L3('Voy, Piksel buzildi! Har safar bitta qatlam o‘chadi. Pikselga qarang va kerakli qatlamni yoqing.',
      'Ой, Пиксель сломался! Каждый раз выключается один слой. Посмотри на Пикселя и включи нужный.',
      'Oh no, Pixel broke! Each time one layer switches off. Look at Pixel and turn on the right one.'),
    q: {
      css: L3('Piksel kulrang bo‘lib qoldi — ranglar yo‘qoldi. Qaysi qatlamni yoqamiz?', 'Пиксель стал серым — пропали цвета. Какой слой включим?', 'Pixel went grey: the colours are gone. Which layer do we turn on?'),
      js: L3('Piksel qotib qoldi: qo‘l silkitmaydi, ko‘z qisib qo‘ymaydi. Qaysi qatlamni yoqamiz?', 'Пиксель замер: не машет и не моргает. Какой слой включим?', 'Pixel froze: no waving, no blinking. Which layer do we turn on?'),
      html: L3('Piksel butunlay yo‘qoldi — faqat tagligi qoldi! Qaysi qatlamni yoqamiz?', 'Пиксель пропал совсем — осталась одна подставка! Какой слой включим?', 'Pixel is gone completely, only the stand is left! Which layer do we turn on?')
    },
    ok: {
      css: L3('Ana! Ranglar qaytdi — bu CSS, tashqi ko‘rinish.', 'Есть! Цвета вернулись — это CSS, внешний вид.', 'Yes! The colours are back: that’s CSS, the look.'),
      js: L3('Zo‘r! Piksel yana qo‘l silkitayapti — bu JavaScript, harakat.', 'Отлично! Пиксель снова машет — это JavaScript, движения.', 'Great! Pixel is waving again: that’s JavaScript, the moves.'),
      html: L3('Aynan nishonga! Detallar joyida — bu HTML. Usiz hech narsa yo‘q.', 'В точку! Детали на месте — это HTML. Без него нет ничего.', 'Nailed it! The parts are back: that’s HTML. Without it there’s nothing.')
    },
    // Промах: что делает выбранный слой — и вопрос, что пропало у Pixel.
    miss: {
      html: L3('HTML — bu detallar. Pikselning detallari joyida-ku. Unda nima yo‘qoldi?', 'HTML — это детали. А детали у Пикселя на месте. Что же у него пропало?', 'HTML is the parts. But Pixel’s parts are all there. So what’s missing?'),
      css: L3('CSS — bu ranglar va ko‘rinish. Pikselning ranglari joyida. Unda nima yo‘qoldi?', 'CSS — это цвета и вид. А цвета у Пикселя на месте. Что же у него пропало?', 'CSS is the colours and the look. But Pixel’s colours are there. So what’s missing?'),
      js: L3('JavaScript — bu harakat. Lekin Pikselning o‘zi qayerda? Avval uni nimadan yasash kerak?', 'JavaScript — это движения. Но где сам Пиксель? Из чего его сначала собрать?', 'JavaScript is the moves. But where is Pixel himself? What do we build him from first?')
    },
    h: {
      css: L3('Ranglar — bu «Ko‘rinish» qatlami.', 'Цвета — это слой «Вид».', 'Colours are the “Look” layer.'),
      js: L3('Qo‘l silkitish va ko‘z qisish — bu «Harakat» qatlami.', 'Махать и моргать — это слой «Движение».', 'Waving and blinking are the “Moves” layer.'),
      html: L3('Piksel nimadan yasalgan — bu «Detallar» qatlami.', 'Из чего сделан Пиксель — это слой «Детали».', 'What Pixel is made of is the “Parts” layer.')
    },
    done: L3('Uchta buzilish — hammasi tuzatildi! Endi har bir qatlam nima uchun kerakligini bilasiz.',
      'Три поломки — и все исправлены! Теперь ты знаешь, за что отвечает каждый слой.',
      'Three breakdowns, all fixed! Now you know what each layer is for.'),
    ask: {
      css: L3('Piksel kulrang. Qaysi qatlamni yoqamiz?', 'Пиксель серый. Какой слой включить?', 'Pixel is grey. Which layer?'),
      js: L3('Piksel qotib qoldi. Qaysi qatlamni yoqamiz?', 'Пиксель замер. Какой слой включить?', 'Pixel froze. Which layer?'),
      html: L3('Piksel yo‘qoldi. Qaysi qatlamni yoqamiz?', 'Пиксель пропал. Какой слой включить?', 'Pixel is gone. Which layer?')
    },
    askDone: L3('Piksel tuzatildi!', 'Пиксель починен!', 'Pixel is fixed!')
  },

  fin: {
    eyebrow: L3('Sayt nimadan yasalgan', 'Из чего сделан сайт', 'What a website is made of'),
    say: L3('Piksel tayyor, hammasi ishlayapti! Endi bilasiz: sayt — bu HTML, CSS va JavaScript. Keyingi darsda HTML ni o‘zingiz yozasiz!',
      'Пиксель в строю! Теперь ты знаешь: сайт — это HTML, CSS и JavaScript. В следующем уроке напишешь HTML сам!',
      'Pixel is up and running! Now you know: a website is HTML, CSS and JavaScript. In the next lesson you’ll write HTML yourself!'),
    btn: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
    ask: L3('Pikselga qarang', 'Посмотри на Пикселя', 'Look at Pixel')
  }
};

/*@HELPERS@*/

/*@UI@*/

// ═════════════════════════════════════════════════════════════════════════════
// ФИГУРА (навык anatomy): робот Pixel, посчитан при сборке.
// ═════════════════════════════════════════════════════════════════════════════
/*@FIGURES@*/

// =============================================================================
// R1. ИЗ ЧЕГО СДЕЛАН PIXEL — три слоя: детали (HTML), вид (CSS), движение (JS).
// Пустая подставка; ученик включает слои по очереди и видит, что даёт каждый.
// Без HTML нет ничего — поэтому урок начинается с него.
// =============================================================================
const LAYERS = ['html', 'css', 'js'];
const LAYER_C = { html: '#586A83', css: '#227882', js: '#8A5A3C' };
function LayerIcon({ k }) {
  const d = {
    html: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
    css: <><path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.7-1 1.2-1.9-.5-1 .1-2 1.2-2H17a4 4 0 0 0 4-4C21 7.6 17 3 12 3z" /><circle cx="7.5" cy="11.5" r="1.1" /><circle cx="10.5" cy="7.5" r="1.1" /><circle cx="15.5" cy="8" r="1.1" /></>,
    js: <path d="M13 2.5L4.5 14H11l-1 7.5L18.5 10H12l1-7.5z" />
  }[k];
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
}
const robotCls = (on) => 'fig-robot' + LAYERS.filter((k) => on[k]).map((k) => ' rb-' + k).join('');
const ALL_LAYERS = { html: true, css: true, js: true };
// Текст на экране Pixel: заголовок и одна короткая строка.
const shortTxt = (s, n) => { const t = String(s || '').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; };

function R1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.r1;
  const [rec, put] = useRec('r1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved ? ALL_LAYERS : { html: false, css: false, js: false });
  const [seen, setSeen] = useState(solved ? LAYERS.slice() : []);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : c.cast.map((x) => ({ text: x.text, pose: x.pose })));
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const next = LAYERS.find((k) => seen.indexOf(k) < 0) || null;
  const led = useIdleLed(canTap && !solved, seen.length);
  const offSaid = useRef(false);
  const toggle = (k) => {
    if (!canTap) return;
    if (!solved && k !== next) return;
    const now = !on[k];
    setOn((o) => Object.assign({}, o, { [k]: now }));
    sfx(now ? 'pop' : 'tap', true);
    if (!solved) {
      const ns = seen.concat(k);
      setSeen(ns);
      if (ns.length === LAYERS.length) {
        put({ done: true });
        log({ screenId: 'r1', type: 'layers', correct: true, attempts: ns.length });
        sayNow(c.on.js, 'cheer');
        say(c.done, 'explain');
      } else {
        sayNow(c.on[k], k === 'html' ? 'wonder' : 'smile');
        // Следующий слой Коди называет сам (заказчик, 17.10.2026).
        say(k === 'html' ? c.next.css : c.next.js, 'point');
      }
      return;
    }
    if (k === 'html' && !now && !offSaid.current) { offSaid.current = true; sayNow(c.off, 'explain'); }
  };
  const askText = solved ? c.askDone : next ? fillL(c.askOne, { x: pick(UI.layers[next].sub) }) : c.ask;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Ask text={askText} n={solved ? null : seen.length + '/3'} />
      <div className="rb-stage">
        <Fig fig={RFIG} cls={robotCls(on)} texts={{ scr1: pick(SAMPLE.title), scr2: pick(UI.scr2) }} label={UI.robot} />
        <div className="rb-layers" role="group">
          {LAYERS.map((k) => (
            <button key={k} type="button" className={'rb-layer' + (on[k] ? ' is-on' : '')} style={{ '--c': LAYER_C[k] }}
              aria-pressed={!!on[k]} disabled={!canTap || (!solved && k !== next)} onClick={() => toggle(k)}>
              <span className="rb-l-ic"><LayerIcon k={k} /></span>
              <span className="rb-l-txt"><span className="rb-l-name" translate="no">{UI.layers[k].name}</span><span className="rb-l-sub">{pick(UI.layers[k].sub)}</span></span>
              <span className="rb-sw" aria-hidden="true" />
              <Led on={led && k === next} />
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// R2. ЭКРАН PIXEL — на нём игра «Битва знаний». Нажали экран — это обычная
// веб-страница, а рядом её код: так написан каждый сайт.
// =============================================================================
function R2({ p }) {
  const pick = usePick();
  const c = C.r2;
  const [rec, put] = useRec('r2');
  const solved = !!(rec && rec.done);
  const [open, setOpen] = useState(solved);
  const [flash, setFlash] = useState(0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !open, 0);
  const game = { title: pick(SAMPLE.title), text: pick(UI.gameQ) };
  const tap = () => {
    if (!canTap || open) return;
    sfx('pop', true);
    setOpen(true); setFlash((n) => n + 1);
    put({ done: true });
    sayNow(c.tab, 'wonder');
    say(c.win, 'point');
    say(c.code, 'explain');
    say(c.done, 'cheer');
  };
  // Что Коди называет, то и обведено: вкладка, окно, код.
  const now = speaker.text === c.tab ? 'tab' : speaker.text === c.win ? 'win' : speaker.text === c.code ? 'code' : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={open ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Ask text={open ? c.askDone : c.ask} />
      {open ? (
        <div className={'work pr rb-zoom rb-open' + (now ? ' is-' + now : '')}>
          <MiniBrowser title={game.title} page={game.text} flashTab={flash} flashPage={flash} hl={now === 'tab' ? 'title' : now === 'win' ? 'body' : null} />
          <CodeLines lines={buildLines(FULL_DOC, game)} className="cv-pr rb-code" />
        </div>
      ) : (
        <>
          <div className="rb-tapfig" role="button" tabIndex={0} aria-label={pick(c.ask)} onClick={tap}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(); } }}>
            <Fig fig={RFIG_BUST} cls="fig-robot rb-html rb-css rb-js" texts={{ scr1: game.title, scr2: pick(UI.scr2) }} label={UI.robot}
              led={led ? ['screen'] : []} />
          </div>
          <div className="rb-acts">
            <button type="button" className="btn-accent rb-open-b" disabled={!canTap} onClick={tap}>
              <Icon name="browser" size={18} />{pick(UI.openScreen)}<Led on={led} />
            </button>
          </div>
        </>
      )}
    </Stage>
  );
}

// =============================================================================
// Q. ПОЧИНИ ПИКСЕЛЯ — у Pixel выключен один слой; ученик по виду узнаёт, какой, и
// включает его. Три раунда: вид → движение → детали. На кнопках нет
// переключателей, иначе ответ виден заранее. Промах ничего не ломает: Коди
// говорит, что делает выбранный слой, и спрашивает, что пропало.
// =============================================================================
const ROUNDS = ['css', 'js', 'html'];
function Q({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q;
  const [rec, put] = useRec('q');
  const solved = !!(rec && rec.done);
  const [r, setR] = useState(solved ? ROUNDS.length - 1 : 0);
  const [fixed, setFixed] = useState(solved);
  const [tries, setTries] = useState(0);
  const [shake, wobble] = useShake();
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'wonder' }, { text: c.q.css, pose: 'think' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const off = fixed ? null : ROUNDS[r];
  const on = { html: off !== 'html', css: off !== 'css', js: off !== 'js' };
  const led = useIdleLed(canTap && !fixed && tries >= 2, r);
  const [hl, setHl] = useState(0);
  const pulse = useHintPulse();
  const p0 = useRef(pulse);
  useEffect(() => { if (pulse !== p0.current) { p0.current = pulse; if (!fixed) setHl(2); } }, [pulse]); // eslint-disable-line react-hooks/exhaustive-deps
  // Следующая поломка — в тот момент, когда Коди начинает её вопрос.
  useEffect(() => {
    const nx = ROUNDS[r + 1];
    if (fixed && nx && speaker.text === c.q[nx]) { setR(r + 1); setFixed(false); setTries(0); setHl(0); }
  }, [speaker.text]); // eslint-disable-line react-hooks/exhaustive-deps
  const choose = (k) => {
    if (!canTap || fixed || solved) return;
    if (k !== ROUNDS[r]) {
      wobble(k); sfx('soft', true);
      setTries((t) => t + 1);
      if (tries >= 1) setHl(2);
      sayNow(c.miss[k], 'think');
      return;
    }
    sfx('pop', true);
    setFixed(true);
    log({ screenId: 'q', type: 'fix-layer', round: r + 1, correct: true, attempts: tries + 1 });
    if (r + 1 < ROUNDS.length) {
      sayNow(c.ok[k], 'cheer');
      say(c.q[ROUNDS[r + 1]], 'think');
    } else {
      put({ done: true });
      sayNow(c.ok[k], 'celebrate');
      say(c.done, 'smile');
      setTimeout(() => celebrate(), 300);
    }
  };
  const askText = solved || (fixed && r === ROUNDS.length - 1) ? c.askDone : c.ask[ROUNDS[r]];
  const hint = hl ? c.h[ROUNDS[r]] : askText;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.h[ROUNDS[r]]} nav={navOf(p, canGo)}>
      <Ask text={hint} n={solved ? null : Math.min(r + (fixed ? 1 : 0), 3) + '/3'} />
      <div className="rb-stage">
        <Fig fig={RFIG} cls={robotCls(on)} texts={{ scr1: pick(SAMPLE.title), scr2: pick(UI.scr2) }} label={UI.robot} />
        <div className="rb-layers rb-pick" role="group">
          {LAYERS.map((k) => (
            <button key={k} type="button" className={'rb-layer' + (fixed && k === ROUNDS[r] ? ' is-on' : '') + (shake === k ? ' is-shake' : '')}
              style={{ '--c': LAYER_C[k] }} disabled={!canTap || fixed || solved} onClick={() => choose(k)}>
              <span className="rb-l-ic"><LayerIcon k={k} /></span>
              <span className="rb-l-txt"><span className="rb-l-name" translate="no">{UI.layers[k].name}</span><span className="rb-l-sub">{pick(UI.layers[k].sub)}</span></span>
              <Led on={(led || hl === 2) && k === ROUNDS[r] && !fixed} />
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// FIN. Pixel целиком со всеми слоями, три слоя одной строкой, следующий урок.
// =============================================================================
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'celebrate' }]);
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 700); return () => clearTimeout(t); }, []);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} /></>}>
      <div className="rb-fin">
        <div className="rb-fin-pixel">
          <Fig fig={RFIG_BUST} cls="fig-robot rb-html rb-css rb-js" texts={{ scr1: pick(SAMPLE.title), scr2: pick(UI.scr2) }} label={UI.robot} />
        </div>
        <div className="rb-fin-side">
          <div className="rb-sum" aria-label={pick(UI.done)}>
            {LAYERS.map((k) => (
              <span key={k} className="rb-sum-i" style={{ '--c': LAYER_C[k] }}>
                <span className="rb-l-ic"><LayerIcon k={k} /></span>
                <span className="rb-l-name" translate="no">{UI.layers[k].name}</span>
                <span className="rb-l-sub">{pick(UI.layers[k].sub)}</span>
              </span>
            ))}
          </div>
          <div className="bye-next next-card">
            <span className="bye-next-ic"><Icon name="doc" size={22} /></span>
            <span className="bye-next-t"><span>{pick(UI.nextLesson)}</span><b>{pick(UI.next)}</b></span>
          </div>
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 'r1', code: 'HOOK', Comp: R1 }, { id: 'r2', code: 'WHY', Comp: R2 },
  { id: 'q', code: 'CHECK-1', Comp: Q }, { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
const SCREEN_RESET = { r1: ['r1'], r2: ['r2'], q: ['q'] };

export default function HtmlRobotPixel({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({ meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit });
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = { screen: R.i, total: SCREENS.length, next: R.next, prev: R.i > 0 ? R.prev : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@LESSON1_CSS@*/
/*@ISO_CSS@*/
/*@FIG_CSS@*/
/*@OWN_CSS@*/
`;
