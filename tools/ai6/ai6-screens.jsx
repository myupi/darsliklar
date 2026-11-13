// =============================================================================
// ЭКРАНЫ УРОКА 6 МОДУЛЯ «ИИ» «Как дать ИИ точные требования?» (12.11.2026). Общие экраны модуля — tools/ai1/ai-common.jsx,
// симулятор с «Qoidalar?» (обязательно, нельзя, ограничения) — tools/ai1/ai1-kit.jsx (rulesOf, ruleEls, ruleCss).
// =============================================================================

const K7 = ['what', 'why', 'who', 'inside', 'look', 'beh', 'rules'];
const missRow = (qi) => ({ q: FORMULA[qi], t: MISS, cls: 'is-task is-miss', body: <span className="a1-later">…</span> });
const digits = (x) => String(x || '').replace(/\D/g, '');
// Номер из правил совпадает с номером клиента (пробелы и «+» не важны).
const phoneIs = (r, want) => !!(r && r.must.phone && r.must.phone.v && digits(r.must.phone.v).slice(-9) === digits(want).slice(-9));
// Общая проверка строки «Qoidalar?»: пусто → «напиши»; «hammasi tushunarli» → «ничего не говорит»; ничего не узнано.
const ruleIssue = (rules, c) => {
  if (!rules) return (c.msgs && c.msgs.empty) || M.empty;
  const r = rulesOf(rules);
  if (r.vague) return (c.msgs && c.msgs.vague) || M.vague;
  if (r.none) return M.none;
  return null;
};
// Шесть готовых строк и поле «Qoidalar?».
const rows6 = (T) => [0, 1, 2, 3, 4, 5].map((i) => txtRow(T.vals[i], i));
const initOf = (pick, c, rules) => [pick(c.what), pick(c.why), pick(c.who), pick(c.inside), pick(c.look), pick(c.beh), rules || ''];
const beforeOf = (T, rules) => ({ what: T.vals[0], why: T.vals[1], who: T.vals[2], inside: T.vals[3], look: T.vals[4], beh: T.vals[5], rules: rules || '' });
// На сайте — метки только «Qoidalar?» и «Taxmin» (остальные строки уже знакомы).
const PIN_R = [false, false, false, false, false, false];
const prOf = (pick, c, rules) => ({ what: pick(c.what), why: pick(c.why), who: pick(c.who), inside: pick(c.inside), look: pick(c.look), beh: pick(c.beh), rules: rules || '' });
// Промпт одной строкой — для домашки (семь строк).
const promptLine7 = (pick, pr) => {
  const t = (x) => String(x || '').trim().replace(/[.!]+$/, '');
  return pick(fillL(L3("{a}. Uning maqsadi: {b}. Sayt {c} uchun. Saytda bo'lsin: {d}. Ko'rinishi: {e}. Qanday ishlaydi: {f}. Qoidalar: {g}.", '{a}. Его цель: {b}. Сайт для: {c}. На сайте: {d}. Вид: {e}. Поведение: {f}. Правила: {g}.', '{a}. Its goal: {b}. It’s for {c}. On the site: {d}. Look: {e}. Behaviour: {f}. Rules: {g}.'),
    { a: capS(pr.what), b: t(pr.why), c: t(pr.who), d: t(pr.inside), e: t(pr.look), f: t(pr.beh), g: t(pr.rules) }));
};

// =============================================================================
// S1. КРЮЧОК — семь строк, «Qoidalar?» = «hammasi tushunarli» → окно подписки, «−50%», чат, выдуманный телефон.
// Загадка: ИИ сам знает, что можно и что нельзя.
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
  const pr = prOf(pick, c, pick(c.rules));
  const site = aiSite(pick, pr);
  const rows = K7.map((k, i) => txtRow(pr[k], i));
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
          <div className="kz-col a1-right">{ph < 2 ? <div className={'a1-empty' + (ph === 1 ? ' is-busy' : '')}>{ph === 1 ? <span className="a1-gen a1-gen-in"><i className="a1-aidot">✦</i>{pick(UI.gen)}<span className="a1-typing"><i /><i /><i /></span></span> : pick(c.empty)}</div> : <AiBrowser site={site} pins={pinsOf.apply(null, [site].concat(PIN_R, [false]))} />}</div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Показ: шесть строк те же, «Qoidalar?» меняется — сайт меняется. Курсор не нужен: правила видны сразу.
const ruleSteps = (pick, c, list) => list.map((x, i) => {
  const rules = x ? pick(x) : '';
  const pr = prOf(pick, c, rules);
  return { pr, rows: () => [0, 1, 2, 3, 4, 5].map((j) => txtRow(pr[K7[j]], j)).concat(rules ? txtRow(rules, 6) : missRow(6)),
    pinWhat: false, pinWhy: false, pinWho: false, pinIn: false, pinLook: false, pinBeh: false, demo: false };
});
// S2. ПОКАЗ «нельзя» — кружок танцев: пусто → без окна → без скидки → без чата.
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  return <AiShow p={p} c={c} id="s2" steps={ruleSteps(pick, c, [null, c.r1, c.r2, c.r3])} />;
}
// S3. САМ — клуб плавания: без окна и скидки.
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const T = usePromptTask('s3', c, initOf(pick, c), (pr) => {
    const e = ruleIssue(pr.rules, c);
    if (e) return e;
    const r = rulesOf(pr.rules);
    if (!r.no.popup) return c.msgs.popup;
    return r.no.sale ? null : c.msgs.sale;
  }, null, K7);
  return <TaskScreen p={p} c={c} T={T} rows={rows6(T).concat(fieldRow(T, 6, 6, c.ph, 160))} before={beforeOf(T)} pinOpts={PIN_R.concat([false])} />;
}
// S4. ЗАКРЕПЛЕНИЕ — какое правило точнее.
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  return <RoundsScreen p={p} c={c} id="s4" keyOf={(it) => it.right} ansOf={(it) => pick(it[it.right])}
    opts={() => ['a', 'b']} optLabel={(v, it) => pick(it[v])}
    body={() => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(c.q)}</p></div>} />;
}
// S5. ПОКАЗ «обязательно» — кафе: выдуманный номер → настоящий → адрес → Telegram.
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  return <AiShow p={p} c={c} id="s5" steps={ruleSteps(pick, c, [c.r0, c.r1, c.r2, c.r3])} />;
}
// S6. САМ — курс роботов: телефон и адрес обязательно.
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const T = usePromptTask('s6', c, initOf(pick, c), (pr) => {
    const e = ruleIssue(pr.rules, c);
    if (e) return e;
    const r = rulesOf(pr.rules);
    if (!phoneIs(r, '+998 90 777 88 99')) return c.msgs.phone;
    return r.must.addr && r.must.addr.v && /yunus|юнус/i.test(r.must.addr.v) ? null : c.msgs.addr;
  }, null, K7);
  return <TaskScreen p={p} c={c} T={T} rows={rows6(T).concat(fieldRow(T, 6, 6, c.ph, 160))} before={beforeOf(T)} pinOpts={PIN_R.concat([false])} />;
}
// S7. ЗАКРЕПЛЕНИЕ — слова клиента: обязательно или нельзя.
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  return <RoundsScreen p={p} c={c} id="s7" keyOf={(it) => it.right} ansOf={(it) => pick(SIDE_L[it.right])}
    opts={() => ['must', 'no']} optLabel={(v) => pick(SIDE_L[v])}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}
// S8. ПОКАЗ ограничений — шахматный кружок: одна кнопка → не больше 3 блоков.
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  return <AiShow p={p} c={c} id="s8" steps={ruleSteps(pick, c, [c.r0, c.r1, c.r2])} />;
}
// S9. САМ — выставка: не больше 2 блоков, одна кнопка.
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const T = usePromptTask('s9', c, initOf(pick, c), (pr) => {
    const e = ruleIssue(pr.rules, c);
    if (e) return e;
    const r = rulesOf(pr.rules);
    if (!r.max || r.max > 2) return c.msgs.max;
    return r.one ? null : c.msgs.one;
  }, null, K7);
  return <TaskScreen p={p} c={c} T={T} rows={rows6(T).concat(fieldRow(T, 6, 6, c.ph, 160))} before={beforeOf(T)} pinOpts={PIN_R.concat([false])} />;
}
// S10. ПОКАЗ заказа клиента — сообщение курса английского превращается в правила.
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  return <AiShow p={p} c={c} id="s10" steps={ruleSteps(pick, c, [null, c.r1, c.r2, c.r3])} />;
}
// S11. САМ — сообщение директора лагеря: номер, без скидки и чата, одна кнопка.
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const T = usePromptTask('s11', c, initOf(pick, c), (pr) => {
    const e = ruleIssue(pr.rules, c);
    if (e) return e;
    const r = rulesOf(pr.rules);
    if (!phoneIs(r, '+998 95 200 30 40')) return c.msgs.phone;
    if (!r.no.sale) return c.msgs.sale;
    if (!r.no.chat) return c.msgs.chat;
    return r.one ? null : c.msgs.one;
  }, null, K7);
  return <TaskScreen p={p} c={c} T={T} rows={rows6(T).concat(fieldRow(T, 6, 6, c.ph, 200))} before={beforeOf(T)} pinOpts={PIN_R.concat([false])} />;
}
// G1. ВЫДУМАННЫЙ НОМЕР — Коди написал «telefon raqami» без номера; ИИ выдумал его.
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const T = usePromptTask('g1', c, initOf(pick, c, pick(c.bad)), (pr) => {
    const e = ruleIssue(pr.rules, c);
    if (e) return e;
    return phoneIs(rulesOf(pr.rules), '+998 93 777 12 12') ? null : c.msgs.phone;
  }, 'embarrassed', K7);
  return <TaskScreen p={p} c={c} T={T} rows={rows6(T).concat(fieldRow(T, 6, 6, c.ph, 160, true))} before={beforeOf(T, pick(c.bad))} pinOpts={PIN_R.concat([false])} />;
}
// DET. ДЕТЕКТИВ: какие правила дали этот сайт (A/B/C).
function Det({ p }) {
  const pick = usePick();
  const c = C.det;
  const base = C.s2;
  const siteOf = (rules) => aiSite(pick, prOf(pick, base, pick(rules)));
  return <RoundsScreen pickCards p={p} c={c} id="det" keyOf={(it) => it.right} ansOf={(it) => it.right.toUpperCase()}
    opts={() => ['a', 'b', 'c']} optLabel={(v) => v.toUpperCase()}
    body={(it, R) => (
      <div className="a1-which">
        <div className="a1-which-site"><AiBrowser site={siteOf(it.rules)} small /></div>
        <div className="a1-which-list">
          <span className="a1-qh">{pick(c.qWhich)}</span>
          {['a', 'b', 'c'].map((v) => <PickCard key={v} R={R} v={v} cls="a1-pr a6-pr-rule"><b>{v.toUpperCase()}</b><span><span className="a1-pr-l"><em>{pick(FORMULA[6])}</em>{pick(it[v])}</span></span></PickCard>)}
        </div>
      </div>
    )} />;
}
// S12. ИСПРАВЬ «hammasi tushunarli» Коди — цветочный магазин из крючка.
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const c1 = C.s1;
  const T = usePromptTask('s12', c, initOf(pick, c1, pick(c1.rules)), (pr) => {
    if (!pr.rules) return M.empty;
    const r = rulesOf(pr.rules);
    if (r.vague) return c.msgs.vague;
    if (r.none) return M.none;
    if (!r.no.sale) return c.msgs.sale;
    if (!r.no.popup) return c.msgs.popup;
    return phoneIs(r, '+998 97 300 40 50') ? null : c.msgs.phone;
  }, 'embarrassed', K7);
  return <TaskScreen p={p} c={c} T={T} rows={rows6(T).concat(fieldRow(T, 6, 6, C.s6.ph, 200, true))} before={beforeOf(T, pick(c1.rules))} pinOpts={PIN_R.concat([false])} />;
}
// S13. ВСЕ ПРАВИЛА — курс гитары: номер и Telegram, без чата и скидки, не больше 3 блоков.
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const T = usePromptTask('s13', c, initOf(pick, c), (pr) => {
    const e = ruleIssue(pr.rules, c);
    if (e) return e;
    const r = rulesOf(pr.rules);
    if (!phoneIs(r, '+998 91 600 70 80')) return c.msgs.phone;
    if (!r.must.tg) return c.msgs.tg;
    if (!r.no.chat || !r.no.sale) return c.msgs.no;
    return r.max && r.max <= 3 ? null : c.msgs.max;
  }, null, K7);
  return <TaskScreen p={p} c={c} T={T} rows={rows6(T).concat(fieldRow(T, 6, 6, c.ph, 240))} before={beforeOf(T)} pinOpts={PIN_R.concat([false])} />;
}
// S14. СВОЙ САЙТ — все семь строк.
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const T = usePromptTask('s14', c, ['', '', '', '', '', '', ''], (pr) => {
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
    const b = behOf(pr.beh);
    if (b.vague || b.chaos || b.none) return c.msgs.beh;
    if (!pr.rules) return c.msgs.noRules;
    return ruleIssue(pr.rules, c);
  }, 'point', K7);
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.phWhat, 60), fieldRow(T, 1, 1, c.phWhy, 90), fieldRow(T, 2, 2, c.phWho, 90), fieldRow(T, 3, 3, c.phIn, 120), fieldRow(T, 4, 4, c.phLook, 120), fieldRow(T, 5, 5, c.phBeh, 160), fieldRow(T, 6, 6, c.phRules, 200)]} later={7} />;
}
// Q1. ВЕРНО ИЛИ НЕТ — пять фраз урока.
function Q1({ p }) {
  const pick = usePick();
  const c = C.q1;
  return <RoundsScreen p={p} c={c} id="q1" keyOf={(it) => it.right} ansOf={(it) => pick(it.right ? c.yes : c.no)}
    opts={() => [true, false]} optLabel={(v) => pick(v ? c.yes : c.no)}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}
// FIN. ВЫВОД — разгадка: ИИ не знает клиента; свой промпт из семи строк; домашка.
const QI = { what: 0, why: 1, who: 2, in: 3, look: 4, beh: 5, rules: 6 };
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const own = store.get('pr_s14') || Object.assign(prOf(pick, C.s13), { rules: pick(C.s13.sample) });
  const site = aiSite(pick, own);
  const [copied, setCopied] = useState(false);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const copy = () => { try { navigator.clipboard.writeText(promptLine7(pick, own)); } catch (e) { /* без буфера */ } sfx('tap', true); setCopied(true); };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a1-fin">
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={K7.map((k, i) => txtRow(own[k], i))} later={7} />
            <div className="kz-roles">
              {['what', 'why', 'who', 'in', 'look', 'beh', 'rules'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (curK === 'what' && k !== 'rules') ? ' is-on' : '')}><i aria-hidden="true" /><span><b>{pick(FORMULA[QI[k]])}</b> — {pick(c.roles[k])}</span></span>
              ))}
            </div>
            <div className="a1-hw">
              <span className="a1-hw-h">{pick(UI.hw)}</span>
              <span className="a1-hw-t">{pick(c.hw)}</span>
              <button type="button" className="kz-btn is-ghost a1-copy" onClick={copy}>{pick(copied ? UI.copied : UI.copy)}</button>
            </div>
          </div>
          <div className="kz-col a1-right">
            <AiBrowser site={site} pins={pinsOf.apply(null, [site].concat(PIN_R, [false]))} />
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

function lessonAi6Artifact(store) {
  const own = store.get('pr_s14');
  return own ? { type: 'ai-prompt', what: own.what, why: own.why, who: own.who, inside: own.inside, look: own.look, beh: own.beh, rules: own.rules } : null;
}

export default function AiExactRules({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonAi6Artifact(store) })
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
