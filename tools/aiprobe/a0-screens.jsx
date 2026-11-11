// =============================================================================
// ПРОБНЫЙ ЭКРАН МОДУЛЯ «ИИ» — облик «запрос → ответ ИИ → сайт». Страница в браузере — движок урока 17 CSS (CssPage),
// её HTML и CSS собирает симулятор ИИ (aiSite) из того, что ученик написал в промпте.
// =============================================================================

// ── СИМУЛЯТОР ИИ: промпт → страница (элементы и правила CSS) ──
const has = (s, re) => re.test(String(s || '').toLowerCase());
const RE_TELL = /haqida|ma'lumot|aytib|aytish|tanishtir|расска|информ|о турнир|tell|about|inform|show/;
const RE_JOIN = /ro'yxat|royxat|yozil|qatnash|ishtirok|qo'shil|регистр|запис|участв|позвать|sign|regist|join/;
const RE_PRETTY = /chiroyli|zo'r|ajoyib|красив|крут|pretty|beautiful|cool/;
const cap = (s) => { const t = String(s || '').trim().replace(/[.!]+$/, ''); return t ? t[0].toUpperCase() + t.slice(1) : t; };
const TXT = {
  vagueH: L3('Futbol', 'Футбол', 'Football'),
  vagueP: L3("Futbol — eng mashhur sport turlaridan biri. Uni butun dunyoda o'ynashadi.", 'Футбол — один из самых популярных видов спорта. В него играют во всём мире.', 'Football is one of the most popular sports. People play it all over the world.'),
  aboutH: L3('Turnir haqida', 'О турнире', 'About the tournament'),
  aboutP: L3("Jamoalar, o'yinlar jadvali va sovrinlar — hammasi shu yerda.", 'Команды, расписание игр и призы — всё здесь.', 'Teams, the match schedule and prizes are all here.'),
  join: L3("Ro'yxatdan o'tish", 'Записаться', 'Sign up')
};
// Название сайта — из «Что?»: «futbol turniri sayti» → «Futbol turniri».
const titleOf = (what) => cap(String(what || '').replace(/\s*(sayti|saytini|sayt|сайт[а-я]*|site|website)\s*/gi, ' ').replace(/\s+/g, ' ').trim()) || cap(what);
function aiSite(pick, pr) {
  if (!pr) {
    return { els: [{ t: 'h1', k: 'h1', text: pick(TXT.vagueH) }, { t: 'p', k: 'p', text: pick(TXT.vagueP) }],
      css: ['h1 { font-size: 22px; margin: 0 0 6px; }'] };
  }
  const tell = has(pr.why, RE_TELL), join = has(pr.why, RE_JOIN);
  const els = [{ t: 'div', cls: 'hero', k: 'hero', kids: [{ t: 'h1', k: 'h1', text: titleOf(pr.what) }, { t: 'p', k: 'lead', text: cap(pr.why) + '.' }] }];
  if (tell) els.push({ t: 'div', cls: 'info', k: 'info', kids: [{ t: 'h2', k: 'h2', text: pick(TXT.aboutH) }, { t: 'p', k: 'ip', text: pick(TXT.aboutP) }] });
  if (join) els.push({ t: 'button', cls: 'cta', k: 'cta', hl: true, text: pick(TXT.join) });   // окно прокручивается к кнопке
  const css = ['.hero { background-color: #E7F6EC; padding: 16px; border-radius: 10px; }', 'h1 { margin: 0 0 6px; font-size: 24px; color: #14532D; }',
    '.info { padding: 10px 4px; }', 'h2 { margin: 0 0 4px; font-size: 17px; font-weight: 700; }',
    '.cta { background-color: #16A34A; color: white; padding: 12px 22px; border: none; border-radius: 8px; font-size: 16px; }'];
  return { els, css: css.filter((r) => (tell || !/^\.info|^h2/.test(r)) && (join || !/^\.cta/.test(r))) };
}
// Код ответа ИИ: HTML страницы и её CSS (для свёрнутого блока).
const htmlOf = (els, d) => els.map((e) => '  '.repeat(d) + '<' + e.t + (e.cls ? ' class="' + e.cls + '"' : '') + '>'
  + (e.kids ? '\n' + htmlOf(e.kids, d + 1) + '\n' + '  '.repeat(d) : e.text) + '</' + e.t + '>').join('\n');
const codeOf = (site) => ['<style>'].concat(site.css.map((r) => '  ' + r), ['</style>', htmlOf(site.els, 0)]).join('\n');
const promptOf = (pick, pr) => pick(fillL(L3('{a}. Uning maqsadi: {b}.', '{a}. Его цель: {b}.', '{a}. Its goal: {b}.'), { a: cap(pr.what), b: String(pr.why).trim().replace(/[.!]+$/, '') }));

// ── РЕДАКТОР ПРОМПТА (облик «Редактор» курса): вкладки prompt.txt и index.html (код, который написал ИИ) ──
// Каждая строка prompt.txt — одна часть формулы модуля: метка вопроса справа. Строки будущих уроков — тусклые
// комментарии «// 3 · Kim uchun? — 2-dars». Поле ввода — прямо в строке, без рамки, как в уроках HTML и CSS.
const LESSON_OF = L3('{n}-dars', 'урок {n}', 'lesson {n}');
// Заказчик, 11.11.2026: «не обязательно чтобы код был… ученик научился писать правильный промпт и увидеть его
// результат, думать правильно» — вкладки с кодом ИИ нет; промпт — обычный текст.
function PromptEditor({ rows, tab = 'p' }) {
  const pick = usePick();
  return (
    <div className="a1-ed" translate="no">
      <div className="a1-tabs"><span className="a1-tab is-txt is-on"><i aria-hidden="true" />prompt.txt</span></div>
      {tab === 'p' ? (
        <div className="a1-lines">
          {rows.map((r, i) => (
            <div key={i} className={'a1-line' + (r.cls ? ' ' + r.cls : '')}>
              <span className="a1-ln">{i + 1}</span>
              <span className="a1-txt">{r.body}</span>
              {r.q ? <span className={'a1-q' + (r.on ? ' is-on' : '')}>{pick(r.q)}</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ── ОТКУДА ЧТО: метки вопросов формулы у частей сайта (название ← «Nima?», кнопка и блок ← «Nega?») — ученик видит,
// какая строка промпта что дала. Ставятся по настоящим местам элементов на странице.
function Pins({ pins }) {
  const pick = usePick();
  const ref = useRef(null);
  const [pos, setPos] = useState([]);
  useLayoutEffect(() => {
    const host = ref.current && ref.current.closest('.kz-br-page');
    if (!host) return undefined;
    const put = () => {
      const o = host.getBoundingClientRect();
      setPos(pins.map((p0) => { const e = host.querySelector('.c17-doc ' + p0.sel); if (!e) return null; let r = e.getBoundingClientRect(); try { const g = document.createRange(); g.selectNodeContents(e); const t = g.getBoundingClientRect(); if (t.width) r = t; } catch (x) { /* по рамке */ }
        return { x: Math.round(r.right - o.left + host.scrollLeft + 14), y: Math.round(r.top - o.top + host.scrollTop), q: p0.q }; }).filter(Boolean));
    };
    put();
    const t = setTimeout(put, 400);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(put) : null;
    if (ro) ro.observe(host);
    return () => { clearTimeout(t); if (ro) ro.disconnect(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className="a1-pins" aria-hidden="true">{pos.map((p0, i) => <i key={i} className="a1-pin a0-in" style={{ left: p0.x + 'px', top: p0.y + 'px', animationDelay: (0.3 + i * 0.35) + 's' }}>{pick(p0.q)}</i>)}</span>;
}

// =============================================================================
// P1. «Что создаём и зачем?» — в prompt.txt промпт Коди «Futbol haqida sayt qil» → скучный сайт; ученик пишет строки
// «Nima?» и «Nega?» → «Yuborish» → ИИ «пишет» сайт (index.html), страница в Chrome меняется; домашка — готовый промпт.
// =============================================================================
function P1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.p1;
  const store = useStore();
  const [rec, put] = useRec('p1');
  const solved = !!(rec && rec.done);
  const [what, setWhat] = useState(store.get('aiWhat') || '');
  const [why, setWhy] = useState(store.get('aiWhy') || '');
  const [sent, setSent] = useState(solved ? { what: store.get('aiWhat'), why: store.get('aiWhy') } : null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !what, 0);
  const issueOf = () => {
    const a = what.trim(), b = why.trim();
    if (!a) return c.msgs.what;
    if (!b) return c.msgs.why;
    if (has(b, RE_PRETTY) && !has(b, RE_TELL) && !has(b, RE_JOIN)) return c.msgs.pretty;
    if (b.split(/\s+/).length < 3) return c.msgs.short;
    return null;
  };
  const send = () => {
    if (!canTap || solved || busy) return;
    st.current.tries += 1;
    const issue = issueOf();
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('pop', true); setMsg(null); setBusy(true);
    setTimeout(() => {
      setBusy(false); sfx('win', true);
      const pr = { what: what.trim(), why: why.trim() };
      setSent(pr); store.set('aiWhat', pr.what); store.set('aiWhy', pr.why); put({ done: true });
      log({ screenId: 'p1', type: 'prompt-what-why', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, what: pr.what, why: pr.why });
      sayNow(c.ok, 'cheer');
    }, reduceMotion() ? 200 : 1400);
  };
  const site = aiSite(pick, sent);
  const inp = (val, set, ph, max, isLed) => (
    <span className={'a1-slot' + (isLed ? ' is-led' : '')}>
      <LessonInput value={val} onChange={(x) => { set(x); setMsg(null); }} onEnter={send} placeholder={ph} label={ph} max={max} />
    </span>
  );
  const lock = solved || busy;
  const rows = [
    { body: <span className="a1-kodi"><b>{pick(UI.kodi)}:</b> {pick(c.vague)}</span>, cls: sent ? 'is-old' : '' },
    { q: FORMULA[0], on: true, cls: 'is-task', body: lock ? <span className="a1-val">{(sent || {}).what || what}</span> : inp(what, setWhat, c.fields.what.ph, 60, led) },
    { q: FORMULA[1], on: true, cls: 'is-task', body: lock ? <span className="a1-val">{(sent || {}).why || why}</span> : inp(why, setWhy, c.fields.why.ph, 120, false) }
  ].concat(FORMULA.slice(2).map((q, i) => ({ q, cls: 'is-later', body: <span className="a1-later">{pick(fillL(LESSON_OF, { n: i + 2 }))}</span> })));
  const copy = () => { try { navigator.clipboard.writeText(promptOf(pick, sent)); } catch (e) { /* без буфера */ } sfx('tap', true); setCopied(true); };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet">
        <KzAsk text={solved ? c.askOk : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={rows} />
            {solved ? (
              <div className="a1-hw">
                <span className="a1-hw-h">{pick(UI.hw)}</span>
                <span className="a1-hw-t">{pick(c.hw)}</span>
                <button type="button" className="kz-btn is-ghost a1-copy" onClick={copy}>{pick(copied ? UI.copied : UI.copy)}</button>
              </div>
            ) : (
              <div className="keys a1-keys" translate="no">
                <button type="button" className={'key-b key-go a1-send' + (what.trim() && why.trim() ? ' is-ready' : '')} disabled={!canTap || busy} onClick={send}>
                  {pick(busy ? UI.thinking : UI.send)}
                </button>
              </div>
            )}
          </div>
          <div className="kz-col a1-right">
            <Br title={sent ? titleOf(sent.what) : pick(TXT.vagueH)} url="index.html" cls={busy ? 'a1-busy' : ''}>
              <CssPage els={site.els} rules={withBase(site.css, 'none')} />
              {sent && !busy ? <Pins pins={[{ sel: 'h1', q: FORMULA[0] }, { sel: '.cta', q: FORMULA[1] }, { sel: '.info h2', q: FORMULA[1] }]} /> : null}
              {busy ? <div className="a1-gen" aria-live="polite"><i className="a0-aidot">✦</i>{pick(c.gen)}<span className="a0-typing"><i /><i /><i /></span></div> : null}
            </Br>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

const SCREENS = [{ id: 'p1', code: 'LEVEL-1', Comp: P1 }];
const SCREEN_RESET = { p1: ['p1'] };

export default function AiProbe({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: store.get('aiWhat') ? { type: 'ai-prompt', what: store.get('aiWhat'), why: store.get('aiWhy') } : null })
  });
  useParallax();
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
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
