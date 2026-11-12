// =============================================================================
// ЭКРАНЫ УРОКА 3 МОДУЛЯ «ИИ» «Что должно быть на сайте?» (12.11.2026). Общие экраны модуля — tools/ai1/ai-common.jsx,
// симулятор с «Ichida nima?» (блоки, порядок, контент) — tools/ai1/ai1-kit.jsx.
// =============================================================================

const K4 = ['what', 'why', 'who', 'inside'];
const missRow = (qi) => ({ q: FORMULA[qi], t: MISS, cls: 'is-task is-miss', body: <span className="a1-later">…</span> });
const blocksOf = (s) => { const x = insOf(s); return x ? x.blocks.map((b) => b.k) : []; };
const digits = (s) => String(s || '').replace(/\D/g, '');
// Общая проверка строки «Ichida nima?»: пусто → «напиши»; «hamma narsa» → «назови блоки»; ни одного блока → «например».
const inIssue = (inside, c) => {
  if (!inside) return (c.msgs && c.msgs.empty) || M.empty;
  const x = insOf(inside);
  if (x.vague) return (c.msgs && c.msgs.vague) || M.vague;
  if (!x.blocks.length) return M.none;
  return null;
};
// Нужные блоки: первый недостающий — его сообщение (c.msgs[k]).
const needIssue = (inside, c, need) => { const have = blocksOf(inside); const k = need.find((n) => have.indexOf(n) < 0); return k ? c.msgs[k] : null; };
// Строки промпта: три готовые строки и поле «Ichida nima?».
const rows3 = (T) => [txtRow(T.vals[0], 0), txtRow(T.vals[1], 1), txtRow(T.vals[2], 2)];
const initOf = (pick, c, inside) => [pick(c.what), pick(c.why), pick(c.who), inside || ''];
// На сайте — метки только «Ichida nima?» и «Taxmin» (остальные строки уже знакомы).
const PIN_IN = [false, false, false];
// Промпт одной строкой — для домашки (четыре строки).
const promptLine4 = (pick, pr) => pick(fillL(L3("{a}. Uning maqsadi: {b}. Sayt {c} uchun. Saytda bo'lsin: {d}.", '{a}. Его цель: {b}. Сайт для: {c}. На сайте: {d}.', '{a}. Its goal: {b}. It’s for {c}. On the site: {d}.'),
  { a: capS(pr.what), b: String(pr.why || '').trim().replace(/[.!]+$/, ''), c: String(pr.who || '').trim().replace(/[.!]+$/, ''), d: String(pr.inside || '').trim().replace(/[.!]+$/, '') }));

// =============================================================================
// S1. КРЮЧОК — промпт Коди из трёх строк без «Ichida nima?» → карточки-заглушки; гость ищет меню, отзывы и адрес.
// Загадка: «ИИ сам знает, какие блоки нужны».
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
  const pr = { what: pick(c.what), why: pick(c.why), who: pick(c.who) };
  const site = aiSite(pick, pr);
  const rows = [txtRow(pr.what, 0), txtRow(pr.why, 1), txtRow(pr.who, 2), missRow(3)];
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
          <div className="kz-col a1-right">{ph < 2 ? <div className={'a1-empty' + (ph === 1 ? ' is-busy' : '')}>{ph === 1 ? <span className="a1-gen a1-gen-in"><i className="a1-aidot">✦</i>{pick(UI.gen)}<span className="a1-typing"><i /><i /><i /></span></span> : pick(c.empty)}</div> : <AiBrowser site={site} />}</div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Показ: первые три строки те же, «Ichida nima?» меняется — меняется сайт; метки — «Ichida nima?» и «Taxmin».
const inSteps = (pick, c, list) => list.map((x, i) => {
  const inside = x ? pick(x) : '';
  const base = { what: pick(c.what), why: pick(c.why), who: pick(c.who) };
  return { pr: Object.assign({ inside }, base), rows: () => [txtRow(base.what, 0), txtRow(base.why, 1), txtRow(base.who, 2), inside ? txtRow(inside, 3) : missRow(3)],
    pins: i === 0 && !inside ? false : undefined, pinWhat: false, pinWhy: false, pinWho: false };
});
// S2. ПОКАЗ «Ichida nima?» — пиццерия: пусто → меню → + фото → + отзывы и адрес.
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  return <AiShow p={p} c={c} id="s2" steps={inSteps(pick, C.s1, [null, c.i1, c.i2, c.i3])} />;
}
// S3. САМ — футбольный клуб: расписание, тренеры, адрес (вопросы родителей).
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const T = usePromptTask('s3', c, initOf(pick, c), (pr) => inIssue(pr.inside, c) || needIssue(pr.inside, c, ['schedule', 'team', 'contact']), null, K4);
  return <TaskScreen p={p} c={c} T={T} rows={rows3(T).concat(fieldRow(T, 3, 3, c.ph, 120))} before={{ what: T.vals[0], why: T.vals[1], who: T.vals[2] }} pinOpts={PIN_IN} />;
}
// S4. ЗАКРЕПЛЕНИЕ — какое «Ichida nima?» точнее.
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  return <RoundsScreen p={p} c={c} id="s4" keyOf={(it) => it.right} ansOf={(it) => pick(it[it.right])}
    opts={() => ['a', 'b']} optLabel={(v, it) => pick(it[v])}
    body={() => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(c.q)}</p></div>} />;
}
// S5. ПОКАЗ порядка — лагерь: контакты первыми → по порядку рассказа → + цены (лендинг).
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  return <AiShow p={p} c={c} id="s5" steps={inSteps(pick, c, [c.o0, c.o1, c.o2])} />;
}
// S6. САМ — собрать порядок блоков нажатиями (курс плавания): фото → цены → отзывы → контакты.
const S6_CHIPS = ['reviews', 'contact', 'gallery', 'prices'];
const S6_RIGHT = ['gallery', 'prices', 'reviews', 'contact'];
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const T = usePromptTask('s6', c, initOf(pick, c), (pr) => {
    const have = blocksOf(pr.inside);
    if (!have.length) return c.msgs.empty;
    if (have.length < 4) return c.msgs.short;
    return have.join() === S6_RIGHT.join() ? null : c.msgs.order;
  }, null, K4);
  const chosen = blocksOf(T.vals[3]);
  const labelOf = (k, i) => { const t = pick(c.chips[k]); return i ? t.toLowerCase() : t; };
  const setChosen = (ks) => T.setVal(3, ks.map(labelOf).join(', '));
  const tap = (k) => { if (T.solved || T.busy) return; sfx('tap', true); setChosen(chosen.indexOf(k) >= 0 ? chosen.filter((x) => x !== k) : chosen.concat(k)); };
  const inRow = T.solved || T.busy || chosen.length ? txtRow(T.vals[3], 3) : { q: FORMULA[3], on: true, cls: 'is-task', body: <span className="a3-ph">{pick(c.ph)}</span> };
  const chips = T.solved ? null : (
    <div className="a3-chips" role="group">
      {S6_CHIPS.map((k) => {
        const n = chosen.indexOf(k);
        return (
          <button key={k} type="button" data-k={k} className={'a3-chip' + (n >= 0 ? ' is-on' : '')} disabled={!T.canTap || T.busy} onClick={() => tap(k)}>
            {n >= 0 ? <b>{n + 1}</b> : null}<span>{pick(c.chips[k])}</span>
          </button>
        );
      })}
      {chosen.length ? <button type="button" className="a3-clear" disabled={!T.canTap || T.busy} onClick={() => { sfx('tap', true); setChosen([]); }}>{pick(UI.clear)}</button> : null}
    </div>
  );
  return <TaskScreen p={p} c={c} T={T} rows={rows3(T).concat(inRow)} before={{ what: T.vals[0], why: T.vals[1], who: T.vals[2] }} pinOpts={PIN_IN} after={chips} />;
}
// S7. ЗАКРЕПЛЕНИЕ — вопрос гостя → блок, который отвечает.
const BLOCK_H = (k) => (BLOCKS.find((b) => b.k === k) || {}).h;
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  return <RoundsScreen p={p} c={c} id="s7" keyOf={(it) => it.right} ansOf={(it) => pick(BLOCK_H(it.right))}
    opts={(it) => it.opts} optLabel={(v) => pick(BLOCK_H(v))}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>«{pick(it.t)}»</p></div>} />;
}
// S8. САМ (перенос) — сервер Minecraft: фото, правила, вопросы и ответы.
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const T = usePromptTask('s8', c, initOf(pick, c), (pr) => inIssue(pr.inside, c) || needIssue(pr.inside, c, ['gallery', 'rules', 'faq']), null, K4);
  return <TaskScreen p={p} c={c} T={T} rows={rows3(T).concat(fieldRow(T, 3, 3, c.ph, 120))} before={{ what: T.vals[0], why: T.vals[1], who: T.vals[2] }} pinOpts={PIN_IN} />;
}
// S9. ПОКАЗ контента — курс рисования: ИИ придумал цену и телефон («Taxmin») → настоящая цена → настоящий телефон.
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  return <AiShow p={p} c={c} id="s9" steps={inSteps(pick, c, [c.c0, c.c1, c.c2])} />;
}
// S10. САМ — курс роботов: блоки цен и контактов с настоящими ценой и телефоном.
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  const T = usePromptTask('s10', c, initOf(pick, c), (pr) => {
    const e = inIssue(pr.inside, c);
    if (e) return e;
    const x = insOf(pr.inside), have = x.blocks.map((b) => b.k);
    if (have.indexOf('prices') < 0 || have.indexOf('contact') < 0) return c.msgs.blocks;
    if (!x.price) return c.msgs.noPrice;
    if (digits(x.price) !== '200000') return c.msgs.badPrice;
    if (!x.phone) return c.msgs.noPhone;
    if (digits(x.phone).slice(-9) !== '912345678') return c.msgs.badPhone;
    return null;
  }, null, K4);
  return <TaskScreen p={p} c={c} T={T} rows={rows3(T).concat(fieldRow(T, 3, 3, c.ph, 140))} before={{ what: T.vals[0], why: T.vals[1], who: T.vals[2] }} pinOpts={PIN_IN} />;
}
// G1. ЛИШНИЕ БЛОКИ — книжный магазин: Коди вписал всё подряд; оставить фото, цены и контакты.
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const T = usePromptTask('g1', c, initOf(pick, c, pick(c.bad)), (pr) => {
    const e = inIssue(pr.inside, c);
    if (e) return e;
    const have = blocksOf(pr.inside), need = ['gallery', 'prices', 'contact'];
    if (need.some((k) => have.indexOf(k) < 0)) return c.msgs.missing;
    return have.length > need.length ? c.msgs.extra : null;
  }, 'embarrassed', K4);
  return <TaskScreen p={p} c={c} T={T} rows={rows3(T).concat(fieldRow(T, 3, 3, c.ph, 220, true))} before={{ what: pick(c.what), why: pick(c.why), who: pick(c.who), inside: pick(c.bad) }} pinOpts={PIN_IN} />;
}
// DET. ДЕТЕКТИВ: какое «Ichida nima?» дало сайт (порядок блоков) и какого блока не хватает гостю.
function Det({ p }) {
  const pick = usePick();
  const c = C.det;
  const siteOf = (s) => aiSite(pick, { what: pick(s.what), why: pick(s.why), inside: pick(s.inside) });
  return <RoundsScreen p={p} c={c} id="det" keyOf={(it) => it.right}
    ansOf={(it) => (it.type === 'which' ? it.right.toUpperCase() : pick(BLOCK_H(it.right)))}
    opts={(it) => (it.type === 'which' ? ['a', 'b', 'c'] : it.opts)}
    optLabel={(v, it) => (it.type === 'which' ? v.toUpperCase() : pick(BLOCK_H(v)))}
    body={(it) => (it.type === 'which' ? (
      <div className="a1-which">
        <div className="a1-which-site"><AiBrowser site={siteOf(it.site)} small focus=".bh0" /></div>
        <div className="a1-which-list">
          <span className="a1-qh">{pick(c.qWhich)}</span>
          {['a', 'b', 'c'].map((v) => <div key={v} className="a1-pr a3-pr-in"><b>{v.toUpperCase()}</b><span><span className="a1-pr-l"><em>{pick(FORMULA[3])}</em>{pick(it[v])}</span></span></div>)}
        </div>
      </div>
    ) : (
      <div className="a1-which">
        <div className="a1-which-list">
          <span className="a1-qh">{pick(c.qMiss)}</span>
          <TaskCard c={{ card: { h: c.wantH, t: it.want } }} />
        </div>
        <div className="a1-which-site"><AiBrowser site={siteOf(it.site)} small focus=".bh0" /></div>
      </div>
    ))} />;
}
// S12. ИСПРАВЬ «hamma narsa bo'lsin» Коди — лагерь: фото, цены, контакты.
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const T = usePromptTask('s12', c, initOf(pick, c, pick(c.bad)), (pr) => inIssue(pr.inside, c) || needIssue(pr.inside, c, ['gallery', 'prices', 'contact']), 'embarrassed', K4);
  return <TaskScreen p={p} c={c} T={T} rows={rows3(T).concat(fieldRow(T, 3, 3, c.ph, 120, true))} before={{ what: pick(c.what), why: pick(c.why), who: pick(c.who), inside: pick(c.bad) }} pinOpts={PIN_IN} />;
}
// S13. С НУЛЯ — школьная столовая: все четыре строки.
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const T = usePromptTask('s13', c, ['', '', '', ''], (pr) => {
    if (!pr.what) return c.msgs.noWhat;
    if (!has(pr.what, RE_KIND)) return c.msgs.kind;
    if (!pr.why) return c.msgs.noWhy;
    if (!has(pr.why, RE_ORDER)) return c.msgs.goal;
    if (!pr.who) return c.msgs.noWho;
    const a = audOf(pr.who);
    if (!a || (a.key !== 'teens' && a.key !== 'kids')) return c.msgs.who;
    if (!pr.inside) return c.msgs.noIn;
    const e = inIssue(pr.inside, c);
    if (e) return e;
    const have = blocksOf(pr.inside);
    return ['menu', 'prices', 'faq'].every((k) => have.indexOf(k) >= 0) ? null : c.msgs.inside;
  }, null, K4);
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.phWhat, 60), fieldRow(T, 1, 1, c.phWhy, 90), fieldRow(T, 2, 2, c.phWho, 90), fieldRow(T, 3, 3, c.phIn, 120)]} />;
}
// S14. СВОЙ САЙТ — все четыре строки, в «Ichida nima?» хотя бы два блока.
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const T = usePromptTask('s14', c, ['', '', '', ''], (pr) => {
    if (!pr.what) return c.msgs.noWhat;
    if (!has(pr.what, RE_KIND) && pr.what.split(/\s+/).length < 2) return c.msgs.kind;
    if (!pr.why) return c.msgs.noWhy;
    if (has(pr.why, RE_PRETTY) && !anyGoal(pr.why)) return c.msgs.pretty;
    if (!anyGoal(pr.why)) return c.msgs.goal;
    if (!pr.who) return c.msgs.noWho;
    const a = audOf(pr.who);
    if (a.key === 'all') return M2.all;
    if (a.key === 'gen') return M2.gen;
    if (!pr.inside) return c.msgs.noIn;
    const e = inIssue(pr.inside, c);
    if (e) return e;
    return blocksOf(pr.inside).length < 2 ? c.msgs.few : null;
  }, 'point', K4);
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.phWhat, 60), fieldRow(T, 1, 1, c.phWhy, 90), fieldRow(T, 2, 2, c.phWho, 90), fieldRow(T, 3, 3, c.phIn, 120)]} later={4} />;
}
// Ответы проверки «Kim uchun?» (из урока 2) — для своего сайта.
const M2 = {
  all: L3("«Hamma uchun» desangiz, sun'iy intellekt saytni hech kimga moslamaydi. Aynan kimlar uchun?", 'Если написать «для всех», ИИ ни под кого сайт не подстроит. Для кого именно?', 'If you write “for everyone”, the AI won’t tailor the site to anyone. Who exactly?'),
  gen: L3("Sun'iy intellekt bu so'zdan kimligini tushunmadi. Yoshini yoki kimligini yozing.", 'ИИ не понял по этому слову, кто это. Напиши возраст или кто они.', 'The AI couldn’t tell who that is. Write their age or who they are.')
};
// Q1. ВЕРНО ИЛИ НЕТ — пять фраз урока.
function Q1({ p }) {
  const pick = usePick();
  const c = C.q1;
  return <RoundsScreen p={p} c={c} id="q1" keyOf={(it) => it.right} ansOf={(it) => pick(it.right ? c.yes : c.no)}
    opts={() => [true, false]} optLabel={(v) => pick(v ? c.yes : c.no)}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}
// FIN. ВЫВОД — разгадка: ИИ ставит шаблон и выдумывает цифры, блоки пишешь ты; свой промпт из четырёх строк; домашка.
const QI = { what: 0, why: 1, who: 2, in: 3 };
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const own = store.get('pr_s14') || { what: pick(C.s5.what), why: pick(C.s5.why), who: pick(C.s5.who), inside: pick(C.s5.o2) };
  const site = aiSite(pick, own);
  const [copied, setCopied] = useState(false);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const copy = () => { try { navigator.clipboard.writeText(promptLine4(pick, own)); } catch (e) { /* без буфера */ } sfx('tap', true); setCopied(true); };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a1-fin">
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={[txtRow(own.what, 0), txtRow(own.why, 1), txtRow(own.who, 2), txtRow(own.inside, 3)]} later={4} />
            <div className="kz-roles">
              {['what', 'why', 'who', 'in'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (curK === 'what' && k !== 'in') ? ' is-on' : '')}><i aria-hidden="true" /><span><b>{pick(FORMULA[QI[k]])}</b> — {pick(c.roles[k])}</span></span>
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

function lessonAi3Artifact(store) {
  const own = store.get('pr_s14');
  return own ? { type: 'ai-prompt', what: own.what, why: own.why, who: own.who, inside: own.inside } : null;
}

export default function AiWhatInside({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonAi3Artifact(store) })
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
