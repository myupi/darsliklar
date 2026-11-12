// =============================================================================
// ЭКРАНЫ УРОКА 5 МОДУЛЯ «ИИ» «Как сайт должен вести себя?» (12.11.2026). Общие экраны модуля — tools/ai1/ai-common.jsx,
// симулятор с «Qanday ishlaydi?» (наведение, нажатие, открытие страницы, телефон) — tools/ai1/ai1-kit.jsx (behOf …).
// Курсор показа сам наводит и нажимает в окне сайта (AiBrowser demo) — кнопки урока не нажимает никогда.
// =============================================================================

const K6 = ['what', 'why', 'who', 'inside', 'look', 'beh'];
const missRow = (qi) => ({ q: FORMULA[qi], t: MISS, cls: 'is-task is-miss', body: <span className="a1-later">…</span> });
// Общая проверка строки «Qanday ishlaydi?»: пусто → «напиши»; «jonli» → «у каждого своё»; всё прыгает; ничего не узнано.
const behIssue = (beh, c) => {
  if (!beh) return (c.msgs && c.msgs.empty) || M.empty;
  const b = behOf(beh);
  if (b.vague) return (c.msgs && c.msgs.vague) || M.vague;
  if (b.chaos) return M.chaos;
  if (b.none) return M.none;
  return null;
};
// Пять готовых строк и поле «Qanday ishlaydi?».
const rows5 = (T) => [0, 1, 2, 3, 4].map((i) => txtRow(T.vals[i], i));
const initOf = (pick, c, beh) => [pick(c.what), pick(c.why), pick(c.who), pick(c.inside), pick(c.look), beh || ''];
const beforeOf = (T, beh) => ({ what: T.vals[0], why: T.vals[1], who: T.vals[2], inside: T.vals[3], look: T.vals[4], beh: beh || '' });
// На сайте — метки только «Qanday ishlaydi?» и «Taxmin» (остальные строки уже знакомы).
const PIN_BEH = [false, false, false, false, false];
// Промпт одной строкой — для домашки (шесть строк).
const promptLine6 = (pick, pr) => {
  const t = (x) => String(x || '').trim().replace(/[.!]+$/, '');
  return pick(fillL(L3("{a}. Uning maqsadi: {b}. Sayt {c} uchun. Saytda bo'lsin: {d}. Ko'rinishi: {e}. Qanday ishlaydi: {f}.", '{a}. Его цель: {b}. Сайт для: {c}. На сайте: {d}. Вид: {e}. Поведение: {f}.', '{a}. Its goal: {b}. It’s for {c}. On the site: {d}. Look: {e}. Behaviour: {f}.'),
    { a: capS(pr.what), b: t(pr.why), c: t(pr.who), d: t(pr.inside), e: t(pr.look), f: t(pr.beh) }));
};
const prOf = (pick, c, beh) => ({ what: pick(c.what), why: pick(c.why), who: pick(c.who), inside: pick(c.inside), look: pick(c.look), beh: beh || '' });

// =============================================================================
// S1. КРЮЧОК — шесть строк, «Qanday ishlaydi?» = «jonli va qiziqarli bo'lsin» → всё прыгает и крутится, кнопка
// убегает («Taxmin»). Загадка: чем больше движения, тем лучше.
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
  const pr = prOf(pick, c, pick(c.beh));
  const site = aiSite(pick, pr);
  const rows = K6.map((k, i) => txtRow(pr[k], i));
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
          <div className="kz-col a1-right">{ph < 2 ? <div className={'a1-empty' + (ph === 1 ? ' is-busy' : '')}>{ph === 1 ? <span className="a1-gen a1-gen-in"><i className="a1-aidot">✦</i>{pick(UI.gen)}<span className="a1-typing"><i /><i /><i /></span></span> : pick(c.empty)}</div> : <AiBrowser site={site} pins={pinsOf.apply(null, [site].concat(PIN_BEH))} demo />}</div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Показ: пять строк те же, «Qanday ishlaydi?» меняется — курсор показывает, как ведёт себя сайт.
// vws — своя ширина окна на шаге (800 — компьютер, 360 — телефон); same — шаг без нового промпта (только окно).
const behSteps = (pick, c, list, vws, same) => list.map((x, i) => {
  const beh = x ? pick(x) : '';
  const pr = prOf(pick, c, beh);
  return { pr, rows: () => [0, 1, 2, 3, 4].map((j) => txtRow(pr[K6[j]], j)).concat(beh ? txtRow(beh, 5) : missRow(5)),
    pins: i === 0 && !beh ? false : undefined, pinWhat: false, pinWhy: false, pinWho: false, pinIn: false, pinLook: false,
    vw: vws ? vws[i] : undefined, noAi: !!(same && same[i]), demo: vws && vws[i] === 360 && same && same[i] ? false : undefined };
});
// S2. ПОКАЗ наведения — клуб плавания: пусто → цвет → цвет и рост → карточки поднимаются.
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  return <AiShow p={p} c={c} id="s2" steps={behSteps(pick, c, [null, c.b1, c.b2, c.b3])} />;
}
// S3. САМ — пиццерия: карточки меню растут при наведении.
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const T = usePromptTask('s3', c, initOf(pick, c), (pr) => {
    const e = behIssue(pr.beh, c);
    if (e) return e;
    const b = behOf(pr.beh);
    if (!b.hover) return c.msgs.noHover;
    if (b.hover.els.indexOf('card') < 0) return c.msgs.notCard;
    return b.hover.fx.indexOf('grow') >= 0 && !b.hover.guess ? null : c.msgs.noGrow;
  }, null, K6);
  return <TaskScreen p={p} c={c} T={T} rows={rows5(T).concat(fieldRow(T, 5, 5, c.ph, 140))} before={beforeOf(T)} pinOpts={PIN_BEH} demo />;
}
// S4. ЗАКРЕПЛЕНИЕ — какое «Qanday ishlaydi?» точнее.
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  return <RoundsScreen p={p} c={c} id="s4" keyOf={(it) => it.right} ansOf={(it) => pick(it[it.right])}
    opts={() => ['a', 'b']} optLabel={(v, it) => pick(it[v])}
    body={() => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(c.q)}</p></div>} />;
}
// S5. ПОКАЗ нажатия — шахматный кружок: пусто → «Rahmat» → вопрос раскрывается.
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  return <AiShow p={p} c={c} id="s5" steps={behSteps(pick, c, [null, c.c1, c.c2])} />;
}
// S6. САМ — книжный: при нажатии «Savatga qo'shildi».
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const T = usePromptTask('s6', c, initOf(pick, c), (pr) => {
    const e = behIssue(pr.beh, c);
    if (e) return e;
    const b = behOf(pr.beh);
    if (!b.click) return b.hover ? c.msgs.hover : c.msgs.noClick;
    return b.click.fx === 'msg' && !b.click.guess ? null : c.msgs.noMsg;
  }, null, K6);
  return <TaskScreen p={p} c={c} T={T} rows={rows5(T).concat(fieldRow(T, 5, 5, c.ph, 140))} before={beforeOf(T)} pinOpts={PIN_BEH} demo />;
}
// S7. ЗАКРЕПЛЕНИЕ — когда это сработало (наведение, нажатие, открытие, телефон).
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  return <RoundsScreen p={p} c={c} id="s7" keyOf={(it) => it.right} ansOf={(it) => pick(TRIG_L[it.right])}
    opts={(it) => it.opts} optLabel={(v) => pick(TRIG_L[v])}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}
// S8. ПОКАЗ открытия страницы — фестиваль: сразу → по очереди → заголовок сверху → кнопка мигает.
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  return <AiShow p={p} c={c} id="s8" steps={behSteps(pick, c, [null, c.l1, c.l2, c.l3])} />;
}
// S9. САМ — выставка: картинки плавно появляются по очереди.
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const T = usePromptTask('s9', c, initOf(pick, c), (pr) => {
    const e = behIssue(pr.beh, c);
    if (e) return e;
    const b = behOf(pr.beh);
    if (!b.loads.length) return c.msgs.noLoad;
    return b.loads.some((l) => l.how) ? null : c.msgs.noFx;
  }, null, K6);
  return <TaskScreen p={p} c={c} T={T} rows={rows5(T).concat(fieldRow(T, 5, 5, c.ph, 140))} before={beforeOf(T)} pinOpts={PIN_BEH} demo />;
}
// S10. ПОКАЗ телефона — курс роботов: компьютер → телефон (меню пропало) → ☰ → кнопка внизу.
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  return <AiShow p={p} c={c} id="s10" steps={behSteps(pick, c, [c.p0, c.p0, c.p2, c.p3], [800, 360, 360, 360], [false, true, false, false])} />;
}
// S11. САМ — лагерь: на телефоне меню сворачивается в ☰.
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const T = usePromptTask('s11', c, initOf(pick, c), (pr) => {
    const e = behIssue(pr.beh, c);
    if (e) return e;
    const b = behOf(pr.beh);
    if (!b.phone) return c.msgs.noPhone;
    return b.phone.menu && !b.phone.guess ? null : c.msgs.noMenu;
  }, null, K6);
  return <TaskScreen p={p} c={c} T={T} rows={rows5(T).concat(fieldRow(T, 5, 5, c.ph, 140))} before={beforeOf(T)} pinOpts={PIN_BEH} demo />;
}
// G1. «КОГДА?» — Коди написал «tugma kattalashsin» → кнопка всегда огромная; нужно «при наведении».
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const T = usePromptTask('g1', c, initOf(pick, c, pick(c.bad)), (pr) => {
    const e = behIssue(pr.beh, c);
    if (e) return e;
    const b = behOf(pr.beh);
    if (b.still || !b.hover) return c.msgs.still;
    return b.hover.els.indexOf('btn') >= 0 && b.hover.fx.indexOf('grow') >= 0 ? null : c.msgs.noGrow;
  }, 'embarrassed', K6);
  return <TaskScreen p={p} c={c} T={T} rows={rows5(T).concat(fieldRow(T, 5, 5, c.ph, 140, true))} before={beforeOf(T, pick(c.bad))} pinOpts={PIN_BEH} demo demoBefore />;
}
// DET. ДЕТЕКТИВ: курсор сам показывает поведение — какое «Qanday ishlaydi?» его дало (A/B/C).
function Det({ p }) {
  const pick = usePick();
  const c = C.det;
  const base = C.s2;
  const siteOf = (beh) => aiSite(pick, prOf(pick, base, pick(beh)));
  return <RoundsScreen p={p} c={c} id="det" keyOf={(it) => it.right} ansOf={(it) => it.right.toUpperCase()}
    opts={() => ['a', 'b', 'c']} optLabel={(v) => v.toUpperCase()}
    body={(it) => (
      <div className="a1-which">
        <div className="a1-which-site"><AiBrowser site={siteOf(it.beh)} small demo /></div>
        <div className="a1-which-list">
          <span className="a1-qh">{pick(c.qWhich)}</span>
          {['a', 'b', 'c'].map((v) => <div key={v} className="a1-pr a5-pr-beh"><b>{v.toUpperCase()}</b><span><span className="a1-pr-l"><em>{pick(FORMULA[5])}</em>{pick(it[v])}</span></span></div>)}
        </div>
      </div>
    )} />;
}
// S12. ИСПРАВЬ «jonli va qiziqarli» Коди — кафе из крючка: цвет при наведении, «Rahmat!» при нажатии, ничего не прыгает.
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const c1 = C.s1;
  const T = usePromptTask('s12', c, initOf(pick, c1, pick(c1.beh)), (pr) => {
    if (!pr.beh) return M.empty;
    const b = behOf(pr.beh);
    if (b.vague) return c.msgs.vague;
    if (b.chaos) return M.chaos;
    if (b.none) return M.none;
    if (!b.hover) return c.msgs.noHover;
    return b.click && b.click.fx === 'msg' && !b.click.guess ? null : c.msgs.noClick;
  }, 'embarrassed', K6);
  return <TaskScreen p={p} c={c} T={T} rows={rows5(T).concat(fieldRow(T, 5, 5, c.ph || C.s3.ph, 160, true))} before={beforeOf(T, pick(c1.beh))} pinOpts={PIN_BEH} demo demoBefore />;
}
// S13. ТРИ ПОВЕДЕНИЯ — соревнования: рост при наведении, ответ на вопрос, ☰ на телефоне.
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const T = usePromptTask('s13', c, initOf(pick, c), (pr) => {
    const e = behIssue(pr.beh, c);
    if (e) return e;
    const b = behOf(pr.beh);
    if (!b.hover || b.hover.fx.indexOf('grow') < 0) return c.msgs.hover;
    const faq = [b.click, b.click2].some((x) => x && x.el === 'faq' && x.fx === 'open');
    if (!faq) return c.msgs.faq;
    return b.phone && b.phone.menu && !b.phone.guess ? null : c.msgs.phone;
  }, null, K6);
  return <TaskScreen p={p} c={c} T={T} rows={rows5(T).concat(fieldRow(T, 5, 5, c.ph, 220))} before={beforeOf(T)} pinOpts={PIN_BEH} demo />;
}
// S14. СВОЙ САЙТ — все шесть строк.
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const T = usePromptTask('s14', c, ['', '', '', '', '', ''], (pr) => {
    if (!pr.what) return c.msgs.noWhat;
    if (!has(pr.what, RE_KIND) && pr.what.split(/\s+/).length < 2) return c.msgs.kind;
    if (!pr.why) return c.msgs.noWhy;
    if (!anyGoal(pr.why)) return c.msgs.goal;
    if (!pr.who) return c.msgs.noWho;
    const a = audOf(pr.who);
    if (a.key === 'all' || a.key === 'gen') return c.msgs.who;
    if (!pr.inside) return c.msgs.noIn;
    if (!insOf(pr.inside).blocks.length) return c.msgs.inNone;
    if (!pr.look) return c.msgs.noLook;
    const lk = lookOf(pr.look);
    if (lk.vague || lk.none) return c.msgs.look;
    if (!pr.beh) return c.msgs.noBeh;
    return behIssue(pr.beh, c);
  }, 'point', K6);
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.phWhat, 60), fieldRow(T, 1, 1, c.phWhy, 90), fieldRow(T, 2, 2, c.phWho, 90), fieldRow(T, 3, 3, c.phIn, 120), fieldRow(T, 4, 4, c.phLook, 120), fieldRow(T, 5, 5, c.phBeh, 160)]} later={6} demo />;
}
// Q1. ВЕРНО ИЛИ НЕТ — пять фраз урока.
function Q1({ p }) {
  const pick = usePick();
  const c = C.q1;
  return <RoundsScreen p={p} c={c} id="q1" keyOf={(it) => it.right} ansOf={(it) => pick(it.right ? c.yes : c.no)}
    opts={() => [true, false]} optLabel={(v) => pick(v ? c.yes : c.no)}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}
// FIN. ВЫВОД — разгадка: движение должно помогать; свой промпт из шести строк; домашка.
const QI = { what: 0, why: 1, who: 2, in: 3, look: 4, beh: 5 };
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const own = store.get('pr_s14') || Object.assign(prOf(pick, C.s13), { beh: pick(C.s13.sample) });
  const site = aiSite(pick, own);
  const [copied, setCopied] = useState(false);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const copy = () => { try { navigator.clipboard.writeText(promptLine6(pick, own)); } catch (e) { /* без буфера */ } sfx('tap', true); setCopied(true); };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a1-fin">
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={K6.map((k, i) => txtRow(own[k], i))} later={6} />
            <div className="kz-roles">
              {['what', 'why', 'who', 'in', 'look', 'beh'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (curK === 'what' && k !== 'beh') ? ' is-on' : '')}><i aria-hidden="true" /><span><b>{pick(FORMULA[QI[k]])}</b> — {pick(c.roles[k])}</span></span>
              ))}
            </div>
            <div className="a1-hw">
              <span className="a1-hw-h">{pick(UI.hw)}</span>
              <span className="a1-hw-t">{pick(c.hw)}</span>
              <button type="button" className="kz-btn is-ghost a1-copy" onClick={copy}>{pick(copied ? UI.copied : UI.copy)}</button>
            </div>
          </div>
          <div className="kz-col a1-right">
            <AiBrowser site={site} pins={pinsOf.apply(null, [site].concat(PIN_BEH))} demo />
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
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 },
  { id: 's10', code: 'SHOW', Comp: S10 }, { id: 's11', code: 'LEVEL-3B', Comp: S11 },
  { id: 'g1', code: 'LEVEL-G', Comp: G1 }, { id: 'det', code: 'CHECK-3', Comp: Det },
  { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'LEVEL-W', Comp: S13 }, { id: 's14', code: 'LEVEL-5', Comp: S14 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только экран; свой промпт ученика (pr_s14) остаётся.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 'fin') SCREEN_RESET[s.id] = [s.id]; });

function lessonAi5Artifact(store) {
  const own = store.get('pr_s14');
  return own ? { type: 'ai-prompt', what: own.what, why: own.why, who: own.who, inside: own.inside, look: own.look, beh: own.beh } : null;
}

export default function AiHowItBehaves({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonAi5Artifact(store) })
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
