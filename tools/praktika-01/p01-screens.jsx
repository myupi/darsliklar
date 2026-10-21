// =============================================================================
// ХУК, ПЯТЬ ЗАДАНИЙ, ВЫВОД И КОРЕНЬ ПРАКТИКИ «БУМАЖНАЯ УЛИЦА»
// Семь слайдов (заказчик, 22.10.2026): задания идут от самого лёгкого к
// сложному — слово между тегами → один тег → блок из трёх строк → найти место
// в чужом коде → своя страница внутри готового html.
// =============================================================================
const DOCTYPE = '<!DOCTYPE html>';
const headWith = (title) => [DOCTYPE, '<html>', '  <head>', '    <title>' + title + '</title>', '  </head>'];
const bodyWith = (text) => ['  <body>', '    ' + text, '  </body>', '</html>'];
const HEAD_OPEN = [DOCTYPE, '<html>', '  <head>'];
const afterTitle = (text) => ['  </head>'].concat(bodyWith(text));

// Поле в строке кода (t1): пишется только слово, теги уже стоят.
function checkTitleField(st) {
  if (hasTags(st.title)) return fb('fieldTags', null, 'head');
  if (!st.title.trim()) return fb('titleBlank', null, 'head');
  if (!hasLetters(st.title)) return fb('fieldLetters', null, 'head');
  return { ok: true, result: { title: squash(st.title), text: squash(st.body) } };
}

// Образцы третьей ступени своего дома — по части, где затруднение; всегда для другого дома.
const FRAG = {
  head: (pick) => '<head>\n  <title>' + pick(TXT.workshop) + '</title>\n</head>',
  body: (pick) => '<body>\n  ' + pick(TXT.bikeText) + '\n</body>'
};
const fragCat = (r) => (r.ok || r.cat === 'body' ? 'body' : 'head');

// =============================================================================
// ПЯТЬ ЗАДАНИЙ. Каждое — описание: что в редакторе, как проверить, какие
// подсказки и наглядная помощь, какая дополнительная задача.
// num — номер задания и дом улицы, который оно чинит.
// =============================================================================
// 1 · Пекарня — своё название между готовыми тегами title.
function cfgT1(pick) {
  return {
    id: 't1', num: 1, kind: 'fields', C: C.t1,
    spec: { kind: 'fields', editBody: false, ph: { title: L3('nom', 'название', 'name') } },
    init: () => ({ title: '', body: pick(TXT.bakeryText) }),
    check: checkTitleField,
    hint: (lv) => ({ text: C.t1.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { hl: rec.hint >= 2 ? 'head' : null, led: rec.hint >= 3 ? 'title' : null }),
    drill: { make: () => ({
      order: C.t1.drill, spec: { kind: 'fields', editBody: false },
      init: () => ({ title: '', body: pick(TXT.bikeText) }), check: checkTitleField
    }) }
  };
}

// 2 · Почта — дописать </title>. Пока его нет, браузер честно уносит на вкладку
// весь код после <title>.
function cfgT2(pick, store, lang) {
  return {
    id: 't2', num: 2, kind: 'line', C: C.t2,
    spec: { kind: 'line', before: HEAD_OPEN, after: afterTitle(pick(TXT.postText)), ind: 4 },
    init: () => ({ code: '<title>' + pick(STREET[1].name) }),
    check: (st) => checkLine(st.code, STREET[1].name, lang),
    hint: (lv) => ({ text: C.t2.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    h3: () => <CodeSample code={'<body>\n  …\n</body>'} />,
    drill: { make: () => ({
      order: C.t2.drill,
      spec: { kind: 'line', before: HEAD_OPEN, after: afterTitle(pick(TXT.stopText)), ind: 4 },
      init: () => ({ code: '<title>' + pick(TXT.stop) }), check: (st) => checkLine(st.code, TXT.stop, lang)
    }) }
  };
}

// 3 · Кинотеатр — блок body со своим текстом; схема «1 · 2 · 3» видна сразу.
function cfgT3(pick) {
  return {
    id: 't3', num: 3, kind: 'block', C: C.t3,
    spec: { kind: 'block', before: headWith(pick(STREET[2].name)), after: ['</html>'], ind: 2, empty: C.t3.empty },
    init: () => ({ code: '' }),
    check: (st) => checkBlock(st.code),
    hint: (lv) => ({ text: C.t3.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    orderExtra: <Slots3 mid="text" />,
    h3: () => <CodeSample code={'<body>\n  ' + pick(TXT.bikeText) + '\n</body>'} />,
    drill: { make: () => ({
      order: C.t3.drill,
      spec: { kind: 'block', before: headWith(pick(TXT.pool)), after: ['</html>'], ind: 2, empty: C.t3.empty },
      init: () => ({ code: '' }), check: (st) => checkBlock(st.code), orderExtra: <Slots3 mid="text" />
    }) }
  };
}

// 4 · Школа — нажать место, где кончается head, и вписать </head>.
function cfgT4(pick) {
  const lines = [DOCTYPE, '<html>', '  <head>', '    <title>' + pick(STREET[3].name) + '</title>',
    '  <body>', '    ' + pick(TXT.schoolText), '  </body>', '</html>'];
  const m = C.t4.miss;
  const dlines = headWith(pick(TXT.cafe)).concat(['  <body>', '    ' + pick(TXT.cafeText), '</html>']);
  const dm = C.t4.drillMiss;
  return {
    id: 't4', num: 4, kind: 'gap', C: C.t4,
    spec: { kind: 'gap', lines, gaps: [1, 2, 3, 4, 5, 6], ind: 2, bars: true },
    init: () => ({ at: null, code: '', miss: null }),
    pick: (i) => (i === 3 ? { ok: true, say: C.t4.picked } : { ok: false, msg: i < 2 ? m.before : i === 2 ? m.inside : m.after }),
    orderOf: (st) => (st.at == null ? C.t4.order : C.t4.order2),
    check: (st) => (st.at == null ? fb('pickFirst', { tag: 'head' }, 'head') : checkCloseTag(st.code, 'head')),
    hint: (lv) => ({ text: C.t4.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { ledGap: rec.hint >= 3 && rec.st.at == null ? 3 : null, led: rec.hint >= 3 && rec.st.at != null }),
    drill: { make: () => ({
      order: C.t4.drill,
      orderOf: (st) => (st.at == null ? C.t4.drill : C.t4.drill2),
      spec: { kind: 'gap', lines: dlines, gaps: [4, 5, 6], ind: 2, bars: true },
      init: () => ({ at: null, code: '', miss: null }),
      pick: (i) => (i === 6 ? { ok: true, say: C.t4.drill2 } : { ok: false, msg: i === 4 ? dm.before : dm.inside }),
      check: (st) => (st.at == null ? fb('pickFirst', { tag: 'body' }, 'body') : checkCloseTag(st.code, 'body'))
    }) }
  };
}

// 5 · Свой дом — внутри готового html: head с title (своё название) и body
// со своим текстом. Редактор во всё свободное место; чертёж виден сразу.
function cfgT5(pick) {
  return {
    id: 't5', num: 5, kind: 'doc', C: C.t5,
    spec: { kind: 'doc', big: true, bars: true },
    init: () => ({ code: [DOCTYPE, '<html>', '  ', '</html>'].join('\n') }),
    check: (st) => checkDoc(st.code),
    hint: (lv, st) => {
      if (lv === 1) return { text: C.t5.hints[0] };
      const r = checkDoc(st.code);
      if (lv === 2) return { text: !r.ok && C.house.hint2[r.cat] ? C.house.hint2[r.cat] : C.t5.hints[1] };
      return { text: C.t5.hints[2], cat: fragCat(r) };
    },
    orderExtra: <Blueprint />,
    h3: (rec) => <CodeSample code={FRAG[rec.hcat || 'head'](pick)} />,
    drill: { make: () => ({
      order: C.t5.drill,
      spec: { kind: 'block', before: headWith(pick(TXT.workshop)), after: ['</html>'], ind: 2, empty: C.t3.empty },
      init: () => ({ code: '' }), check: (st) => checkBlock(st.code)
    }) }
  };
}

const ST1 = ({ p }) => <TaskScreen p={p} make={cfgT1} />;
const ST2 = ({ p }) => <TaskScreen p={p} make={cfgT2} />;
const ST3 = ({ p }) => <TaskScreen p={p} make={cfgT3} />;
const ST4 = ({ p }) => <TaskScreen p={p} make={cfgT4} />;
const ST5 = ({ p }) => <TaskScreen p={p} make={cfgT5} />;

// =============================================================================
// ХУК — улица целая; одно касание «Ветер!»: дома выцветают и косятся, с них
// слетают бумажки-вывески (stop-motion, шорох). Потом Коди называет задачу.
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
  const blow = () => {
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
            <button type="button" className={'kz-btn is-coral pp-wind' + (led ? ' is-led' : '')} disabled={!canTap} onClick={blow}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7" />
              </svg>
              {pick(UI.wind)}
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

// ВЫВОД — улица горит, своя страница и её код, что ученик теперь умеет, следующий урок.
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
              <div className="pp-fin-b"><PageView title={res.title} text={res.text} /></div>
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

// Артефакт практики — страница своего дома, как её написал ученик.
function practiceArtifact(store) {
  const r = (store.get('t5') || {}).result;
  if (!r) return null;
  return { type: 'html-page', title: r.title, text: r.text, html: r.html };
}

export default function HtmlPractice01({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
