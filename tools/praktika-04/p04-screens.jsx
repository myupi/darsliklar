// =============================================================================
// ХУК, ПЯТЬ ЗАДАНИЙ, ВЫВОД И КОРЕНЬ ПРАКТИКИ «ОСТРОВА»
// Семь слайдов (заказчик, 22.10.2026). У каждого задания своя механика:
// дописать href → поменять адреса двух ссылок (проверить нажатием) → ссылка
// целиком с пустой строки → найти и починить две ссылки (счётчик) → своё меню
// с нуля (живой список условий).
// =============================================================================
const DOCTYPE = '<!DOCTYPE html>';
// Готовая рамка документа (урок 1): head с title и открытый body; extra — строки в body.
const frame = (title, extra) => [DOCTYPE, '<html>', '  <head>', '    <title>' + title + '</title>', '  </head>', '  <body>'].concat(extra || []);
const END = ['  </body>', '</html>'];
const same = (a, b) => normName(a) === normName(b);
// Разбор нашёл поломку записи, пар или атрибутов — его фраза; line — где она.
const fragFail = (r) => ({ ok: false, msg: r.msg, cat: 'tag', line: r.line });
const linkCode = (href, text) => '<a href="' + href + '">' + text + '</a>';
const isReal = (href) => !!SITE_PAGES[String(href || '').trim()];

// Карта: остров — песчаный круг, на нём флажок своего цвета и пальма. Ждёт —
// флажок сорван и выцвел; готов — флажок поднят.
function stopArt(h, i, on) {
  return (
    <>
      <Cut c="#F3DFA8" round seed={80 + i} n={7} amp={4} cls="pp-stop-disc" />
      <span className={'pp-isle' + (on ? '' : ' is-mess')} style={{ '--hc': h.c }}><i /><i /><i /></span>
    </>
  );
}

// Файлы островов — видны сразу (наглядная помощь): картинка острова и его файл.
function IslandFiles({ hl }) {
  const pick = usePick();
  return (
    <div className="pp-files kz-piece" aria-label={pick(UI.files)}>
      <span className="pp-files-h">{pick(UI.files)}</span>
      <span className="pp-files-row">
        {STREET.filter((s) => s.file).map((s) => (
          <span key={s.id} className={'pp-file' + (hl === s.file ? ' is-hl' : '')} style={{ '--hc': s.c }}>
            <i aria-hidden="true" /><code translate="no">{s.file}</code>
          </span>
        ))}
      </span>
      <span className="pp-files-tip">{pick(UI.tryLink)}</span>
    </div>
  );
}

// t1 — у ссылки появился нужный адрес, слова прежние.
function checkAddHref(code, w, want) {
  const r = checkFrag(code);
  if (!r.ok) return fragFail(r);
  if (!r.links.length) return fb('needA');
  if (r.links.length > 1) return fb('oneLink');
  const L = r.links[0];
  if (L.href === undefined) return fb('noHref');
  if (!L.href) return fb('hrefEmpty');
  if (L.href !== want) return fb('hrefWrong', { href: L.href, want });
  if (!same(L.text, w)) return fb('textKeep', { w });
  return { ok: true, result: {} };
}
// t2, t4 — каждая ссылка со своими словами ведёт на свою страницу.
function checkLinkMap(r, map) {
  if (r.links.length !== map.length) return fb('twoLinks');
  for (let k = 0; k < map.length; k += 1) {
    const m = map[k];
    const L = r.links.find((x) => same(x.text, m.text));
    if (!L) return fb('keepLinks');
    if (L.href === undefined) return fb('noHref');
    if (!L.href) return fb('hrefEmpty');
    if (L.href !== m.href) return fb('linkTo', { text: m.text, href: L.href, want: m.href });
  }
  return { ok: true, result: {} };
}
function checkSwap(code, map) {
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  return checkLinkMap(r, map);
}
// t3 — одна ссылка целиком: a, href с нужным адресом, свои слова.
function checkNewLink(code, want) {
  const s = String(code || '').trim();
  if (!s) return fb('needA');
  const r = checkFrag(code);
  if (!r.ok) return fragFail(r);
  if (!r.links.length) return fb('needA');
  if (r.links.length > 1) return fb('oneLink');
  const L = r.links[0];
  if (L.href === undefined) return fb('noHref');
  if (!L.href) return fb('hrefEmpty');
  if (L.href !== want) return fb('hrefWrong', { href: L.href, want });
  if (!hasLetters(L.text)) return fb('needText');
  return { ok: true, result: {} };
}
// t4 — сломанные ссылки починены; ссылки и абзацы прежние.
function checkFixLinks(code, map) {
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  return checkLinkMap(r, map);
}
const brokenLeft = (code) => { const r = checkFrag(code, { strictText: true }); return r.ok ? 0 : Math.max(1, r.count); };

// t5 — своё меню: h1 с названием, список, хотя бы три ссылки в li — на настоящие страницы.
function menuOf(code) {
  const r = checkFrag(code, { strictText: true });
  const h1 = r.blocks.find((x) => x.t === 'h1' && hasLetters(x.text));
  const ls = r.lists[0] || null;
  const inLi = r.links.filter((L) => L.inLi && hasLetters(L.text) && L.href !== undefined);
  const real = inLi.length > 0 && inLi.every((L) => isReal(L.href));
  return { r, h1, ls, n: inLi.length, inLi, real, closed: r.ok && (r.blocks.length > 0 || r.lists.length > 0) };
}
function checkOwn(code) {
  if (!String(code || '').trim()) return fb('artEmpty', null, 'h1');
  const a = menuOf(code);
  if (!a.r.ok) return fragFail(a.r);
  if (!a.r.blocks.some((x) => x.t === 'h1')) return fb('needH1', null, 'h1');
  if (!a.h1) return fb('menuHeadEmpty', null, 'h1');
  if (!a.ls) return fb('needList', null, 'list');
  if (a.n < 3) return fb('needLinks', null, 'links');
  const bad = a.inLi.find((L) => !isReal(L.href));
  if (bad) return fb(bad.href ? 'notReal' : 'hrefEmpty', { href: bad.href }, 'real');
  return { ok: true, result: { title: squash(a.h1.text), items: a.inLi.map((L) => squash(L.text)) } };
}

// =============================================================================
// ПЯТЬ ЗАДАНИЙ. num — номер задания и остров, к которому оно чинит мост.
// =============================================================================
// 1 · Попугаи — у готовой ссылки нет адреса: дописать href.
function cfgT1(pick) {
  const top = pick(TXT.top);
  const before = frame(top, ['    <h2>' + pick(TXT.whereH) + '</h2>']);
  const w = pick(TXT.parrots), w2 = pick(TXT.cave);
  return {
    id: 't1', num: 1, kind: 'line', C: C.t1,
    spec: { kind: 'line', before, after: END, ind: 4, url: 'index.html' },
    init: () => ({ code: '<a>' + w + '</a>' }),
    check: (st) => checkAddHref(st.code, w, 'parrots.html'),
    hint: (lv) => ({ text: C.t1.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: <IslandFiles hl="parrots.html" />,
    h3: () => <CodeSample code={linkCode('lighthouse.html', pick(TXT.light))} />,
    drill: { make: () => ({
      order: C.t1.drill,
      spec: { kind: 'line', before, after: END, ind: 4, url: 'index.html' },
      init: () => ({ code: '<a>' + w2 + '</a>' }), check: (st) => checkAddHref(st.code, w2, 'cave.html'),
      aids: <IslandFiles hl="cave.html" />
    }) }
  };
}

// 2 · Указатели — «Пещера» и «Маяк» ведут не туда: поменять значения href.
function cfgT2(pick) {
  const top = pick(TXT.top);
  const before = frame(top, ['    <h2>' + pick(TXT.whereH) + '</h2>']);
  const cave = pick(TXT.cave), light = pick(TXT.light), par = pick(TXT.parrotsS), vol = pick(TXT.volcano);
  const map = [{ text: cave, href: 'cave.html' }, { text: light, href: 'lighthouse.html' }];
  const map2 = [{ text: par, href: 'parrots.html' }, { text: vol, href: 'volcano.html' }];
  return {
    id: 't2', num: 2, kind: 'block', C: C.t2,
    spec: { kind: 'block', before, after: END, ind: 4, url: 'index.html' },
    init: () => ({ code: [linkCode('lighthouse.html', cave), linkCode('cave.html', light)].join('\n') }),
    check: (st) => checkSwap(st.code, map),
    hint: (lv) => ({ text: C.t2.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: <IslandFiles />,
    h3: () => <CodeSample code={linkCode('cave.html', cave)} />,
    drill: { make: () => ({
      order: C.t2.drill,
      spec: { kind: 'block', before, after: END, ind: 4, url: 'index.html' },
      init: () => ({ code: [linkCode('volcano.html', par), linkCode('parrots.html', vol)].join('\n') }), check: (st) => checkSwap(st.code, map2),
      aids: <IslandFiles />
    }) }
  };
}

// 3 · Вулкан — ссылка целиком с пустой строки.
function cfgT3(pick) {
  const top = pick(TXT.top);
  const before = frame(top, ['    <h2>' + pick(TXT.whereH) + '</h2>', '    ' + linkCode('parrots.html', pick(TXT.parrots))]);
  return {
    id: 't3', num: 3, kind: 'line', C: C.t3,
    spec: { kind: 'line', before, after: END, ind: 4, url: 'index.html' },
    init: () => ({ code: '' }),
    check: (st) => checkNewLink(st.code, 'volcano.html'),
    hint: (lv) => ({ text: C.t3.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: <IslandFiles hl="volcano.html" />,
    h3: () => <CodeSample code={linkCode('cave.html', pick(TXT.cave))} />,
    drill: { make: () => ({
      order: C.t3.drill,
      spec: { kind: 'line', before, after: END, ind: 4, url: 'index.html' },
      init: () => ({ code: '' }), check: (st) => checkNewLink(st.code, 'lighthouse.html'),
      aids: <IslandFiles hl="lighthouse.html" />
    }) }
  };
}

// 4 · После шторма — опечатка в имени атрибута (ссылка стала чёрной) и нет </a>
// (абзац ниже стал синим). Браузер честно показывает обе поломки.
function cfgT4(pick) {
  const top = pick(TXT.top);
  const before = frame(top, ['    <h2>' + pick(TXT.whereH) + '</h2>']);
  const light = pick(TXT.light), vol = pick(TXT.volcano), cave = pick(TXT.cave), par = pick(TXT.parrotsS);
  const map = [{ text: light, href: 'lighthouse.html' }, { text: vol, href: 'volcano.html' }];
  const map2 = [{ text: cave, href: 'cave.html' }, { text: par, href: 'parrots.html' }];
  const lineOf = (code) => { const r = checkFrag(code, { strictText: true }); return r.ok || r.line == null ? null : before.length + r.line; };
  return {
    id: 't4', num: 4, kind: 'block', C: C.t4,
    spec: { kind: 'block', before, after: END, ind: 4, url: 'index.html' },
    init: () => ({ code: ['<a hrf="lighthouse.html">' + light + '</a>', '<a href="volcano.html">' + vol, '<p>' + pick(TXT.wish) + '</p>'].join('\n') }),
    check: (st) => checkFixLinks(st.code, map),
    hint: (lv, st) => {
      if (lv !== 2) return { text: C.t4.hints[lv - 1] };
      const at = lineOf(st.code);
      if (at != null) return { text: fillL(C.t4.hints[1], { n: at + 1 }) };
      if (brokenLeft(st.code)) return { text: C.t4.hintTags };
      return { text: checkFixLinks(st.code, map).ok ? C.t4.hintLine : C.t4.hintKeep };
    },
    fx: (rec) => (rec.solved ? null : { markLine: rec.hint >= 2 ? lineOf(rec.st.code) : null }),
    aids: (rec, st) => <FixLeft n={brokenLeft(st.code)} />,
    h3: () => <CodeSample code={[linkCode('cave.html', cave), linkCode('parrots.html', par)].join('\n')} />,
    drill: { make: () => ({
      order: C.t4.drill,
      spec: { kind: 'block', before, after: END, ind: 4, url: 'index.html' },
      init: () => ({ code: ['<a href="cave.html">' + cave, '<p>' + pick(TXT.wish2) + '</p>', '<a hreff="parrots.html">' + par + '</a>'].join('\n') }),
      check: (st) => checkFixLinks(st.code, map2),
      aids: (d, st) => <FixLeft n={brokenLeft(st.code)} />
    }) }
  };
}

// 5 · Своё меню — с нуля внутри body: h1, список и три ссылки на острова.
// Список условий загорается по ходу набора; редактор во всё свободное место.
function cfgT5(pick) {
  const top = pick(TXT.top);
  const before = frame(top);
  const items = (code) => {
    const a = menuOf(code);
    return [
      { k: 'h1', ok: !!a.h1, text: UI.needH1 },
      { k: 'list', ok: !!a.ls, text: UI.needList },
      { k: 'n', ok: a.n >= 3, text: UI.need3 },
      { k: 'real', ok: a.n >= 1 && a.real, text: UI.needReal },
      { k: 'cl', ok: a.closed, text: UI.needClosed }
    ];
  };
  return {
    id: 't5', num: 5, kind: 'block', C: C.t5,
    spec: { kind: 'block', before, after: END, ind: 4, big: true, empty: C.t5.empty, url: 'index.html' },
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
    aids: (rec, st) => <><Checklist items={items(st.code)} /><IslandFiles /></>,
    h3: () => <CodeSample code={'<h1>' + pick(TXT.menuH) + '</h1>\n<ul>\n  <li>' + linkCode('cave.html', pick(TXT.cave)) + '</li>\n  …\n</ul>'} />,
    drill: { make: () => ({
      order: C.t5.drill,
      spec: { kind: 'block', before, after: END, ind: 4, empty: C.t5.empty, url: 'index.html' },
      init: () => ({ code: '' }),
      check: (st) => {
        const r = checkFrag(st.code, { strictText: true });
        if (!r.ok) return fragFail(r);
        const L = r.links.find((x) => x.href === 'index.html' && hasLetters(x.text));
        if (!L) return fb(r.links.length ? 'needHome' : 'needA');
        return { ok: true, result: {} };
      }
    }) }
  };
}

const ST1 = ({ p }) => <TaskScreen p={p} make={cfgT1} />;
const ST2 = ({ p }) => <TaskScreen p={p} make={cfgT2} />;
const ST3 = ({ p }) => <TaskScreen p={p} make={cfgT3} />;
const ST4 = ({ p }) => <TaskScreen p={p} make={cfgT4} />;
const ST5 = ({ p }) => <TaskScreen p={p} make={cfgT5} />;

// =============================================================================
// ХУК — острова соединены мостами; одно касание «Шторм!»: острова вздрагивают,
// флажки срывает, мосты-пунктиры рвутся, летят брызги (stop-motion, шорох).
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
  const storm = () => {
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
            <button type="button" className={'kz-btn is-coral pp-wind' + (led ? ' is-led' : '')} disabled={!canTap} onClick={storm}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
                <path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              </svg>
              {pick(UI.storm)}
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

// ВЫВОД — острова горят, своё меню (ссылки можно нажать) и его код, умения, следующий урок.
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
              <div className="pp-fin-b"><PageView title={res.page} blocks={res.blocks} url="index.html" /></div>
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

// Артефакт практики — страница со своим меню ссылок, как её написал ученик.
function practiceArtifact(store) {
  const r = (store.get('t5') || {}).result;
  if (!r) return null;
  return { type: 'html-page', title: r.title, text: (r.items || []).join(', '), items: r.items || [], html: r.html };
}

export default function HtmlPractice04({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
