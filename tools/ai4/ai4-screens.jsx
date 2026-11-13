// =============================================================================
// ЭКРАНЫ УРОКА 4 МОДУЛЯ «ИИ» «Как должен выглядеть сайт?» (12.11.2026). Общие экраны модуля — tools/ai1/ai-common.jsx,
// симулятор с «Ko'rinishi?» (настроение, цвета, форма, тени, шрифт) — tools/ai1/ai1-kit.jsx.
// =============================================================================

const K5 = ['what', 'why', 'who', 'inside', 'look'];
const missRow = (qi) => ({ q: FORMULA[qi], t: MISS, cls: 'is-task is-miss', body: <span className="a1-later">…</span> });
const colorKeys = (lk) => (lk ? lk.colors.map((c) => c.k) : []);
const mainColor = (lk) => { const c = lk ? lk.colors.find((x) => x.k !== 'white') : null; return c ? c.k : null; };
// Общая проверка строки «Ko'rinishi?»: пусто → «напиши»; «chiroyli» → «у каждого своё»; ничего не узнано → «например».
const lookIssue = (look, c) => {
  if (!look) return (c.msgs && c.msgs.empty) || M.empty;
  const lk = lookOf(look);
  if (lk.vague) return (c.msgs && c.msgs.vague) || M.vague;
  if (lk.none) return M.none;
  return null;
};
// Четыре готовые строки и поле «Ko'rinishi?».
const rows4 = (T) => [txtRow(T.vals[0], 0), txtRow(T.vals[1], 1), txtRow(T.vals[2], 2), txtRow(T.vals[3], 3)];
const initOf = (pick, c, look) => [pick(c.what), pick(c.why), pick(c.who), pick(c.inside), look || ''];
const beforeOf = (T, look) => ({ what: T.vals[0], why: T.vals[1], who: T.vals[2], inside: T.vals[3], look: look || '' });
// На сайте — метки только «Ko'rinishi?» и «Taxmin» (остальные строки уже знакомы).
const PIN_LOOK = [false, false, false, false];
// Промпт одной строкой — для домашки (пять строк).
const promptLine5 = (pick, pr) => {
  const t = (x) => String(x || '').trim().replace(/[.!]+$/, '');
  return pick(fillL(L3("{a}. Uning maqsadi: {b}. Sayt {c} uchun. Saytda bo'lsin: {d}. Ko'rinishi: {e}.", '{a}. Его цель: {b}. Сайт для: {c}. На сайте: {d}. Вид: {e}.', '{a}. Its goal: {b}. It’s for {c}. On the site: {d}. Look: {e}.'),
    { a: capS(pr.what), b: t(pr.why), c: t(pr.who), d: t(pr.inside), e: t(pr.look) }));
};

// =============================================================================
// S1. КРЮЧОК — пять строк, «Ko'rinishi?» = «chiroyli bo'lsin» → нежно-розовый сайт для киберспорта («Taxmin»).
// Загадка: «красиво» все понимают одинаково.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [ph, setPh] = useState(solved ? 2 : 0);   // 0 — промпт Коди, 1 — ИИ пишет, 2 — сайт готов
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken) && ph === 0;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap, 0);
  const send = () => {
    if (!canTap) return;
    sfx('pop', true); setPh(1);
    setTimeout(() => { setPh(2); put({ done: true }); sfx('soft', true); sayNow(c.magic, 'embarrassed'); say(c.done, 'think'); }, AI_MS());
  };
  const pr = { what: pick(c.what), why: pick(c.why), who: pick(c.who), inside: pick(c.inside), look: pick(c.look) };
  const site = aiSite(pick, pr);
  const rows = [txtRow(pr.what, 0), txtRow(pr.why, 1), txtRow(pr.who, 2), txtRow(pr.inside, 3), txtRow(pr.look, 4)];
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ph === 2 ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet">
        <KzAsk text={ph === 2 ? c.askDone : c.ask} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={rows} send={ph < 2 ? (
              <button type="button" className="a1-send is-ready" disabled={!canTap} onClick={send}>
                <span>{pick(ph === 1 ? UI.thinking : UI.send)}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <Led on={led} />
              </button>) : null} />
            {ph === 2 ? <div className="a1-in"><TaskCard c={{ card: c.seen }} /></div> : null}
          </div>
          <div className="kz-col a1-right">{ph < 2 ? <div className={'a1-empty' + (ph === 1 ? ' is-busy' : '')}>{ph === 1 ? <span className="a1-gen a1-gen-in"><i className="a1-aidot">✦</i>{pick(UI.gen)}<span className="a1-typing"><i /><i /><i /></span></span> : pick(c.empty)}</div> : <AiBrowser site={site} pins={pinsOf.apply(null, [site].concat(PIN_LOOK))} />}</div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Показ: четыре строки те же, «Ko'rinishi?» меняется — меняется дизайн; метки — «Ko'rinishi?».
const lookSteps = (pick, c, list) => list.map((x, i) => {
  const look = x ? pick(x) : '';
  const base = { what: pick(c.what), why: pick(c.why), who: pick(c.who), inside: pick(c.inside) };
  return { pr: Object.assign({ look }, base), rows: () => [txtRow(base.what, 0), txtRow(base.why, 1), txtRow(base.who, 2), txtRow(base.inside, 3), look ? txtRow(look, 4) : missRow(4)],
    pins: i === 0 && !look ? false : undefined, pinWhat: false, pinWhy: false, pinWho: false, pinIn: false };
});
// S2. ПОКАЗ настроения — книжный клуб: пусто → современный → минимализм → весёлый.
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  return <AiShow p={p} c={c} id="s2" steps={lookSteps(pick, c, [null, c.l1, c.l2, c.l3])} />;
}
// S3. САМ — праздник в детском саду: весёлое настроение.
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const T = usePromptTask('s3', c, initOf(pick, c), (pr) => lookIssue(pr.look, c) || (lookOf(pr.look).moods.indexOf('fun') >= 0 ? null : c.msgs.other), null, K5);
  return <TaskScreen p={p} c={c} T={T} rows={rows4(T).concat(fieldRow(T, 4, 4, c.ph, 120))} before={beforeOf(T)} pinOpts={PIN_LOOK} />;
}
// S4. ЗАКРЕПЛЕНИЕ — какое «Ko'rinishi?» точнее.
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  return <RoundsScreen p={p} c={c} id="s4" keyOf={(it) => it.right} ansOf={(it) => pick(it[it.right])}
    opts={() => ['a', 'b']} optLabel={(v, it) => pick(it[v])}
    body={() => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(c.q)}</p></div>} />;
}
// S5. ПОКАЗ цветов — футбольный клуб: только стиль → синий и белый → красный и жёлтый → чёрный и золотой.
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  return <AiShow p={p} c={c} id="s5" steps={lookSteps(pick, c, [c.k0, c.k1, c.k2, c.k3])} />;
}
// S6. САМ — цвета пиццерии: красный (главный) и зелёный.
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const T = usePromptTask('s6', c, initOf(pick, c), (pr) => {
    const e = lookIssue(pr.look, c);
    if (e) return e;
    const lk = lookOf(pr.look), ks = colorKeys(lk);
    if (!ks.length) return c.msgs.noColor;
    if (ks.indexOf('red') < 0 || ks.indexOf('green') < 0) return c.msgs.other;
    return mainColor(lk) === 'red' ? null : c.msgs.first;
  }, null, K5);
  return <TaskScreen p={p} c={c} T={T} rows={rows4(T).concat(fieldRow(T, 4, 4, c.ph, 120))} before={beforeOf(T)} pinOpts={PIN_LOOK} />;
}
// S7. ЗАКРЕПЛЕНИЕ — какой стиль подходит сайту.
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  return <RoundsScreen p={p} c={c} id="s7" keyOf={(it) => it.right} ansOf={(it) => pick(MOOD_L[it.right])}
    opts={(it) => it.opts} optLabel={(v) => pick(MOOD_L[v])}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>«{pick(it.t)}»</p></div>} />;
}
// S8. ПОКАЗ формы и шрифта — курс роботов: скругления → большие тени → острые углы, без теней, шрифт кода.
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  return <AiShow p={p} c={c} id="s8" steps={lookSteps(pick, c, [c.f0, c.f1, c.f2, c.f3])} />;
}
// S9. САМ — бабушкины сладости: рукописный шрифт, коричневый и золотой.
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const T = usePromptTask('s9', c, initOf(pick, c), (pr) => {
    const e = lookIssue(pr.look, c);
    if (e) return e;
    const lk = lookOf(pr.look), ks = colorKeys(lk);
    if (lk.font !== 'hand') return c.msgs.font;
    return ks.indexOf('brown') >= 0 || ks.indexOf('gold') >= 0 ? null : c.msgs.color;
  }, null, K5);
  return <TaskScreen p={p} c={c} T={T} rows={rows4(T).concat(fieldRow(T, 4, 4, c.ph, 140))} before={beforeOf(T)} pinOpts={PIN_LOOK} />;
}
// S10. САМ (перенос) — киберспорт из крючка: тёмный неон, зелёный.
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  const T = usePromptTask('s10', c, initOf(pick, c, pick(C.s1.look)), (pr) => {
    const e = lookIssue(pr.look, c);
    if (e) return e;
    const lk = lookOf(pr.look);
    if (lk.moods.indexOf('neon') < 0 && lk.moods.indexOf('dark') < 0) return c.msgs.neon;
    return colorKeys(lk).indexOf('green') >= 0 ? null : c.msgs.green;
  }, null, K5);
  return <TaskScreen p={p} c={c} T={T} rows={rows4(T).concat(fieldRow(T, 4, 4, c.ph, 140, true))} before={beforeOf(T, pick(C.s1.look))} pinOpts={PIN_LOOK} />;
}
// G1. ГЛАВНЫЙ ЦВЕТ — Коди написал «жёлтый, красный и белый» → сайт жёлтый; главным должен быть красный.
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const T = usePromptTask('g1', c, initOf(pick, c, pick(c.bad)), (pr) => {
    const e = lookIssue(pr.look, c);
    if (e) return e;
    const lk = lookOf(pr.look);
    if (colorKeys(lk).indexOf('red') < 0) return c.msgs.noRed;
    return mainColor(lk) === 'red' ? null : c.msgs.first;
  }, 'embarrassed', K5);
  return <TaskScreen p={p} c={c} T={T} rows={rows4(T).concat(fieldRow(T, 4, 4, c.ph, 120, true))} before={beforeOf(T, pick(c.bad))} pinOpts={PIN_LOOK} />;
}
// DET. ДЕТЕКТИВ: какое «Ko'rinishi?» дало сайт (A/B/C) и что это за стиль.
function Det({ p }) {
  const pick = usePick();
  const c = C.det;
  const base = C.s2;
  const siteOf = (look) => aiSite(pick, { what: pick(base.what), why: pick(base.why), inside: pick(base.inside), look: pick(look) });
  return <RoundsScreen pickCards={(it) => it.type === 'which'} p={p} c={c} id="det" keyOf={(it) => it.right}
    ansOf={(it) => (it.type === 'which' ? it.right.toUpperCase() : pick(MOOD_L[it.right]))}
    opts={(it) => (it.type === 'which' ? ['a', 'b', 'c'] : it.opts)}
    optLabel={(v, it) => (it.type === 'which' ? v.toUpperCase() : pick(MOOD_L[v]))}
    body={(it, R) => (it.type === 'which' ? (
      <div className="a1-which">
        <div className="a1-which-site"><AiBrowser site={siteOf(it.look)} small /></div>
        <div className="a1-which-list">
          <span className="a1-qh">{pick(c.qWhich)}</span>
          {['a', 'b', 'c'].map((v) => <PickCard key={v} R={R} v={v} cls="a1-pr a4-pr-look"><b>{v.toUpperCase()}</b><span><span className="a1-pr-l"><em>{pick(FORMULA[4])}</em>{pick(it[v])}</span></span></PickCard>)}
        </div>
      </div>
    ) : (
      <div className="a4-mood">
        <span className="a1-qh">{pick(c.qMood)}</span>
        <div className="a1-which-site"><AiBrowser site={siteOf(it.look)} small /></div>
      </div>
    ))} />;
}
// S12. ИСПРАВЬ «chiroyli va zo'r» Коди — олимпиада: строгий, синий и белый, классический шрифт.
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const T = usePromptTask('s12', c, initOf(pick, c, pick(c.bad)), (pr) => {
    const e = lookIssue(pr.look, c);
    if (e) return e;
    const lk = lookOf(pr.look);
    if (lk.moods.indexOf('serious') < 0) return c.msgs.serious;
    return mainColor(lk) === 'blue' ? null : c.msgs.blue;
  }, 'embarrassed', K5);
  return <TaskScreen p={p} c={c} T={T} rows={rows4(T).concat(fieldRow(T, 4, 4, c.ph, 120, true))} before={beforeOf(T, pick(c.bad))} pinOpts={PIN_LOOK} />;
}
// S13. ПОЛНОЕ ОПИСАНИЕ — музыкальный фестиваль: стиль, цвета, углы и тени.
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const T = usePromptTask('s13', c, initOf(pick, c), (pr) => {
    const e = lookIssue(pr.look, c);
    if (e) return e;
    const lk = lookOf(pr.look);
    if (!lk.moods.length) return c.msgs.mood;
    if (!lk.colors.length) return c.msgs.color;
    if (lk.shape !== 'round') return c.msgs.shape;
    return lk.shadow === 'big' ? null : c.msgs.shadow;
  }, null, K5);
  return <TaskScreen p={p} c={c} T={T} rows={rows4(T).concat(fieldRow(T, 4, 4, c.ph, 160))} before={beforeOf(T)} pinOpts={PIN_LOOK} />;
}
// S14. СВОЙ САЙТ — все пять строк.
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const T = usePromptTask('s14', c, ['', '', '', '', ''], (pr) => {
    if (!pr.what) return c.msgs.noWhat;
    if (!has(pr.what, RE_KIND) && pr.what.split(/\s+/).length < 2) return c.msgs.kind;
    if (!pr.why) return c.msgs.noWhy;
    if (!anyGoal(pr.why)) return c.msgs.goal;
    if (!pr.who) return c.msgs.noWho;
    const a = audOf(pr.who);
    if (a.key === 'all' || a.key === 'gen') return c.msgs.who;
    if (!pr.inside) return c.msgs.noIn;
    const x = insOf(pr.inside);
    if (!x.blocks.length) return M3none;
    if (!pr.look) return c.msgs.noLook;
    return lookIssue(pr.look, c);
  }, 'point', K5);
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.phWhat, 60), fieldRow(T, 1, 1, c.phWhy, 90), fieldRow(T, 2, 2, c.phWho, 90), fieldRow(T, 3, 3, c.phIn, 120), fieldRow(T, 4, 4, c.phLook, 120)]} later={5} />;
}
const M3none = L3("«Ichida nima?» da blok topilmadi. Masalan: rasmlar, narxlar, aloqa.", 'В «Что внутри?» не найдено блоков. Например: фото, цены, контакты.', 'No blocks found in “What’s inside?”. For example: photos, prices, contact.');
// Q1. ВЕРНО ИЛИ НЕТ — пять фраз урока.
function Q1({ p }) {
  const pick = usePick();
  const c = C.q1;
  return <RoundsScreen p={p} c={c} id="q1" keyOf={(it) => it.right} ansOf={(it) => pick(it.right ? c.yes : c.no)}
    opts={() => [true, false]} optLabel={(v) => pick(v ? c.yes : c.no)}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}
// FIN. ВЫВОД — разгадка: «красиво» у каждого своё; свой промпт из пяти строк; домашка.
const QI = { what: 0, why: 1, who: 2, in: 3, look: 4 };
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const own = store.get('pr_s14') || { what: pick(C.s10.what), why: pick(C.s10.why), who: pick(C.s10.who), inside: pick(C.s10.inside), look: pick(C.s10.sample) };
  const site = aiSite(pick, own);
  const [copied, setCopied] = useState(false);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const copy = () => { try { navigator.clipboard.writeText(promptLine5(pick, own)); } catch (e) { /* без буфера */ } sfx('tap', true); setCopied(true); };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a1-fin">
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={[txtRow(own.what, 0), txtRow(own.why, 1), txtRow(own.who, 2), txtRow(own.inside, 3), txtRow(own.look, 4)]} later={5} />
            <div className="kz-roles">
              {['what', 'why', 'who', 'in', 'look'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (curK === 'what' && k !== 'look') ? ' is-on' : '')}><i aria-hidden="true" /><span><b>{pick(FORMULA[QI[k]])}</b> — {pick(c.roles[k])}</span></span>
              ))}
            </div>
            <div className="a1-hw">
              <span className="a1-hw-h">{pick(UI.hw)}</span>
              <span className="a1-hw-t">{pick(c.hw)}</span>
              <button type="button" className="kz-btn is-ghost a1-copy" onClick={copy}>{pick(copied ? UI.copied : UI.copy)}</button>
            </div>
          </div>
          <div className="kz-col a1-right">
            <AiBrowser site={site} pins={pinsOf(site)} />
            <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 }, { id: 's10', code: 'LEVEL-3B', Comp: S10 },
  { id: 'g1', code: 'LEVEL-G', Comp: G1 }, { id: 'det', code: 'CHECK-3', Comp: Det },
  { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'LEVEL-W', Comp: S13 }, { id: 's14', code: 'LEVEL-5', Comp: S14 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только экран; свой промпт ученика (pr_s14) остаётся.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 'fin') SCREEN_RESET[s.id] = [s.id]; });

function lessonAi4Artifact(store) {
  const own = store.get('pr_s14');
  return own ? { type: 'ai-prompt', what: own.what, why: own.why, who: own.who, inside: own.inside, look: own.look } : null;
}

export default function AiHowItLooks({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonAi4Artifact(store) })
  });
  useParallax();
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
  const go = useKzTransition(cur.id + ':' + R.runN);
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next, 1), prev: R.i > 0 ? go(R.prev, -1) : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}
