// =============================================================================
// ХУК, ПЯТЬ ЗАДАНИЙ, ВЫВОД И КОРЕНЬ ПРАКТИКИ «ВЫСТАВКА»
// Семь слайдов (заказчик, 22.10.2026). У каждого задания своя механика:
// дописать src → исправить имена файлов → написать подписи alt (их «читает»
// программа чтения экрана) → найти и починить два тега (счётчик) → своя
// галерея с нуля (живой список условий).
// =============================================================================
const DOCTYPE = '<!DOCTYPE html>';
// Готовая рамка документа (урок 1): head с title и открытый body; extra — строки в body.
const frame = (title, extra) => [DOCTYPE, '<html>', '  <head>', '    <title>' + title + '</title>', '  </head>', '  <body>'].concat(extra || []);
const END = ['  </body>', '</html>'];
const same = (a, b) => normName(a) === normName(b);
// Разбор нашёл поломку записи, пар или атрибутов — его фраза; line — где она.
const fragFail = (r) => ({ ok: false, msg: r.msg, cat: 'tag', line: r.line });
const imgCode = (src, alt) => '<img' + (src != null ? ' src="' + src + '"' : '') + (alt != null ? ' alt="' + alt + '"' : '') + '>';
const isFile = (s) => !!PHOTO_FILES[String(s || '').trim()];

// Карта: рама на стене. Готова — в ней картинка; ждёт — пустая, со знаком «?».
function stopArt(h, i, on) {
  return (
    <>
      <Cut c="#1F2A44" seed={80 + i} n={8} amp={2.4} cls="pp-stop-disc pp-frame" />
      <span className={'pp-frame-in' + (on ? '' : ' is-mess')}>{on && h.pic ? <PgPhoto file={h.pic} /> : on ? <b className="is-star" aria-hidden="true">★</b> : <b aria-hidden="true">?</b>}</span>
    </>
  );
}

// Файлы картинок — видны сразу (наглядная помощь): маленькое фото и имя файла.
function FileShelf({ hl }) {
  const pick = usePick();
  return (
    <div className="pp-files pp-shelf kz-piece" aria-label={pick(UI.files)}>
      <span className="pp-files-h">{pick(UI.files)}</span>
      <span className="pp-shelf-row">
        {FILE_LIST.map((f) => (
          <span key={f} className={'pp-shelf-f' + (hl === f ? ' is-hl' : '')}><PgPhoto file={f} /><code translate="no">{f}</code></span>
        ))}
      </span>
    </div>
  );
}
// Что скажет программа чтения экрана — alt каждой картинки на странице (t3).
function ReaderList({ code }) {
  const pick = usePick();
  const imgs = checkFrag(code).imgs;
  return (
    <div className="pp-reader kz-piece" aria-live="polite">
      <span className="pp-files-h">{pick(UI.reader)}</span>
      {imgs.map((I, k) => (
        <span key={k} className={'pp-reader-l' + (I.alt && hasLetters(I.alt) ? ' is-ok' : '')}>
          <i className="pp-spk" aria-hidden="true" />{I.alt && I.alt.trim() ? '«' + I.alt + '»' : pick(UI.noAlt)}
        </span>
      ))}
    </div>
  );
}

// t1 — у картинки появился нужный файл, alt прежний.
function checkAddSrc(code, want, alt) {
  const r = checkFrag(code);
  if (!r.ok) return fragFail(r);
  if (!r.imgs.length) return fb('needImg');
  if (r.imgs.length > 1) return fb('oneImg');
  const I = r.imgs[0];
  if (I.src === undefined) return fb('noSrc');
  if (!I.src) return fb('srcEmpty');
  if (I.src !== want) return fb('srcWrong', { src: I.src, want });
  if (!same(I.alt, alt)) return fb('altKeep', { w: alt });
  return { ok: true, result: {} };
}
// t2, t4 — у каждой картинки (по её alt) свой файл.
function checkImgMap(r, map) {
  if (r.imgs.length !== map.length) return fb('twoImgs');
  for (let k = 0; k < map.length; k += 1) {
    const m = map[k];
    const I = r.imgs.find((x) => same(x.alt, m.alt));
    if (!I) return fb('keepImgs');
    if (I.src === undefined) return fb('noSrc');
    if (!I.src) return fb('srcEmpty');
    if (I.src !== m.src) return fb(isFile(I.src) ? 'imgTo' : 'imgNoFile', { alt: m.alt, src: I.src, want: m.src });
  }
  return { ok: true, result: {} };
}
function checkNames(code, map) {
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  return checkImgMap(r, map);
}
// t3 — у каждой картинки описание словами: не пусто, не имя файла, не «картинка».
function altIssue(I) {
  if (I.alt === undefined) return fb('needAlt', { src: I.src });
  const a = String(I.alt).trim();
  if (!a) return fb('altEmpty', { src: I.src });
  if (/\.(jpe?g|png|gif)\b/i.test(a)) return fb('altFile');
  if (TXT.generic.indexOf(normName(a)) >= 0) return fb('altGeneric', { w: a });
  if (!hasLetters(a)) return fb('altEmpty', { src: I.src });
  return null;
}
function checkAlts(code, srcs) {
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  if (r.imgs.length !== srcs.length) return fb('twoImgs');
  for (let k = 0; k < srcs.length; k += 1) {
    const I = r.imgs.find((x) => x.src === srcs[k]);
    if (!I) return fb('keepSrc');
    const bad = altIssue(I);
    if (bad) return bad;
  }
  return { ok: true, result: {} };
}
const brokenLeft = (code) => { const r = checkFrag(code, { strictText: true }); return r.ok ? 0 : Math.max(1, r.count); };

// t5 — своя галерея: h1, p, хотя бы две картинки из файлов, у каждой alt.
function galOf(code) {
  const r = checkFrag(code, { strictText: true });
  const h1 = r.blocks.find((x) => x.t === 'h1' && hasLetters(x.text));
  const p = r.blocks.find((x) => x.t === 'p' && hasLetters(x.text));
  const files = r.imgs.filter((I) => isFile(I.src));
  const alts = r.imgs.length > 0 && r.imgs.every((I) => !altIssue(I));
  return { r, h1, p, n: files.length, alts, closed: r.ok && (r.blocks.length > 0 || r.lists.length > 0) };
}
function checkOwn(code) {
  if (!String(code || '').trim()) return fb('artEmpty', null, 'h1');
  const a = galOf(code);
  if (!a.r.ok) return fragFail(a.r);
  if (!a.r.blocks.some((x) => x.t === 'h1')) return fb('needH1', null, 'h1');
  if (!a.h1) return fb('galHeadEmpty', null, 'h1');
  if (!a.p) return fb('needP', null, 'p');
  if (a.r.imgs.length < 2) return fb('needTwo', null, 'img');
  const badF = a.r.imgs.find((I) => !isFile(I.src));
  if (badF) return badF.src ? fb('noFile', { src: badF.src }, 'file') : fb('noSrc', null, 'file');
  const badA = a.r.imgs.find((I) => altIssue(I));
  if (badA) return Object.assign(altIssue(badA), { cat: 'alt' });
  return { ok: true, result: { title: squash(a.h1.text), items: a.r.imgs.map((I) => squash(I.alt)), images: a.r.imgs.map((I) => ({ src: I.src, alt: squash(I.alt) })) } };
}

// =============================================================================
// ПЯТЬ ЗАДАНИЙ. num — номер задания и рама на стене, куда оно возвращает картинку.
// =============================================================================
// 1 · Кот — у картинки есть alt, но нет src: дописать src="cat.jpg".
function cfgT1(pick) {
  const top = pick(TXT.top);
  const before = frame(top, ['    <h2>' + pick(TXT.hallH) + '</h2>']);
  const cat = pick(TXT.cat), dog = pick(TXT.dog);
  return {
    id: 't1', num: 1, kind: 'line', C: C.t1,
    spec: { kind: 'line', before, after: END, ind: 4, url: 'gallery.html' },
    init: () => ({ code: imgCode(null, cat) }),
    check: (st) => checkAddSrc(st.code, 'cat.jpg', cat),
    hint: (lv) => ({ text: C.t1.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: <FileShelf hl="cat.jpg" />,
    h3: () => <CodeSample code={imgCode('sun.png', pick(TXT.sun))} />,
    drill: { make: () => ({
      order: C.t1.drill,
      spec: { kind: 'line', before, after: END, ind: 4, url: 'gallery.html' },
      init: () => ({ code: imgCode(null, dog) }), check: (st) => checkAddSrc(st.code, 'dog.jpg', dog),
      aids: <FileShelf hl="dog.jpg" />
    }) }
  };
}

// 2 · Попугай и рыбка — опечатки в именах файлов: сломанные картинки.
function cfgT2(pick) {
  const top = pick(TXT.top);
  const before = frame(top, ['    <h2>' + pick(TXT.hallH) + '</h2>']);
  const par = pick(TXT.parrot), fish = pick(TXT.fish), dog = pick(TXT.dog), cat = pick(TXT.catS);
  const map = [{ alt: par, src: 'parrot.png' }, { alt: fish, src: 'fish.jpg' }];
  const map2 = [{ alt: dog, src: 'dog.jpg' }, { alt: cat, src: 'cat.jpg' }];
  return {
    id: 't2', num: 2, kind: 'block', C: C.t2,
    spec: { kind: 'block', before, after: END, ind: 4, url: 'gallery.html' },
    init: () => ({ code: [imgCode('parot.png', par), imgCode('fish.jpeg', fish)].join('\n') }),
    check: (st) => checkNames(st.code, map),
    hint: (lv) => ({ text: C.t2.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: <FileShelf />,
    h3: () => <CodeSample code={imgCode('parrot.png', par)} />,
    drill: { make: () => ({
      order: C.t2.drill,
      spec: { kind: 'block', before, after: END, ind: 4, url: 'gallery.html' },
      init: () => ({ code: [imgCode('dgo.jpg', dog), imgCode('cat.png', cat)].join('\n') }), check: (st) => checkNames(st.code, map2),
      aids: <FileShelf />
    }) }
  };
}

// 3 · Подписи — две картинки без alt: описания словами. Рядом — что «скажет»
// программа чтения экрана.
function cfgT3(pick) {
  const top = pick(TXT.top);
  const before = frame(top, ['    <h2>' + pick(TXT.hallH) + '</h2>']);
  return {
    id: 't3', num: 3, kind: 'block', C: C.t3,
    spec: { kind: 'block', before, after: END, ind: 4, url: 'gallery.html' },
    init: () => ({ code: [imgCode('parrot.png'), imgCode('sun.png')].join('\n') }),
    check: (st) => checkAlts(st.code, ['parrot.png', 'sun.png']),
    hint: (lv) => ({ text: C.t3.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: (rec, st) => <ReaderList code={st.code} />,
    h3: () => <CodeSample code={imgCode('dog.jpg', pick(TXT.dog))} />,
    drill: { make: () => ({
      order: C.t3.drill,
      spec: { kind: 'block', before, after: END, ind: 4, url: 'gallery.html' },
      init: () => ({ code: imgCode('flower.jpg') }), check: (st) => checkAlts(st.code, ['flower.jpg']),
      aids: (d, st) => <ReaderList code={st.code} />
    }) }
  };
}

// 4 · Витрина — scr вместо src и href у img: на странице только тексты alt.
function cfgT4(pick) {
  const top = pick(TXT.top);
  const before = frame(top, ['    <h2>' + pick(TXT.hallH) + '</h2>']);
  const fish = pick(TXT.fish), dog = pick(TXT.dog), cat = pick(TXT.catS), sun = pick(TXT.sun);
  const map = [{ alt: fish, src: 'fish.jpg' }, { alt: dog, src: 'dog.jpg' }];
  const map2 = [{ alt: cat, src: 'cat.jpg' }, { alt: sun, src: 'sun.png' }];
  const lineOf = (code) => { const r = checkFrag(code, { strictText: true }); return r.ok || r.line == null ? null : before.length + r.line; };
  return {
    id: 't4', num: 4, kind: 'block', C: C.t4,
    spec: { kind: 'block', before, after: END, ind: 4, url: 'gallery.html' },
    init: () => ({ code: ['<img scr="fish.jpg" alt="' + fish + '">', '<img href="dog.jpg" alt="' + dog + '">'].join('\n') }),
    check: (st) => checkNames(st.code, map),
    hint: (lv, st) => {
      if (lv !== 2) return { text: C.t4.hints[lv - 1] };
      const at = lineOf(st.code);
      if (at != null) return { text: fillL(C.t4.hints[1], { n: at + 1 }) };
      if (brokenLeft(st.code)) return { text: C.t4.hintTags };
      return { text: checkNames(st.code, map).ok ? C.t4.hintLine : C.t4.hintKeep };
    },
    fx: (rec) => (rec.solved ? null : { markLine: rec.hint >= 2 ? lineOf(rec.st.code) : null }),
    aids: (rec, st) => <FixLeft n={brokenLeft(st.code)} />,
    h3: () => <CodeSample code={[imgCode('cat.jpg', cat), imgCode('sun.png', sun)].join('\n')} />,
    drill: { make: () => ({
      order: C.t4.drill,
      spec: { kind: 'block', before, after: END, ind: 4, url: 'gallery.html' },
      init: () => ({ code: ['<img sr="cat.jpg" alt="' + cat + '">', '<img src="sun.png" alt="' + sun + '"></img>'].join('\n') }),
      check: (st) => checkNames(st.code, map2),
      aids: (d, st) => <FixLeft n={brokenLeft(st.code)} />
    }) }
  };
}

// 5 · Своя галерея — с нуля внутри body: h1, p и две картинки с src и alt.
// Список условий загорается по ходу набора; редактор во всё свободное место.
function cfgT5(pick) {
  const top = pick(TXT.top);
  const before = frame(top);
  const items = (code) => {
    const a = galOf(code);
    return [
      { k: 'h1', ok: !!a.h1, text: UI.needH1 },
      { k: 'p', ok: !!a.p, text: UI.needP },
      { k: 'n', ok: a.n >= 2, text: UI.need2 },
      { k: 'alt', ok: a.n >= 1 && a.alts, text: UI.needAlts },
      { k: 'cl', ok: a.closed, text: UI.needClosed }
    ];
  };
  return {
    id: 't5', num: 5, kind: 'block', C: C.t5,
    spec: { kind: 'block', before, after: END, ind: 4, big: true, empty: C.t5.empty, url: 'gallery.html' },
    init: () => ({ code: '' }),
    check: (st) => {
      const r = checkOwn(st.code);
      if (!r.ok) return r;
      const html = before.concat(st.code.split('\n').map((l) => '    ' + l)).concat(END).join('\n');
      const pg = renderDoc(html);
      return { ok: true, result: Object.assign({}, r.result, { html, page: pg.title, blocks: pg.blocks }) };
    },
    hint: (lv, st) => {
      if (lv !== 2) return { text: C.t5.hints[lv - 1] };
      const r = checkOwn(st.code);
      return { text: C.t5.hint2[r.ok ? 'tag' : (r.cat || 'tag')] || C.t5.hints[1] };
    },
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: (rec, st) => <><Checklist items={items(st.code)} /><FileShelf /></>,
    h3: () => <CodeSample code={'<h1>' + pick(TXT.galH) + '</h1>\n<p>' + pick(TXT.galP) + '</p>\n' + imgCode('sun.png', pick(TXT.sun)) + '\n…'} />,
    drill: { make: () => ({
      order: C.t5.drill,
      spec: { kind: 'block', before, after: END, ind: 4, empty: C.t5.empty, url: 'gallery.html' },
      init: () => ({ code: '' }),
      check: (st) => {
        const r = checkFrag(st.code, { strictText: true });
        if (!r.ok) return fragFail(r);
        const I = r.imgs[0];
        if (!I) return fb('needImg');
        if (I.src !== 'flower.jpg') return I.src ? fb('srcWrong', { src: I.src, want: 'flower.jpg' }) : fb('noSrc');
        const bad = altIssue(I);
        return bad || { ok: true, result: {} };
      },
      aids: <FileShelf hl="flower.jpg" />
    }) }
  };
}

const ST1 = ({ p }) => <TaskScreen p={p} make={cfgT1} />;
const ST2 = ({ p }) => <TaskScreen p={p} make={cfgT2} />;
const ST3 = ({ p }) => <TaskScreen p={p} make={cfgT3} />;
const ST4 = ({ p }) => <TaskScreen p={p} make={cfgT4} />;
const ST5 = ({ p }) => <TaskScreen p={p} make={cfgT5} />;

// =============================================================================
// ХУК — рамы с картинками; одно касание «Открыть выставку»: рамы вздрагивают,
// картинки выпадают (stop-motion, шорох), в рамах остаётся «?».
// =============================================================================
function SIntro({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.intro;
  const [done, setDone] = useState(() => !!(store.get('intro') || {}).done);
  const [blown, setBlown] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.plan : c.say, pose: 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, 0);
  const openIt = () => {
    if (!canTap || done) return;
    sfx('pop', true);
    setBlown(true);
    setDone(true);
    store.set('intro', { done: true });
    sayNow(joinL(c.blown, c.plan), 'wonder');
  };
  return (
    <PStage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.plan : c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} label={UI.start} /></>}>
      <Sheet cls="pp-sheet pp-sheet-intro">
        <PAsk text={done ? c.order : c.ask} />
        <StreetMap whole={!done} blown={blown} />
        {done ? <p className="pp-intro-note kz-piece">{pick(c.note)}</p> : (
          <div className="pp-wind-row">
            <button type="button" className={'kz-btn is-coral pp-wind' + (led ? ' is-led' : '')} disabled={!canTap} onClick={openIt}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
                <path d="M4 21V5l8-2v18M12 3l8 2v16M4 21h16M9 12h.01" />
              </svg>
              {pick(UI.open)}
            </button>
          </div>
        )}
      </Sheet>
    </PStage>
  );
}

// Переключатель «Страница / Код» на телефоне в выводе.
function PSeg({ value, onChange }) {
  const pick = usePick();
  return (
    <div className="pp-seg" role="radiogroup">
      {[{ v: 'page', label: UI.page }, { v: 'code', label: UI.code }].map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} className={'pp-seg-b' + (value === o.v ? ' is-on' : '')}
          onClick={() => { sfx('tap', true); onChange(o.v); }}>{pick(o.label)}</button>
      ))}
    </div>
  );
}

// ВЫВОД — рамы горят, своя галерея и её код, умения, следующий урок.
function SFin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'celebrate' }]);
  const canGo = useAdvanceGate(true, spoken);
  const [view, setView] = useState('page');
  const res = (store.get('t5') || {}).result;
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  return (
    <PStage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.say}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="pp-sheet pp-sheet-fin">
        <StreetMap glow />
        {res ? (
          <div className="pp-fin">
            <div className="pp-fin-top">
              <span className="pp-stamp kz-piece"><Icon name="check" size={18} />{pick(UI.ready)}</span>
              <span className="pp-only-narrow"><PSeg value={view} onChange={setView} /></span>
            </div>
            <div className={'pp-fin-pair view-' + view}>
              <div className="pp-fin-b"><PageView title={res.page} blocks={res.blocks} url="gallery.html" /></div>
              <div className="pp-fin-c"><Pad><CodeSample code={res.html} /></Pad></div>
            </div>
            <div className="pp-skills kz-piece">
              {c.skills.map((sk, i) => (
                <span className="pp-skill" key={i} style={{ '--dl': (0.2 + i * 0.12) + 's' }}><Icon name="check" size={13} />{pick(sk)}</span>
              ))}
            </div>
            <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
          </div>
        ) : null}
      </Sheet>
    </PStage>
  );
}

// =============================================================================
// РЕЕСТР ЭКРАНОВ, АРТЕФАКТ, КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 'intro', code: 'HOOK', Comp: SIntro },
  { id: 't1', code: 'LEVEL-1', Comp: ST1 }, { id: 't2', code: 'LEVEL-2', Comp: ST2 },
  { id: 't3', code: 'LEVEL-3', Comp: ST3 }, { id: 't4', code: 'CHECK-1', Comp: ST4 },
  { id: 't5', code: 'RESULT', Comp: ST5 },
  { id: 'fin', code: 'PREVIEW', Comp: SFin }
];

// «Повторить» стирает только текущий экран.
const SCREEN_RESET = { intro: ['intro'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5'], fin: [] };

// Артефакт практики — своя галерея, как её написал ученик.
function practiceArtifact(store) {
  const r = (store.get('t5') || {}).result;
  if (!r) return null;
  return { type: 'html-page', title: r.title, text: (r.items || []).join(', '), items: r.items || [], images: r.images || [], html: r.html };
}

export default function HtmlPractice05({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: practiceArtifact(store) })
  });
  useParallax();
  usePaperSound();
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  // Прогрев озвучки: реплики этого экрана и следующего — заранее.
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  // Переход «разбор и сборка» — на «Дальше» и «Назад», как в уроке 1.
  const go = useKzTransition(cur.id + ':' + R.runN);
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next), prev: R.i > 0 ? go(R.prev) : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}
