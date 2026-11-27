// Практика 5 «Зоопарк Коди», ЧАСТЬ 1: img, src и alt (tools/qism/build-prac.mjs, 27.11.2026).
// Хук S1 (прежний, четыре страницы вместо пяти), прежние т1 (имя файла в src), т2 (строка img) и т4 (href вместо src),
// новое т3 «опечатка в имени файла» (Toshbaqa: поле в строке с готовым неверным именем) и новый вывод E1.
// Четыре вкладки: Sher, Fil, Toshbaqa (на месте прежней Jirafa — жираф с абзацем уехал во вторую часть), Panda.

TABS.splice(4);   // карта части 1 — четыре вкладки
TABS[2] = { id: 'toshbaqa', file: 'toshbaqa.html', ico: 'sun', c: '#0FA38E', name: ANIMAL.toshbaqa.name };

Object.assign(UI, {
  finishP1: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  nextPart: L3("Keyingi dars: internetdagi rasm va o'z sahifangiz", 'Следующий урок: картинка из интернета и своя страница', 'Next lesson: a picture from the internet and your own page')
});
Object.assign(NOT_SPOKEN_IN, { roles: { img: 1, src: 1, alt: 1, href: 1, own: 1 } });

// Крючок: пять страниц → четыре.
Object.assign(C.s1, {
  say: L3("Hayvonot bog'ida bir kun o'tkazsangiz, oldin kimning oldiga borardingiz, sherningmi yoki pandaningmi? Menga hammasi yoqadi, shuning uchun saytimga hammasini qo'ydim: sher, fil, toshbaqa va panda. Mehmonlar ertalab keladi, endi «Saqlash» tugmasini bosing.",
    'Привет! Я сделал сайт зоопарка. У каждого животного своя страница: лев, слон, черепаха и панда. Осталось только сохранить сайт. Нажми «Сохранить».',
    'Hi! I made a zoo website. Each animal has its own page: lion, elephant, turtle and panda. I just need to save the site. Tap “Save”.'),
  done: L3("Hayvonlar yo'qolmagan, papkada turibdi. Ularni sahifaga qaytarish uchun img tegi, src va alt atributlari kerak. Qochoqlarni kod yozib o'zingiz tutasiz, men esa ular qayerda yashiringanini aytib turaman. To'rtta sahifa buzilgan, hammasini bittalab tuzatamiz.",
    'На уроке мы познакомились с картинками: тег img, атрибуты src и alt. Теперь с этими знаниями починим четыре страницы по одной. Код пишешь ты, а я рядом.',
    'In the lesson we met pictures: the img tag and the src and alt attributes. Now let’s use that to fix the four pages one by one. You write the code, and I’ll be right here.'),
  askDone: L3("To'rtta sahifani tuzatamiz — kodni o'zingiz yozasiz", 'Починим четыре страницы — код пишешь ты', 'Let’s fix four pages — you write the code')
});

// Т3 · новое: опечатка в имени файла. В src стоит готовое неверное имя (toshbqa.jpg — не хватает буквы), на странице —
// значок сломанной картинки и alt. Ученик сверяет имя со списком файлов и правит его в поле. Вид, проверка и
// дополнительная задача — прежние (a5FieldView, a5FieldCheck), меняются только начальное значение и тексты.
Object.assign(C, {
  t3: {
    eyebrow: L3("Toshbaqa", 'Черепаха', 'Turtle'),
    say: L3("Ikkita sahifa tayyor! Uchinchisi toshbaqaniki. Qarang, rasm o'rnida buzilgan rasm belgisi turibdi! Kodda src ham joyida, toshbaqaning fayli ham papkada turibdi, lekin brauzer uni topa olmayapti. Demak, fayl nomida nimadir adashgan. Uni yoningizdagi ro'yxat bilan harfma-harf solishtirib ko'ring-da, to'g'rilang.",
      'Две страницы готовы! Третья: черепаха. Смотри, на месте картинки значок сломанной картинки! В коде src есть, файл тоже лежит в папке, а браузер его не находит. Значит, в имени файла опечатка. Сравни имя со списком файлов буква в букву и поправь.',
      'Two pages are done! The third is the turtle. Look, there’s a broken picture icon where the picture should be! The code has src and the file is in the folder, but the browser can’t find it. So there’s a typo in the file name. Compare the name with the list of files letter by letter and fix it.'),
    ask: L3("src ichidagi fayl nomini to'g'rilang", 'Поправь имя файла в src', 'Fix the file name in src'),
    ok: L3("Toshbaqa ham yetib keldi! Nomda bitta harf tushib qolgan ekan, brauzer esa faylni harfma-harf qidiradi.",
      'Вот это да! В имени не хватало одной буквы, а браузер ищет файл буква в букву. Черепаха на месте!',
      'Wow! One letter was missing from the name, and the browser looks for the file letter by letter. The turtle is back!'),
    hints: [
      L3("Rasm o'rnida buzilgan belgi turibdi: brauzer faylni topa olmagan. Fayl nomini yoningizdagi ro'yxat bilan solishtirib ko'ring.",
        'Вместо картинки значок: браузер не нашёл файл. Сравни имя файла со списком рядом.',
        'There’s an icon instead of the picture: the browser didn’t find the file. Compare the file name with the list next to it.'),
      L3("Ro'yxatdagi toshbaqa fayliga qarang-chi va nomni harfma-harf tekshiring: qaysi harf yetishmayapti?",
        'Найди в списке файл черепахи и сверь имя буква в букву: какой буквы не хватает?',
        'Find the turtle file in the list and check the name letter by letter: which letter is missing?'),
      L3("Mana to'g'ri nom: toshbaqa.jpg. Maydondagi nomni xuddi shunday yozing.",
        'Правильное имя: toshbaqa.jpg. Впиши его в поле буква в букву.',
        'The right name is toshbaqa.jpg. Type it in the field letter by letter.')
    ],
    drill: L3("Endi panda: nomdagi harflar adashibdi, to'g'rilang", 'Теперь панда: в имени перепутаны буквы, поправь', 'Now the panda: the letters in the name are mixed up, fix it')
  }
});
const cfgV3 = () => ({
  id: 't3', num: 3, kind: 'fix-src', C: C.t3,
  init: () => ({ v: 'toshbqa.jpg' }),
  check: (st) => a5FieldCheck(st.v, 'toshbaqa.jpg'),
  view: a5FieldView('toshbaqa'),
  sample: (pk) => ['<img src="jirafa.jpg" alt="' + pk(ANIMAL.jirafa.name) + '">'],
  drill: { init: () => ({ v: 'pnada.jpg' }), check: (st) => a5FieldCheck(st.v, 'panda.jpg'), view: a5FieldView('panda') }
});
const V3 = ({ p }) => <A5Task p={p} make={cfgV3} />;

// Т4 — последнее задание части 1: страница «Panda» после починки уходит в артефакт части.
const cfgV4 = (pick, store) => Object.assign(cfgT4(pick), {
  onSolved: () => {
    const name = pick(ANIMAL.panda.name);
    const fact = pick(ANIMAL.panda.fact);
    store.set('myCode', ['<h1>' + name + '</h1>', '<img src="panda.jpg" alt="' + name + '">', '<p>' + fact + '</p>'].join('\n'));
    store.set('myHead', name); store.set('myText', fact); store.set('mySrc', 'panda.jpg'); store.set('myAlt', name); store.set('myTab', name);
  }
});
const V4 = ({ p }) => <A5Task p={p} make={cfgV4} />;

// Вывод части 1: четыре вкладки горят; по ходу речи страница панды — картинка на месте, «сломанный» файл (alt), href вместо src.
Object.assign(C, {
  e1: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Barakalla! To'rtta sahifaning hammasida rasm yana o'z joyida: sher, fil, toshbaqa va panda. Hammasi joy-joyiga tushdi!",
        'Ура! На всех четырёх страницах картинки снова на месте: лев, слон, черепаха и панда. Всё встало на свои места!',
        'Hooray! The pictures are back on all four pages: lion, elephant, turtle and panda. Everything is back in place!') },
      { k: 'img', text: L3("Rasmlarni sahifaga img tegi olib chiqdi. U yopilmaydi, chunki yopuvchi img tegi umuman bo'lmaydi.",
        'Картинки на страницу поставил тег img. Он не закрывается, у него нет закрывающего тега.',
        'The img tag put the pictures on the pages. It doesn’t close: it has no closing tag.') },
      { k: 'src', text: L3("src brauzerga rasm faylining nomini aytib turdi. Toshbaqa sahifasi esa ko'rsatdi: nomda bitta harf adashsa, rasm chiqmaydi.",
        'src называл браузеру файл картинки. А страница черепахи показала: ошибёшься хоть в одной букве, и картинки не будет.',
        'src named the picture file for the browser. And the turtle page showed it: get one letter wrong and there’s no picture.') },
      { k: 'alt', text: L3("alt esa rasmda nima borligini so'z bilan aytdi. Rasm chiqmay qolganda sahifada aynan shu so'zlar turdi.",
        'А alt словами говорил, что на картинке. Когда фото не открывалось, на странице оставались именно эти слова.',
        'And alt said in words what’s in the picture. When the photo didn’t open, exactly these words were left on the page.') },
      { k: 'href', text: L3("Panda sahifasi esa yana bir narsani o'rgatdi: rasmga href emas, src kerak. href faqat havolalar uchun.",
        'А страница панды научила ещё одному: картинке нужен src, а не href. href нужен только ссылкам.',
        'And the panda page taught one more thing: a picture needs src, not href. href is only for links.') },
      { k: null, text: L3("Lekin hozircha hamma rasmimiz o'zimizning papkada yotibdi. Rasm boshqa saytda tursa-chi? Uni sahifaga qanday olib kelamiz? Buni keyingi darsda ko'ramiz, oxirida esa o'z hayvoningiz bilan sahifa yozasiz!",
        'Но пока все наши картинки лежат в нашей папке. А если картинка на другом сайте? Как принести её на страницу? Узнаем на следующем уроке, а в конце напишешь страницу со своим животным!',
        'But so far all our pictures sit in our own folder. What if the picture is on another site? How do we bring it to the page? We’ll find out in the next lesson, and at the end you’ll write a page with your own animal!') }
    ],
    roles: {
      img: L3("img — rasm", 'img — картинка', 'img — picture'),
      src: L3("src — rasm fayli", 'src — файл картинки', 'src — picture file'),
      alt: L3("alt — rasm haqida so'z", 'alt — слова о картинке', 'alt — words about the picture'),
      href: L3("Rasmga href emas, src", 'Картинке src, а не href', 'A picture needs src, not href')
    },
    ask: L3("To'rtta sahifa tayyor! «Amaliyotni tugatish»ni bosing", 'Четыре страницы готовы! Нажми «Завершить практику»', 'Four pages are ready! Tap “Finish the practice”')
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// E1 · ВЫВОД ЧАСТИ 1: четыре вкладки горят; открыта «Panda». За речью: img — строка с картинкой, src — файл,
// alt — «сломанный» файл (виден значок и слова), href — вместо src (картинки нет, только слова); дальше — часть 2.
// ─────────────────────────────────────────────────────────────────────────────
function E1({ p }) {
  const pick = usePick();
  const c = C.e1;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'curious' : i === 0 ? 'celebrate' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const tabs = useA5Tabs(true);
  const name = pick(ANIMAL.panda.name);
  const imgLine = curK === 'href' ? '<img href="panda.jpg" alt="' + name + '">'
    : '<img src="' + (curK === 'alt' ? 'panda.jgp' : 'panda.jpg') + '" alt="' + name + '">';
  const rows = ['<h1>' + name + '</h1>', imgLine, '<p>' + pick(ANIMAL.panda.fact) + '</p>'];
  const lines = a5Body(rows);
  const mark = curK === 'img' || curK === 'src' || curK === 'alt' || curK === 'href' ? 2 : null;
  const col = { img: '#FA4F28', src: '#7C5CFA', alt: '#0FA38E', href: '#E44D26' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finishP1} /></>}>
      <Sheet cls="a5-sheet a5-fin">
        <KzAsk text={c.ask} />
        <div className="a5-work">
          <div className="a5-side">
            <A5Browser tabs={tabs} cur={3} title={name} url="panda.html"><A5Doc blocks={a5Page(rows.join('')).blocks} /></A5Browser>
            <div className="a5-ready"><Icon name="check" size={16} />{pick(UI.workReady)}</div>
          </div>
          <div className="a5-main">
            <A5Code lines={lines} mark={mark} />
            <div className="kz-roles a5-roles">
              {['img', 'src', 'alt', 'href'].map((k) => (
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
