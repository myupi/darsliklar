// =============================================================================
// ЭКРАНЫ УРОКА 2 МОДУЛЯ «ИИ» «Для кого создаём?» (11.11.2026). Общие экраны модуля — tools/ai1/ai-common.jsx
// (usePromptTask, fieldRow, TaskScreen, AiShow, RoundsScreen), симулятор с «Kim uchun?» — tools/ai1/ai1-kit.jsx.
// =============================================================================

const K3 = ['what', 'why', 'who'];
const missRow = (qi) => ({ q: FORMULA[qi], t: MISS, cls: 'is-task is-miss', body: <span className="a1-later">…</span> });
const young = (a) => !!a && (a.key === 'kids' || a.key === 'teens');
const hasLike = (a, ks) => !!a && a.likes.some((l) => ks.indexOf(l.k) >= 0);
// Общая проверка строки «Kim uchun?»: пусто → «напиши»; «для всех» → «никто»; непонятное слово → «напиши возраст».
const whoIssue = (who, c) => {
  if (!who) return (c.msgs && c.msgs.empty) || M.empty;
  const a = audOf(who);
  if (a.key === 'all') return (c.msgs && c.msgs.all) || M.all;
  if (a.key === 'gen') return M.gen;
  return null;
};
// Промпт одной строкой — для домашки (три строки).
const promptLine3 = (pick, pr) => pick(fillL(L3('{a}. Uning maqsadi: {b}. Sayt {c} uchun.', '{a}. Его цель: {b}. Сайт для: {c}.', '{a}. Its goal: {b}. It’s for {c}.'),
  { a: capS(pr.what), b: String(pr.why || '').trim().replace(/[.!]+$/, ''), c: String(pr.who || '').trim().replace(/[.!]+$/, '') }));

// =============================================================================
// S1. КРЮЧОК — промпт Коди «Nima? + Nega?» без «Kim uchun?» → правильный, но «взрослый» сайт турнира; его открыл
// первоклассник и заскучал. Загадка: «хороший сайт нравится всем».
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
  const pr = { what: pick(c.what), why: pick(c.why) };
  const site = aiSite(pick, pr);
  const rows = [txtRow(pr.what, 0), txtRow(pr.why, 1), missRow(2)];
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
            {ph === 2 ? <div className="a1-in a2-seen"><TaskCard c={{ card: c.seen }} /></div> : null}
          </div>
          <div className="kz-col a1-right">{ph < 2 ? <div className={'a1-empty' + (ph === 1 ? ' is-busy' : '')}>{ph === 1 ? <span className="a1-gen a1-gen-in"><i className="a1-aidot">✦</i>{pick(UI.gen)}<span className="a1-typing"><i /><i /><i /></span></span> : pick(c.empty)}</div> : <AiBrowser site={site} />}</div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Показ: «Nima?» и «Nega?» те же, «Kim uchun?» меняется — меняется сайт; метки — только «Kim uchun?».
const whoSteps = (pick, w, g, list) => list.map((x, i) => {
  const who = x ? pick(x) : '';
  return { pr: { what: w, why: g, who }, rows: () => [txtRow(w, 0), txtRow(g, 1), who ? txtRow(who, 2) : missRow(2)], pins: i === 0 && !who ? false : undefined, pinWhat: false, pinWhy: false };
});
// S2. ПОКАЗ «Kim uchun?» — турнир: никто → дети 7–8 → родители → бабушки и дедушки.
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  return <AiShow p={p} c={c} id="s2" steps={whoSteps(pick, pick(C.s1.what), pick(C.s1.why), [null, c.a1, c.a2, c.a3])} />;
}
// S3. САМ — кружок роботов ждёт школьников 12–14 лет → строка «Kim uchun?».
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const T = usePromptTask('s3', c, [pick(c.what), pick(c.why), ''], (pr) => whoIssue(pr.who, c) || (audOf(pr.who).key === 'teens' ? null : c.msgs.other), null, K3);
  return <TaskScreen p={p} c={c} T={T} rows={[txtRow(T.vals[0], 0), txtRow(T.vals[1], 1), fieldRow(T, 2, 2, c.ph, 80)]} before={{ what: T.vals[0], why: T.vals[1], who: '' }} />;
}
// S4. ЗАКРЕПЛЕНИЕ — какое «Kim uchun?» точнее.
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  return <RoundsScreen p={p} c={c} id="s4" keyOf={(it) => it.right} ansOf={(it) => pick(it[it.right])}
    opts={() => ['a', 'b']} optLabel={(v, it) => pick(it[v])}
    body={() => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(c.q)}</p></div>} />;
}
// S5. ПОКАЗ интересов — книжная выставка: возраст → + комиксы → + приключения → игры и подарки.
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  return <AiShow p={p} c={c} id="s5" steps={whoSteps(pick, pick(c.what), pick(c.why), [c.b0, c.b1, c.b2, c.b3])} />;
}
// S6. САМ — праздник животных: возраст и что любят.
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const T = usePromptTask('s6', c, [pick(c.what), pick(c.why), ''], (pr) => {
    const e = whoIssue(pr.who, c);
    if (e) return e;
    const a = audOf(pr.who);
    if (a.key !== 'kids') return c.msgs.other;
    if (!hasLike(a, ['animal', 'game'])) return c.msgs.noLike;
    return null;
  }, null, K3);
  return <TaskScreen p={p} c={c} T={T} rows={[txtRow(T.vals[0], 0), txtRow(T.vals[1], 1), fieldRow(T, 2, 2, c.ph, 110)]} before={{ what: T.vals[0], why: T.vals[1], who: '' }} />;
}
// S7. ЗАКРЕПЛЕНИЕ — в какую строку фраза: «Nima?», «Nega?» или «Kim uchun?».
const QI = { what: 0, why: 1, who: 2 };
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  return <RoundsScreen p={p} c={c} id="s7" keyOf={(it) => it.right} ansOf={(it) => pick(FORMULA[QI[it.right]])}
    opts={() => ['what', 'why', 'who']} optLabel={(v) => pick(FORMULA[QI[v]])}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>«{pick(it.t)}»</p></div>} />;
}
// S8. САМ (перенос) — столовая района: заказывают бабушки и дедушки.
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const T = usePromptTask('s8', c, [pick(c.what), pick(c.why), ''], (pr) => {
    const e = whoIssue(pr.who, c);
    if (e) return e;
    const a = audOf(pr.who);
    return a.key === 'old' || a.also === 'old' ? null : c.msgs.other;
  }, null, K3);
  return <TaskScreen p={p} c={c} T={T} rows={[txtRow(T.vals[0], 0), txtRow(T.vals[1], 1), fieldRow(T, 2, 2, c.ph, 80)]} before={{ what: T.vals[0], why: T.vals[1], who: '' }} />;
}
// S9. ПОКАЗ двух аудиторий — лагерь: дети → родители → дети и родители.
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  return <AiShow p={p} c={c} id="s9" steps={whoSteps(pick, pick(c.what), pick(c.why), [c.c0, c.c1, c.c2])} />;
}
// S10. САМ — курс плавания: дети и их родители.
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  const T = usePromptTask('s10', c, [pick(c.what), pick(c.why), ''], (pr) => {
    const e = whoIssue(pr.who, c);
    if (e) return e;
    const a = audOf(pr.who);
    const kids = young(a) || a.also === 'kids' || a.also === 'teens';
    const par = a.key === 'parents' || a.also === 'parents';
    if (kids && par) return null;
    if (kids) return c.msgs.noParents;
    if (par) return c.msgs.noKids;
    return c.msgs.other;
  }, null, K3);
  return <TaskScreen p={p} c={c} T={T} rows={[txtRow(T.vals[0], 0), txtRow(T.vals[1], 1), fieldRow(T, 2, 2, c.ph, 110)]} before={{ what: T.vals[0], why: T.vals[1], who: '' }} />;
}
// G1. ИИ УГАДАЛ НЕ ТО — без «Kim uchun?» ИИ сам решил «для взрослых» (метки «Taxmin»), а кружок — для малышей 5–7.
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const T = usePromptTask('g1', c, [pick(c.what), pick(c.why), ''], (pr) => {
    const e = whoIssue(pr.who, c);
    if (e) return e;
    const a = audOf(pr.who);
    if (a.key === 'adult') return c.msgs.guess;
    return a.key === 'kids' ? null : c.msgs.other;
  }, null, K3);
  const guess = aiSite(pick, { what: pick(c.what), why: pick(c.why), who: pick(c.guess) });
  const shown = T.sent ? aiSite(pick, T.sent) : guess;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={T.speaker} done={T.canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, T.canGo)}>
      <Sheet cls="a1-sheet">
        <KzAsk text={T.solved ? c.ok : c.ask} hint={T.solved ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <TaskCard c={c} />
            <PromptEditor rows={[txtRow(T.vals[0], 0), txtRow(T.vals[1], 1), fieldRow(T, 2, 2, c.ph, 80)]} send={!T.solved ? <SendBtn T={T} /> : null} />
            {!T.solved && T.lad.lv >= 3 ? <HelpCode code={pick(c.sample)} /> : null}
          </div>
          <div className="kz-col a1-right"><AiBrowser site={shown} busy={T.busy}
            pins={T.sent ? pinsOf(shown) : [{ sel: '.badge', q: c.guessTag, cls: 'is-guess' }, { sel: '.sub', q: c.guessTag, cls: 'is-guess' }]} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}
// DET. ДЕТЕКТИВ: для кого этот сайт (дети / родители / пожилые) и какое «Kim uchun?» дало сайт (A / B / C).
function Det({ p }) {
  const pick = usePick();
  const c = C.det;
  const siteOf = (s) => aiSite(pick, { what: pick(s.what), why: pick(s.why), who: pick(s.who) });
  return <RoundsScreen pickCards={(it) => it.type === 'which'} p={p} c={c} id="det" keyOf={(it) => it.right}
    ansOf={(it) => (it.type === 'which' ? it.right.toUpperCase() : pick(c.whom[it.right]))}
    opts={(it) => (it.type === 'which' ? ['a', 'b', 'c'] : ['kids', 'parents', 'old'])}
    optLabel={(v, it) => (it.type === 'which' ? v.toUpperCase() : pick(c.whom[v]))}
    body={(it, R) => (it.type === 'which' ? (
      <div className="a1-which">
        <div className="a1-which-site"><AiBrowser site={siteOf(it.site)} small focus=".cards" /></div>
        <div className="a1-which-list">
          <span className="a1-qh">{pick(c.qWhich)}</span>
          <div className="a1-pr a2-pr-base"><span><span className="a1-pr-l"><em>{pick(FORMULA[0])}</em>{pick(it.site.what)}</span><span className="a1-pr-l"><em>{pick(FORMULA[1])}</em>{pick(it.site.why)}</span></span></div>
          {['a', 'b', 'c'].map((v) => <PickCard key={v} R={R} v={v} cls="a1-pr a2-pr-who"><b>{v.toUpperCase()}</b><span><span className="a1-pr-l"><em>{pick(FORMULA[2])}</em>{pick(it[v])}</span></span></PickCard>)}
        </div>
      </div>
    ) : (
      <div className="a2-whom">
        <span className="a1-qh">{pick(c.qWhom)}</span>
        <div className="a1-which-site"><AiBrowser site={siteOf(it.site)} small /></div>
      </div>
    ))} />;
}
// S12. ИСПРАВЬ «hamma uchun» Коди — сервер Minecraft: игроки 10–13 лет, любят строить.
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const T = usePromptTask('s12', c, [pick(c.what), pick(c.why), pick(c.bad)], (pr) => {
    const e = whoIssue(pr.who, c);
    if (e) return e;
    const a = audOf(pr.who);
    if (!young(a)) return c.msgs.other;
    if (!hasLike(a, ['build'])) return c.msgs.noLike;
    return null;
  }, 'embarrassed', K3);
  return <TaskScreen p={p} c={c} T={T} rows={[txtRow(T.vals[0], 0), txtRow(T.vals[1], 1), fieldRow(T, 2, 2, c.ph, 110, true)]} before={{ what: pick(c.what), why: pick(c.why), who: pick(c.bad) }} />;
}
// S13. С НУЛЯ — выставка роботов: все три строки.
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const T = usePromptTask('s13', c, ['', '', ''], (pr) => {
    if (!pr.what) return c.msgs.noWhat;
    if (!has(pr.what, /robot|робот/)) return c.msgs.topic;
    if (!has(pr.what, RE_KIND)) return c.msgs.kind;
    if (!pr.why) return c.msgs.noWhy;
    if (has(pr.why, RE_PRETTY) && !anyGoal(pr.why)) return c.msgs.pretty;
    if (!(has(pr.why, RE_COME) || has(pr.why, RE_TELL) || has(pr.why, RE_JOIN))) return c.msgs.goal;
    if (!pr.who) return c.msgs.noWho;
    const e = whoIssue(pr.who, c);
    if (e) return e;
    return young(audOf(pr.who)) ? null : c.msgs.other;
  }, null, K3);
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.phWhat, 60), fieldRow(T, 1, 1, c.phWhy, 90), fieldRow(T, 2, 2, c.phWho, 110)]} />;
}
// S14. СВОЙ САЙТ — все три строки, своя аудитория.
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const T = usePromptTask('s14', c, ['', '', ''], (pr) => {
    if (!pr.what) return c.msgs.noWhat;
    if (!has(pr.what, RE_KIND) && pr.what.split(/\s+/).length < 2) return c.msgs.kind;
    if (!pr.why) return c.msgs.noWhy;
    if (has(pr.why, RE_PRETTY) && !anyGoal(pr.why)) return c.msgs.pretty;
    if (!anyGoal(pr.why)) return c.msgs.goal;
    if (!pr.who) return c.msgs.noWho;
    return whoIssue(pr.who, c);
  }, 'point', K3);
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.phWhat, 60), fieldRow(T, 1, 1, c.phWhy, 90), fieldRow(T, 2, 2, c.phWho, 110)]} later={3} />;
}
// Q1. ВЕРНО ИЛИ НЕТ — пять фраз урока.
function Q1({ p }) {
  const pick = usePick();
  const c = C.q1;
  return <RoundsScreen p={p} c={c} id="q1" keyOf={(it) => it.right} ansOf={(it) => pick(it.right ? c.yes : c.no)}
    opts={() => [true, false]} optLabel={(v) => pick(v ? c.yes : c.no)}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}
// FIN. ВЫВОД — разгадка: сайт «для всех» — ни для кого; свой промпт из трёх строк и сайт; домашка.
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const own = store.get('pr_s14') || { what: pick(C.s9.what), why: pick(C.s9.why), who: pick(C.s9.c2) };
  const site = aiSite(pick, own);
  const [copied, setCopied] = useState(false);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const copy = () => { try { navigator.clipboard.writeText(promptLine3(pick, own)); } catch (e) { /* без буфера */ } sfx('tap', true); setCopied(true); };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a1-fin">
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={[txtRow(own.what, 0), txtRow(own.why, 1), txtRow(own.who, 2)]} later={3} />
            <div className="kz-roles">
              {['what', 'why', 'who'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (curK === 'what' && k === 'why') ? ' is-on' : '')}><i aria-hidden="true" /><span><b>{pick(FORMULA[QI[k]])}</b> — {pick(c.roles[k])}</span></span>
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
  { id: 's8', code: 'LEVEL-3', Comp: S8 }, { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-3B', Comp: S10 },
  { id: 'g1', code: 'LEVEL-G', Comp: G1 }, { id: 'det', code: 'CHECK-3', Comp: Det },
  { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'LEVEL-W', Comp: S13 }, { id: 's14', code: 'LEVEL-5', Comp: S14 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только экран; свой промпт ученика (pr_s14) остаётся.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 'fin') SCREEN_RESET[s.id] = [s.id]; });

function lessonAi2Artifact(store) {
  const own = store.get('pr_s14');
  return own ? { type: 'ai-prompt', what: own.what, why: own.why, who: own.who } : null;
}

export default function AiWhoFor({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonAi2Artifact(store) })
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
