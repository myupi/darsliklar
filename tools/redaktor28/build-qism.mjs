// Урок 1 курса HTML двумя частями (заказчик, 25.11.2026: «можем ли первый урок html как-то поделить на 2 части?» —
// «две части по ~10», «урок 1, две части»: номер урока не меняется, части — 01q1 и 01q2 под уроком 1).
// Части собираются из тех же экранов, что и целый урок (tools/redaktor28/build.mjs → gen/), только со своим списком
// экранов, своим META и двумя новыми экранами:
//   часть 1 «тег, head и title» — экраны 1–7 целого урока + E1 (вывод части: html, head, title; окно пока пустое);
//   часть 2 «body и порядок документа» — H2 (крючок: страница без body, окно пустое) + экраны 8–17 целого урока.
// Своё название и текст ученика (myTitle, myText) у частей не общие: часть 2 без части 1 берёт «Mening saytim».
//   node tools/redaktor28/build-qism.mjs   → lessons/html/01q1-struktura-dokumenta.jsx, 01q2-struktura-dokumenta.jsx
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const gen = join(here, 'gen');

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('build-qism.mjs: не найдено ровно одно место — ' + what);
  return s.replace(from, to);
};

// Свежий gen/ целого урока (без сборки самого урока).
execFileSync('node', [join(here, 'build.mjs'), '--gen-only'], { stdio: 'inherit' });

const PARTS = [
  {
    k: 1,
    out: 'lessons/html/01q1-struktura-dokumenta.jsx',
    lessonId: 'html-01q1-struktura-dokumenta',
    title: { uz: "1-dars. 1-qism: teg, head va title", ru: 'Урок 1. Часть 1: тег, head и title', en: 'Lesson 1. Part 1: tags, head and title' },
    screens: `{ id: 's1', code: 'HOOK', Comp: S1 }, { id: 'rd', code: 'SHOW', Comp: RD },
  { id: 's3', code: 'SHOW', Comp: S3 }, { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'CHECK-1', Comp: S5 },
  { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }`
  },
  {
    k: 2,
    out: 'lessons/html/01q2-struktura-dokumenta.jsx',
    lessonId: 'html-01q2-struktura-dokumenta',
    title: { uz: "1-dars. 2-qism: body va sahifa tartibi", ru: 'Урок 1. Часть 2: body и порядок документа', en: 'Lesson 1. Part 2: body and document order' },
    screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-3', Comp: S10 }, { id: 's8', code: 'PREDICT', Comp: S8 },
  { id: 's11', code: 'CHECK-2', Comp: S11 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 's13', code: 'LEVEL-4', Comp: S13 }, { id: 's14', code: 'CHECK-3', Comp: S14 },
  { id: 'q1', code: 'CHECK-4', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }`
  }
];

// Тексты двух новых экранов (узбекский — первым, апостроф ASCII).
const TEXTS = `
// ── Урок 1 частями (tools/redaktor28/build-qism.mjs, 25.11.2026): вывод части 1 и крючок части 2. ──
Object.assign(C, {
  e1: {
    eyebrow: L3('Xulosa', 'Итог', 'Summary'),
    ask: L3("Sahifaning boshi tayyor", 'Начало страницы готово', 'The top of the page is ready'),
    next: L3("Keyingi qism: oynada ko'rinadigan hamma narsa", 'Следующая часть: всё, что видно в окне', 'Next part: everything you see in the window'),
    say: [
      { text: L3("Mana, sahifangizning boshi tayyor! Nomi yorliqda turibdi.", 'Вот и готово начало твоей страницы! Её название уже на вкладке.', 'Here it is, the top of your page! Its name is already on the tab.'), k: null },
      { text: L3("Esingizdami? Teg bu burchakli qavs ichidagi so'z. Brauzer uni ko'rsatmaydi, faqat o'qiydi.", 'Помнишь? Тег — это слово в угловых скобках. Браузер его не показывает, а только читает.', 'Remember? A tag is a word in angle brackets. The browser doesn’t show it, it just reads it.'), k: null },
      { text: L3("html butun sahifani o'rab turadi.", 'html обнимает всю страницу.', 'html wraps the whole page.'), k: 'html' },
      { text: L3("head sahifa haqidagi ma'lumotlarni saqlaydi.", 'head хранит информацию о странице.', 'head keeps information about the page.'), k: 'head' },
      { text: L3("title head ichida yashaydi. Unga sahifa nomi yoziladi, brauzer esa shu nomni yorliqda ko'rsatadi.", 'title живёт внутри head. В нём пишут название страницы, а браузер показывает его на вкладке.', 'title lives inside head. It holds the page name, and the browser shows that name on the tab.'), k: 'title' },
      { text: L3("Lekin qarang: brauzer oynasi hali bo'sh. Oynada ko'rinadigan hamma narsa qayerda yashaydi? Buni keyingi qismda bilib olamiz!", 'Но посмотри: окно браузера пока пустое. Где живёт всё, что видно в окне? Узнаем в следующей части!', 'But look: the browser window is still empty. Where does everything you see in the window live? We’ll find out in the next part!'), k: 'body' }
    ]
  },
  h2: {
    eyebrow: L3('Davom etamiz', 'Продолжаем', 'Let’s continue'),
    ask: L3("Oyna hali bo'sh", 'Окно пока пустое', 'The window is still empty'),
    say: [
      { text: L3("Salom! O'tgan qismda biz sahifaning boshini yasadik: html, head va title. Sahifa nomi yorliqda turibdi.", 'Привет! В прошлой части мы собрали начало страницы: html, head и title. Название страницы уже на вкладке.', 'Hi! In the last part we built the top of the page: html, head and title. The page name is already on the tab.'), k: 'title' },
      { text: L3("Lekin brauzer oynasiga qarang: u bo'm-bo'sh! Matn yo'q, rasm yo'q, tugma yo'q.", 'Но посмотри на окно браузера: оно совсем пустое! Ни текста, ни картинок, ни кнопок.', 'But look at the browser window: it’s completely empty! No text, no pictures, no buttons.'), k: 'body' },
      { text: L3("Nima deb o'ylaysiz, oynadagi hamma narsa qayerda yashaydi? Bugun shuni bilib olamiz va sahifani to'ldiramiz. Ketdik!", 'Как думаешь, где живёт всё, что видно в окне? Сегодня узнаем и заполним страницу. Погнали!', 'Where do you think everything in the window lives? Today we’ll find out and fill the page. Let’s go!'), k: null }
    ]
  }
});
`;

// Два новых экрана — по образцу вывода целого урока (S15): страница ученика и роли частей.
const SCREENS_NEW = `
// =============================================================================
// E1. ВЫВОД ЧАСТИ 1 — страница ученика без body (окно пустое); роли html, head, title загораются под речь Коди;
// последняя реплика — интрига: где живёт то, что видно в окне (часть 2).
// =============================================================================
function E1({ p }) {
  const pick = usePick();
  const c = C.e1;
  const mine = useMine();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'curious' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet>
        <div className="kz-scene kz-s15 kz-qism">
          <div className="kz-col kz-s15-left">
            <PageCollage title={mine.title} text="" show={{ doc: 1, html: 1, head: 1, title: 1, body: 1, text: 0 }} anim hl={curK} />
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['html', 'head', 'title', 'body'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '') + (k === 'body' ? ' is-q' : '')} style={{ '--c': k === 'html' ? KZ.coral : k === 'body' ? KZ.teal : KZ.mustard }}>
                  <i aria-hidden="true" />{k === 'body' ? '?' : pick(C.s15.roles[k])}
                </span>
              ))}
            </div>
            <div className="kz-next"><Icon name="doc" size={18} /><span><b>{pick(c.next)}</b></span></div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// H2. КРЮЧОК ЧАСТИ 2 — страница с head и title, а окно пустое: часть body — вопрос; Коди напоминает часть 1 и
// спрашивает, где живёт всё, что видно в окне.
// =============================================================================
function H2({ p }) {
  const pick = usePick();
  const c = C.h2;
  const mine = useMine();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === 0 ? 'hello' : i === 1 ? 'wonder' : 'curious' })));
  const canGo = useAdvanceGate(true, spoken);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet>
        <KzAsk text={c.ask} />
        <div className="kz-scene kz-s15 kz-qism">
          <div className="kz-col kz-s15-left">
            <PageCollage title={mine.title} text="" show={{ doc: 1, html: 1, head: 1, title: 1, body: 1, text: 0 }} hl={curK} />
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['html', 'head', 'title', 'body'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (k !== 'body' && curK === 'title') ? ' is-on' : '') + (k === 'body' ? ' is-q' : '')} style={{ '--c': k === 'html' ? KZ.coral : k === 'body' ? KZ.teal : KZ.mustard }}>
                  <i aria-hidden="true" />{k === 'body' ? '?' : pick(C.s15.roles[k])}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
`;

const CSS_NEW = `
/* Урок 1 частями: роль body пока вопрос — пунктир и мерцание. */
.kz-qism .kz-role.is-q { border-style: dashed; }
.kz-qism .kz-role.is-q.is-on { animation: kzQ 1.2s ease-in-out infinite; }
@keyframes kzQ { 0%, 100% { transform: none; } 50% { transform: scale(1.06); } }
`;

for (const P of PARTS) {
  let scr = readFileSync(join(gen, 'kollazh-screens.jsx'), 'utf8');
  const a = scr.indexOf('const SCREENS = [');
  const b = scr.indexOf('];', a);
  scr = scr.slice(0, a) + 'const SCREENS = [\n  ' + P.screens + '\n' + scr.slice(b);
  scr = must(scr, '// =============================================================================\n// РЕЕСТР И КОРЕНЬ', SCREENS_NEW + '\n// =============================================================================\n// РЕЕСТР И КОРЕНЬ', 'реестр');
  writeFileSync(join(gen, `q${P.k}-screens.jsx`), scr);

  const texts = readFileSync(join(gen, 'b16-texts.jsx'), 'utf8') + TEXTS;
  writeFileSync(join(gen, `q${P.k}-texts.jsx`), texts);
  writeFileSync(join(gen, `q${P.k}.css`), readFileSync(join(gen, 'r28.css'), 'utf8') + CSS_NEW);

  let src = readFileSync(join(gen, 'r28.src.jsx'), 'utf8');
  src = must(src, "lessonId: 'html-01-struktura-dokumenta'", `lessonId: '${P.lessonId}'`, 'lessonId');
  src = must(src, "uz: '1-dars. HTML hujjatining tuzilishi'", 'uz: ' + JSON.stringify(P.title.uz), 'title uz');
  src = must(src, "ru: 'Урок 1. Структура HTML-документа'", 'ru: ' + JSON.stringify(P.title.ru), 'title ru');
  src = must(src, "en: 'Lesson 1. HTML document structure'", 'en: ' + JSON.stringify(P.title.en), 'title en');
  src = must(src, '/*@FILE:b16-texts.jsx@*/', `/*@FILE:q${P.k}-texts.jsx@*/`, 'texts');
  src = must(src, '/*@FILE:kollazh-screens.jsx@*/', `/*@FILE:q${P.k}-screens.jsx@*/`, 'screens');
  src = must(src, '/*@FILE:r28.css@*/', `/*@FILE:q${P.k}.css@*/`, 'css');
  src = src.replace(/^\/\/ СГЕНЕРИРОВАНО[^\n]*\n/, `// СГЕНЕРИРОВАНО tools/redaktor28/build-qism.mjs (урок 1 курса HTML, часть ${P.k}) — не править руками.\n`);
  const srcOut = join(gen, `q${P.k}.src.jsx`);
  writeFileSync(srcOut, src);
  execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcOut, join(root, P.out)], { stdio: 'inherit' });
}
